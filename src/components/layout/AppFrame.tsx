"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  PaperAirplaneIcon,
  BoltIcon,
  UsersIcon,
  FunnelIcon,
  TagIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { IconType } from "@/components/ui";
import { signOutAction } from "@/server/actions";
import { Brand } from "./Brand";

type NavItem = { label: string; href: string; icon: IconType; exact?: boolean };
type NavSection = { heading?: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon, exact: true },
      { label: "Campaigns", href: "/campaigns", icon: PaperAirplaneIcon },
      { label: "Automations", href: "/automations", icon: BoltIcon },
    ],
  },
  {
    heading: "Audience",
    items: [
      { label: "Subscribers", href: "/audience/subscribers", icon: UsersIcon },
      { label: "Segments", href: "/audience/segments", icon: FunnelIcon },
      { label: "Tags", href: "/audience/tags", icon: TagIcon },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Templates", href: "/templates", icon: DocumentDuplicateIcon },
      { label: "Forms", href: "/forms", icon: ClipboardDocumentListIcon },
    ],
  },
  {
    heading: "Insights",
    items: [{ label: "Reports", href: "/reports", icon: ChartBarIcon }],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function NavTree({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV.map((section, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          {section.heading && (
            <div className="eyebrow px-3 pb-1.5">{section.heading}</div>
          )}
          {section.items.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-accent-soft text-accent-700 ring-1 ring-inset ring-accent-600/12"
                    : "text-muted hover:bg-canvas hover:text-ink",
                )}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-600"
                    aria-hidden
                  />
                )}
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    active
                      ? "text-accent-600"
                      : "text-faint group-hover:text-muted",
                  )}
                  strokeWidth={2}
                />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function BrandLink() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center px-1 outline-none"
      aria-label="inboxrow — go to dashboard"
    >
      <Brand markSize={30} />
    </Link>
  );
}

function UserFooter({ email }: { email: string | null }) {
  return (
    <div className="border-t border-line pt-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold uppercase text-accent-700">
          {email?.[0] ?? "?"}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
          {email ?? "Not signed in"}
        </span>
        <Link
          href="/settings"
          title="Settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-canvas hover:text-ink"
        >
          <Cog6ToothIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className="sr-only">Settings</span>
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-canvas hover:text-ink"
          >
            <ArrowRightStartOnRectangleIcon className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="sr-only">Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function CreateButton({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/campaigns/new"
      onClick={onNavigate}
      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-glow-sm transition-colors hover:bg-accent-700"
    >
      <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
      New campaign
    </Link>
  );
}

export function AppFrame({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-5 border-r border-line bg-surface px-3 py-4 md:flex">
        <BrandLink />
        <CreateButton />
        <div className="-mr-1 flex-1 overflow-y-auto pr-1">
          <NavTree pathname={pathname} />
        </div>
        <UserFooter email={email} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 animate-fade-in flex-col gap-5 border-r border-line bg-surface px-3 py-4 shadow-pop">
            <div className="flex items-center justify-between">
              <BrandLink />
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-faint hover:bg-canvas hover:text-ink"
              >
                <XMarkIcon className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <CreateButton onNavigate={() => setOpen(false)} />
            <div className="-mr-1 flex-1 overflow-y-auto pr-1">
              <NavTree pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <UserFooter email={email} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (desktop is content-first, no chrome) */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          >
            <Bars3Icon className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>
          <BrandLink />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
