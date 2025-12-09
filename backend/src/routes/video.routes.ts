import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOADS_DIR || './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadsDir, req.user!.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024 // 5GB max file size
  }
});

// Get all videos for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user!.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Get single video
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Upload video
router.post('/upload', authenticate, upload.single('video'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No video file provided' });
    }

    const { title, description } = req.body;
    
    const { rows } = await db.query(
      `INSERT INTO videos (user_id, title, description, filename, original_filename, file_size, mime_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ready')
       RETURNING *`,
      [
        req.user!.id,
        title || req.file.originalname,
        description || null,
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype
      ]
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update video
router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    const { rows } = await db.query(
      `UPDATE videos SET title = COALESCE($1, title), description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [title, description, req.params.id, req.user!.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete video
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    // Get video info first
    const { rows: videos } = await db.query(
      `SELECT * FROM videos WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    // Delete file from disk
    const filePath = path.join(uploadsDir, req.user!.id, videos[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await db.query(`DELETE FROM videos WHERE id = $1`, [req.params.id]);
    
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user storage stats
router.get('/stats/storage', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT COUNT(*) as total_videos, COALESCE(SUM(file_size), 0) as total_size 
       FROM videos WHERE user_id = $1`,
      [req.user!.id]
    );
    res.json({ 
      success: true, 
      data: {
        totalVideos: parseInt(rows[0].total_videos),
        totalSize: parseInt(rows[0].total_size)
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============ PLAYLISTS ============

// Get all playlists
router.get('/playlists/all', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, COUNT(pv.id) as video_count
       FROM playlists p
       LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.user!.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

// Create playlist
router.post('/playlists', authenticate, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const { rows } = await db.query(
      `INSERT INTO playlists (user_id, name, description) VALUES ($1, $2, $3) RETURNING *`,
      [req.user!.id, name, description || null]
    );
    
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get playlist with videos
router.get('/playlists/:id', authenticate, async (req, res, next) => {
  try {
    const { rows: playlists } = await db.query(
      `SELECT * FROM playlists WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    
    if (playlists.length === 0) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const { rows: videos } = await db.query(
      `SELECT v.*, pv.position
       FROM videos v
       JOIN playlist_videos pv ON v.id = pv.video_id
       WHERE pv.playlist_id = $1
       ORDER BY pv.position`,
      [req.params.id]
    );

    res.json({ 
      success: true, 
      data: { ...playlists[0], videos } 
    });
  } catch (error) {
    next(error);
  }
});

// Add video to playlist
router.post('/playlists/:id/videos', authenticate, async (req, res, next) => {
  try {
    const { videoId } = req.body;
    
    // Get max position
    const { rows: positions } = await db.query(
      `SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM playlist_videos WHERE playlist_id = $1`,
      [req.params.id]
    );
    
    await db.query(
      `INSERT INTO playlist_videos (playlist_id, video_id, position) VALUES ($1, $2, $3)
       ON CONFLICT (playlist_id, video_id) DO NOTHING`,
      [req.params.id, videoId, positions[0].next_pos]
    );
    
    res.json({ success: true, message: 'Video added to playlist' });
  } catch (error) {
    next(error);
  }
});

// Remove video from playlist
router.delete('/playlists/:playlistId/videos/:videoId', authenticate, async (req, res, next) => {
  try {
    await db.query(
      `DELETE FROM playlist_videos WHERE playlist_id = $1 AND video_id = $2`,
      [req.params.playlistId, req.params.videoId]
    );
    res.json({ success: true, message: 'Video removed from playlist' });
  } catch (error) {
    next(error);
  }
});

// Delete playlist
router.delete('/playlists/:id', authenticate, async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      `DELETE FROM playlists WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    
    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }
    
    res.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
