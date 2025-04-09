CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_subscription_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`price_id` text,
	`current_period_start` integer,
	`current_period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` text;