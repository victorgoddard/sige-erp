ALTER TABLE `login` RENAME COLUMN "idUser" TO "id";--> statement-breakpoint
CREATE TABLE `product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL
);
--> statement-breakpoint
DROP INDEX "login_email_unique";--> statement-breakpoint
ALTER TABLE `login` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `login_email_unique` ON `login` (`email`);--> statement-breakpoint
ALTER TABLE `login` ADD `name` text NOT NULL;