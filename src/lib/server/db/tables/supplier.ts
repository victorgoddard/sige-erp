import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const supplierTable = sqliteTable("supplier", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  telefone: text("telefone").notNull(),
  condicaoPagamento: text("condicaoPagamento").notNull(),

  idUser: integer("idUser").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type SupplierType = InferSelectModel<typeof supplierTable>;
export type NewSupplierType = InferInsertModel<typeof supplierTable>;
