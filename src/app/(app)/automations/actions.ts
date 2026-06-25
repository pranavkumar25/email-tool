"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import type { StepType } from "@/data/automations";

type StarterStep = { type: StepType; title: string; detail: string };
type Starter = { name: string; trigger: string; steps: StarterStep[] };

export const STARTERS: Record<string, Starter> = {
  welcome: {
    name: "Welcome series",
    trigger: "Subscriber joins",
    steps: [
      { type: "email", title: "Welcome email", detail: "Sent immediately" },
      { type: "delay", title: "Wait 2 days", detail: "" },
      { type: "email", title: "Getting started guide", detail: "Tips + best first actions" },
      { type: "condition", title: "Opened guide?", detail: "Branch on engagement" },
      { type: "email", title: "Case study", detail: "Sent to non-openers after 3 days" },
    ],
  },
  abandoned: {
    name: "Abandoned cart recovery",
    trigger: "Cart abandoned",
    steps: [
      { type: "delay", title: "Wait 1 hour", detail: "" },
      { type: "email", title: "Did you forget something?", detail: "Cart contents reminder" },
      { type: "delay", title: "Wait 1 day", detail: "" },
      { type: "email", title: "10% off to finish", detail: "Discount incentive" },
    ],
  },
  reengage: {
    name: "Re-engagement",
    trigger: "No opens in 60 days",
    steps: [
      { type: "email", title: "We miss you", detail: "Win-back offer" },
      { type: "delay", title: "Wait 5 days", detail: "" },
      { type: "condition", title: "Re-engaged?", detail: "Opened or clicked" },
      { type: "action", title: "Tag as churned", detail: "If still dormant" },
    ],
  },
};

/** Build the create payload for a trigger step + the given downstream steps. */
function stepCreate(trigger: string, steps: StarterStep[]) {
  return [
    {
      stepOrder: 0,
      type: "trigger",
      title: trigger,
      detail: "Entry trigger",
    },
    ...steps.map((s, i) => ({
      stepOrder: i + 1,
      type: s.type,
      title: s.title,
      detail: s.detail,
    })),
  ];
}

export async function createAutomationAction(input: {
  name?: string;
  trigger?: string;
  starter?: string;
}) {
  const user = await requireUser();
  const starter = input.starter ? STARTERS[input.starter] : undefined;
  const name = (input.name?.trim() || starter?.name || "").trim();
  if (!name) return { ok: false as const, error: "Name is required" };
  const trigger = input.trigger?.trim() || starter?.trigger || "Subscriber joins";

  const automation = await prisma.automation.create({
    data: {
      userId: user.id,
      name,
      trigger,
      status: "DRAFT",
      steps: { create: stepCreate(trigger, starter?.steps ?? []) },
    },
  });
  revalidatePath("/automations");
  redirect(`/automations/${automation.id}`);
}

export async function toggleAutomationStatusAction(id: string) {
  const user = await requireUser();
  const a = await prisma.automation.findFirst({
    where: { id, userId: user.id },
    select: { id: true, status: true },
  });
  if (!a) return { ok: false as const, error: "Not found" };
  const next = a.status === "LIVE" ? "PAUSED" : "LIVE";
  await prisma.automation.update({ where: { id: a.id }, data: { status: next } });
  revalidatePath("/automations");
  revalidatePath(`/automations/${id}`);
  return { ok: true as const, status: next };
}

export async function addAutomationStepAction(
  automationId: string,
  step: { type: StepType; title: string; detail?: string },
) {
  const user = await requireUser();
  const owned = await prisma.automation.findFirst({
    where: { id: automationId, userId: user.id },
    select: { id: true },
  });
  if (!owned) return { ok: false as const, error: "Not found" };
  if (!step.title.trim()) return { ok: false as const, error: "Title is required" };

  const last = await prisma.automationStep.findFirst({
    where: { automationId },
    orderBy: { stepOrder: "desc" },
    select: { stepOrder: true },
  });
  await prisma.automationStep.create({
    data: {
      automationId,
      stepOrder: (last?.stepOrder ?? -1) + 1,
      type: step.type,
      title: step.title.trim(),
      detail: step.detail?.trim() ?? "",
    },
  });
  // Keep the workspace's "updated" stamp fresh.
  await prisma.automation.update({
    where: { id: automationId },
    data: { updatedAt: new Date() },
  });
  revalidatePath(`/automations/${automationId}`);
  return { ok: true as const };
}

export async function deleteAutomationAction(id: string) {
  const user = await requireUser();
  await prisma.automation.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/automations");
  redirect("/automations");
}
