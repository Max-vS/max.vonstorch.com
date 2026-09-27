import type { Metadata } from "next";
import { ErrorShell } from "@/components/tiles/error-shell";
import { PanelText } from "@/components/tiles/panel-text";
import { errors } from "@/content/site";

export const metadata: Metadata = { title: errors.notFound.kicker };

export default function NotFound() {
  return (
    <ErrorShell kicker={errors.notFound.kicker} title={errors.notFound.title}>
      <PanelText>{errors.notFound.body}</PanelText>
    </ErrorShell>
  );
}
