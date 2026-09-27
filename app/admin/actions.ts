"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { checkOwner } from "@/lib/auth/session";
import * as mutations from "@/lib/mutations/marks";

const markIdSchema = z.uuid();

// An action is a public endpoint that the page's owner check does not cover, so each one checks again.
async function ownerMarkId(id: string) {
  const owner = await checkOwner();
  // A plain form action has no state to show an error in, and a lapsed session only needs a new sign-in.
  if (!owner.ok) redirect("/admin/login");
  const parsed = markIdSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

export async function approveMark(id: string) {
  const markId = await ownerMarkId(id);
  if (markId && (await mutations.approveMark(markId))) updateTag("marks");
}

export async function deleteMark(id: string) {
  const markId = await ownerMarkId(id);
  if (markId && (await mutations.deleteMark(markId))) updateTag("marks");
}
