import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AuthRequest, User } from '../types/index.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    const result = await db.query<User>(
      `INSERT INTO users (id, name, email, password_hash, role, plan)
       VALUES ($1, $2, $3, $4, 'user', 'free')
       RETURNING id, name, email, role, plan, created_at`,
      [userId, name, email, password_hash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, plan: user.plan },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const result = await db.query<User>(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, plan: user.plan },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          plan: user.plan
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query<User>(
      'SELECT id, name, email, role, plan, created_at FROM users WHERE id = $1',
      [req.user?.id]
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
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = jwt.sign(
      { id: req.user?.id, email: req.user?.email, role: req.user?.role, plan: req.user?.plan },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
