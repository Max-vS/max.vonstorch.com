"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { labelText } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import type { SpotifyStatus } from "@/lib/queries/spotify";

const STATUS_TEXT: Record<SpotifyStatus, string> = {
  connected: "Connected",
  "not-connected": "Not connected",
  "reconnect-needed": "Reconnect needed",
};

export function SpotifyConnection({
  status,
  linkError,
}: {
  status: SpotifyStatus;
  linkError?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function connect() {
    if (pending) return;
    startTransition(async () => {
      const { error } = await authClient.linkSocial({
        provider: "spotify",
        callbackURL: "/admin",
        errorCallbackURL: "/admin",
      });
      setFailed(Boolean(error));
    });
  }

  return (
    <section className="flex flex-col gap-12">
      <h2 className={labelText}>Spotify</h2>
      <div className="flex items-center justify-between gap-16 border-ink border-t-[1.5px] pt-16">
        <p className="font-semibold text-[length:--spacing(18)]">
          {STATUS_TEXT[status]}
        </p>
        <Button
          aria-disabled={pending}
          variant={status === "connected" ? "ghost" : "solid"}
          onClick={connect}
        >
          {status === "not-connected" ? "Connect" : "Reconnect"}
        </Button>
      </div>
      <FieldError>
        {failed
          ? "The Spotify connection could not start. Try again."
          : linkError
            ? `Spotify did not connect (${linkError}).`
            : null}
      </FieldError>
    </section>
  );
}
