import { cn } from "cn";
import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function ListRow({
  href,
  title,
  sub,
  meta,
  className,
  ...props
}: Omit<ComponentProps<"a">, "href" | "title"> & {
  href: string;
  title: ReactNode;
  sub?: ReactNode;
  meta?: ReactNode;
}) {
  const style = cn(
    "row-nudge flex items-baseline gap-12 border-ink/18 border-b py-9 sm:py-7",
    className,
  );
  const content = (
    <>
      <span className="truncate font-semibold text-[length:--spacing(15)] sm:text-[length:--spacing(18)]">
        {title}
      </span>
      {sub ? (
        <span className="truncate text-[length:--spacing(12)] text-muted sm:text-[length:--spacing(14)]">
          {sub}
        </span>
      ) : null}
      {meta ? (
        <span className="ml-auto shrink-0 whitespace-nowrap">{meta}</span>
      ) : null}
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href as Route} className={style} {...props}>
      {content}
    </Link>
  ) : (
    <a href={href} className={style} {...props}>
      {content}
    </a>
  );
}
