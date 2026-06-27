import { cn } from "@/lib/utils";

/**
 * The inboxrow mark — an inbox line with an unread marigold tick beside the
 * row. Pine tile, warm spark. Server-safe (no hooks) so both the signed-in
 * shell and the public sign-in page render the same identity.
 */
export function BrandMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="#136548" />
      <circle cx="9.5" cy="16" r="2.6" fill="#eaa53f" />
      <rect x="15" y="14.5" width="10.5" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.92" />
    </svg>
  );
}

/** Lowercase mono logotype: "inbox" in ink, "row" in pine. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono lowercase font-semibold tracking-[-0.02em] text-ink",
        className,
      )}
    >
      inbox<span className="text-accent-600">row</span>
    </span>
  );
}

export function Brand({
  className,
  markSize = 30,
  wordmarkClassName,
}: {
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={markSize} />
      <Wordmark className={cn("text-[15px]", wordmarkClassName)} />
    </span>
  );
}
