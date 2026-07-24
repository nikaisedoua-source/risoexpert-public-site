CREATE TABLE `support_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`location` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`machine` text NOT NULL,
	`urgency` text NOT NULL,
	`error_message` text,
	`problem` text NOT NULL,
	`status` text DEFAULT 'nouvelle' NOT NULL,
	`consented_at` text NOT NULL,
	`created_at` text NOT NULL
);
