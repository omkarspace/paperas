import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";
import { UserRole } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { role } = await request.json();

    const validRoles: UserRole[] = ["AUTHOR", "REVIEWER", "EDITOR", "ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    logger.error("Failed to update user", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}