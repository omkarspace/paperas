import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PaperCard } from "@/components/papers/paper-card";
import { JsonLd } from "@/components/shared/json-ld";
import { BookOpen, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    select: { name: true, institution: true, bio: true },
  });

  if (!user) return { title: "Author Not Found" };

  return {
    title: `${user.name || "Author"} - Author Profile`,
    description: user.bio || `Profile of ${user.name || "author"}${user.institution ? ` at ${user.institution}` : ""}`,
    openGraph: {
      title: `${user.name} - Research Verse`,
      description: user.bio || `Author profile at Research Verse Journal`,
      type: "profile",
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      name: true,
      institution: true,
      bio: true,
      orcid: true,
      image: true,
    },
  });

  if (!user || !user.name) {
    notFound();
  }

  const papers = await db.paper.findMany({
    where: { authorId: id, status: "PUBLISHED" },
    include: { author: true, category: true },
    orderBy: { publicationDate: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start gap-6 mb-10">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h1 className="font-serif font-bold text-3xl mb-2">{user.name}</h1>
          {user.institution && (
            <p className="text-muted-foreground">{user.institution}</p>
          )}
          {user.orcid && (
            <a
              href={`https://orcid.org/${user.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              ORCID: {user.orcid}
            </a>
          )}
          {user.bio && (
            <p className="text-foreground/80 mt-3 max-w-prose">{user.bio}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="font-serif text-xl font-semibold mb-6">
          Published Papers ({papers.length})
        </h2>
        {papers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No published papers yet.</p>
        )}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.name,
          affiliation: user.institution
            ? { "@type": "Organization", name: user.institution }
            : undefined,
          identifier: user.orcid ? `https://orcid.org/${user.orcid}` : undefined,
          description: user.bio || undefined,
        }}
      />
    </div>
  );
}
