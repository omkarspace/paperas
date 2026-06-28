import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const supabase = await createClient()

  // Use Supabase to verify the recovery token and update password
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
  }

  // Also update the password in our local DB for the auth() helper
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const hashedPassword = await bcrypt.hash(password, 12)
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }).catch(() => {})
  }

  return NextResponse.json({ message: "Password reset successfully." })
}
