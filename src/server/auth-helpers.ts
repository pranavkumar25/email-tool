import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { IMPERSONATION_COOKIE, isAdminEmail } from "@/server/admin";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type AuthContext = {
  /** The actually-signed-in user. */
  realUser: SessionUser | null;
  /** The user whose data the app should show — the impersonated target when an
   *  admin is viewing as someone, otherwise the same as realUser. */
  effectiveUser: SessionUser | null;
  isAdmin: boolean;
  isImpersonating: boolean;
};

/**
 * Resolves who is signed in and, for admins, whose workspace they're viewing.
 * The "view as" cookie is only honored when the real user is an admin, so a
 * non-admin setting the cookie by hand changes nothing.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getSession();
  const realUser = (session?.user as SessionUser | undefined) ?? null;
  const isAdmin = isAdminEmail(realUser?.email);

  let effectiveUser = realUser;
  let isImpersonating = false;

  if (realUser && isAdmin) {
    const targetId = (await cookies()).get(IMPERSONATION_COOKIE)?.value;
    if (targetId && targetId !== realUser.id) {
      const target = await prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true, name: true, email: true, image: true },
      });
      if (target) {
        effectiveUser = target;
        isImpersonating = true;
      }
    }
  }

  return { realUser, effectiveUser, isAdmin, isImpersonating };
}

/**
 * For server components/pages and mutations: returns the EFFECTIVE user (the
 * impersonated target when an admin is viewing as someone). Because the whole
 * app scopes data through this, "view as" re-scopes every page automatically.
 */
export async function requireUser(): Promise<SessionUser> {
  const { effectiveUser } = await getAuthContext();
  if (!effectiveUser?.id) redirect("/");
  return effectiveUser;
}

/** The actually-signed-in user, ignoring any impersonation. */
export async function requireRealUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session?.user?.id) redirect("/");
  return session.user as SessionUser;
}

/** Gate admin-only routes/actions. Returns the real signed-in admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  const user = (session?.user as SessionUser | undefined) ?? null;
  if (!user?.id) redirect("/");
  if (!isAdminEmail(user.email)) redirect("/dashboard");
  return user;
}
