import { redirect } from "next/navigation";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { getSession, signIn } from "@/server/auth";
import { buttonClass } from "@/components/ui";
import { Brand, Logo } from "@/components/layout/Brand";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ── Sign-in ───────────────────────────────────────────── */}
      <div className="flex min-w-0 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <Brand height={28} />

          <p className="eyebrow mt-12">Mail-merge &amp; sequencing</p>
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[40px] lg:text-[46px] lg:leading-[1.02]">
            Earn a row in
            <br />
            the inbox.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Send personalized campaigns and follow-up sequences from your own
            Gmail — on your real deliverability and quota, never a third-party
            relay.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
            className="mt-9"
          >
            <button className={buttonClass("primary", "lg") + " group w-full"}>
              Continue with Google
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </button>
          </form>

          <p className="mt-5 text-[13px] leading-relaxed text-faint">
            Continuing creates a campaign Sheet in your Drive. Gmail sending is
            authorized once, separately, from inside that Sheet.
          </p>
        </div>
      </div>

      {/* ── The thesis: a personal note, landing as a real inbox row ── */}
      <div className="relative hidden min-w-0 flex-col justify-center overflow-hidden bg-ink p-12 lg:flex">
        {/* ambient blue + red light, the two action colors on black */}
        <div
          className="pointer-events-none absolute -right-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-signal-500/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative mx-auto w-full max-w-md">
          <Logo height={22} className="text-white/90" />

          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-300">
            Primary · 9:41 AM
          </p>

          <InboxMock />

          <p className="mt-7 max-w-sm text-base leading-relaxed text-white/70">
            Sent from your Gmail. It lands like a note from a person — because it
            is one. Merge fields fill in, follow-ups thread, opens and replies
            come back to you.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-5 border-t border-white/12 pt-6">
            <Feature title="Your mailbox" sub="Real Gmail quota" />
            <Feature title="Sequences" sub="Threaded follow-ups" />
            <Feature title="Analytics" sub="Opens · clicks · replies" />
          </div>
        </div>
      </div>
    </main>
  );
}

/** The signature: a mail-merge email shown as a real, personal inbox row. */
function InboxMock() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl bg-surface shadow-pop ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
          Inbox
        </span>
        <span className="text-[11px] font-medium text-faint">3 unread</span>
      </div>

      {/* The earned row — your personal email, unread, starred, at the top. */}
      <div className="relative flex gap-3 bg-accent-50/70 px-4 py-3.5">
        <span
          className="absolute inset-y-0 left-0 w-[3px] bg-accent-600"
          aria-hidden
        />
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal-500"
          aria-hidden
        />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-semibold text-accent-700">
          JL
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-ink">
              Jordan Lee
            </span>
            <span className="shrink-0 text-[11px] font-medium text-faint">
              9:41 AM
            </span>
          </div>
          <div className="truncate text-sm font-medium text-ink">
            Quick question,{" "}
            <span className="rounded bg-accent px-1 text-white">Ada</span>
          </div>
          <div className="truncate text-[13px] text-muted">
            Saw you just shipped the new docs — wanted to ask how you…
          </div>
          <div className="mt-1.5 font-mono text-[11px] text-faint">
            {"{{first_name}}"} → Ada
          </div>
        </div>
        <StarIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-signal-500"
          fill="currentColor"
          strokeWidth={1.5}
        />
      </div>

      {/* The robots, quieter — read, transactional, no spark. */}
      {[
        { from: "GitHub", subject: "[acme/web] 3 new pull requests", time: "8:02" },
        { from: "Figma", subject: "Weekly digest for your team", time: "Tue" },
      ].map((r) => (
        <div
          key={r.from}
          className="flex gap-3 border-t border-line/70 px-4 py-3"
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent" aria-hidden />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-medium text-faint">
            {r.from[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm text-muted">{r.from}</span>
              <span className="shrink-0 text-[11px] font-medium text-faint">
                {r.time}
              </span>
            </div>
            <div className="truncate text-[13px] text-faint">{r.subject}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Feature({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-0.5 text-[11px] font-medium text-white/55">{sub}</div>
    </div>
  );
}
