import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db";
import { marks } from "@/lib/db/schema";

export const APPROVED_MARKS_PAGE_SIZE = 24;
export const ADMIN_MARKS_PAGE_SIZE = 50;
const MAX_PAGE = 999;

export function parsePage(param: string | string[] | undefined): number | null {
  if (typeof param !== "string" || !/^\d+$/.test(param)) return null;
  const page = Number(param);
  return page >= 1 && page <= MAX_PAGE ? page : null;
}

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

async function approvedPage(page: number, size: number) {
  const db = getDb();
  const [rows, total] = await Promise.all([
    db
      .select({ ...markColumns, approvedAt: marks.approvedAt })
      .from(marks)
      .where(isApproved)
      .orderBy(desc(marks.approvedAt), desc(marks.id))
      .limit(size)
      .offset(page * size),
    db.$count(marks, isApproved),
  ]);
  return { marks: rows, total };
}

export async function getApprovedMarks({ page }: { page: number }) {
  "use cache";
  cacheLife("max");
  cacheTag("marks");
  const { marks: rows, total } = await approvedPage(
    page,
    APPROVED_MARKS_PAGE_SIZE,
  );
  return { marks: rows.map(({ approvedAt: _, ...mark }) => mark), total };
}

export function getApprovedMarksForAdmin({ page }: { page: number }) {
  return approvedPage(page, ADMIN_MARKS_PAGE_SIZE);
}

export function getPendingMarks() {
  return getDb()
    .select(markColumns)
    .from(marks)
    .where(isPending)
    .orderBy(asc(marks.createdAt));
}

export function countPending(): Promise<number> {
  return getDb().$count(marks, isPending);
}
