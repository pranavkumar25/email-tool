import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";

/** For server components/pages: returns the signed-in user or redirects home. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/");
  return session.user;
}
