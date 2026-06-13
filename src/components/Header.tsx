import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/campaigns" className="font-semibold tracking-tight">
          Gmail Campaigns
        </Link>
        {session?.user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-500">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="rounded-md border border-neutral-300 px-3 py-1.5 font-medium hover:bg-neutral-100">
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
