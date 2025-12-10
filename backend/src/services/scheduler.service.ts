import { db } from '../config/database.js';
import { streamingEngine } from './streaming.engine.js';

interface Schedule {
  id: string;
  user_id: string;
  stream_id?: string;
  name: string;
  schedule_type: 'once' | 'daily' | 'weekly';
  scheduled_at?: Date;
  schedule_time?: string;
  days_of_week?: string;
  video_source: 'video' | 'playlist';
  video_id?: string;
  playlist_id?: string;
  playback_mode: 'loop' | 'sequential' | 'random';
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  stream_key: string;
  quality: '720p' | '1080p' | '4k';
  is_active: boolean;
  next_run_at?: Date;
}

class SchedulerService {
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.start();
  }

  start() {
    // Check schedules every minute using setInterval
    this.intervalId = setInterval(async () => {
      await this.checkSchedules();
    }, 60 * 1000); // Every 60 seconds
    
    // Also run immediately on start
    this.checkSchedules();
    
    console.log('✅ Scheduler service started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Scheduler service stopped');
    }
  }

  private async checkSchedules() {
    try {
      const now = new Date();
      
      // Get all active schedules that should run now
      const { rows: schedules } = await db.query<Schedule>(
        `SELECT * FROM stream_schedules 
         WHERE is_active = true 
         AND next_run_at IS NOT NULL 
         AND next_run_at <= $1`,
        [now]
      );

      for (const schedule of schedules) {
        await this.executeSchedule(schedule);
      }
    } catch (error) {
      console.error('[Scheduler] Error checking schedules:', error);
    }
  }

  private async executeSchedule(schedule: Schedule) {
    console.log(`[Scheduler] Executing schedule: ${schedule.name} (${schedule.id})`);

    try {
      // Get video filename
      let videoFilename: string | undefined;
      let playlist: string[] | undefined;

      if (schedule.video_source === 'video' && schedule.video_id) {
        const { rows } = await db.query(
          'SELECT filename FROM videos WHERE id = $1 AND user_id = $2',
          [schedule.video_id, schedule.user_id]
        );
        if (rows.length > 0) {
          videoFilename = rows[0].filename;
        }
      } else if (schedule.video_source === 'playlist' && schedule.playlist_id) {
        const { rows } = await db.query(
          `SELECT v.filename FROM videos v
           JOIN playlist_videos pv ON v.id = pv.video_id
           WHERE pv.playlist_id = $1
           ORDER BY pv.position`,
          [schedule.playlist_id]
        );
        playlist = rows.map(r => r.filename);
        if (playlist.length > 0) {
          videoFilename = playlist[0];
        }
      }

      if (!videoFilename) {
        console.error(`[Scheduler] No video found for schedule ${schedule.id}`);
        return;
      }

      // Create or get stream
      let streamId = schedule.stream_id;
      
      if (!streamId) {
        // Create a new stream entry
        const { rows } = await db.query(
          `INSERT INTO streams (user_id, name, source_url, platform, stream_key, quality, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'idle')
           RETURNING id`,
          [
            schedule.user_id,
            schedule.name,
            videoFilename,
            schedule.platform,
            schedule.stream_key,
            schedule.quality
          ]
        );
        streamId = rows[0].id;

        // Update schedule with stream_id
        await db.query(
          'UPDATE stream_schedules SET stream_id = $1 WHERE id = $2',
          [streamId, schedule.id]
        );
      }

      // Start the stream
      await streamingEngine.startStream({
        streamId: streamId!,
        userId: schedule.user_id,
        videoPath: videoFilename,
        platform: schedule.platform,
        streamKey: schedule.stream_key,
        playbackMode: schedule.playback_mode,
        quality: schedule.quality,
        playlist,
      });

      // Update schedule
      await db.query(
        `UPDATE stream_schedules SET 
         last_run_at = NOW(),
         run_count = run_count + 1,
         next_run_at = $1
         WHERE id = $2`,
        [this.calculateNextRun(schedule), schedule.id]
      );

      // Deactivate one-time schedules
      if (schedule.schedule_type === 'once') {
        await db.query(
          'UPDATE stream_schedules SET is_active = false WHERE id = $1',
          [schedule.id]
        );
      }

      console.log(`[Scheduler] Successfully started stream for schedule ${schedule.id}`);
    } catch (error) {
      console.error(`[Scheduler] Error executing schedule ${schedule.id}:`, error);
    }
  }

  calculateNextRun(schedule: Schedule): Date | null {
    const now = new Date();

    switch (schedule.schedule_type) {
      case 'once':
        return null; // One-time schedules don't repeat

      case 'daily':
        if (!schedule.schedule_time) return null;
        
        const [dailyHour, dailyMinute] = schedule.schedule_time.split(':').map(Number);
        const nextDaily = new Date(now);
        nextDaily.setHours(dailyHour, dailyMinute, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (nextDaily <= now) {
          nextDaily.setDate(nextDaily.getDate() + 1);
        }
        
        return nextDaily;

      case 'weekly':
        if (!schedule.schedule_time || !schedule.days_of_week) return null;
        
        const [weeklyHour, weeklyMinute] = schedule.schedule_time.split(':').map(Number);
        const days = schedule.days_of_week.split(',').map(Number);
        
        if (days.length === 0) return null;

        // Find next occurrence
        for (let i = 0; i < 8; i++) {
          const checkDate = new Date(now);
          checkDate.setDate(checkDate.getDate() + i);
          checkDate.setHours(weeklyHour, weeklyMinute, 0, 0);
          
          if (days.includes(checkDate.getDay()) && checkDate > now) {
            return checkDate;
          }
        }
        
        return null;

      default:
        return null;
    }
  }

  async createSchedule(data: Omit<Schedule, 'id' | 'is_active' | 'next_run_at'>): Promise<Schedule> {
    const nextRun = this.calculateNextRun(data as Schedule) || data.scheduled_at || null;

    const { rows } = await db.query<Schedule>(
      `INSERT INTO stream_schedules (
        user_id, name, schedule_type, scheduled_at, schedule_time, days_of_week,
        video_source, video_id, playlist_id, playback_mode, platform, stream_key, quality,
        is_active, next_run_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, $14)
      RETURNING *`,
      [
        data.user_id,
        data.name,
        data.schedule_type,
        data.scheduled_at || null,
        data.schedule_time || null,
        data.days_of_week || null,
        data.video_source,
        data.video_id || null,
        data.playlist_id || null,
        data.playback_mode,
        data.platform,
        data.stream_key,
        data.quality,
        nextRun
      ]
    );

    return rows[0];
  }

  async getSchedules(userId: string): Promise<Schedule[]> {
    const { rows } = await db.query<Schedule>(
      'SELECT * FROM stream_schedules WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  async updateSchedule(id: string, userId: string, data: Partial<Schedule>): Promise<Schedule | null> {
    // First get current schedule to calculate next run
    const { rows: current } = await db.query<Schedule>(
      'SELECT * FROM stream_schedules WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (current.length === 0) return null;

    const merged = { ...current[0], ...data };
    const nextRun = this.calculateNextRun(merged as Schedule) || merged.scheduled_at || null;

    const { rows } = await db.query<Schedule>(
      `UPDATE stream_schedules SET
        name = COALESCE($1, name),
        schedule_type = COALESCE($2, schedule_type),
        scheduled_at = $3,
        schedule_time = $4,
        days_of_week = $5,
        video_source = COALESCE($6, video_source),
        video_id = $7,
        playlist_id = $8,
        playback_mode = COALESCE($9, playback_mode),
        platform = COALESCE($10, platform),
        stream_key = COALESCE($11, stream_key),
        quality = COALESCE($12, quality),
        is_active = COALESCE($13, is_active),
        next_run_at = $14,
        updated_at = NOW()
       WHERE id = $15 AND user_id = $16
       RETURNING *`,
      [
        data.name,
        data.schedule_type,
        data.scheduled_at || null,
        data.schedule_time || null,
        data.days_of_week || null,
        data.video_source,
        data.video_id || null,
        data.playlist_id || null,
        data.playback_mode,
        data.platform,
        data.stream_key,
        data.quality,
        data.is_active,
        nextRun,
        id,
        userId
      ]
    );

    return rows[0] || null;
  }

  async deleteSchedule(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await db.query(
      'DELETE FROM stream_schedules WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (rowCount ?? 0) > 0;
  }

  async toggleSchedule(id: string, userId: string): Promise<Schedule | null> {
    const { rows } = await db.query<Schedule>(
      `UPDATE stream_schedules SET is_active = NOT is_active, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    return rows[0] || null;
  }
}

export const schedulerService = new SchedulerService();
