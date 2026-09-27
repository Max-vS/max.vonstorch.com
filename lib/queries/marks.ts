import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db";
import { marks } from "@/lib/db/schema";

export const APPROVED_MARKS_PAGE_SIZE = 24;
export const ADMIN_MARKS_PAGE_SIZE = 50;

// ip_hash never leaves the database.
const markColumns = {
  id: marks.id,
  name: marks.name,
  note: marks.note,
  tiles: marks.tiles,
  createdAt: marks.createdAt,
};

const isApproved = eq(marks.status, "approved");
const isPending = eq(marks.status, "pending");

/** `page` starts at 0; `total` counts all approved marks. */
export async function getApprovedMarks({ page }: { page: number }) {
  "use cache";
  // Approve and delete call updateTag("marks"), so the database is read only after a change.
  cacheLife("max");
  cacheTag("marks");

  const db = getDb();
  const [rows, total] = await Promise.all([
    db
      .select(markColumns)
      .from(marks)
      .where(isApproved)
      .orderBy(desc(marks.approvedAt), desc(marks.id))
      .limit(APPROVED_MARKS_PAGE_SIZE)
      .offset(page * APPROVED_MARKS_PAGE_SIZE),
    db.$count(marks, isApproved),
  ]);
  return { marks: rows, total };
}

export async function getPendingMarks() {
  return getDb()
    .select(markColumns)
    .from(marks)
    .where(isPending)
    .orderBy(asc(marks.createdAt));
}

/** `page` starts at 0; `total` counts all approved marks. */
export async function getApprovedMarksForAdmin({ page }: { page: number }) {
  const db = getDb();
  const [rows, total] = await Promise.all([
    db
      .select({ ...markColumns, approvedAt: marks.approvedAt })
      .from(marks)
      .where(isApproved)
      .orderBy(desc(marks.approvedAt), desc(marks.id))
      .limit(ADMIN_MARKS_PAGE_SIZE)
      .offset(page * ADMIN_MARKS_PAGE_SIZE),
    db.$count(marks, isApproved),
  ]);
  return { marks: rows, total };
}

export async function countPending(): Promise<number> {
  return getDb().$count(marks, isPending);
}
