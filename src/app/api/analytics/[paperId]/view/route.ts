import { NextResponse } from "next/server";
import { incrementPaperView } from "@/lib/services";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const { paperId } = await params;

  try {
    await incrementPaperView(paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
