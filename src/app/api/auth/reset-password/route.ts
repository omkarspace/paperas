import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { logger } from "@/lib/logger"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 5, 15 * 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 12)
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }).catch(() => {})
    }

    return NextResponse.json({ message: "Password reset successfully." })
  } catch (error) {
    logger.error("Password reset error", { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
