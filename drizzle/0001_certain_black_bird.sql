CREATE TABLE `sessions_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(512) NOT NULL,
	`user_id` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sessions_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sessions_table` ADD CONSTRAINT `sessions_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;