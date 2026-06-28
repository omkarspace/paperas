import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { sendPasswordResetEmail } from '@/lib/services/email'

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
  const ip = getClientIp(request);
  const { success } = await rateLimit(ip, 3, 15 * 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const { email } = await request.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })

  if (user) {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000)

    await db.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    await sendPasswordResetEmail(email, token)
  }

  return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
}
