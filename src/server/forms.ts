import { type FormType as DbFormType } from "@prisma/client";
import { prisma } from "@/server/db";
import type { FormItem, FormType } from "@/data/forms";

export const TYPE_TO_ENUM: Record<FormType, DbFormType> = {
  Embedded: "EMBEDDED",
  Popup: "POPUP",
  "Landing page": "LANDING",
};

export const ENUM_TO_TYPE: Record<DbFormType, FormType> = {
  EMBEDDED: "Embedded",
  POPUP: "Popup",
  LANDING: "Landing page",
};

function conversion(views: number, submissions: number): number {
  return views ? Math.round((submissions / views) * 1000) / 10 : 0;
}

export async function listForms(userId: string): Promise<FormItem[]> {
  const rows = await prisma.form.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((f) => ({
    id: f.id,
    name: f.name,
    type: ENUM_TO_TYPE[f.type],
    status: f.status,
    views: f.views,
    submissions: f.submissions,
    conversionRate: conversion(f.views, f.submissions),
    audience: f.audience,
    updatedAt: f.updatedAt.toISOString(),
  }));
}
