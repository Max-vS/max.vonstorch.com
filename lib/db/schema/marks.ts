import {
  index,
  jsonb,
  pgEnum,
  snakeCase,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  MARK_NAME_MAX,
  MARK_NOTE_MAX,
  type MarkTile,
} from "@/lib/schemas/mark";

export const markStatus = pgEnum("mark_status", ["pending", "approved"]);

export const marks = snakeCase.table(
  "marks",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: MARK_NAME_MAX }),
    note: varchar({ length: MARK_NOTE_MAX }).notNull(),
    tiles: jsonb().$type<MarkTile[]>().notNull(),
    status: markStatus().notNull().default("pending"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    approvedAt: timestamp({ withTimezone: true }),
    ipHash: text().notNull(),
  },
  (table) => [
    // Plain `.desc()` emits NULLS LAST, which `ORDER BY approved_at DESC` cannot use.
    index("marks_status_approved_at_idx").on(
      table.status,
      table.approvedAt.desc().nullsFirst(),
    ),
    index("marks_status_created_at_idx").on(table.status, table.createdAt),
    index("marks_ip_hash_created_at_idx").on(table.ipHash, table.createdAt),
  ],
);
