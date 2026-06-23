import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from '@/lib/services/email'

export async function POST(request: NextRequest) {
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
