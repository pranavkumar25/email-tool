import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { requireUser } from "@/server/auth-helpers";
import { configHealth } from "@/server/config";
import {
  Card,
  SectionTitle,
  Button,
  Badge,
  Banner,
  Divider,
  cn,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const DOMAINS = [
  {
    domain: "getpickcel.com",
    spf: true,
    dkim: true,
    dmarc: true,
    verified: true,
  },
  {
    domain: "mail.pickcel.io",
    spf: true,
    dkim: true,
    dmarc: false,
    verified: false,
  },
];

export default async function DomainsSettingsPage() {
  await requireUser();
  const health = configHealth();

  const checks = [
    {
      key: "TRACKING_BASE_URL",
      ok: Boolean(health.baseUrl) && health.ok,
      value: health.baseUrl || "(not set)",
      hint: "Public https domain used for the open pixel, click redirects, and the ingest callback.",
    },
    {
      key: "INGEST_SECRET",
      ok: Boolean(process.env.INGEST_SECRET),
      value: process.env.INGEST_SECRET ? "•••• set" : "(not set)",
      hint: "Shared secret the Apps Script uses to authenticate event callbacks.",
    },
    {
      key: "Google OAuth",
      ok: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
      value: process.env.AUTH_GOOGLE_ID ? "configured" : "(not set)",
      hint: "Lets users sign in and lets the app provision the campaign Sheet + script.",
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Authenticated domains */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <SectionTitle>Authenticated domains</SectionTitle>
          <Button size="sm" variant="secondary">
            <PlusIcon className="h-4 w-4" />
            Add domain
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted">
          Authenticate domains with SPF, DKIM, and DMARC to maximize
          deliverability and remove the &quot;via&quot; label in inboxes.
        </p>
        <div className="mt-4 space-y-3">
          {DOMAINS.map((d) => (
            <div
              key={d.domain}
              className="rounded-lg border border-line p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-ink">{d.domain}</span>
                {d.verified ? (
                  <Badge tone="success">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : (
                  <Badge tone="warning">
                    <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                    Action needed
                  </Badge>
                )}
              </div>
              <Divider className="my-3" />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <RecordPill label="SPF" ok={d.spf} />
                <RecordPill label="DKIM" ok={d.dkim} />
                <RecordPill label="DMARC" ok={d.dmarc} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tracking & delivery health (live env checks) */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <SectionTitle>Tracking &amp; delivery</SectionTitle>
          <Badge tone={health.ok ? "success" : "warning"}>
            {health.ok ? "Healthy" : "Needs attention"}
          </Badge>
        </div>

        {!health.ok && (
          <div className="mt-4">
            <Banner icon={ExclamationTriangleIcon} tone="strong">
              {health.reason}
            </Banner>
          </div>
        )}

        <ul className="mt-4 divide-y divide-line/70">
          {checks.map((c) => (
            <li key={c.key} className="flex items-start gap-3 py-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  c.ok
                    ? "bg-emerald-500 text-white"
                    : "border border-line-strong text-faint",
                )}
              >
                {c.ok ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <ExclamationTriangleIcon className="h-3 w-3" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[13px] font-medium text-ink">
                    {c.key}
                  </span>
                  <span className="truncate text-[13px] text-muted">
                    {c.value}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-faint">
                  {c.hint}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function RecordPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium",
        ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
      )}
    >
      {ok ? (
        <CheckCircleIcon className="h-3.5 w-3.5" />
      ) : (
        <ExclamationTriangleIcon className="h-3.5 w-3.5" />
      )}
      {label}
    </div>
  );
}
