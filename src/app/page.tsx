import { redirect } from "next/navigation";
import { ArrowRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { getSession, signIn } from "@/server/auth";
import { buttonClass } from "@/components/ui";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* Sign-in */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white shadow-glow-sm">
              G
            </span>
            <span className="text-base font-semibold tracking-tight text-ink">
              Gmail Campaigns
            </span>
          </div>

          <h1 className="mt-10 text-2xl font-semibold tracking-tight text-ink">
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-sm text-muted">
            Use your Google Workspace account. Campaigns send from your own
            mailbox on your own sending quota.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
            className="mt-8"
          >
            <button className={buttonClass("primary", "md") + " w-full"}>
              Continue with Google
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>

          <p className="mt-6 text-xs leading-relaxed text-faint">
            By continuing you authorize the app to create a campaign Sheet in
            your Drive. Gmail sending is authorized separately, once, from inside
            that Sheet.
          </p>
        </div>
      </div>

      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-l border-line bg-surface p-12 lg:flex">
        {/* ambient accent glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-accent-600/15 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center gap-2 text-sm text-muted">
          <EnvelopeIcon className="h-4 w-4 text-accent-600" strokeWidth={2} />
          Mail-merge &amp; sequencing
        </div>
        <div className="relative">
          <p className="text-2xl font-medium leading-snug tracking-tight text-ink">
            Personalized campaigns and follow-up sequences, sent from your real
            Gmail — not a third-party relay.
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            Upload contacts, compose with merge fields, schedule a send window,
            and track opens, clicks, and replies — all on your own
            deliverability and quota.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4 border-t border-line pt-8 text-sm">
          <Feature title="Your mailbox" sub="Real Gmail quota" />
          <Feature title="Sequences" sub="Threaded follow-ups" />
          <Feature title="Analytics" sub="Opens · clicks · replies" />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="font-medium text-ink">{title}</div>
      <div className="mt-0.5 text-xs text-muted">{sub}</div>
    </div>
  );
}
