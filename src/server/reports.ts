import { prisma } from "@/server/db";
import { pct } from "@/lib/utils";

const DAY = 86_400_000;

export type ReportData = {
  totals: { sent: number; openRate: number; clickRate: number; replies: number };
  engagementSeries: { date: string; sent: number; opens: number; clicks: number }[];
  audienceGrowthSeries: { date: string; gained: number; lost: number }[];
  topLinks: { url: string; clicks: number; ctr: number }[];
  topCampaigns: { name: string; sent: number; openRate: number; clickRate: number }[];
  locationBreakdown: { label: string; value: number }[];
  statusBreakdown: { label: string; value: number }[];
  deliverability: {
    delivered: number;
    bounceRate: number;
    spamRate: number;
    unsubscribeRate: number;
  };
};

const dayStr = (ms: number) => new Date(ms).toISOString().slice(0, 10);

function emptyReport(): ReportData {
  const today = Date.now();
  const engagementSeries = Array.from({ length: 30 }, (_, i) => ({
    date: dayStr(today - (29 - i) * DAY),
    sent: 0,
    opens: 0,
    clicks: 0,
  }));
  const audienceGrowthSeries = Array.from({ length: 30 }, (_, i) => ({
    date: dayStr(today - (29 - i) * DAY),
    gained: 0,
    lost: 0,
  }));
  return {
    totals: { sent: 0, openRate: 0, clickRate: 0, replies: 0 },
    engagementSeries,
    audienceGrowthSeries,
    topLinks: [],
    topCampaigns: [],
    locationBreakdown: [],
    statusBreakdown: [],
    deliverability: { delivered: 0, bounceRate: 0, spamRate: 0, unsubscribeRate: 0 },
  };
}

