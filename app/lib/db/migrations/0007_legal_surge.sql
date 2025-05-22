CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL
);
