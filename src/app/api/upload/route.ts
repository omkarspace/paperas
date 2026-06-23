import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/lib/auth/auth'
import { uploadPDF, generateS3Key } from "@/lib/storage/s3"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
  }

  const MAX_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const key = generateS3Key(session.user.id, file.name)
    const url = await uploadPDF(buffer, key)
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
