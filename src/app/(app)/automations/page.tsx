import Link from "next/link";
import {
  PlusIcon,
  BoltIcon,
  SparklesIcon,
  ShoppingCartIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  IconTile,
  PageHeader,
  SectionTitle,
  Stat,
  StatusBadge,
  type IconType,
} from "@/components/ui";
import { automations } from "@/data/automations";
import { formatNumber, relativeTime } from "@/lib/utils";

/** Visual-only starter templates shown above the table. */
const TEMPLATES: { icon: IconType; title: string; desc: string }[] = [
  {
    icon: SparklesIcon,
    title: "Welcome series",
    desc: "Greet new subscribers and guide their first steps.",
  },
  {
    icon: ShoppingCartIcon,
    title: "Abandoned cart",
    desc: "Win back shoppers who left items behind.",
  },
  {
    icon: ArrowPathRoundedSquareIcon,
    title: "Re-engagement",
    desc: "Reignite contacts who have gone quiet.",
  },
];

export default function AutomationsPage() {
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
        actions={
          <Button size="sm">
            <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
            Create automation
          </Button>
        }
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

      <section className="space-y-3">
        <SectionTitle>Start from a template</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Card
              key={t.title}
              className="flex flex-col gap-3 p-4 transition-colors hover:border-line-strong"
            >
              <div className="flex items-start gap-3">
                <IconTile icon={t.icon} tone="accent" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{t.title}</div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    {t.desc}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex justify-end">
                <Button variant="ghost" size="sm">
                  Use
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>All automations</SectionTitle>
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
      </section>
    </div>
  );
}
