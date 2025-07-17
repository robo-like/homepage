CREATE TABLE `code_verification_rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text NOT NULL,
	`last_attempt_at` integer NOT NULL,
	`attempt_count` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ip_verification_idx` ON `code_verification_rate_limits` (`ip_address`);--> statement-breakpoint
CREATE INDEX `last_attempt_idx` ON `code_verification_rate_limits` (`last_attempt_at`);