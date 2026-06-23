import { NextResponse } from 'next/server'
import { searchPapers } from '@/lib/services/typesense'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1

  const result = await searchPapers(q, page)
  return NextResponse.json(result)
}
