import { redirect } from "next/navigation";
import { getAuthContext } from "@/server/auth-helpers";
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
  const { realUser, effectiveUser, isAdmin, isImpersonating } =
    await getAuthContext();
  if (!realUser?.id) redirect("/");

  return (
    <AppFrame
      email={realUser.email ?? null}
      isAdmin={isAdmin}
      viewingAs={isImpersonating ? effectiveUser?.email ?? null : null}
    >
      {children}
    </AppFrame>
  );
}
