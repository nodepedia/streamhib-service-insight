import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { AuthRequest, User } from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users - Admin only
router.get('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query<User>(
      `SELECT id, name, email, role, plan, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow users to view their own profile unless admin
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await db.query<User>(
      'SELECT id, name, email, role, plan, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Only allow users to update their own profile unless admin
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (password) {
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(password_hash);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query<User>(
      `UPDATE users SET ${updates.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, role, plan, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Admin only or self-delete
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow users to delete their own account unless admin
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
