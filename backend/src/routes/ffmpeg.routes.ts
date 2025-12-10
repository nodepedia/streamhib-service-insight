import express, { Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { AuthRequest } from '../types/index.js';

const router = express.Router();

const uploadsDir = process.env.UPLOADS_DIR || './uploads';
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

// Ensure directories exist
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Helper: Run FFmpeg command
const runFFmpeg = (args: string[]): Promise<{ success: boolean; output: string }> => {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', args);
    let output = '';
    let errorOutput = '';

    ffmpeg.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        resolve({ success: false, output: errorOutput });
      }
    });

    ffmpeg.on('error', (err) => {
      resolve({ success: false, output: err.message });
    });
  });
};

// Helper: Get video duration using FFprobe
const getVideoDuration = async (filePath: string): Promise<number | null> => {
  return new Promise((resolve) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(output.trim());
        resolve(isNaN(duration) ? null : Math.round(duration));
      } else {
        resolve(null);
      }
    });

    ffprobe.on('error', () => {
      resolve(null);
    });
  });
};

// Helper: Get video metadata
const getVideoMetadata = async (filePath: string): Promise<{
  duration: number | null;
  width: number | null;
  height: number | null;
  codec: string | null;
  bitrate: number | null;
}> => {
  return new Promise((resolve) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,codec_name,bit_rate:format=duration',
      '-of', 'json',
      filePath
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(output);
          const stream = data.streams?.[0] || {};
          const format = data.format || {};
          resolve({
            duration: format.duration ? Math.round(parseFloat(format.duration)) : null,
            width: stream.width || null,
            height: stream.height || null,
            codec: stream.codec_name || null,
            bitrate: stream.bit_rate ? parseInt(stream.bit_rate) : null
          });
        } catch {
          resolve({ duration: null, width: null, height: null, codec: null, bitrate: null });
        }
      } else {
        resolve({ duration: null, width: null, height: null, codec: null, bitrate: null });
      }
    });

    ffprobe.on('error', () => {
      resolve({ duration: null, width: null, height: null, codec: null, bitrate: null });
    });
  });
};

