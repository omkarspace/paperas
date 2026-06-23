import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const issues = await db.journalIssue.findMany({
    orderBy: [{ volume: "desc" }, { issue: "desc" }],
  });
  return NextResponse.json({ issues });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { volume, issue, publicationDate } = body;

  if (!volume || !issue) {
    return NextResponse.json({ error: "Volume and issue are required" }, { status: 400 });
  }

  const journalIssue = await db.journalIssue.create({
    data: {
      volume: Number(volume),
      issue: Number(issue),
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
    },
  });

  return NextResponse.json({ issue: journalIssue }, { status: 201 });
}
