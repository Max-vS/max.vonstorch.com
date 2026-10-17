import { getApprovedMarks, parsePage } from "@/lib/queries/marks";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/marks/[page]">,
) {
  const page = parsePage((await params).page);
  if (page === null) return new Response(null, { status: 404 });
  return Response.json(await getApprovedMarks({ page }));
}
