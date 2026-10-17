"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await authClient.signOut();
          window.location.assign("/admin/login");
        })
      }
    >
      Sign out
    </Button>
  );
}
