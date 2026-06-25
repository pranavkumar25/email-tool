import { prisma } from "@/server/db";
import type { Template } from "@/data/templates";

export async function listTemplates(userId: string): Promise<Template[]> {
  const rows = await prisma.template.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    updatedAt: t.updatedAt.toISOString(),
    usageCount: t.usageCount,
    gradient: t.gradient,
  }));
}

export type TemplateContent = {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
};

/** Full content for prefilling the campaign composer. */
export async function getTemplateContent(
  userId: string,
  id: string,
): Promise<TemplateContent | null> {
  const t = await prisma.template.findFirst({
    where: { id, userId },
    select: { id: true, name: true, subject: true, bodyHtml: true },
  });
  return t;
}
