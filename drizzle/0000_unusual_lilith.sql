CREATE TABLE `visitor_locations` (
	`city_key` text PRIMARY KEY NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`visits` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
