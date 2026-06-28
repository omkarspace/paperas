import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { rateLimit } from "@/lib/utils/rate-limit"
import { sendPasswordResetEmail } from '@/lib/services/email'

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = await rateLimit(ip, 3, 15 * 60 * 1000); // 3 requests per 15 minutes
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { email } = await request.json()

  if (!email) {
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
