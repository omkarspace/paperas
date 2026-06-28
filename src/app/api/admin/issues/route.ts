import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const issueSchema = z.object({
  volume: z.number().int().min(1),
  issue: z.number().int().min(1),
  publicationDate: z.string().datetime().optional(),
});

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
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = issueSchema.parse(body);

    const journalIssue = await db.journalIssue.create({
      data: {
        volume: data.volume,
        issue: data.issue,
        publicationDate: data.publicationDate ? new Date(data.publicationDate) : new Date(),
      },
    });

    return NextResponse.json({ issue: journalIssue }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}
