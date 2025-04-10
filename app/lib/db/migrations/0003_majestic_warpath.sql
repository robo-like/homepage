-- Add Stripe customer ID to users table
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
--> statement-breakpoint

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    price_id TEXT,
    current_period_start INTEGER,
    current_period_end INTEGER,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
--> statement-breakpoint

-- Add index for user_id on subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
--> statement-breakpoint

-- Add index for stripe_subscription_id on subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);