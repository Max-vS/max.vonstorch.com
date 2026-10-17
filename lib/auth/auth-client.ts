import { createAuthClient } from "better-auth/react";

// Sign in through the HTTP handler, not auth.api: only it runs the rate limit and origin check.
export const authClient = createAuthClient();
