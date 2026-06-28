import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/utils/rate-limit";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 5, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    return NextResponse.json({ message: "Message received. We'll get back to you soon." });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
