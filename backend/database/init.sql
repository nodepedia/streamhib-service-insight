-- InfinityStream Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Streams Table
CREATE TABLE IF NOT EXISTS streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source_url VARCHAR(2000) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('youtube', 'facebook', 'twitch', 'custom')),
    stream_key VARCHAR(255) NOT NULL,
    rtmp_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('idle', 'starting', 'live', 'stopping', 'error')),
    quality VARCHAR(10) DEFAULT '1080p' CHECK (quality IN ('720p', '1080p', '4k')),
    is_24h BOOLEAN DEFAULT FALSE,
    viewer_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stream Sessions Table (for analytics)
CREATE TABLE IF NOT EXISTS stream_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    peak_viewers INTEGER DEFAULT 0,
    average_viewers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    duration INTEGER,
    thumbnail_path VARCHAR(500),
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Playlist Videos (junction table)
CREATE TABLE IF NOT EXISTS playlist_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, video_id)
);

-- Stream Schedules Table
CREATE TABLE IF NOT EXISTS stream_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    
    -- Schedule type: once, daily, weekly
    schedule_type VARCHAR(20) NOT NULL CHECK (schedule_type IN ('once', 'daily', 'weekly')),
    
    -- For one-time schedules
    scheduled_at TIMESTAMP WITH TIME ZONE,
    
    -- For daily/weekly schedules (stored as HH:MM in 24h format)
    schedule_time TIME,
    
    -- For weekly schedules (comma-separated days: 0=Sunday, 1=Monday, ..., 6=Saturday)
    days_of_week VARCHAR(20),
    
    -- Stream configuration
    video_source VARCHAR(50) NOT NULL CHECK (video_source IN ('video', 'playlist')),
    video_id UUID,
    playlist_id UUID,
    playback_mode VARCHAR(20) NOT NULL CHECK (playback_mode IN ('loop', 'sequential', 'random')),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('youtube', 'facebook', 'twitch', 'custom')),
    stream_key VARCHAR(255) NOT NULL,
    quality VARCHAR(10) DEFAULT '1080p' CHECK (quality IN ('720p', '1080p', '4k')),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_stream_sessions_stream_id ON stream_sessions(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_sessions_started_at ON stream_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON stream_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_next_run ON stream_schedules(next_run_at);
CREATE INDEX IF NOT EXISTS idx_schedules_active ON stream_schedules(is_active);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_streams_updated_at ON streams;
CREATE TRIGGER update_streams_updated_at
    BEFORE UPDATE ON streams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON stream_schedules;
CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON stream_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Admin user with username 'admin' and password '123qwe!@#QWE'
-- bcrypt hash generated with 12 rounds
INSERT INTO users (id, email, username, name, password_hash, role, plan) 
VALUES (
    uuid_generate_v4(),
    'admin@infinitystream.id',
    'admin',
    'Administrator',
    '$2a$12$rQH8TfGdJQMvQrj3.EKzAu4.O7GxXkQqKN5h8YbdL5mMH9YLPUq3e',
    'admin',
    'enterprise'
) ON CONFLICT (email) DO NOTHING;
