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
    table_name: text().unique(),
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
  table_name: text(),
  schema: json(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
  deleted_at: timestamp({ withTimezone: true }),
});

export const viewTable = pgTable(
  "__view",
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .default(sql`uuidv7()`),
    page_id: uuid(),
    path: text(),
    user_agent: text(),
    ip_address: text(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [index("__view_page_id_idx").on(table.page_id)],
);
