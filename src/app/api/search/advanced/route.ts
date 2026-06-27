import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PaperStatus } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || ''
  const author = searchParams.get('author') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const status = searchParams.get('status') || 'PUBLISHED'
  const page = Number(searchParams.get('page')) || 1
  const limit = 20

  const where: Record<string, unknown> = {
    status: status as PaperStatus,
  }

  if (title) {
    where.title = { contains: title, mode: 'insensitive' }
  }

  if (author) {
    where.author = {
      OR: [
        { name: { contains: author, mode: 'insensitive' } },
        { email: { contains: author, mode: 'insensitive' } },
      ],
    }
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  const [papers, total] = await Promise.all([
    db.paper.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: true, category: true },
    }),
    db.paper.count({ where }),
  ])

  return NextResponse.json({ 
    papers, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  })
}
