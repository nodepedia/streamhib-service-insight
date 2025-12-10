import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { db } from '../config/database.js';
import { authenticate, requirePlan } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createStreamSchema, updateStreamSchema, streamIdSchema } from '../schemas/stream.schema.js';
import { AuthRequest, Stream } from '../types/index.js';
import { streamingEngine } from '../services/streaming.engine.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/streams - Get user's streams
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query<Stream>(
      `SELECT * FROM streams 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user?.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ error: 'Failed to get streams' });
  }
});

// GET /api/streams/:id - Get single stream
router.get('/:id', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db.query<Stream>(
      'SELECT * FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get stream error:', error);
    res.status(500).json({ error: 'Failed to get stream' });
  }
});

// POST /api/streams - Create new stream
router.post('/', validate(createStreamSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, source_url, platform, stream_key, rtmp_url, quality, is_24h } = req.body;

    // Check stream limits based on plan
    const countResult = await db.query(
      'SELECT COUNT(*) FROM streams WHERE user_id = $1',
      [req.user?.id]
    );
    const streamCount = parseInt(countResult.rows[0].count);

    const planLimits: Record<string, number> = {
      free: 1,
      starter: 3,
      professional: 10,
      enterprise: -1 // unlimited
    };

    const limit = planLimits[req.user?.plan || 'free'];
    if (limit !== -1 && streamCount >= limit) {
      res.status(403).json({ 
        error: 'Stream limit reached. Upgrade your plan for more streams.',
        currentPlan: req.user?.plan,
        limit
      });
      return;
    }

    const streamId = uuidv4();
    const result = await db.query<Stream>(
      `INSERT INTO streams (id, user_id, name, description, source_url, platform, stream_key, rtmp_url, quality, is_24h, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'idle')
       RETURNING *`,
      [streamId, req.user?.id, name, description, source_url, platform, stream_key, rtmp_url || '', quality, is_24h]
    );

    res.status(201).json({
      success: true,
      message: 'Stream created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create stream error:', error);
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

// PATCH /api/streams/:id - Update stream
router.patch('/:id', validate(updateStreamSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, source_url, stream_key, quality, is_24h } = req.body;

    // Check ownership
    const checkResult = await db.query(
      'SELECT id, status FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    if (checkResult.rows[0].status === 'live') {
      res.status(400).json({ error: 'Cannot update stream while live. Stop the stream first.' });
      return;
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (source_url !== undefined) {
      updates.push(`source_url = $${paramCount++}`);
      values.push(source_url);
    }
    if (stream_key !== undefined) {
      updates.push(`stream_key = $${paramCount++}`);
      values.push(stream_key);
    }
    if (quality !== undefined) {
      updates.push(`quality = $${paramCount++}`);
      values.push(quality);
    }
    if (is_24h !== undefined) {
      updates.push(`is_24h = $${paramCount++}`);
      values.push(is_24h);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query<Stream>(
      `UPDATE streams SET ${updates.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'Stream updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update stream error:', error);
    res.status(500).json({ error: 'Failed to update stream' });
  }
});

// POST /api/streams/:id/start - Start streaming with FFmpeg
router.post('/:id/start', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { playbackMode = 'loop', playlist } = req.body;

    const checkResult = await db.query<Stream>(
      'SELECT * FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    const stream = checkResult.rows[0];
    
    if (stream.status === 'live' || stream.status === 'starting') {
      res.status(400).json({ error: 'Stream is already running' });
      return;
    }

    // Check if streaming engine already has this stream
    if (streamingEngine.isStreamActive(id)) {
      res.status(400).json({ error: 'Stream is already active in streaming engine' });
      return;
    }

    // Update stream status to starting
    await db.query(
      `UPDATE streams SET status = 'starting', started_at = NOW(), updated_at = NOW() 
       WHERE id = $1`,
      [id]
    );

    // Extract filename from source_url (assuming it's stored as filename)
    const videoFilename = path.basename(stream.source_url);

    // Start streaming engine
    try {
      const status = await streamingEngine.startStream({
        streamId: id,
        userId: req.user!.id,
        videoPath: videoFilename,
        platform: stream.platform,
        streamKey: stream.stream_key,
        rtmpUrl: stream.rtmp_url || undefined,
        playbackMode: playbackMode as 'loop' | 'sequential' | 'random',
        quality: stream.quality,
        playlist: playlist || undefined,
      });

      // Set up event listeners for this stream
      streamingEngine.once('streamLive', async (streamId: string) => {
        if (streamId === id) {
          await db.query(
            `UPDATE streams SET status = 'live', updated_at = NOW() WHERE id = $1`,
            [id]
          );
        }
      });

      streamingEngine.once('streamEnded', async (streamId: string) => {
        if (streamId === id) {
          // Record session
          const streamData = await db.query<Stream>(
            'SELECT * FROM streams WHERE id = $1',
            [id]
          );
          
          if (streamData.rows.length > 0 && streamData.rows[0].started_at) {
            const durationSeconds = Math.floor(
              (Date.now() - new Date(streamData.rows[0].started_at).getTime()) / 1000
            );
            
            await db.query(
              `INSERT INTO stream_sessions (id, stream_id, started_at, ended_at, duration_seconds, peak_viewers, average_viewers)
               VALUES ($1, $2, $3, NOW(), $4, $5, $6)`,
              [uuidv4(), id, streamData.rows[0].started_at, durationSeconds, streamData.rows[0].viewer_count, streamData.rows[0].viewer_count]
            );
          }

          await db.query(
            `UPDATE streams SET status = 'idle', started_at = NULL, viewer_count = 0, updated_at = NOW() 
             WHERE id = $1`,
            [id]
          );
        }
      });

      streamingEngine.once('streamError', async (streamId: string, errorStatus: any) => {
        if (streamId === id) {
          await db.query(
            `UPDATE streams SET status = 'error', updated_at = NOW() WHERE id = $1`,
            [id]
          );
        }
      });

      res.json({
        success: true,
        message: 'Stream starting...',
        data: status
      });
    } catch (engineError: any) {
      // Reset status if engine fails
      await db.query(
        `UPDATE streams SET status = 'idle', updated_at = NOW() WHERE id = $1`,
        [id]
      );
      res.status(500).json({ error: engineError.message || 'Failed to start streaming engine' });
    }
  } catch (error) {
    console.error('Start stream error:', error);
    res.status(500).json({ error: 'Failed to start stream' });
  }
});

