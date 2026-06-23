import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      institution: true,
      bio: true,
      orcidId: true,
      role: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, institution, bio, currentPassword, newPassword } = body;

  const updateData: Record<string, string> = {};

  if (name) updateData.name = name;
  if (institution) updateData.institution = institution;
  if (bio) updateData.bio = bio;

  if (newPassword) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user?.password) {
      return NextResponse.json(
        { error: "Cannot change password for OAuth accounts" },
        { status: 400 }
      );
    }
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      institution: true,
      bio: true,
      orcidId: true,
      role: true,
    },
  });

  return NextResponse.json({ user: updated });
}
