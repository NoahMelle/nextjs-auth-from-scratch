import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./user";
import dayjs from "dayjs";

export const sessionsTable = mysqlTable("sessions_table", {
  id: int().primaryKey().autoincrement(),
  sessionId: varchar("session_id", { length: 512 }).notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  valid: boolean().default(true),

  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").$defaultFn(() =>
    dayjs().add(7, "day").toDate()
  ),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
