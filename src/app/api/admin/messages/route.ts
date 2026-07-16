import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 30, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    logger.error("Failed to fetch messages", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
