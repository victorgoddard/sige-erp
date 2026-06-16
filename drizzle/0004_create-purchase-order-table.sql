CREATE TABLE `purchase_order` (
	`orderId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderCode` text GENERATED ALWAYS AS ('OC' || printf('%04d', "orderId")) VIRTUAL,
	`date` integer NOT NULL,
	`supplierId` integer NOT NULL,
	`productId` integer NOT NULL,
	`quantity` integer DEFAULT 0,
	`unitPrice` real DEFAULT 0,
	`totalPrice` real DEFAULT 0,
	`status` text NOT NULL,
	`idUser` integer NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
