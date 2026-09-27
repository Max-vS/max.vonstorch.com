import { createAuthClient } from "better-auth/react";

// Sign in through this same-origin client, not auth.api: only the HTTP handler runs the rate limit and origin check.
export const authClient = createAuthClient();
