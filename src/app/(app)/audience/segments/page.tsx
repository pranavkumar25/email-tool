import {
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  Badge,
  Card,
  Divider,
  EmptyState,
  IconTile,
  PageHeader,
  Stat,
  Tag,
} from "@/components/ui";
import { formatDate, formatNumber } from "@/lib/utils";
import { requireUser } from "@/server/auth-helpers";
import { listSegments } from "@/server/audience";
import { CreateSegmentButton } from "./CreateSegmentButton";
import { DeleteSegmentButton } from "./DeleteSegmentButton";

export const dynamic = "force-dynamic";

export default async function SegmentsPage() {
  const user = await requireUser();
  const segments = await listSegments(user.id);

  const largest = segments.reduce(
    (best, s) => (s.count > best.count ? s : best),
    segments[0],
  );
  const totalContacts = segments.reduce((sum, s) => sum + s.count, 0);
  const avgSize = segments.length
    ? Math.round(totalContacts / segments.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Segments"
        subtitle="Dynamic groups that update automatically."
        actions={<CreateSegmentButton />}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total segments" value={segments.length} icon={FunnelIcon} />
        <Stat
          label="Largest segment"
          value={largest ? formatNumber(largest.count) : "0"}
          sub={largest?.name}
        />
        <Stat label="Avg. size" value={formatNumber(avgSize)} sub="contacts" />
      </section>

      {segments.length === 0 ? (
        <EmptyState
          icon={FunnelIcon}
          title="No segments yet"
          description="Create a dynamic segment to group subscribers by behavior, tags, or fields — it updates itself as people qualify."
          action={<CreateSegmentButton variant="empty" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((seg) => {
            const up = seg.growthPct >= 0;
            return (
              <Card
                key={seg.id}
                className="group flex flex-col p-5 transition-colors hover:border-line-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <IconTile icon={FunnelIcon} tone="accent" />
                  <div className="flex items-center gap-1">
                  <Badge tone={up ? "success" : "danger"}>
                    {up ? (
                      <ArrowTrendingUpIcon
                        className="h-3 w-3"
                        strokeWidth={2.25}
                      />
                    ) : (
                      <ArrowTrendingDownIcon
                        className="h-3 w-3"
                        strokeWidth={2.25}
                      />
                    )}
                    {Math.abs(seg.growthPct)}%
                  </Badge>
                  <DeleteSegmentButton id={seg.id} name={seg.name} />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-ink">{seg.name}</h3>
                  <p className="mt-1 text-sm text-muted">{seg.description}</p>
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-xs text-faint">
                    Matches {seg.match === "all" ? "ALL" : "ANY"} of{" "}
                    {seg.conditions.length} condition
                    {seg.conditions.length === 1 ? "" : "s"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {seg.conditions.slice(0, 2).map((c, i) => (
                      <Tag key={i}>
                        {c.field} {c.op} {c.value}
                      </Tag>
                    ))}
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <div className="font-mono text-xl font-medium tracking-[-0.02em] tabular-nums text-ink">
                      {formatNumber(seg.count)}
                    </div>
                    <div className="mt-0.5 text-xs text-faint">contacts</div>
                  </div>
                  <div className="text-xs text-faint">
                    Updated {formatDate(seg.updatedAt)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
