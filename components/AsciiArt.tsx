import { cn } from "@/lib/utils";

interface AsciiArtProps {
  art: string;
  className?: string;
}

export function AsciiArt({ art, className }: AsciiArtProps) {
  return (
    <pre className={cn("text-molten", className)} aria-hidden="true">
      {art}
    </pre>
  );
}
