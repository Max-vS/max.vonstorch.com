import { getApprovedMarks } from "@/lib/queries/marks";

/** Pages after the first, which /community renders itself; getApprovedMarks caches each one until a mark changes. */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/marks/[page]">,
) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1) {
    return new Response(null, { status: 404 });
  }
  return Response.json(await getApprovedMarks({ page }));
}
