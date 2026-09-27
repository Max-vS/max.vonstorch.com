import "server-only";

import { and, eq, gt, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { marks } from "@/lib/db/schema";
import type { MarkSubmission } from "@/lib/schemas/mark";

const MARKS_PER_IP_PER_HOUR = 3;
const MAX_PENDING_MARKS = 50;
// Any constant works: nothing else in this database takes advisory locks.
const SUBMIT_LOCK = 1;

export type CreatePendingMarkResult =
  | { ok: true; id: string }
  | { ok: false; reason: "rate_limited" | "busy" };

/** `input` must already pass markSubmissionSchema; a pending mark is not public, so no cache tag changes. */
export async function createPendingMark(
  input: MarkSubmission,
  ipHash: string,
): Promise<CreatePendingMarkResult> {
  return getDb().transaction(async (tx) => {
    // Parallel submits would all count before any of them inserts; submits are rare, so one lock for all of them costs nothing.
    await tx.execute(sql`select pg_advisory_xact_lock(${SUBMIT_LOCK})`);
    const [recentFromIp, pending] = await Promise.all([
      tx.$count(
        marks,
        and(
          eq(marks.ipHash, ipHash),
          gt(marks.createdAt, sql`now() - interval '1 hour'`),
        ),
      ),
      tx.$count(marks, eq(marks.status, "pending")),
    ]);
    if (recentFromIp >= MARKS_PER_IP_PER_HOUR) {
      return { ok: false, reason: "rate_limited" };
    }
    if (pending >= MAX_PENDING_MARKS) return { ok: false, reason: "busy" };

    const [mark] = await tx
      .insert(marks)
      .values({
        name: input.name || null,
        note: input.note,
        tiles: input.tiles,
        ipHash,
      })
      .returning({ id: marks.id });
    return { ok: true, id: mark.id };
  });
}

// The callers are owner-only Server Actions; they must call updateTag("marks") after these two.

/** False when the mark is gone or already approved. */
export async function approveMark(id: string): Promise<boolean> {
  const approved = await getDb()
    .update(marks)
    .set({ status: "approved", approvedAt: sql`now()` })
    .where(and(eq(marks.id, id), eq(marks.status, "pending")))
    .returning({ id: marks.id });
  return approved.length > 0;
}

/** False when the mark is already gone. */
export async function deleteMark(id: string): Promise<boolean> {
  const deleted = await getDb()
    .delete(marks)
    .where(eq(marks.id, id))
    .returning({ id: marks.id });
  return deleted.length > 0;
}
