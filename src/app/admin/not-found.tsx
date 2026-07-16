"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The admin page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link href="/admin">Back to Admin Dashboard</Link>
      </Button>
    </div>
  );
}
