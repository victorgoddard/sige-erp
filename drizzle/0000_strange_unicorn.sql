CREATE TABLE `supplier` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`idUser` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
