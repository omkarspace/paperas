import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  } catch (error) {
    logger.error("Logout error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }
}
