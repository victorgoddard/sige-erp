import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { supplierTable } from "../schema";

export const productTable = sqliteTable("product", {
  // Usando autoIncrement para o ID ser gerenciado pelo banco
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  minimumStockQuantity: integer("minimumStockQuantity").notNull().default(0),

  fornecedorId: integer("fornecedorId").references(() => supplierTable.id),
});

export type ProductType = typeof productTable.$inferSelect;
export type NewProductType = typeof productTable.$inferInsert;