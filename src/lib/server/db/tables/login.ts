import { email } from 'better-auth';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const LoginTable = sqliteTable('login', {
    id: integer('idUser').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    password: text('password').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' })
});

export type LoginType = InferSelectModel<typeof LoginTable>;
export type NewLoginType = InferInsertModel<typeof LoginTable>;

//npx drizzle-kit generate
//npx drizzle-kit generate --name=create-login-table
//npx drizzle-kit migrate
