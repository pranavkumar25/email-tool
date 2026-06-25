import {
  ArrowUpTrayIcon,
  UsersIcon,
  CheckBadgeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";
import {
  PageHeader,
  ButtonLink,
  Stat,
} from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import {
  listSubscribers,
  audienceStats as getAudienceStats,
} from "@/server/audience";
import { SubscribersTable } from "./SubscribersTable";
import { AddSubscriberButton } from "./AddSubscriberButton";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const user = await requireUser();
  const [subscribers, audienceStats] = await Promise.all([
    listSubscribers(user.id),
    getAudienceStats(user.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscribers"
        subtitle="Everyone in your audience."
        actions={
          <>
            <ButtonLink href="/audience/import" variant="secondary" size="sm">
              <ArrowUpTrayIcon className="h-4 w-4" strokeWidth={2.25} />
              Import
            </ButtonLink>
            <AddSubscriberButton />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          accent
          label="Total subscribers"
          value={audienceStats.total.toLocaleString("en-US")}
          icon={UsersIcon}
          delta={{ value: `${audienceStats.growthLast30}%`, dir: "up" }}
          sub="vs. last 30 days"
        />
        <Stat
          label="Subscribed"
          value={audienceStats.subscribed.toLocaleString("en-US")}
          icon={CheckBadgeIcon}
          sub={`${audienceStats.pending} pending · ${audienceStats.unsubscribed} unsubscribed`}
        />
        <Stat
          label="Avg. open rate"
          value={`${audienceStats.avgOpenRate}%`}
          icon={EnvelopeOpenIcon}
          sub="Across all sends"
        />
        <Stat
          label="Avg. click rate"
          value={`${audienceStats.avgClickRate}%`}
          icon={CursorArrowRaysIcon}
          sub="Across all sends"
        />
      </div>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
