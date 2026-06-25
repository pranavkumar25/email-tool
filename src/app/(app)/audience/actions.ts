"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type SubscriberStatus } from "@prisma/client";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { upsertSubscriber, type SubscriberInput } from "@/server/audience";
import type { SegmentCondition } from "@/data/segments";

// ─── Subscribers ────────────────────────────────────────────────────────────
export async function addSubscriberAction(input: SubscriberInput) {
  const user = await requireUser();
  if (!input.email?.trim()) return { ok: false as const, error: "Email is required" };
  try {
    const { created } = await upsertSubscriber(user.id, input);
    revalidatePath("/audience/subscribers");
    return { ok: true as const, created };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function importSubscribersAction(payload: {
  rows: SubscriberInput[];
  tagName?: string | null;
  source?: string;
}) {
  const user = await requireUser();
  let created = 0;
  let updated = 0;
  for (const row of payload.rows) {
    if (!row.email?.trim()) continue;
    const res = await upsertSubscriber(
      user.id,
      { ...row, source: payload.source ?? "CSV import" },
      payload.tagName,
    );
    if (res.created) created++;
    else updated++;
  }
  revalidatePath("/audience/subscribers");
  revalidatePath("/audience/tags");
  return { ok: true as const, created, updated };
}

export async function setSubscriberStatusAction(
  ids: string[],
  status: SubscriberStatus,
) {
  const user = await requireUser();
  if (ids.length === 0) return { ok: true as const, count: 0 };
  const res = await prisma.subscriber.updateMany({
    where: { id: { in: ids }, userId: user.id },
    data: { status },
  });
  revalidatePath("/audience/subscribers");
  return { ok: true as const, count: res.count };
}

export async function tagSubscribersAction(ids: string[], tagName: string) {
  const user = await requireUser();
  const name = tagName.trim();
  if (ids.length === 0 || !name) return { ok: false as const, error: "Nothing to tag" };
  const tag = await prisma.tag.upsert({
    where: { userId_name: { userId: user.id, name } },
    create: { userId: user.id, name },
    update: {},
  });
  // Scope to this user's subscribers, then connect the tag to each.
  const owned = await prisma.subscriber.findMany({
    where: { id: { in: ids }, userId: user.id },
    select: { id: true },
  });
  await Promise.all(
    owned.map((s) =>
      prisma.subscriber.update({
        where: { id: s.id },
        data: { tags: { connect: { id: tag.id } } },
      }),
    ),
  );
  revalidatePath("/audience/subscribers");
  revalidatePath("/audience/tags");
  return { ok: true as const, count: owned.length };
}

// ─── Tags ───────────────────────────────────────────────────────────────────
export async function createTagAction(name: string, tone = "neutral") {
  const user = await requireUser();
  const trimmed = name.trim();
  if (!trimmed) return { ok: false as const, error: "Name is required" };
  try {
    await prisma.tag.create({ data: { userId: user.id, name: trimmed, tone } });
    revalidatePath("/audience/tags");
    return { ok: true as const };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false as const, error: "A tag with that name already exists" };
    }
    return { ok: false as const, error: "Failed to create tag" };
  }
}

export async function deleteTagAction(id: string) {
  const user = await requireUser();
  await prisma.tag.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/audience/tags");
  revalidatePath("/audience/subscribers");
  return { ok: true as const };
}

// ─── Segments ─────────────────────────────────────────────────────────────
export async function createSegmentAction(input: {
  name: string;
  description?: string;
  match: "all" | "any";
  conditions: SegmentCondition[];
}) {
  const user = await requireUser();
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Name is required" };
  await prisma.segment.create({
    data: {
      userId: user.id,
      name,
      description: input.description?.trim() ?? "",
      match: input.match === "any" ? "ANY" : "ALL",
      conditions: input.conditions as unknown as Prisma.InputJsonValue,
    },
  });
  revalidatePath("/audience/segments");
  return { ok: true as const };
}

export async function deleteSegmentAction(id: string) {
  const user = await requireUser();
  await prisma.segment.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/audience/segments");
  return { ok: true as const };
}
