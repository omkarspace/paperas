import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}