// POST /api/streams/:id/stop - Stop streaming
router.post('/:id/stop', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const checkResult = await db.query<Stream>(
      'SELECT * FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    const stream = checkResult.rows[0];
    if (stream.status !== 'live' && stream.status !== 'starting') {
      res.status(400).json({ error: 'Stream is not running' });
      return;
    }

    // Stop streaming engine
    if (streamingEngine.isStreamActive(id)) {
      try {
        await streamingEngine.stopStream(id);
      } catch (engineError) {
        console.error('Error stopping streaming engine:', engineError);
      }
    }

    // Record session if was live
    if (stream.status === 'live' && stream.started_at) {
      const durationSeconds = Math.floor((Date.now() - new Date(stream.started_at).getTime()) / 1000);
      await db.query(
        `INSERT INTO stream_sessions (id, stream_id, started_at, ended_at, duration_seconds, peak_viewers, average_viewers)
         VALUES ($1, $2, $3, NOW(), $4, $5, $6)`,
        [uuidv4(), id, stream.started_at, durationSeconds, stream.viewer_count, stream.viewer_count]
      );
    }

    // Update stream status
    await db.query(
      `UPDATE streams SET status = 'idle', started_at = NULL, viewer_count = 0, updated_at = NOW() 
       WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: 'Stream stopped successfully',
      data: { status: 'idle' }
    });
  } catch (error) {
    console.error('Stop stream error:', error);
    res.status(500).json({ error: 'Failed to stop stream' });
  }
});

// GET /api/streams/:id/live-status - Get live stream status from engine
router.get('/:id/live-status', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check ownership
    const checkResult = await db.query(
      'SELECT id FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    const status = streamingEngine.getStreamStatus(id);

    res.json({
      success: true,
      data: status || { status: 'idle', streamId: id }
    });
  } catch (error) {
    console.error('Get live status error:', error);
    res.status(500).json({ error: 'Failed to get live status' });
  }
});

// GET /api/streams/active - Get all active streams for user
router.get('/active/all', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query<Stream>(
      `SELECT * FROM streams 
       WHERE user_id = $1 AND status IN ('live', 'starting')
       ORDER BY started_at DESC`,
      [req.user?.id]
    );

    // Enrich with engine status
    const enrichedStreams = result.rows.map(stream => ({
      ...stream,
      engineStatus: streamingEngine.getStreamStatus(stream.id),
    }));

    res.json({
      success: true,
      data: enrichedStreams
    });
  } catch (error) {
    console.error('Get active streams error:', error);
    res.status(500).json({ error: 'Failed to get active streams' });
  }
});

// DELETE /api/streams/:id - Delete stream
router.delete('/:id', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const checkResult = await db.query<Stream>(
      'SELECT status FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    if (checkResult.rows[0].status === 'live') {
      res.status(400).json({ error: 'Cannot delete stream while live. Stop the stream first.' });
      return;
    }

    await db.query('DELETE FROM streams WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Stream deleted successfully'
    });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(500).json({ error: 'Failed to delete stream' });
  }
});

// GET /api/streams/:id/stats - Get stream statistics
router.get('/:id/stats', validate(streamIdSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check ownership
    const checkResult = await db.query(
      'SELECT id FROM streams WHERE id = $1 AND user_id = $2',
      [id, req.user?.id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    // Get session history
    const sessionsResult = await db.query(
      `SELECT * FROM stream_sessions 
       WHERE stream_id = $1 
       ORDER BY started_at DESC 
       LIMIT 30`,
      [id]
    );

    // Calculate totals
    const statsResult = await db.query(
      `SELECT 
         COUNT(*) as total_sessions,
         COALESCE(SUM(duration_seconds), 0) as total_duration,
         COALESCE(MAX(peak_viewers), 0) as max_peak_viewers,
         COALESCE(AVG(average_viewers), 0) as avg_viewers
       FROM stream_sessions 
       WHERE stream_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        summary: statsResult.rows[0],
        sessions: sessionsResult.rows
      }
    });
  } catch (error) {
    console.error('Get stream stats error:', error);
    res.status(500).json({ error: 'Failed to get stream statistics' });
  }
});

export default router;
