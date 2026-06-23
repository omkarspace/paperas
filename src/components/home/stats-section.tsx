import { FileText, BookOpen, Users, Search } from "lucide-react"
import { db } from "@/lib/db"

export async function StatsSection() {
  const [paperCount, issueCount] = await Promise.all([
    db.paper.count({ where: { status: "PUBLISHED" } }),
    db.journalIssue.count({ where: { isPublished: true } }),
  ])

  const stats = [
    { icon: FileText, label: "Published Papers", value: paperCount, sub: "Research articles" },
    { icon: BookOpen, label: "Active Issues", value: issueCount, sub: "Volumes published" },
    { icon: Users, label: "Reviewers", value: "45+", sub: "Expert reviewers" },
    { icon: Search, label: "Citations", value: "2000+", sub: "Total citations" },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30"
            >
              <div className="bg-primary/10 rounded-full p-2 mb-4">
                <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="font-serif font-bold text-4xl mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
