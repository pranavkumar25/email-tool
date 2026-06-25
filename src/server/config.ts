/**
 * Resolution + health-checking of the public base URL the Apps Script uses to
 * (a) load the open-pixel / click-redirect and (b) POST events back to /api/ingest.
 *
 * If this URL is missing or points at localhost, NOTHING phones home: no opens,
 * clicks, replies, bounces or even SENT events reach the database. That is the
 * single most common reason a campaign's analytics stay empty.
 */
export function trackingBaseUrl(): string {
  return (process.env.TRACKING_BASE_URL || process.env.AUTH_URL || "").replace(
    /\/+$/,
    "",
  );
}

/** True only for a non-local, publicly reachable https URL. */
export function isPublicUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export type ConfigHealth = {
  baseUrl: string;
  ok: boolean;
  reason: string | null;
};

/** Whether outbound tracking/ingest can actually work in the current env. */
export function configHealth(): ConfigHealth {
  const baseUrl = trackingBaseUrl();
  if (!baseUrl) {
    return {
      baseUrl,
      ok: false,
      reason:
        "TRACKING_BASE_URL is not set. Set it to your live https domain so Gmail and the Apps Script can reach the app.",
    };
  }
  if (!isPublicUrl(baseUrl)) {
    return {
      baseUrl,
      ok: false,
      reason:
        "TRACKING_BASE_URL must be a public https:// URL (not localhost). Gmail mail clients and the Apps Script run on Google's servers and cannot reach a local address — so opens, clicks, replies and sends never get recorded.",
    };
  }
  if (!process.env.INGEST_SECRET) {
    return {
      baseUrl,
      ok: false,
      reason:
        "INGEST_SECRET is not set, so the Apps Script callback cannot authenticate with /api/ingest.",
    };
  }
  return { baseUrl, ok: true, reason: null };
}
