import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { AppFrame } from "@/components/layout/AppFrame";

/**
 * Persistent shell for every signed-in page. The sidebar lives here so it stays
 * mounted across navigations (no re-fetch, no flicker); only the page content
 * swaps — and Suspense `loading.tsx` skeletons paint instantly while it loads.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/");

  return <AppFrame email={session.user.email ?? null}>{children}</AppFrame>;
}
