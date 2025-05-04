import { relations } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { sessionsTable } from "./session";

export const usersTable = mysqlTable("users_table", {
  id: int().primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password", { length: 512 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}));
