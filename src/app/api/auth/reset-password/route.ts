import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const resetToken = await db.passwordResetToken.findUnique({ where: { token } })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await db.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.delete({ where: { id: resetToken.id } })

  return NextResponse.json({ message: "Password reset successfully." })
}
