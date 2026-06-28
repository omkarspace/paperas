import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { message: "Already subscribed" },
          { status: 200 }
        );
      }
      // Re-activate inactive subscriber
      await db.subscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return NextResponse.json(
        { message: "Successfully re-subscribed" },
        { status: 200 }
      );
    }

    await db.subscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
