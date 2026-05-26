import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cashFlowTable = sqliteTable('cash_flow', {
	id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
	launchDate: text('launch_date').notNull(),
	description: text('description').notNull(),
	origin: text('origin').notNull(),
	dueDate: text('due_date').notNull(),
	valueCents: integer('value_cents').notNull(),
	type: text('type', { enum: ['A Pagar', 'A Receber'] }).notNull(),
	idUser: integer('idUser').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
});

export type CashFlowType = InferSelectModel<typeof cashFlowTable>;
export type NewCashFlowType = InferInsertModel<typeof cashFlowTable>;
