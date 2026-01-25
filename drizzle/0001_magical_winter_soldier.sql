CREATE TABLE `keyword_search_logs` (
	`keyword` text NOT NULL,
	`session_id` text NOT NULL,
	`searched_at` integer NOT NULL,
	PRIMARY KEY(`keyword`, `session_id`)
);
