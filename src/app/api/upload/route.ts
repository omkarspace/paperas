import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/lib/auth/auth'
import { db } from "@/lib/db"
import { uploadPDF, generateS3Key } from "@/lib/storage"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_TYPE = "application/pdf"

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { success } = await rateLimit(ip, 5, 60 * 1000)
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const paperId = formData.get("paperId") as string | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.type !== ALLOWED_TYPE) {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 400 })
  }

  if (paperId) {
    const paper = await db.paper.findUnique({ where: { id: paperId } })
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 })
    }
    if (paper.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const key = generateS3Key(session.user.id, file.name)
    const url = await uploadPDF(buffer, key)

    if (paperId) {
      await db.paper.update({
        where: { id: paperId },
        data: { pdfUrl: url },
      })
    }

    return NextResponse.json({ url, paperId: paperId || undefined })
  } catch (_error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
