import type { ReactNode } from "react";

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-bold text-[length:--spacing(48)] leading-[0.9] tracking-[-0.04em]">
      {children}
    </h1>
  );
}
