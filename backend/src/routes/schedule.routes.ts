import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { AuthRequest } from '../types/index.js';
import { schedulerService } from '../services/scheduler.service.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const createScheduleSchema = z.object({
  name: z.string().min(1).max(255),
  schedule_type: z.enum(['once', 'daily', 'weekly']),
  scheduled_at: z.string().datetime().optional(),
  schedule_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  days_of_week: z.string().regex(/^[0-6](,[0-6])*$/).optional(),
  video_source: z.enum(['video', 'playlist']),
  video_id: z.string().uuid().optional(),
  playlist_id: z.string().uuid().optional(),
  playback_mode: z.enum(['loop', 'sequential', 'random']),
  platform: z.enum(['youtube', 'facebook', 'twitch', 'custom']),
  stream_key: z.string().min(1),
  quality: z.enum(['720p', '1080p', '4k']).optional(),
});

// All routes require authentication
router.use(authenticate);

// GET /api/schedules - Get all schedules for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await schedulerService.getSchedules(req.user!.id);
    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to get schedules' });
  }
});

// POST /api/schedules - Create new schedule
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validation = createScheduleSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
      return;
    }

    const data = validation.data;

    // Validate schedule type requirements
    if (data.schedule_type === 'once' && !data.scheduled_at) {
      res.status(400).json({ error: 'scheduled_at is required for one-time schedules' });
      return;
    }

    if ((data.schedule_type === 'daily' || data.schedule_type === 'weekly') && !data.schedule_time) {
      res.status(400).json({ error: 'schedule_time is required for daily/weekly schedules' });
      return;
    }

    if (data.schedule_type === 'weekly' && !data.days_of_week) {
      res.status(400).json({ error: 'days_of_week is required for weekly schedules' });
      return;
    }

    // Validate video source
    if (data.video_source === 'video' && !data.video_id) {
      res.status(400).json({ error: 'video_id is required when video_source is video' });
      return;
    }

    if (data.video_source === 'playlist' && !data.playlist_id) {
      res.status(400).json({ error: 'playlist_id is required when video_source is playlist' });
      return;
    }

    const schedule = await schedulerService.createSchedule({
      user_id: req.user!.id,
      name: data.name,
      schedule_type: data.schedule_type,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
      schedule_time: data.schedule_time,
      days_of_week: data.days_of_week,
      video_source: data.video_source,
      video_id: data.video_id,
      playlist_id: data.playlist_id,
      playback_mode: data.playback_mode,
      platform: data.platform,
      stream_key: data.stream_key,
      quality: data.quality || '1080p',
    });

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// PATCH /api/schedules/:id - Update schedule
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const schedule = await schedulerService.updateSchedule(
      req.params.id,
      req.user!.id,
      req.body
    );

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// POST /api/schedules/:id/toggle - Toggle schedule active status
router.post('/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const schedule = await schedulerService.toggleSchedule(req.params.id, req.user!.id);

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error('Toggle schedule error:', error);
    res.status(500).json({ error: 'Failed to toggle schedule' });
  }
});

// DELETE /api/schedules/:id - Delete schedule
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await schedulerService.deleteSchedule(req.params.id, req.user!.id);

    if (!deleted) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;
