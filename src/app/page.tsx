import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Gmail Campaigns</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Send personalized campaigns and follow-up sequences from your own Gmail.
        </p>

        {session?.user ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm">
              Signed in as{" "}
              <span className="font-medium">{session.user.email}</span>
            </p>
            <div className="flex gap-3">
              <a
                href="/campaigns/new"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                New campaign
              </a>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="mt-6"
          >
            <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
              Sign in with Google
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
