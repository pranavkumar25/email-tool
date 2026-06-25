"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { TEMPLATE_GRADIENTS } from "@/data/templates";

export async function createTemplateAction(input: {
  name: string;
  category: string;
  description?: string;
  subject?: string;
  bodyHtml?: string;
}) {
  const user = await requireUser();
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Name is required" };

  // Cycle a thumbnail gradient deterministically off the current count.
  const count = await prisma.template.count({ where: { userId: user.id } });
  const gradient = TEMPLATE_GRADIENTS[count % TEMPLATE_GRADIENTS.length];

  await prisma.template.create({
    data: {
      userId: user.id,
      name,
      category: input.category || "Newsletter",
      description: input.description?.trim() ?? "",
      subject: input.subject?.trim() ?? "",
      bodyHtml: input.bodyHtml ?? "",
      gradient,
    },
  });
  revalidatePath("/templates");
  return { ok: true as const };
}

export async function duplicateTemplateAction(id: string) {
  const user = await requireUser();
  const src = await prisma.template.findFirst({ where: { id, userId: user.id } });
  if (!src) return { ok: false as const, error: "Not found" };
  await prisma.template.create({
    data: {
      userId: user.id,
      name: `${src.name} (copy)`,
      category: src.category,
      description: src.description,
      subject: src.subject,
      bodyHtml: src.bodyHtml,
      gradient: src.gradient,
    },
  });
  revalidatePath("/templates");
  return { ok: true as const };
}

export async function deleteTemplateAction(id: string) {
  const user = await requireUser();
  await prisma.template.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/templates");
  return { ok: true as const };
}
