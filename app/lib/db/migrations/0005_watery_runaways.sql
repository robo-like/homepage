CREATE TABLE `access_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `support_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_support_tickets_user_id` ON `support_tickets` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_support_tickets_status` ON `support_tickets` (`status`);