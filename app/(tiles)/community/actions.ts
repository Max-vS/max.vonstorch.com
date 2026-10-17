"use server";

import { ipAddress } from "@vercel/functions";
import { checkBotId } from "botid/server";
import { headers } from "next/headers";
import * as z from "zod";
import { hashIp } from "@/lib/ip-hash";
import { createPendingMark } from "@/lib/mutations/marks";
import { type MarkSubmission, markSubmissionSchema } from "@/lib/schemas/mark";

export type SubmitMarkResult =
  | { ok: true; id: string }
  | {
      ok: false;
      fieldErrors: Partial<Record<keyof MarkSubmission, string[]>>;
    }
  | { ok: false; error: "too_many" | "failed" };

export async function submitMark(
  input: MarkSubmission,
): Promise<SubmitMarkResult> {
  try {
    const { isBot } = await checkBotId();
    if (isBot) return { ok: false, error: "failed" };

    const parsed = markSubmissionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      };
    }

    // Wrapped, because ipAddress() would read the raw Node headers that Next keeps on its own `headers` field.
    const ip = ipAddress({ headers: await headers() });
    const created = await createPendingMark(
      parsed.data,
      hashIp(ip ?? "unknown"),
    );
    return created.ok
      ? { ok: true, id: created.id }
      : { ok: false, error: "too_many" };
  } catch (error) {
    console.error("[community] submitMark failed", error);
    return { ok: false, error: "failed" };
  }
}
