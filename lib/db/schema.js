import {
  pgTable,
  uuid,
  text,
  json,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pageTable = pgTable(
  "__page",
  {
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
  },
  (table) => [index("__page_name_idx").on(table.name)],
);

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

export const collectionTable = pgTable(
  "__collection",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`uuidv7()`),
    name: text().unique(),
    schema: json(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [index("__collation_name_idx").on(table.name)],
);

export const collectionDeletedTable = pgTable("__collection_deleted", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`uuidv7()`),
  name: text(),
  schema: json(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
  deleted_at: timestamp({ withTimezone: true }),
});
