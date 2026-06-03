import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const LoginTable = sqliteTable("login", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("createdAt", {
        mode: "timestamp_ms"
    }).notNull(),
    updatedAt: integer("updatedAt", {
        mode: "timestamp_ms"
    }).notNull()
});

export type LoginType = InferSelectModel<typeof LoginTable>;
export type NewLoginType = InferInsertModel<typeof LoginTable>;

//npx drizzle-kit generate
//npx drizzle-kit generate --name=create-login-table
//npx drizzle-kit migrate
//npx drizzle-kit push

/*
cookies.set("session", token, {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 24
});
*/
