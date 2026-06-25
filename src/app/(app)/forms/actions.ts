"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { TYPE_TO_ENUM } from "@/server/forms";
import type { FormType } from "@/data/forms";

export async function createFormAction(input: {
  name: string;
  type: FormType;
  audience?: string;
}) {
  const user = await requireUser();
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Name is required" };
  await prisma.form.create({
    data: {
      userId: user.id,
      name,
      type: TYPE_TO_ENUM[input.type] ?? "EMBEDDED",
      status: "DRAFT",
      audience: input.audience?.trim() ?? "",
    },
  });
  revalidatePath("/forms");
  return { ok: true as const };
}

export async function toggleFormStatusAction(id: string) {
  const user = await requireUser();
  const f = await prisma.form.findFirst({
    where: { id, userId: user.id },
    select: { id: true, status: true },
  });
  if (!f) return { ok: false as const, error: "Not found" };
  const next = f.status === "LIVE" ? "PAUSED" : "LIVE";
  await prisma.form.update({ where: { id: f.id }, data: { status: next } });
  revalidatePath("/forms");
  return { ok: true as const, status: next };
}

export async function deleteFormAction(id: string) {
  const user = await requireUser();
  await prisma.form.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/forms");
  return { ok: true as const };
}
