import Link from "next/link";
import {
  PlusIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { configHealth } from "@/server/config";
import {
  Stat,
  Card,
  StatusBadge,
  EmptyState,
  ButtonLink,
  Banner,
  PageHeader,
} from "@/components/ui";

export const dynamic = "force-dynamic";

function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 1000) / 10 : 0;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const where = { campaign: { userId: user.id } } as const;

  const [campaigns, totalContacts, sent, replied, openRows, activeCount] =
    await Promise.all([
      prisma.campaign.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { contacts: true } } },
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { ...where, status: { not: "QUEUED" } } }),
      prisma.contact.count({ where: { ...where, status: "REPLIED" } }),
      prisma.event.findMany({
        where: { ...where, type: "OPEN" },
        distinct: ["contactId"],
        select: { contactId: true },
      }),
      prisma.campaign.count({ where: { userId: user.id, status: "ACTIVE" } }),
    ]);

  const opened = openRows.filter((r) => r.contactId).length;
  const health = configHealth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Your sending performance at a glance."
        actions={
          <ButtonLink href="/campaigns/new" size="sm">
            <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
            New campaign
          </ButtonLink>
        }
      />

      {!health.ok && (
        <Banner
          icon={ExclamationTriangleIcon}
          tone="strong"
          title="Tracking is not configured — analytics won't update"
          action={
            <ButtonLink href="/settings" variant="secondary" size="sm">
              Fix in Settings
            </ButtonLink>
          }
        >
          {health.reason}
        </Banner>
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Campaigns"
          value={campaigns.length}
          sub={`${activeCount} active`}
        />
        <Stat
          label="Contacts"
          value={totalContacts.toLocaleString()}
          sub={`${sent.toLocaleString()} sent`}
        />
        <Stat
          label="Open rate"
          value={`${pct(opened, sent)}%`}
          sub={`${opened.toLocaleString()} opened`}
          accent
        />
        <Stat
          label="Reply rate"
          value={`${pct(replied, sent)}%`}
          sub={`${replied.toLocaleString()} replied`}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Recent campaigns</h2>
          {campaigns.length > 0 && (
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-ink"
            >
              View all
              <ArrowUpRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          )}
        </div>

        {campaigns.length === 0 ? (
          <EmptyState
            icon={PaperAirplaneIcon}
            title="No campaigns yet"
            description="Create your first campaign to upload contacts, compose, and start sending from your own Gmail."
            action={
              <ButtonLink href="/campaigns/new">
                <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
                New campaign
              </ButtonLink>
            }
          />
        ) : (
          <Card className="divide-y divide-line/70 overflow-hidden p-0">
            {campaigns.map((c) => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-canvas"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">
                    {c.name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted tabular-nums">
                    {c._count.contacts.toLocaleString()} contacts ·{" "}
                    {c.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
