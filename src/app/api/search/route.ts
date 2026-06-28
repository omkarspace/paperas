import { NextResponse } from 'next/server'
import { searchPapers } from '@/lib/services/typesense'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  // Try Typesense first, fall back to Prisma
  const result = await searchPapers(q, page)

  // If Typesense returned no results or isn't configured, use Prisma
  if (result.papers.length === 0 && q.trim()) {
    try {
      const perPage = 20
      const papers = await db.paper.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q } },
            { abstract: { contains: q } },
            { keywords: { contains: q } },
            { author: { name: { contains: q } } },
          ],
        },
        include: {
          author: { select: { name: true, institution: true } },
          category: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      })

      const total = await db.paper.count({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q } },
            { abstract: { contains: q } },
            { keywords: { contains: q } },
            { author: { name: { contains: q } } },
          ],
        },
      })

      return NextResponse.json({
        papers,
        total,
        page,
        totalPages: Math.ceil(total / perPage),
      })
    } catch {
      // Prisma fallback also failed, return empty
    }
  }

  return NextResponse.json(result)
}
