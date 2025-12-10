import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

interface StreamConfig {
  streamId: string;
  userId: string;
  videoPath: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  streamKey: string;
  rtmpUrl?: string;
  playbackMode: 'loop' | 'sequential' | 'random';
  quality: '720p' | '1080p' | '4k';
  playlist?: string[];
}

interface StreamStatus {
  streamId: string;
  status: 'idle' | 'starting' | 'live' | 'stopping' | 'error';
  currentVideo?: string;
  currentVideoIndex?: number;
  uptime?: number;
  startedAt?: Date;
  error?: string;
  fps?: number;
  bitrate?: string;
}

// RTMP URLs for different platforms
const RTMP_URLS: Record<string, string> = {
  youtube: 'rtmp://a.rtmp.youtube.com/live2',
  facebook: 'rtmps://live-api-s.facebook.com:443/rtmp',
  twitch: 'rtmp://live.twitch.tv/app',
};

// Quality presets
const QUALITY_PRESETS: Record<string, { resolution: string; videoBitrate: string; audioBitrate: string }> = {
  '720p': { resolution: '1280x720', videoBitrate: '2500k', audioBitrate: '128k' },
  '1080p': { resolution: '1920x1080', videoBitrate: '4500k', audioBitrate: '192k' },
  '4k': { resolution: '3840x2160', videoBitrate: '15000k', audioBitrate: '320k' },
};

export class StreamingEngine extends EventEmitter {
  private activeStreams: Map<string, {
    process: ChildProcess;
    config: StreamConfig;
    status: StreamStatus;
    playlistIndex: number;
  }> = new Map();

  private uploadsDir: string;

  constructor(uploadsDir: string = './uploads') {
    super();
    this.uploadsDir = uploadsDir;
  }

  private buildFFmpegArgs(config: StreamConfig, videoPath: string): string[] {
    const quality = QUALITY_PRESETS[config.quality] || QUALITY_PRESETS['1080p'];
    const rtmpUrl = config.rtmpUrl || RTMP_URLS[config.platform];
    const fullRtmpUrl = `${rtmpUrl}/${config.streamKey}`;

    const args: string[] = [
      // Input options
      '-re', // Read input at native frame rate
      '-stream_loop', config.playbackMode === 'loop' ? '-1' : '0', // Loop if single video loop mode
      '-i', videoPath,
      
      // Video encoding
      '-c:v', 'libx264',
      '-preset', 'veryfast', // Good balance of quality and CPU usage
      '-tune', 'zerolatency', // Optimize for low latency streaming
      '-b:v', quality.videoBitrate,
      '-maxrate', quality.videoBitrate,
      '-bufsize', `${parseInt(quality.videoBitrate) * 2}k`,
      '-vf', `scale=${quality.resolution}:force_original_aspect_ratio=decrease,pad=${quality.resolution}:(ow-iw)/2:(oh-ih)/2`,
      '-g', '60', // Keyframe interval (2 seconds at 30fps)
      '-keyint_min', '60',
      '-sc_threshold', '0',
      '-pix_fmt', 'yuv420p',
      
      // Audio encoding
      '-c:a', 'aac',
      '-b:a', quality.audioBitrate,
      '-ar', '44100',
      '-ac', '2',
      
      // Output options
      '-f', 'flv', // FLV format for RTMP
      '-flvflags', 'no_duration_filesize',
      
      // Progress reporting
      '-progress', 'pipe:1',
      '-stats_period', '1',
      
      fullRtmpUrl
    ];

    return args;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async startStream(config: StreamConfig): Promise<StreamStatus> {
    // Check if stream is already running
    if (this.activeStreams.has(config.streamId)) {
      throw new Error('Stream is already running');
    }

    // Determine video(s) to stream
    let playlist: string[] = [];
    
    if (config.playlist && config.playlist.length > 0) {
      playlist = config.playbackMode === 'random' 
        ? this.shuffleArray(config.playlist) 
        : [...config.playlist];
    } else if (config.videoPath) {
      playlist = [config.videoPath];
    } else {
      throw new Error('No video or playlist provided');
    }

    // Verify first video exists
    const firstVideo = playlist[0];
    const videoFullPath = path.join(this.uploadsDir, config.userId, firstVideo);
    
    if (!fs.existsSync(videoFullPath)) {
      throw new Error(`Video file not found: ${firstVideo}`);
    }

    const status: StreamStatus = {
      streamId: config.streamId,
      status: 'starting',
      currentVideo: firstVideo,
      currentVideoIndex: 0,
      startedAt: new Date(),
    };

    // Start FFmpeg process
    const ffmpegArgs = this.buildFFmpegArgs(config, videoFullPath);
    console.log(`[StreamEngine] Starting stream ${config.streamId} with FFmpeg:`, ffmpegArgs.join(' '));

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    // Store stream info
    this.activeStreams.set(config.streamId, {
      process: ffmpegProcess,
      config,
      status,
      playlistIndex: 0,
    });

    // Handle stdout (progress)
    ffmpegProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      const streamInfo = this.activeStreams.get(config.streamId);
      if (streamInfo) {
        // Parse progress info
        const fpsMatch = output.match(/fps=(\d+)/);
        const bitrateMatch = output.match(/bitrate=(\S+)/);
        
        if (fpsMatch) streamInfo.status.fps = parseInt(fpsMatch[1]);
        if (bitrateMatch) streamInfo.status.bitrate = bitrateMatch[1];
        
        if (streamInfo.status.status === 'starting') {
          streamInfo.status.status = 'live';
          this.emit('streamLive', config.streamId, streamInfo.status);
        }
      }
    });

    // Handle stderr (FFmpeg logs)
    ffmpegProcess.stderr.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log(`[StreamEngine ${config.streamId}]`, output);
      
