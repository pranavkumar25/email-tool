import { Prisma, type SubscriberStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import type {
  Subscriber,
  AudienceStats,
} from "@/data/subscribers";
import type { TagItem, TagTone } from "@/data/tags";
import type { Segment, SegmentCondition } from "@/data/segments";

const DAY = 86_400_000;

type SubscriberWithTags = Prisma.SubscriberGetPayload<{
  include: { tags: { select: { name: true } } };
}>;

/** DB row → UI view-model. */
export function toSubscriberView(s: SubscriberWithTags): Subscriber {
  return {
    id: s.id,
    email: s.email,
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    company: s.company ?? "",
    country: s.country ?? "",
    status: s.status,
    rating: s.rating,
    opens: s.opens,
    clicks: s.clicks,
    tags: s.tags.map((t) => t.name),
    source: s.source,
    subscribedAt: s.subscribedAt.toISOString(),
    lastActivityAt: s.lastActivityAt.toISOString(),
  };
}

export async function listSubscribers(userId: string): Promise<Subscriber[]> {
  const rows = await prisma.subscriber.findMany({
    where: { userId },
    include: { tags: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSubscriberView);
}

export async function getSubscriber(
  userId: string,
  id: string,
): Promise<Subscriber | null> {
  const row = await prisma.subscriber.findFirst({
    where: { id, userId },
    include: { tags: { select: { name: true } } },
  });
  return row ? toSubscriberView(row) : null;
}

export async function audienceStats(userId: string): Promise<AudienceStats> {
  const [grouped, totals, recent] = await Promise.all([
    prisma.subscriber.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.subscriber.aggregate({
      where: { userId },
      _count: { _all: true },
      _sum: { opens: true, clicks: true },
    }),
    prisma.subscriber.count({
      where: { userId, subscribedAt: { gte: new Date(Date.now() - 30 * DAY) } },
    }),
  ]);

  const by = (s: SubscriberStatus) =>
    grouped.find((g) => g.status === s)?._count._all ?? 0;

  const total = totals._count._all;
  const opens = totals._sum.opens ?? 0;
  const clicks = totals._sum.clicks ?? 0;
  const prior = Math.max(0, total - recent);

  return {
    total,
    subscribed: by("SUBSCRIBED"),
    unsubscribed: by("UNSUBSCRIBED"),
    pending: by("PENDING"),
    bounced: by("BOUNCED") + by("CLEANED"),
    // Coarse audience-wide engagement: opens/clicks per subscriber, as a %.
    avgOpenRate: total ? Math.round((opens / total) * 10) / 10 : 0,
    avgClickRate: total ? Math.round((clicks / total) * 10) / 10 : 0,
    growthLast30: prior ? Math.round((recent / prior) * 1000) / 10 : 0,
  };
}

// ─── Tags ───────────────────────────────────────────────────────────────
export async function listTags(userId: string): Promise<TagItem[]> {
  const rows = await prisma.tag.findMany({
    where: { userId },
    include: { _count: { select: { subscribers: true } } },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    count: t._count.subscribers,
    tone: (t.tone as TagTone) ?? "neutral",
    createdAt: t.createdAt.toISOString(),
  }));
}

// ─── Segments ─────────────────────────────────────────────────────────────
function parseLeadingInt(v: string): number | null {
  const m = v.match(/-?\d+/);
  return m ? parseInt(m[0], 10) : null;
}

/**
 * Translate a single segment condition into a Prisma where fragment.
 * Returns null when the condition can't be expressed (it is then ignored).
 */
function conditionToWhere(
  c: SegmentCondition,
): Prisma.SubscriberWhereInput | null {
  const v = (c.value ?? "").trim();
  const num = parseLeadingInt(v);
  const days = parseLeadingInt(v);
  const sinceDays = (n: number) => new Date(Date.now() - n * DAY);

  switch (c.field) {
    case "Tag":
      if (c.op === "is not") return { tags: { none: { name: v } } };
      return { tags: { some: { name: v } } };
    case "Country":
      if (c.op === "is not") return { NOT: { country: v } };
      if (c.op === "contains") return { country: { contains: v, mode: "insensitive" } };
      return { country: v };
    case "Source":
      if (c.op === "is not") return { NOT: { source: v } };
      return { source: v };
    case "Company":
      if (c.op === "contains") return { company: { contains: v, mode: "insensitive" } };
      return { company: v };
    case "Total opens":
      if (num == null) return null;
      if (c.op === "is at least") return { opens: { gte: num } };
      if (c.op === "is at most") return { opens: { lte: num } };
      return { opens: num };
    case "Total clicks":
      if (num == null) return null;
      if (c.op === "is at least") return { clicks: { gte: num } };
      if (c.op === "is at most") return { clicks: { lte: num } };
      return { clicks: num };
    case "Subscribed":
      if (days == null) return null;
      if (c.op === "is before") return { subscribedAt: { lt: sinceDays(days) } };
      return { subscribedAt: { gte: sinceDays(days) } };
    case "Last opened":
    case "Last clicked":
      // Approximated by overall last activity (no per-channel timestamp yet).
      if (days == null) return null;
      if (c.op === "is before")
        return { lastActivityAt: { lt: sinceDays(days) } };
      return { lastActivityAt: { gte: sinceDays(days) } };
    default:
      return null;
  }
}

export function segmentWhere(
  userId: string,
  match: "all" | "any",
  conditions: SegmentCondition[],
): Prisma.SubscriberWhereInput {
  const clauses = conditions
    .map(conditionToWhere)
    .filter((w): w is Prisma.SubscriberWhereInput => w !== null);
  if (clauses.length === 0) return { userId };
  return match === "any" ? { userId, OR: clauses } : { userId, AND: clauses };
}

export async function evaluateSegmentCount(
  userId: string,
  match: "all" | "any",
  conditions: SegmentCondition[],
): Promise<number> {
  return prisma.subscriber.count({
    where: segmentWhere(userId, match, conditions),
  });
}

export async function listSegments(userId: string): Promise<Segment[]> {
  const rows = await prisma.segment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const counts = await Promise.all(
    rows.map((r) =>
      evaluateSegmentCount(
        userId,
        r.match === "ANY" ? "any" : "all",
        (r.conditions as SegmentCondition[] | null) ?? [],
      ),
    ),
  );
  return rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    count: counts[i],
    match: r.match === "ANY" ? "any" : "all",
    conditions: (r.conditions as SegmentCondition[] | null) ?? [],
    updatedAt: r.updatedAt.toISOString(),
    growthPct: r.growthPct,
  }));
}

