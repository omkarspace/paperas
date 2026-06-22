import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const members = await db.editorialBoardMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json({ members })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, affiliation, role, bio, imageUrl } = body

  if (!name || !affiliation) {
    return NextResponse.json({ error: "Name and affiliation are required" }, { status: 400 })
  }

  const count = await db.editorialBoardMember.count()

  const member = await db.editorialBoardMember.create({
    data: { name, affiliation, role, bio, imageUrl, order: count + 1 },
  })

  return NextResponse.json({ member }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await db.editorialBoardMember.delete({ where: { id } })

  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { id, name, affiliation, role, bio, imageUrl, order, isActive } = body

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const member = await db.editorialBoardMember.update({
    where: { id },
    data: { name, affiliation, role, bio, imageUrl, order, isActive },
  })

  return NextResponse.json({ member })
}
