-- Add username column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Create index for username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update admin user with username and new password hash
-- Password: 123qwe!@#QWE (bcrypt hash with 12 rounds)
UPDATE users SET 
    username = 'admin',
    password_hash = '$2a$12$rQH8TfGdJQMvQrj3.EKzAu4.O7GxXkQqKN5h8YbdL5mMH9YLPUq3e'
WHERE email = 'admin@infinitystream.id';

-- If admin doesn't exist, create it
INSERT INTO users (id, email, username, name, password_hash, role, plan) 
VALUES (
    uuid_generate_v4(),
    'admin@infinitystream.id',
    'admin',
    'Administrator',
    '$2a$12$rQH8TfGdJQMvQrj3.EKzAu4.O7GxXkQqKN5h8YbdL5mMH9YLPUq3e',
    'admin',
    'enterprise'
) ON CONFLICT (email) DO UPDATE SET
    username = 'admin',
    password_hash = '$2a$12$rQH8TfGdJQMvQrj3.EKzAu4.O7GxXkQqKN5h8YbdL5mMH9YLPUq3e';
