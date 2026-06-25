import * as React from "react";
import Link from "next/link";
import {
  CheckIcon,
  NoSymbolIcon,
  PauseIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

/** Any Heroicons component (or compatible inline SVG icon). */
export type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

/* ─────────────────────────── Button ─────────────────────────── */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-glow-sm hover:bg-accent-700 active:bg-accent-700 border border-transparent",
  secondary:
    "bg-surface text-ink border border-line shadow-xs hover:bg-canvas hover:border-line-strong",
  ghost: "bg-transparent text-muted hover:bg-canvas hover:text-ink",
  danger:
    "bg-rose-600 text-white shadow-xs hover:bg-rose-700 border border-transparent",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "inline-flex select-none items-center justify-center rounded-lg font-medium transition-all duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANT[variant],
    SIZE[size],
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={cn(buttonClass(variant, size), className)} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link className={cn(buttonClass(variant, size), className)} {...props} />
  );
}

/* ─────────────────────────── Card ─────────────────────────── */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.12em] text-faint",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

/* ─────────────────────────── Page header ─────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && <div className="mb-1.5">{breadcrumb}</div>}
        <h1 className="truncate text-xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/* ─────────────────────────── Icon tile ─────────────────────────── */

type ToneKey = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

const TILE_TONE: Record<ToneKey, string> = {
  accent: "bg-accent-soft text-accent-600 ring-accent-600/15",
  success: "bg-emerald-50 text-emerald-600 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-600 ring-amber-600/15",
  danger: "bg-rose-50 text-rose-600 ring-rose-600/15",
  info: "bg-sky-50 text-sky-600 ring-sky-600/15",
  neutral: "bg-subtle text-muted ring-line",
};

export function IconTile({
  icon: Icon,
  tone = "accent",
  className,
}: {
  icon: IconType;
  tone?: ToneKey;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
        TILE_TONE[tone],
        className,
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>
  );
}

/* ─────────────────────────── Badge / Tag ─────────────────────────── */

const BADGE_TONE: Record<ToneKey, string> = {
  accent: "bg-accent-soft text-accent-700 ring-accent-600/15",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/15",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/15",
  info: "bg-sky-50 text-sky-700 ring-sky-600/15",
  neutral: "bg-subtle text-muted ring-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: ToneKey;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        BADGE_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Tag({
  children,
  onRemove,
  className,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-inset ring-line",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-0.5 ml-0.5 text-faint transition-colors hover:text-ink"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ─────────────────────────── Avatar ─────────────────────────── */

const AVATAR_PALETTE = [
  "bg-accent-soft text-accent-700",
  "bg-sky-50 text-sky-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-violet-50 text-violet-700",
];

function hashIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-7 w-7 text-[11px]",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
  };
  const local = name.includes("@") ? name.split("@")[0] : name;
  const parts = local.split(/[\s._-]+/).filter(Boolean);
  const init =
    parts.length >= 2
      ? (parts[0]![0]! + parts[1]![0]!).toUpperCase()
      : (local.slice(0, 2) || "?").toUpperCase();
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizes[size],
        AVATAR_PALETTE[hashIndex(name, AVATAR_PALETTE.length)],
        className,
      )}
    >
      {init}
    </span>
  );
}

/* ─────────────────────────── Progress ─────────────────────────── */

export function Progress({
  value,
  tone = "accent",
  className,
}: {
  value: number; // 0–100
  tone?: ToneKey;
  className?: string;
}) {
  const fill: Record<ToneKey, string> = {
    accent: "bg-accent",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    neutral: "bg-faint",
  };
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-subtle",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", fill[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/* ─────────────────────────── KPI Stat ─────────────────────────── */

export function Stat({
  label,
  value,
  sub,
  icon: Icon,
  delta,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: IconType;
  delta?: { value: string; dir: "up" | "down" };
  accent?: boolean;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition-colors",
        accent ? "hover:border-accent-300" : "hover:border-line-strong",
      )}
    >
      {accent && (
        <div
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent"
          aria-hidden
        />
      )}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-faint">
          {label}
        </div>
        {Icon && <Icon className="h-4 w-4 text-faint" strokeWidth={2} />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tabular-nums text-ink">
          {value}
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
              delta.dir === "up" ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {delta.dir === "up" ? (
              <ArrowUpRightIcon className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <ArrowDownRightIcon className="h-3 w-3" strokeWidth={2.5} />
            )}
            {delta.value}
          </span>
        )}
      </div>
      {sub != null && (
        <div className="mt-0.5 text-xs text-muted tabular-nums">{sub}</div>
      )}
    </Card>
  );
}

