import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeftIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  UserPlusIcon,
  HandRaisedIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  PageHeader,
  Card,
  SectionTitle,
  Divider,
  IconTile,
  Tag,
  Progress,
  StatusBadge,
  Avatar,
  Button,
  type IconType,
} from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import { getSubscriber } from "@/server/audience";
import { formatDate, relativeTime } from "@/lib/utils";

type TimelineEvent = {
  icon: IconType;
  tone: "accent" | "success" | "info" | "neutral";
  title: string;
  detail: string;
  at: string;
};

export default async function SubscriberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const subscriber = await getSubscriber(user.id, id);
  if (!subscriber) notFound();

  const name =
    `${subscriber.firstName} ${subscriber.lastName}`.trim() || subscriber.email;

  // Timeline from what we actually know about the subscriber.
  const timeline: TimelineEvent[] = [];
  if (subscriber.lastActivityAt !== subscriber.subscribedAt) {
    timeline.push({
      icon: subscriber.clicks > 0 ? CursorArrowRaysIcon : EnvelopeOpenIcon,
      tone: subscriber.clicks > 0 ? "accent" : "info",
      title:
        subscriber.clicks > 0
          ? "Most recent engagement — clicked"
          : "Most recent engagement — opened",
      detail: `${subscriber.opens} opens · ${subscriber.clicks} clicks total`,
      at: subscriber.lastActivityAt,
    });
  }
  if (subscriber.tags.length > 0) {
    timeline.push({
      icon: HandRaisedIcon,
      tone: "success",
      title: `Tagged ${subscriber.tags.map((t) => `“${t}”`).join(", ")}`,
      detail: subscriber.tags.length === 1 ? "1 tag" : `${subscriber.tags.length} tags`,
      at: subscriber.subscribedAt,
    });
  }
  timeline.push({
    icon: UserPlusIcon,
    tone: "success",
    title: "Subscribed to your audience",
    detail: subscriber.source,
    at: subscriber.subscribedAt,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link
            href="/audience/subscribers"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeftIcon className="h-4 w-4" strokeWidth={2} />
            Subscribers
          </Link>
        }
        title={
          <span className="flex items-center gap-3">
            <Avatar name={name} size="lg" />
            <span>{name}</span>
          </span>
        }
        subtitle={subscriber.email}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <PencilSquareIcon className="h-4 w-4" strokeWidth={2} />
              Edit
            </Button>
            <Button size="sm">
              <PaperAirplaneIcon className="h-4 w-4" strokeWidth={2.25} />
              Send email
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <SectionTitle>Activity timeline</SectionTitle>
            <ol className="mt-4 space-y-0">
              {timeline.map((ev, i) => {
                const Icon = ev.icon;
                const isLast = i === timeline.length - 1;
                return (
                  <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
                    {!isLast && (
                      <span
                        className="absolute left-[17px] top-9 bottom-0 w-px bg-line"
                        aria-hidden
                      />
                    )}
                    <IconTile icon={Icon} tone={ev.tone} />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-ink">{ev.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {ev.detail}
                        <span className="text-faint"> · {relativeTime(ev.at)}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="p-5">
            <SectionTitle>Recent campaigns</SectionTitle>
            <p className="mt-3 text-sm text-muted">
              Campaign sends are tracked per-campaign. Per-subscriber send
              history isn&apos;t linked to the audience yet.
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-5">
            <SectionTitle>Details</SectionTitle>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Status">
                <StatusBadge status={subscriber.status} />
              </DetailRow>
              <DetailRow label="Email">
                <span className="truncate text-ink">{subscriber.email}</span>
              </DetailRow>
              <DetailRow label="Company">
                <span className="text-ink">{subscriber.company}</span>
              </DetailRow>
              <DetailRow label="Country">
                <span className="text-ink">{subscriber.country}</span>
              </DetailRow>
              <DetailRow label="Source">
                <span className="text-ink">{subscriber.source}</span>
              </DetailRow>
              <DetailRow label="Subscribed">
                <span className="text-ink">
                  {formatDate(subscriber.subscribedAt)}
                </span>
              </DetailRow>
              <DetailRow label="Last active">
                <span className="text-ink">
                  {relativeTime(subscriber.lastActivityAt)}
                </span>
              </DetailRow>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionTitle>Tags</SectionTitle>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {subscriber.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-dashed border-line-strong px-2 py-0.5 text-xs font-medium text-muted transition-colors hover:border-accent-300 hover:text-accent-700"
              >
                <PlusIcon className="h-3 w-3" strokeWidth={2.25} />
                Add tag
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Engagement</SectionTitle>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-2xl font-medium tracking-[-0.02em] tabular-nums text-ink">
                  {subscriber.opens}
                </div>
                <div className="mt-0.5 text-xs text-muted">Total opens</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-medium tracking-[-0.02em] tabular-nums text-ink">
                  {subscriber.clicks}
                </div>
                <div className="mt-0.5 text-xs text-muted">Total clicks</div>
              </div>
            </div>
            <Divider className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">
                Engagement score
              </span>
              <span className="text-xs font-medium tabular-nums text-ink">
                {subscriber.rating * 20}%
              </span>
            </div>
            <Progress className="mt-2" value={subscriber.rating * 20} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium">{children}</dd>
    </div>
  );
}
