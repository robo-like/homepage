-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users (email);
--> statement-breakpoint

-- Create active_sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS active_sessions_user_id_idx ON active_sessions (user_id);
--> statement-breakpoint

-- Create expiring_email_keys table
CREATE TABLE IF NOT EXISTS expiring_email_keys (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    utilized INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expiring_email_keys_key_idx ON expiring_email_keys (key);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expiring_email_keys_user_id_idx ON expiring_email_keys (user_id);