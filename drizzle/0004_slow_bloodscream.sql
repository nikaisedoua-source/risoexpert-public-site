CREATE TABLE `customer_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`author_name` text NOT NULL,
	`country` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`client_hash` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text NOT NULL
);
