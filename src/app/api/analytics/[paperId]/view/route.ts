import { NextResponse } from "next/server";
import { incrementPaperView } from "@/lib/services";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const ip = getClientIp(_request);
  const { success } = await rateLimit(`view:${ip}`, 20, 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { paperId } = await params;

  try {
    await incrementPaperView(paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
