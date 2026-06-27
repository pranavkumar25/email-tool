"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/server/auth";
import { prisma } from "@/server/db";
import { requireAdmin } from "@/server/auth-helpers";
import { IMPERSONATION_COOKIE } from "@/server/admin";

export async function signOutAction() {
  // Clear any active "view as" so it never leaks into the next sign-in.
  (await cookies()).delete(IMPERSONATION_COOKIE);
  await signOut({ redirectTo: "/" });
}

/** Admin-only: start viewing another workspace as that user. */
export async function impersonateUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const targetId = String(formData.get("userId") ?? "").trim();
  const store = await cookies();

  if (!targetId || targetId === admin.id) {
    store.delete(IMPERSONATION_COOKIE);
    redirect("/admin");
  }

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true },
  });
  if (!target) {
    store.delete(IMPERSONATION_COOKIE);
    redirect("/admin");
  }

  store.set(IMPERSONATION_COOKIE, target!.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  redirect("/dashboard");
}

/** Stop viewing as another workspace and return to the admin's own account. */
export async function stopImpersonationAction() {
  (await cookies()).delete(IMPERSONATION_COOKIE);
  redirect("/admin");
}
