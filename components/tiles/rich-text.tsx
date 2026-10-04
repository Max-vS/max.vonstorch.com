import { TextLink } from "@/components/ui/text-link";
import type { RichText as RichTextParts } from "@/content/site";

export function RichText({ parts }: { parts: RichTextParts }) {
  return parts.map((part) =>
    typeof part === "string" ? (
      part
    ) : (
      <TextLink key={part.href} href={part.href}>
        {part.label}
      </TextLink>
    ),
  );
}
