import type { Metadata } from "next"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Editorial Board",
  description: "Meet the editorial board members of Paperas academic journal.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about/editorial-board` },
}

export const dynamic = "force-dynamic"

export default async function EditorialBoardPage() {
  const members = await db.editorialBoardMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const editorInChief = members.filter((m) => m.role === "Editor-in-Chief")
  const editors = members.filter((m) => m.role !== "Editor-in-Chief")

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Editorial Board</h1>

      {editorInChief.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Editor-in-Chief</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorInChief.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.affiliation}</p>
                  {member.bio && <p className="mt-2 text-sm">{member.bio}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Editorial Board Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editors.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
                {member.bio && <p className="mt-2 text-sm">{member.bio}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {members.length === 0 && (
        <p className="text-muted-foreground text-center py-12">Editorial board information coming soon.</p>
      )}
    </div>
  )
}
