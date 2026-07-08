import { db } from "@/lib/db"
import { PaperCard } from "./paper-card"

interface RelatedPapersProps {
  categoryId: string | null
  currentPaperId: string
}

export async function RelatedPapers({ categoryId, currentPaperId }: RelatedPapersProps) {
  if (!categoryId) return null

  const papers = await db.paper.findMany({
    where: {
      categoryId,
      id: { not: currentPaperId },
      status: "PUBLISHED",
    },
    include: { author: true, category: true },
    orderBy: { publicationDate: "desc" },
    take: 3,
  })

  if (papers.length === 0) return null

  return (
    <section className="border-t pt-8 mt-12">
      <h2 className="font-serif text-xl font-semibold mb-6">Related Papers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </section>
  )
}
