import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "../db";
import { UserRole } from "@prisma/client";
import { logger } from "@/lib/logger";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
}

export interface Session {
  user: SessionUser;
}

/**
 * Get the current session by reading the Supabase auth cookie
 * and looking up the user's role from the database.
 * Returns null if not authenticated.
 */
export async function auth(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // Ignore — set() in Server Component
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch {
              // Ignore — remove() in Server Component
            }
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Look up role from Prisma
    const appUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, image: true },
    });

    if (!appUser) {
      return null;
    }

    return {
      user: {
        id: appUser.id,
        email: appUser.email,
        name: appUser.name,
        role: appUser.role,
        image: appUser.image,
      },
    };
  } catch (error) {
    logger.error("[auth] Error getting session", { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

/**
 * Require authentication - throws redirect if not authenticated.
 * For use in server components.
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