/* ─────────────────────────── Status badge ───────────────────────────
 * Indigo is the brand/interaction accent; status semantics use the
 * conventional success/warning/danger colors. Every state pairs an
 * icon or dot with the label so meaning never rests on color alone.
 */

type Tone = {
  dot: string | null;
  icon?: IconType;
  text: string;
  ring: string;
  label?: string;
};

const STATUS_TONES: Record<string, Tone> = {
  // Contact / send lifecycle
  QUEUED: { dot: "bg-transparent ring-1 ring-inset ring-line-strong", text: "text-faint", ring: "bg-subtle" },
  SENT: { dot: "bg-faint", text: "text-muted", ring: "bg-subtle" },
  OPENED: { dot: "bg-accent-400", text: "text-muted", ring: "bg-subtle" },
  CLICKED: { dot: "bg-accent-600", text: "text-ink", ring: "bg-accent-soft" },
  REPLIED: { dot: null, icon: CheckIcon, text: "text-accent-700", ring: "bg-accent-soft ring-1 ring-inset ring-accent-600/15" },
  BOUNCED: { dot: null, icon: ExclamationTriangleIcon, text: "text-amber-700", ring: "bg-amber-50" },
  UNSUBSCRIBED: { dot: null, icon: NoSymbolIcon, text: "text-faint", ring: "bg-subtle" },
  FAILED: { dot: null, icon: ExclamationTriangleIcon, text: "text-rose-700", ring: "bg-rose-50 ring-1 ring-inset ring-rose-600/15" },
  // Subscriber lifecycle
  SUBSCRIBED: { dot: "bg-emerald-500", text: "text-emerald-700", ring: "bg-emerald-50 ring-1 ring-inset ring-emerald-600/15" },
  PENDING: { dot: null, icon: ArrowPathIcon, text: "text-amber-700", ring: "bg-amber-50", label: "Pending" },
  CLEANED: { dot: null, icon: NoSymbolIcon, text: "text-faint", ring: "bg-subtle" },
  COMPLAINED: { dot: null, icon: ExclamationTriangleIcon, text: "text-rose-700", ring: "bg-rose-50" },
  // Campaign / automation status
  DRAFT: { dot: "bg-transparent ring-1 ring-inset ring-line-strong", text: "text-faint", ring: "bg-subtle" },
  SCHEDULED: { dot: "bg-sky-500", text: "text-sky-700", ring: "bg-sky-50 ring-1 ring-inset ring-sky-600/15", label: "Scheduled" },
  SENDING: { dot: null, icon: ArrowPathIcon, text: "text-accent-700", ring: "bg-accent-soft", label: "Sending" },
  PROVISIONING: { dot: null, icon: ArrowPathIcon, text: "text-accent-700", ring: "bg-accent-soft", label: "Provisioning" },
  ACTIVE: { dot: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]", text: "text-emerald-700", ring: "bg-emerald-50 ring-1 ring-inset ring-emerald-600/15" },
  LIVE: { dot: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]", text: "text-emerald-700", ring: "bg-emerald-50 ring-1 ring-inset ring-emerald-600/15" },
  PAUSED: { dot: null, icon: PauseIcon, text: "text-muted", ring: "bg-subtle" },
  COMPLETED: { dot: null, icon: CheckIcon, text: "text-muted", ring: "bg-subtle" },
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONES[status] ?? STATUS_TONES.QUEUED;
  const Icon = tone.icon;
  const label = tone.label ?? status.charAt(0) + status.slice(1).toLowerCase();
  const spinning =
    status === "PROVISIONING" || status === "SENDING" || status === "PENDING";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        tone.ring,
        tone.text,
      )}
    >
      {Icon ? (
        <Icon
          className={cn("h-3 w-3", spinning && "animate-spin")}
          strokeWidth={2.25}
        />
      ) : (
        <span className={cn("h-2 w-2 rounded-full", tone.dot ?? "")} />
      )}
      {label}
    </span>
  );
}
