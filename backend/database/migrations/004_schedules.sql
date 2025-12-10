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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON stream_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_next_run ON stream_schedules(next_run_at);
CREATE INDEX IF NOT EXISTS idx_schedules_active ON stream_schedules(is_active);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_schedules_updated_at ON stream_schedules;
CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON stream_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
