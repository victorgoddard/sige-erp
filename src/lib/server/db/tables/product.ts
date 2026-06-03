import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const productTable = sqliteTable("product", {
  // Usando autoIncrement para o ID ser gerenciado pelo banco
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export type ProductType = typeof productTable.$inferSelect;
export type NewProductType = typeof productTable.$inferInsert;