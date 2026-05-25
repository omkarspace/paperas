import { NextResponse } from "next/server";

const subscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (subscribers.has(email)) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    subscribers.add(email);
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
