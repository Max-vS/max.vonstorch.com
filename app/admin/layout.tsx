import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto flex min-h-svh max-w-760 flex-col gap-40 px-24 py-48 [--spacing:1px]">
      {children}
    </div>
  );
}