// POST /api/ffmpeg/thumbnail/:videoId - Generate thumbnail for a video
router.post('/thumbnail/:videoId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const { timestamp = '00:00:05' } = req.body;

    // Get video info
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [videoId, req.user!.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: 'Video not found' });
      return;
    }

    const video = rows[0];
    const videoPath = path.join(uploadsDir, req.user!.id, video.filename);
    
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ success: false, error: 'Video file not found' });
      return;
    }

    // Generate thumbnail
    const thumbnailFilename = `${uuidv4()}.jpg`;
    const userThumbnailDir = path.join(thumbnailsDir, req.user!.id);
    
    if (!fs.existsSync(userThumbnailDir)) {
      fs.mkdirSync(userThumbnailDir, { recursive: true });
    }

    const thumbnailPath = path.join(userThumbnailDir, thumbnailFilename);

    const result = await runFFmpeg([
      '-i', videoPath,
      '-ss', timestamp,
      '-vframes', '1',
      '-vf', 'scale=320:-1',
      '-y',
      thumbnailPath
    ]);

    if (!result.success) {
      res.status(500).json({ success: false, error: 'Failed to generate thumbnail', details: result.output });
      return;
    }

    // Update video with thumbnail URL
    const thumbnailUrl = `/uploads/thumbnails/${req.user!.id}/${thumbnailFilename}`;
    await db.query(
      `UPDATE videos SET thumbnail_url = $1 WHERE id = $2`,
      [thumbnailUrl, videoId]
    );

    res.json({ 
      success: true, 
      data: { thumbnailUrl } 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ffmpeg/transcode/:videoId - Transcode video to different quality
router.post('/transcode/:videoId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const { quality = '720p' } = req.body;

    // Get video info
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [videoId, req.user!.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: 'Video not found' });
      return;
    }

    const video = rows[0];
    const videoPath = path.join(uploadsDir, req.user!.id, video.filename);
    
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ success: false, error: 'Video file not found' });
      return;
    }

    // Quality settings
    const qualitySettings: Record<string, { scale: string; bitrate: string }> = {
      '480p': { scale: '-2:480', bitrate: '1000k' },
      '720p': { scale: '-2:720', bitrate: '2500k' },
      '1080p': { scale: '-2:1080', bitrate: '5000k' }
    };

    const settings = qualitySettings[quality] || qualitySettings['720p'];

    // Generate output filename
    const ext = path.extname(video.filename);
    const baseName = path.basename(video.filename, ext);
    const outputFilename = `${baseName}_${quality}.mp4`;
    const outputPath = path.join(uploadsDir, req.user!.id, outputFilename);

    // Update video status to processing
    await db.query(
      `UPDATE videos SET status = 'processing' WHERE id = $1`,
      [videoId]
    );

    // Start transcoding (async - runs in background)
    const ffmpegArgs = [
      '-i', videoPath,
      '-vf', `scale=${settings.scale}`,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-b:v', settings.bitrate,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y',
      outputPath
    ];

    const userId = req.user!.id;

    // Run transcoding
    runFFmpeg(ffmpegArgs).then(async (result) => {
      if (result.success) {
        // Get new file stats
        const stats = fs.statSync(outputPath);
        const duration = await getVideoDuration(outputPath);

        // Create new video entry for transcoded version
        await db.query(
          `INSERT INTO videos (user_id, title, description, filename, original_filename, file_size, duration_seconds, mime_type, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'video/mp4', 'ready')`,
          [
            userId,
            `${video.title} (${quality})`,
            video.description,
            outputFilename,
            video.original_filename,
            stats.size,
            duration
          ]
        );

        // Update original video status back to ready
        await db.query(
          `UPDATE videos SET status = 'ready' WHERE id = $1`,
          [videoId]
        );
      } else {
        // Mark as error
        await db.query(
          `UPDATE videos SET status = 'error' WHERE id = $1`,
          [videoId]
        );
      }
    });

    res.json({ 
      success: true, 
      message: 'Transcoding started',
      data: { quality, outputFilename }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ffmpeg/metadata/:videoId - Get video metadata
router.get('/metadata/:videoId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;

    // Get video info
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [videoId, req.user!.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: 'Video not found' });
      return;
    }

    const video = rows[0];
    const videoPath = path.join(uploadsDir, req.user!.id, video.filename);
    
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ success: false, error: 'Video file not found' });
      return;
    }

    const metadata = await getVideoMetadata(videoPath);

    // Update video duration if not set
    if (metadata.duration && !video.duration_seconds) {
      await db.query(
        `UPDATE videos SET duration_seconds = $1 WHERE id = $2`,
        [metadata.duration, videoId]
      );
    }

    res.json({ 
      success: true, 
      data: {
        ...metadata,
        filename: video.original_filename,
        file_size: video.file_size
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ffmpeg/extract-audio/:videoId - Extract audio from video
router.post('/extract-audio/:videoId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const { format = 'mp3' } = req.body;

    // Get video info
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [videoId, req.user!.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: 'Video not found' });
      return;
    }

    const video = rows[0];
    const videoPath = path.join(uploadsDir, req.user!.id, video.filename);
    
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ success: false, error: 'Video file not found' });
      return;
    }

    // Generate output filename
    const ext = path.extname(video.filename);
    const baseName = path.basename(video.filename, ext);
    const outputFilename = `${baseName}_audio.${format}`;
    const outputPath = path.join(uploadsDir, req.user!.id, outputFilename);

    const codecMap: Record<string, string[]> = {
      'mp3': ['-c:a', 'libmp3lame', '-b:a', '192k'],
      'aac': ['-c:a', 'aac', '-b:a', '192k'],
      'wav': ['-c:a', 'pcm_s16le']
    };

    const codecArgs = codecMap[format] || codecMap['mp3'];

    const result = await runFFmpeg([
      '-i', videoPath,
      '-vn',
      ...codecArgs,
      '-y',
      outputPath
    ]);

    if (!result.success) {
      res.status(500).json({ success: false, error: 'Failed to extract audio', details: result.output });
      return;
    }

    const stats = fs.statSync(outputPath);

    res.json({ 
      success: true, 
      data: { 
        filename: outputFilename,
        size: stats.size,
        format
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
