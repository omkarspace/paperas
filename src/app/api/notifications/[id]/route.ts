import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/utils/rate-limit'
import { logger } from '@/lib/logger'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 30, 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const notification = await db.notification.findUnique({
      where: { id }
    })

    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await db.notification.update({
      where: { id },
      data: { read: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    logger.error('Failed to update notification', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
