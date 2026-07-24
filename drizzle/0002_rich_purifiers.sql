CREATE TABLE `user_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`google_sub` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`picture` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_sub_unique` ON `users` (`google_sub`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);