// ─── Shared write path (import + public forms) ──────────────────────────────
export type SubscriberInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  country?: string | null;
  source?: string;
};

/**
 * Create or update a subscriber by (userId, email), optionally attaching a tag.
 * Returns whether the row was newly created. Shared by CSV import and the
 * public form-submission endpoint so the dedupe/tagging rules never drift.
 */
export async function upsertSubscriber(
  userId: string,
  input: SubscriberInput,
  tagName?: string | null,
): Promise<{ created: boolean }> {
  const email = input.email.trim().toLowerCase();
  if (!email) return { created: false };

  const tagConnect = tagName?.trim()
    ? {
        connectOrCreate: {
          where: { userId_name: { userId, name: tagName.trim() } },
          create: { userId, name: tagName.trim() },
        },
      }
    : undefined;

  const existing = await prisma.subscriber.findUnique({
    where: { userId_email: { userId, email } },
    select: { id: true },
  });

  if (existing) {
    await prisma.subscriber.update({
      where: { id: existing.id },
      data: {
        firstName: input.firstName ?? undefined,
        lastName: input.lastName ?? undefined,
        company: input.company ?? undefined,
        country: input.country ?? undefined,
        ...(tagConnect ? { tags: tagConnect } : {}),
      },
    });
    return { created: false };
  }

  await prisma.subscriber.create({
    data: {
      userId,
      email,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      company: input.company ?? null,
      country: input.country ?? null,
      source: input.source ?? "Manual",
      ...(tagConnect ? { tags: tagConnect } : {}),
    },
  });
  return { created: true };
}