export async function getReport(userId: string): Promise<ReportData> {
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    select: { id: true, name: true },
  });
  const ids = campaigns.map((c) => c.id);
  const nameById = new Map(campaigns.map((c) => [c.id, c.name]));

  const since = Date.now() - 30 * DAY;
  const sinceDate = new Date(since);

  const [
    byType,
    distinctSent,
    distinctOpened,
    distinctClicked,
    recentEvents,
    clickEvents,
    perCampaign,
    countryGroups,
    statusGroups,
    totalSubs,
    recentSubs,
  ] = await Promise.all([
    ids.length
      ? prisma.event.groupBy({
          by: ["type"],
          where: { campaignId: { in: ids } },
          _count: { _all: true },
        })
      : Promise.resolve([] as { type: string; _count: { _all: number } }[]),
    ids.length
      ? prisma.event.findMany({
          where: { campaignId: { in: ids }, type: "SENT", contactId: { not: null } },
          distinct: ["contactId"],
          select: { contactId: true },
        })
      : Promise.resolve([] as { contactId: string | null }[]),
    ids.length
      ? prisma.event.findMany({
          where: { campaignId: { in: ids }, type: "OPEN", contactId: { not: null } },
          distinct: ["contactId"],
          select: { contactId: true },
        })
      : Promise.resolve([] as { contactId: string | null }[]),
    ids.length
      ? prisma.event.findMany({
          where: { campaignId: { in: ids }, type: "CLICK", contactId: { not: null } },
          distinct: ["contactId"],
          select: { contactId: true },
        })
      : Promise.resolve([] as { contactId: string | null }[]),
    ids.length
      ? prisma.event.findMany({
          where: {
            campaignId: { in: ids },
            type: { in: ["SENT", "OPEN", "CLICK"] },
            createdAt: { gte: sinceDate },
          },
          select: { type: true, createdAt: true },
        })
      : Promise.resolve([] as { type: string; createdAt: Date }[]),
    ids.length
      ? prisma.event.findMany({
          where: { campaignId: { in: ids }, type: "CLICK" },
          select: { metadata: true },
        })
      : Promise.resolve([] as { metadata: unknown }[]),
    ids.length
      ? prisma.event.groupBy({
          by: ["campaignId", "type"],
          where: { campaignId: { in: ids } },
          _count: { _all: true },
        })
      : Promise.resolve(
          [] as { campaignId: string; type: string; _count: { _all: number } }[],
        ),
    prisma.subscriber.groupBy({
      by: ["country"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.subscriber.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.subscriber.count({ where: { userId } }),
    prisma.subscriber.findMany({
      where: { userId, subscribedAt: { gte: sinceDate } },
      select: { subscribedAt: true },
    }),
  ]);

  if (ids.length === 0 && totalSubs === 0) return emptyReport();

  const typeCount = (t: string) =>
    byType.find((b) => b.type === t)?._count._all ?? 0;
  const sentEvents = typeCount("SENT");
  const replies = typeCount("REPLY");
  const bounces = typeCount("BOUNCE");
  const unsubs = typeCount("UNSUBSCRIBE");

  const sentContacts = distinctSent.filter((e) => e.contactId).length;
  const openedContacts = distinctOpened.filter((e) => e.contactId).length;
  const clickedContacts = distinctClicked.filter((e) => e.contactId).length;

  // ── 30-day engagement series ──
  const buckets = new Map<string, { sent: number; opens: number; clicks: number }>();
  for (let i = 0; i < 30; i++) {
    buckets.set(dayStr(since + i * DAY), { sent: 0, opens: 0, clicks: 0 });
  }
  for (const e of recentEvents) {
    const key = dayStr(e.createdAt.getTime());
    const b = buckets.get(key);
    if (!b) continue;
    if (e.type === "SENT") b.sent++;
    else if (e.type === "OPEN") b.opens++;
    else if (e.type === "CLICK") b.clicks++;
  }
  const engagementSeries = Array.from(buckets, ([date, v]) => ({ date, ...v }));

  // ── 30-day audience growth ──
  const gainedByDay = new Map<string, number>();
  for (const s of recentSubs) {
    const key = dayStr(s.subscribedAt.getTime());
    gainedByDay.set(key, (gainedByDay.get(key) ?? 0) + 1);
  }
  const audienceGrowthSeries = Array.from({ length: 30 }, (_, i) => {
    const date = dayStr(since + i * DAY);
    return { date, gained: gainedByDay.get(date) ?? 0, lost: 0 };
  });

  // ── Top links from click metadata ──
  const linkCounts = new Map<string, number>();
  for (const e of clickEvents) {
    const url = (e.metadata as { url?: string } | null)?.url;
    if (!url) continue;
    linkCounts.set(url, (linkCounts.get(url) ?? 0) + 1);
  }
  const topLinks = [...linkCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([url, clicks]) => ({
      url: url.replace(/^https?:\/\//, ""),
      clicks,
      ctr: pct(clicks, sentContacts),
    }));

  // ── Top campaigns ──
  const perCampaignMap = new Map<string, Record<string, number>>();
  for (const r of perCampaign) {
    const m = perCampaignMap.get(r.campaignId) ?? {};
    m[r.type] = r._count._all;
    perCampaignMap.set(r.campaignId, m);
  }
  const topCampaigns = [...perCampaignMap.entries()]
    .map(([cid, m]) => {
      const sent = m.SENT ?? 0;
      return {
        name: nameById.get(cid) ?? "Untitled",
        sent,
        openRate: pct(m.OPEN ?? 0, sent),
        clickRate: pct(m.CLICK ?? 0, sent),
      };
    })
    .filter((c) => c.sent > 0)
    .sort((a, b) => b.sent - a.sent)
    .slice(0, 5);

  // ── Location breakdown (subscribers by country) ──
  const sortedCountries = countryGroups
    .map((g) => ({ label: g.country || "Unknown", value: g._count._all }))
    .sort((a, b) => b.value - a.value);
  const topCountries = sortedCountries.slice(0, 5);
  const otherCount = sortedCountries
    .slice(5)
    .reduce((s, c) => s + c.value, 0);
  const locationBreakdown = totalSubs
    ? [
        ...topCountries.map((c) => ({
          label: c.label,
          value: pct(c.value, totalSubs),
        })),
        ...(otherCount > 0
          ? [{ label: "Other", value: pct(otherCount, totalSubs) }]
          : []),
      ]
    : [];

  // ── Status breakdown (subscribers) ──
  const STATUS_LABEL: Record<string, string> = {
    SUBSCRIBED: "Subscribed",
    PENDING: "Pending",
    UNSUBSCRIBED: "Unsubscribed",
    BOUNCED: "Bounced",
    CLEANED: "Cleaned",
  };
  const statusBreakdown = totalSubs
    ? statusGroups
        .map((g) => ({
          label: STATUS_LABEL[g.status] ?? g.status,
          value: pct(g._count._all, totalSubs),
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  return {
    totals: {
      sent: sentEvents,
      openRate: pct(openedContacts, sentContacts),
      clickRate: pct(clickedContacts, sentContacts),
      replies,
    },
    engagementSeries,
    audienceGrowthSeries,
    topLinks,
    topCampaigns,
    locationBreakdown,
    statusBreakdown,
    deliverability: {
      delivered: sentEvents ? pct(sentEvents - bounces, sentEvents) : 0,
      bounceRate: pct(bounces, sentEvents),
      spamRate: 0,
      unsubscribeRate: pct(unsubs, sentEvents),
    },
  };
}
