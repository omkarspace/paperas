import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function createCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name) return;
  await db.category.create({ data: { name } });
  revalidatePath("/admin/categories");
}

async function deleteCategory(id: string) {
  "use server";
  await db.category.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/auth/login");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { papers: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-primary mb-6">Categories</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" name="name" placeholder="e.g. Computer Science" required />
            </div>
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat._count.papers} papers</p>
              </div>
              <form action={deleteCategory.bind(null, cat.id)}>
                <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                  Delete
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No categories yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
