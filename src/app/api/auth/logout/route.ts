import { NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await signOut({ redirect: false })
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
