import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'user' | 'admin';
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  created_at: Date;
  updated_at: Date;
}

export interface Stream {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  source_url: string;
  platform: 'youtube' | 'facebook' | 'twitch' | 'custom';
  stream_key: string;
  rtmp_url: string;
  status: 'idle' | 'starting' | 'live' | 'stopping' | 'error';
  quality: '720p' | '1080p' | '4k';
  is_24h: boolean;
  viewer_count: number;
  started_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface StreamSession {
  id: string;
  stream_id: string;
  started_at: Date;
  ended_at?: Date;
  duration_seconds?: number;
  peak_viewers: number;
  average_viewers: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    plan: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  plan: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
