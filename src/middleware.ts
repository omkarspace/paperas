import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isReviewer = nextUrl.pathname.startsWith("/reviewer");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAdmin && (!isLoggedIn || req.auth?.user?.role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isReviewer && (!isLoggedIn || !["REVIEWER", "EDITOR", "ADMIN"].includes(req.auth?.user?.role as string))) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/reviewer/:path*", "/auth/:path*"],
};