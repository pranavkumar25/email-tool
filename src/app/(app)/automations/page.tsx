import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/outline";
import {
  Card,
  EmptyState,
  IconTile,
  PageHeader,
  SectionTitle,
  Stat,
  StatusBadge,
} from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import { listAutomations } from "@/server/automations";
import { formatNumber, relativeTime } from "@/lib/utils";
import { CreateAutomationButton } from "./CreateAutomationButton";
import { AutomationStarters } from "./AutomationStarters";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const user = await requireUser();
  const automations = await listAutomations(user.id);

  const live = automations.filter((a) => a.status === "LIVE");
  const activeCount = automations.reduce((sum, a) => sum + a.active, 0);
  const completedCount = automations.reduce((sum, a) => sum + a.completed, 0);
  const avgOpenRate = live.length
    ? Math.round(
        (live.reduce((sum, a) => sum + a.openRate, 0) / live.length) * 10,
      ) / 10
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        subtitle="Trigger-based journeys that run on autopilot."
        actions={<CreateAutomationButton />}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Active automations"
          value={live.length}
          sub={`${automations.length} total`}
          accent
        />
        <Stat
          label="In progress"
          value={formatNumber(activeCount)}
          sub="contacts mid-journey"
        />
        <Stat
          label="Completed"
          value={formatNumber(completedCount)}
          sub="journeys finished"
        />
        <Stat
          label="Avg. open rate"
          value={`${avgOpenRate.toFixed(1)}%`}
          sub="across live journeys"
        />
      </section>

      <AutomationStarters />

      <section className="space-y-3">
        <SectionTitle>All automations</SectionTitle>
        {automations.length === 0 ? (
          <EmptyState
            icon={BoltIcon}
            title="No automations yet"
            description="Create a trigger-based journey from scratch or start from a template above."
          />
        ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-medium">Automation</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Entered</th>
                <th className="px-4 py-2.5 text-right font-medium">Active</th>
                <th className="px-4 py-2.5 text-right font-medium">Open rate</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Click rate
                </th>
                <th className="px-4 py-2.5 text-right font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {automations.map((a) => (
                <tr
                  key={a.id}
                  className="group transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <IconTile icon={BoltIcon} tone="accent" />
                      <div className="min-w-0">
                        <Link
                          href={`/automations/${a.id}`}
                          className="font-medium text-ink transition-colors hover:text-accent-700"
                        >
                          {a.name}
                        </Link>
                        <div className="mt-0.5 text-xs text-muted">
                          {a.trigger}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {formatNumber(a.entered)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {formatNumber(a.active)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {a.openRate}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {a.clickRate}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-faint">
                    {relativeTime(a.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        )}
      </section>
    </div>
  );
}
