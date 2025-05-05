ALTER TABLE `sessions_table` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `sessions_table` RENAME COLUMN `expiredAt` TO `expires_at`;--> statement-breakpoint
ALTER TABLE `sessions_table` ADD `valid` boolean DEFAULT true;