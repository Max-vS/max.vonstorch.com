"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/** Disabled while its form's action runs, so one click sends one action. */
export function SubmitButton(props: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return <Button {...props} type="submit" disabled={pending} />;
}
