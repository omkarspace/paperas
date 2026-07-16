import { NextResponse } from "next/server";
import { incrementPaperDownload } from "@/lib/services";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  const ip = getClientIp(_request);
  const { success } = await rateLimit(`download:${ip}`, 20, 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { paperId } = await params;

  try {
    await incrementPaperDownload(paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to record download", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to record download" }, { status: 500 });
  }
}
