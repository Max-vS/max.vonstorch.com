import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/admin/page-title";
import { FieldError } from "@/components/ui/field";
import { GitHubSignIn } from "./github-sign-in";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Partial<Record<string, string>> = {
  owner_only: "This GitHub account is not the owner's.",
  access_denied: "The GitHub sign-in was cancelled.",
};

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex max-w-360 flex-col gap-24">
      <PageTitle>Sign in</PageTitle>
      <Suspense>
        <SignInError searchParams={searchParams} />
      </Suspense>
      <GitHubSignIn />
    </main>
  );
}

async function SignInError({
  searchParams,
}: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { error } = await searchParams;
  if (typeof error !== "string") return null;
  return (
    <FieldError>
      {ERRORS[error] ?? "The GitHub sign-in failed. Try again."}
    </FieldError>
  );
}