      // Check for successful connection
      if (output.includes('Output #0')) {
        const streamInfo = this.activeStreams.get(config.streamId);
        if (streamInfo && streamInfo.status.status === 'starting') {
          streamInfo.status.status = 'live';
          this.emit('streamLive', config.streamId, streamInfo.status);
        }
      }
    });

    // Handle process exit
    ffmpegProcess.on('close', (code: number | null) => {
      console.log(`[StreamEngine] Stream ${config.streamId} FFmpeg exited with code ${code}`);
      
      const streamInfo = this.activeStreams.get(config.streamId);
      if (!streamInfo) return;

      // Check if we need to continue with playlist
      if (config.playbackMode !== 'loop' && playlist.length > 1) {
        const nextIndex = streamInfo.playlistIndex + 1;
        
        if (nextIndex < playlist.length || config.playbackMode === 'sequential') {
          // Continue with next video
          const actualIndex = nextIndex % playlist.length;
          this.continuePlaylist(config, playlist, actualIndex);
          return;
        }
      }

      // Stream ended
      streamInfo.status.status = code === 0 ? 'idle' : 'error';
      if (code !== 0) {
        streamInfo.status.error = `FFmpeg exited with code ${code}`;
      }
      
      this.emit('streamEnded', config.streamId, streamInfo.status);
      this.activeStreams.delete(config.streamId);
    });

    // Handle process error
    ffmpegProcess.on('error', (error: Error) => {
      console.error(`[StreamEngine] Stream ${config.streamId} FFmpeg error:`, error);
      
      const streamInfo = this.activeStreams.get(config.streamId);
      if (streamInfo) {
        streamInfo.status.status = 'error';
        streamInfo.status.error = error.message;
        this.emit('streamError', config.streamId, streamInfo.status);
      }
      
      this.activeStreams.delete(config.streamId);
    });

    return status;
  }

  private async continuePlaylist(config: StreamConfig, playlist: string[], index: number): Promise<void> {
    const nextVideo = playlist[index];
    const videoFullPath = path.join(this.uploadsDir, config.userId, nextVideo);
    
    if (!fs.existsSync(videoFullPath)) {
      console.error(`[StreamEngine] Next video not found: ${nextVideo}`);
      return;
    }

    const ffmpegArgs = this.buildFFmpegArgs(config, videoFullPath);
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    const streamInfo = this.activeStreams.get(config.streamId);
    if (streamInfo) {
      streamInfo.process = ffmpegProcess;
      streamInfo.playlistIndex = index;
      streamInfo.status.currentVideo = nextVideo;
      streamInfo.status.currentVideoIndex = index;
      
      this.emit('playlistProgress', config.streamId, {
        currentIndex: index,
        totalVideos: playlist.length,
        currentVideo: nextVideo,
      });
    }

    // Re-attach event handlers
    ffmpegProcess.stderr.on('data', (data: Buffer) => {
      console.log(`[StreamEngine ${config.streamId}]`, data.toString());
    });

    ffmpegProcess.on('close', (code: number | null) => {
      const streamInfo = this.activeStreams.get(config.streamId);
      if (!streamInfo) return;

      const nextIndex = index + 1;
      if (nextIndex < playlist.length) {
        this.continuePlaylist(config, playlist, nextIndex);
      } else if (config.playbackMode === 'sequential') {
        // Loop playlist from beginning
        this.continuePlaylist(config, playlist, 0);
      } else {
        // Stream ended
        streamInfo.status.status = 'idle';
        this.emit('streamEnded', config.streamId, streamInfo.status);
        this.activeStreams.delete(config.streamId);
      }
    });

    ffmpegProcess.on('error', (error: Error) => {
      console.error(`[StreamEngine] Playlist stream ${config.streamId} error:`, error);
    });
  }

  async stopStream(streamId: string): Promise<StreamStatus> {
    const streamInfo = this.activeStreams.get(streamId);
    
    if (!streamInfo) {
      throw new Error('Stream not found or not running');
    }

    streamInfo.status.status = 'stopping';
    this.emit('streamStopping', streamId, streamInfo.status);

    // Gracefully stop FFmpeg
    streamInfo.process.stdin?.write('q'); // Send quit command
    
    // Force kill after timeout
    setTimeout(() => {
      if (this.activeStreams.has(streamId)) {
        streamInfo.process.kill('SIGKILL');
      }
    }, 5000);

    return new Promise((resolve) => {
      streamInfo.process.on('close', () => {
        streamInfo.status.status = 'idle';
        streamInfo.status.uptime = streamInfo.status.startedAt 
          ? Math.floor((Date.now() - streamInfo.status.startedAt.getTime()) / 1000)
          : 0;
        
        this.activeStreams.delete(streamId);
        resolve(streamInfo.status);
      });
    });
  }

  getStreamStatus(streamId: string): StreamStatus | null {
    const streamInfo = this.activeStreams.get(streamId);
    if (!streamInfo) return null;

    // Calculate uptime
    if (streamInfo.status.startedAt) {
      streamInfo.status.uptime = Math.floor(
        (Date.now() - streamInfo.status.startedAt.getTime()) / 1000
      );
    }

    return { ...streamInfo.status };
  }

  getAllActiveStreams(): StreamStatus[] {
    return Array.from(this.activeStreams.values()).map(info => ({
      ...info.status,
      uptime: info.status.startedAt 
        ? Math.floor((Date.now() - info.status.startedAt.getTime()) / 1000)
        : 0,
    }));
  }

  isStreamActive(streamId: string): boolean {
    return this.activeStreams.has(streamId);
  }
}

// Singleton instance
export const streamingEngine = new StreamingEngine(process.env.UPLOADS_DIR || './uploads');
