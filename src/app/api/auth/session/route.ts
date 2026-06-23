import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ 
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      image: session.user.image,
    }
  })
}
