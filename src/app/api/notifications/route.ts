import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/lib/auth/auth'
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 30, 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    logger.error("Failed to fetch notifications", { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 10, 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    if (body.markAllRead) {
      await db.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Failed to update notifications", { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
