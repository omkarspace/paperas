import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { cache } from "react";
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

const AUTH_USER_SELECT = { id: true, email: true, name: true, role: true, image: true } as const;

function toSession(u: { id: string; email: string; name: string | null; role: UserRole; image: string | null }): Session {
  return { user: { id: u.id, email: u.email, name: u.name, role: u.role, image: u.image } };
}

async function findUser(identifier: { id?: string; email?: string }) {
  if (identifier.id) {
    const user = await db.user.findUnique({ where: { id: identifier.id }, select: AUTH_USER_SELECT });
    if (user) return user;
  }
  if (identifier.email) {
    const user = await db.user.findUnique({ where: { email: identifier.email }, select: AUTH_USER_SELECT });
    if (user) return user;
  }
  return null;
}

export const auth = cache(async (): Promise<Session | null> => {
  try {
    const headerStore = await headers();
    const middlewareUserId = headerStore.get("x-middleware-user-id");
    const middlewareUserEmail = headerStore.get("x-middleware-user-email");

    if (middlewareUserId || middlewareUserEmail) {
      const appUser = await findUser({ id: middlewareUserId ?? undefined, email: middlewareUserEmail ?? undefined });
      if (appUser) return toSession(appUser);
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(_name: string, _value: string, _options: CookieOptions) {},
          remove(_name: string, _options: CookieOptions) {},
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const appUser = await findUser({ id: user.id, email: user.email });
    if (!appUser) return null;

    return toSession(appUser);
  } catch (error) {
    logger.error("[auth] Error getting session", { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
});

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
