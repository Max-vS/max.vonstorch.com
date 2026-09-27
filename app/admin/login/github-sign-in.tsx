"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { authClient } from "@/lib/auth/auth-client";

export function GitHubSignIn() {
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function signIn() {
    if (pending) return;
    startTransition(async () => {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/admin",
        errorCallbackURL: "/admin/login",
      });
      // Without an error the browser is already on its way to GitHub.
      setFailed(Boolean(error));
    });
  }

  return (
    <div className="flex flex-col gap-12">
      <Button aria-disabled={pending} className="self-start" onClick={signIn}>
        Sign in with GitHub
      </Button>
      <FieldError>
        {failed ? "The GitHub sign-in could not start. Try again." : null}
      </FieldError>
    </div>
  );
}
