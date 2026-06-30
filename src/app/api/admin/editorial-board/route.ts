import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/lib/auth/auth'
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { z } from "zod"

const memberSchema = z.object({
  name: z.string().min(1).max(200),
  affiliation: z.string().min(1).max(500),
  role: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  const members = await db.editorialBoardMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json({ members })
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 20, 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = memberSchema.parse(body)

    const count = await db.editorialBoardMember.count()

    const member = await db.editorialBoardMember.create({
      data: { name: data.name, affiliation: data.affiliation, role: data.role, bio: data.bio, imageUrl: data.imageUrl, order: data.order ?? count + 1 },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    await db.editorialBoardMember.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 20, 60 * 1000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updateSchema = memberSchema.extend({ id: z.string().uuid() })
    const data = updateSchema.parse(body)

    const member = await db.editorialBoardMember.update({
      where: { id: data.id },
      data: { name: data.name, affiliation: data.affiliation, role: data.role, bio: data.bio, imageUrl: data.imageUrl, order: data.order, isActive: data.isActive },
    })

    return NextResponse.json({ member })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}
