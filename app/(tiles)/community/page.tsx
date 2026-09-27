import { CommunityWall } from "@/components/community/community-wall";
import { PanelText } from "@/components/tiles/panel-text";
import { community, pages } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { getApprovedMarks } from "@/lib/queries/marks";

export const metadata = pageMetadata(pages.community);

export default async function CommunityPage() {
  // A failed read at build time fails the build (Next rejects errors inside `use cache` while prerendering), so this only catches a request-time failure.
  const first = await getApprovedMarks({ page: 0 }).catch((error) => {
    console.error("[community] marks cannot load", error);
    return null;
  });
  if (!first) return <PanelText>{community.loadError}</PanelText>;
  return (
    <CommunityWall
      first={{
        marks: first.marks.map((mark) => ({
          ...mark,
          createdAt: mark.createdAt.toISOString(),
        })),
        total: first.total,
      }}
    />
  );
}
