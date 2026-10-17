import type { ReactNode } from "react";

export function PanelText({ children }: { children: ReactNode }) {
  return (
    <p className="text-pretty font-medium text-[length:--spacing(15)] leading-[1.3] sm:text-[length:--spacing(22)]">
      {children}
    </p>
  );
}
