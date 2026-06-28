import { createClient } from "@/lib/supabase/server";
import { db } from "../db";
import { UserRole } from "@prisma/client";

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
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Look up our app user by Supabase auth ID
    const appUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, image: true },
    });

    if (!appUser) return null;

    return {
      user: {
        id: appUser.id,
        email: appUser.email,
        name: appUser.name,
        role: appUser.role,
        image: appUser.image,
      },
    };
  } catch {
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
