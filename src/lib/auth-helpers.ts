import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** For server components/pages: returns the signed-in user or redirects home. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user;
}
