CREATE TABLE `intake_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`client_hash` text NOT NULL,
	`day` text NOT NULL,
	`requests` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `support_requests` ADD `user_id` text;