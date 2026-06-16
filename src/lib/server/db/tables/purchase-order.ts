import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql, type SQL } from 'drizzle-orm';

import type { StatusType } from '$lib/enums/orderStatus'; 

// Caso precise referenciar essas tabelas explicitamente para criar as Foreign Keys (Chaves Estrangeiras):
// import { loginTable } from './login';
// import { supplierTable } from './supplier';
// import { productTable } from './product';

export const purchaseOrderTable = sqliteTable("purchase_order", {
  
    orderId: integer("orderId").primaryKey({ autoIncrement: true }),

    code: text("orderCode").generatedAlwaysAs(
        (): SQL => sql`'OC' || printf('%04d', "orderId")`
    ),
    
    date: integer("date", { mode: 'timestamp' }).notNull(),
    
    // Chaves Estrangeiras (você pode adicionar .references(() => tabela.id) no futuro se desejar a trava do DB)
    supplierId: integer("supplierId").notNull(),
    productId: integer("productId").notNull(),
    
    quantity: integer("quantity").default(0),
    unitPrice: real("unitPrice").default(0),
    totalPrice: real("totalPrice").default(0),
    
    status: text("status").$type<StatusType>().notNull(),
    
    idUser: integer("idUser").notNull(),
    
    // createdAt e updatedAt: timestamps numéricos que viram objetos Date no TS
    createdAt: integer("createdAt", { mode: 'timestamp' }).defaultNow(),
    
    // O $onUpdate() garante que ao atualizar um registro, essa coluna receba a data atual automaticamente
    updatedAt: integer("updatedAt", { mode: 'timestamp' })
        .defaultNow()
        .$onUpdate(() => new Date())
});