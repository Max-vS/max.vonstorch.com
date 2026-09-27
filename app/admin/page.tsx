import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { MarkPreview } from "@/components/admin/mark-preview";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { SpotifyConnection } from "@/components/admin/spotify-connection";
import { SubmitButton } from "@/components/admin/submit-button";
import { labelText } from "@/components/ui/label";
import { requireOwner } from "@/lib/auth/session";
import {
  ADMIN_MARKS_PAGE_SIZE,
  getApprovedMarksForAdmin,
  getPendingMarks,
} from "@/lib/queries/marks";
import { getSpotifyStatus } from "@/lib/queries/spotify";
import type { MarkTile } from "@/lib/schemas/mark";
import { approveMark, deleteMark } from "./actions";

export const metadata: Metadata = { title: "Admin" };

const pageLink = "underline underline-offset-4 hover:opacity-60";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    // The session is read per request, which Cache Components allows only inside a boundary.
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Moderation searchParams={searchParams} />
    </Suspense>
  );
}

async function Moderation({
  searchParams,
}: Pick<PageProps<"/admin">, "searchParams">) {
  await requireOwner();
  const { page: pageParam, error } = await searchParams;
  // `?page=2` is the second page of approved marks; anything else is the first.
  const page = Math.max(1, Math.trunc(Number(pageParam)) || 1);
  const [pending, approved, spotify] = await Promise.all([
    getPendingMarks(),
    getApprovedMarksForAdmin({ page: page - 1 }),
    getSpotifyStatus(),
  ]);
  const pages = Math.max(1, Math.ceil(approved.total / ADMIN_MARKS_PAGE_SIZE));

  return (
    <>
      <header className="flex items-start justify-between gap-16">
        <div className="flex flex-col gap-12">
          <p className={labelText}>Admin · {pending.length} pending</p>
          <h1 className="font-bold text-[length:--spacing(48)] leading-[0.9] tracking-[-0.04em]">
            Community
          </h1>
        </div>
        <SignOutButton />
      </header>

      <SpotifyConnection
        status={spotify}
        linkError={typeof error === "string" ? error : undefined}
      />

      <MarkList
        title={`Pending · ${pending.length}`}
        empty="No marks wait for approval."
      >
        {pending.map((mark) => (
          <MarkRow key={mark.id} mark={mark} date={mark.createdAt}>
            <form action={approveMark.bind(null, mark.id)}>
              <SubmitButton>Approve</SubmitButton>
            </form>
            <form action={deleteMark.bind(null, mark.id)}>
              <SubmitButton variant="ghost">Delete</SubmitButton>
            </form>
          </MarkRow>
        ))}
      </MarkList>

      <MarkList
        title={`Approved · ${approved.total}`}
        empty="No approved marks yet."
      >
        {approved.marks.map((mark) => (
          <MarkRow key={mark.id} mark={mark} date={mark.approvedAt}>
            <form action={deleteMark.bind(null, mark.id)}>
              <SubmitButton variant="ghost">Delete</SubmitButton>
            </form>
          </MarkRow>
        ))}
      </MarkList>

      {pages > 1 ? (
        <nav
          aria-label="Approved marks pages"
          className="flex items-center justify-between gap-16"
        >
          {page > 1 ? (
            <Link href={`/admin?page=${page - 1}`} className={pageLink}>
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className={labelText}>
            Page {page} / {pages}
          </span>
          {page < pages ? (
            <Link href={`/admin?page=${page + 1}`} className={pageLink}>
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}

function MarkList({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: ReactNode[];
}) {
  return (
    <section className="flex flex-col gap-12">
      <h2 className={labelText}>{title}</h2>
      {children.length > 0 ? (
        <ul className="border-ink border-t-[1.5px]">{children}</ul>
      ) : (
        <p className="text-muted">{empty}</p>
      )}
    </section>
  );
}

function MarkRow({
  mark,
  date,
  children,
}: {
  mark: { name: string | null; note: string; tiles: MarkTile[] };
  date: Date | null;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-16 border-ink/18 border-b py-16">
      <MarkPreview tiles={mark.tiles} className="size-96 shrink-0" />
      <div className="flex min-w-0 flex-col gap-8">
        <p className="flex flex-wrap items-baseline gap-x-10">
          <span className="font-semibold text-[length:--spacing(18)]">
            {mark.name ?? "Anonymous"}
          </span>
          {date ? (
            <span className="font-mono text-[length:--spacing(11)] text-muted">
              {dateFormat.format(date)}
            </span>
          ) : null}
        </p>
        <p className="break-words">“{mark.note}”</p>
        <div className="flex items-center gap-14">{children}</div>
      </div>
    </li>
  );
}
