import { relations } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "./user";

export const sessionsTable = mysqlTable("sessions_table", {
  id: int().primaryKey().autoincrement(),
  sessionId: varchar("session_id", { length: 512 }).notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  createdAt: timestamp().defaultNow(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
