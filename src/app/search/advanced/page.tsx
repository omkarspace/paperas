import { db } from "@/lib/db";
import { Suspense } from "react";
import { AdvancedSearchClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdvancedSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; author?: string; categoryId?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Advanced Search</h1>
      <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading...</div>}>
        <AdvancedSearchClient
          initialParams={params}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}
