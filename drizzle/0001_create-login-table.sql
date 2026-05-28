CREATE TABLE `login` (
	`idUser` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `cash_flow` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`launch_date` text NOT NULL,
	`description` text NOT NULL,
	`origin` text NOT NULL,
	`due_date` text NOT NULL,
	`value_cents` integer NOT NULL,
	`type` text NOT NULL,
	`idUser` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
