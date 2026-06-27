import * as React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { IconType } from "./primitives";

/* ─────────────────────────── Banner ─────────────────────────── */

export function Banner({
  icon: Icon,
  title,
  children,
  action,
  tone = "neutral",
}: {
  icon?: IconType;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "strong" | "danger" | "success";
}) {
  const tones = {
    neutral: "border-line bg-surface",
    strong: "border-amber-300/60 bg-amber-50",
    danger: "border-signal-300/60 bg-signal-50",
    success: "border-emerald-300/60 bg-emerald-50",
  };
  const iconTone = {
    neutral: "text-muted",
    strong: "text-amber-600",
    danger: "text-signal-600",
    success: "text-emerald-600",
  };
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        tones[tone],
      )}
    >
      {Icon && (
        <Icon
          className={cn("mt-0.5 h-4 w-4 shrink-0", iconTone[tone])}
          strokeWidth={2}
        />
      )}
      <div className="min-w-0 flex-1">
        {title && <div className="font-medium text-ink">{title}</div>}
        {children && <div className="mt-0.5 text-muted">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ─────────────────────────── Empty state ─────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: IconType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-600 ring-1 ring-inset ring-accent-600/15">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ─────────────────────────── Skeleton / Spinner ─────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <ArrowPathIcon
      className={cn("h-4 w-4 animate-spin text-muted", className)}
      strokeWidth={2}
    />
  );
}
