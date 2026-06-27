import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const _body = await request.json();

  return NextResponse.json({ message: "Settings saved" });
}
