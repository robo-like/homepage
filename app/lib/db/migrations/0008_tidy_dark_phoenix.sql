CREATE TABLE `email_rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`last_sent_at` integer NOT NULL,
	`attempt_count` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_ip_idx` ON `email_rate_limits` (`email`,`ip_address`);--> statement-breakpoint
CREATE INDEX `last_sent_idx` ON `email_rate_limits` (`last_sent_at`);--> statement-breakpoint
DROP TABLE `contacts`;