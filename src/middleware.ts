import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const { supabaseResponse, user } = await updateSession(request);
  supabaseResponse.headers.set("X-Request-Id", requestId);

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isReviewer = pathname.startsWith("/reviewer");
  const isApiAdmin = pathname.startsWith("/api/admin");

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return Response.redirect(url);
  }

  // Protect dashboard
  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return Response.redirect(url);
  }

  // Protect admin API routes
  if (isApiAdmin) {
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Role check requires DB lookup — done in the route handler
    return supabaseResponse;
  }

  // Protect admin pages
  if (isAdmin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return Response.redirect(url);
  }

  // Protect reviewer pages
  if (isReviewer && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return Response.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/reviewer/:path*",
    "/auth/:path*",
  ],
};
