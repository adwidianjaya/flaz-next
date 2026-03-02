import { pgTable, uuid, text, json, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pageTable = pgTable("__page", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`uuidv7()`),
  name: text(),
  path: text().unique(),
  schema: json(),
  definition: json(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const pageDeletedTable = pgTable("__page_deleted", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`uuidv7()`),
  name: text(),
  path: text(),
  schema: json(),
  definition: json(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
  deleted_at: timestamp({ withTimezone: true }),
});
