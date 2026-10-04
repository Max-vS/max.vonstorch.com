"use client";

import Link from "next/link";
import { ErrorShell } from "@/components/tiles/error-shell";
import { PanelText } from "@/components/tiles/panel-text";
import { Button } from "@/components/ui/button";
import { textLinkStyle } from "@/components/ui/text-link";
import { errors } from "@/content/site";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <ErrorShell kicker={errors.failed.kicker} title={errors.failed.title}>
      <PanelText>
        {errors.failed.body}{" "}
        <Link href="/" className={textLinkStyle}>
          {errors.home}
        </Link>
        .
      </PanelText>
      <Button onClick={retry}>{errors.retry}</Button>
    </ErrorShell>
  );
}
