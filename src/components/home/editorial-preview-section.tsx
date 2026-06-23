import Link from "next/link"

const editors = [
  {
    name: "Dr. Meera Gupta",
    title: "Editor-in-Chief, AI & Machine Learning",
  },
  {
    name: "Prof. Suresh Patel",
    title: "Senior Editor, Environmental Sciences",
  },
  {
    name: "Dr. Kavitha Reddy",
    title: "Section Editor, Biomedical Research",
  },
]

export function EditorialPreviewSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif font-semibold text-2xl">
            Meet Our Editorial Board
          </h2>
          <Link
            href="/about/editorial-board"
            className="text-sm text-primary hover:underline"
          >
            View Full Board
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editors.map((editor) => (
            <div
              key={editor.name}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className="bg-muted rounded-full w-16 h-16 mx-auto mb-4" />
              <p className="font-serif font-semibold text-base mb-1">{editor.name}</p>
              <p className="text-xs text-muted-foreground">{editor.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
