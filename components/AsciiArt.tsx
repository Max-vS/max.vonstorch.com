import { cn } from "@/lib/utils";

interface AsciiArtProps {
  art: string;
  className?: string;
}

export function AsciiArt({ art, className }: AsciiArtProps) {
  return (
    <div className="w-full overflow-hidden flex justify-center">
      <pre className={cn("text-molten shrink-0", className)} aria-hidden="true">
        {art}
      </pre>
    </div>
  );
}
