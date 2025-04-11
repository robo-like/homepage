-- Add support_tickets table for user inquiries
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Add index on user_id for faster queries
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);

-- Add index on status for filtering
CREATE INDEX idx_support_tickets_status ON support_tickets(status);