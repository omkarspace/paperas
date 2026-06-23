import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaperCard } from "@/components/papers/paper-card"
import { db } from "@/lib/db"

export async function PublicationsSection() {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
  })

  return (
    <section className="py-16 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif font-semibold text-xl">Latest Publications</h2>
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="rounded-full gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-border bg-card">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground text-sm">No publications yet. Be the first to submit!</p>
          </div>
        )}
      </div>
    </section>
  )
}
