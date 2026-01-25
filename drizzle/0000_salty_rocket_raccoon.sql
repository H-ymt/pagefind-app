CREATE TABLE `keyword_counts` (
	`keyword` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`last_searched_at` integer NOT NULL
);
