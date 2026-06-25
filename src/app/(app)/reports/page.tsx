import {
  CalendarDaysIcon,
  PaperAirplaneIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  SectionTitle,
  Stat,
  Progress,
} from "@/components/ui";
import { compactNumber, formatNumber } from "@/lib/utils";
import { requireUser } from "@/server/auth-helpers";
import { getReport } from "@/server/reports";
import { EngagementChart, AudienceGrowthChart } from "./ReportsCharts";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireUser();
  const report = await getReport(user.id);
  const {
    totals,
    engagementSeries,
    audienceGrowthSeries,
    topLinks,
    topCampaigns,
    locationBreakdown,
    statusBreakdown,
    deliverability,
  } = report;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Performance across campaigns and audience."
        actions={
          <Button variant="secondary" size="sm">
            <CalendarDaysIcon className="h-4 w-4" />
            Last 30 days
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Emails sent"
          value={compactNumber(totals.sent)}
          icon={PaperAirplaneIcon}
          accent
        />
        <Stat
          label="Open rate"
          value={`${totals.openRate}%`}
          icon={EnvelopeOpenIcon}
        />
        <Stat
          label="Click rate"
          value={`${totals.clickRate}%`}
          icon={CursorArrowRaysIcon}
        />
        <Stat
          label="Replies"
          value={formatNumber(totals.replies)}
          icon={ChatBubbleLeftRightIcon}
        />
      </section>

      <Card className="p-5">
        <SectionTitle>Engagement · last 30 days</SectionTitle>
        <div className="mt-4">
          <EngagementChart data={engagementSeries} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle>Audience growth</SectionTitle>
          <div className="mt-4">
            <AudienceGrowthChart data={audienceGrowthSeries} />
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle>Deliverability</SectionTitle>
          <div className="mt-4 space-y-4">
            <MeterRow label="Delivered" value={deliverability.delivered} tone="success" />
            <MeterRow label="Bounce rate" value={deliverability.bounceRate} tone="warning" />
            <MeterRow label="Spam rate" value={deliverability.spamRate} tone="danger" />
            <MeterRow label="Unsubscribe rate" value={deliverability.unsubscribeRate} tone="neutral" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top campaigns */}
        <Card className="overflow-hidden">
          <div className="px-5 pt-5">
            <SectionTitle>Top campaigns</SectionTitle>
          </div>
          {topCampaigns.length === 0 ? (
            <p className="px-5 pb-5 pt-3 text-sm text-muted">
              No sends recorded yet.
            </p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                  <th className="px-5 py-2.5 font-medium">Campaign</th>
                  <th className="px-3 py-2.5 text-right font-medium">Sent</th>
                  <th className="px-3 py-2.5 text-right font-medium">Open</th>
                  <th className="px-5 py-2.5 text-right font-medium">Click</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {topCampaigns.map((c) => (
                  <tr key={c.name} className="transition-colors hover:bg-canvas">
                    <td className="max-w-[200px] truncate px-5 py-3 font-medium text-ink">
                      {c.name}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {formatNumber(c.sent)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted">
                      {c.openRate}%
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium text-ink">
                      {c.clickRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Top links */}
        <Card className="p-5">
          <SectionTitle>Most clicked links</SectionTitle>
          {topLinks.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No link clicks recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topLinks.map((l) => (
                <li key={l.url} className="flex items-center gap-3">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-faint" />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">
                    {l.url}
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-ink">
                    {formatNumber(l.clicks)}
                  </span>
                  <span className="w-12 shrink-0 text-right text-xs tabular-nums text-faint">
                    {l.ctr}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle>Audience by status</SectionTitle>
          {statusBreakdown.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No subscribers yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {statusBreakdown.map((s) => (
                <MeterRow key={s.label} label={s.label} value={s.value} tone="accent" />
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <SectionTitle>Top locations</SectionTitle>
          {locationBreakdown.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No subscribers yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {locationBreakdown.map((l) => (
                <MeterRow key={l.label} label={l.label} value={l.value} tone="info" />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MeterRow({
  label,
  value,
  tone,
  suffix = "%",
}: {
  label: string;
  value: number;
  tone: "accent" | "success" | "warning" | "danger" | "info" | "neutral";
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium tabular-nums text-ink">
          {value}
          {suffix}
        </span>
      </div>
      <Progress value={value} tone={tone} />
    </div>
  );
}
