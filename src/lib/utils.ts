/**
 * Pure, framework-agnostic helpers shared by client and server.
 * No React, no Node, no Next imports — safe to use anywhere.
 */

/** Tiny classnames joiner. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Percentage of n over d, rounded to one decimal. */
export function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 1000) / 10 : 0;
}

/** Locale thousands separators: 1234 → "1,234". */
export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

/** Compact notation: 1234 → "1.2K", 1_200_000 → "1.2M". */
export function compactNumber(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** "Jun 21, 2026" */
export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Coarse relative time: "3d ago", "2h ago", "just now". */
export function relativeTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const secs = Math.round((Date.now() - date.getTime()) / 1000);
  const table: [number, string][] = [
    [60, "s"],
    [3600, "m"],
    [86400, "h"],
    [604800, "d"],
    [2629800, "w"],
    [31557600, "mo"],
  ];
  if (secs < 45) return "just now";
  let prev = 1;
  for (const [limit, unit] of table) {
    if (secs < limit) return `${Math.round(secs / prev)}${unit} ago`;
    prev = limit;
  }
  return `${Math.round(secs / 31557600)}y ago`;
}

/** Initials from a name or email: "Ada Lovelace" → "AL". */
export function initials(nameOrEmail: string) {
  const s = (nameOrEmail || "").trim();
  if (!s) return "?";
  const local = s.includes("@") ? s.split("@")[0] : s;
  const parts = local.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return s[0]!.toUpperCase();
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
