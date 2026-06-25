import { prisma } from "@/server/db";
import type {
  Automation,
  AutomationStep,
  StepType,
} from "@/data/automations";

type StepRow = { id: string; type: string; title: string; detail: string };

function toStepView(s: StepRow): AutomationStep {
  return {
    id: s.id,
    type: s.type as StepType,
    title: s.title,
    detail: s.detail,
  };
}

export async function listAutomations(userId: string): Promise<Automation[]> {
  const rows = await prisma.automation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { steps: { orderBy: { stepOrder: "asc" } } },
  });
  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    status: a.status,
    trigger: a.trigger,
    entered: a.entered,
    active: a.active,
    completed: a.completed,
    openRate: a.openRate,
    clickRate: a.clickRate,
    updatedAt: a.updatedAt.toISOString(),
    steps: a.steps.map(toStepView),
  }));
}

export async function getAutomation(
  userId: string,
  id: string,
): Promise<Automation | null> {
  const a = await prisma.automation.findFirst({
    where: { id, userId },
    include: { steps: { orderBy: { stepOrder: "asc" } } },
  });
  if (!a) return null;
  return {
    id: a.id,
    name: a.name,
    status: a.status,
    trigger: a.trigger,
    entered: a.entered,
    active: a.active,
    completed: a.completed,
    openRate: a.openRate,
    clickRate: a.clickRate,
    updatedAt: a.updatedAt.toISOString(),
    steps: a.steps.map(toStepView),
  };
}
