import { NextResponse } from "next/server";
import { incrementPaperDownload } from "@/lib/analytics";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const { paperId } = await params;

  try {
    await incrementPaperDownload(paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record download:", error);
    return NextResponse.json({ error: "Failed to record download" }, { status: 500 });
  }
}
