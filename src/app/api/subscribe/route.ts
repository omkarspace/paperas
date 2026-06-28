import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
});

function checkOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 5, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!checkOrigin(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const body = await request.json();
    const data = subscribeSchema.parse(body);

    const existing = await db.subscriber.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
      }
      await db.subscriber.update({
        where: { email: data.email },
        data: { isActive: true },
      });
      return NextResponse.json({ message: "Successfully re-subscribed" }, { status: 200 });
    }

    await db.subscriber.create({
      data: { email: data.email },
    });

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
