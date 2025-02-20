CREATE TABLE `analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`event_type` text NOT NULL,
	`path` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`description` text,
	`event_value` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`author` text NOT NULL,
	`created_at` integer NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`seo_image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `posts` (`slug`);