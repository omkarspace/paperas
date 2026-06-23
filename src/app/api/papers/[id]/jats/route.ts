import { NextResponse } from "next/server";
import { generateJATS } from "@/lib/services/jats";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const xml = await generateJATS(id);
  if (!xml) return NextResponse.json({ error: "Paper not found" }, { status: 404 });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Disposition": `attachment; filename="${id}.jats.xml"`,
    },
  });
}
