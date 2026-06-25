import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

const stepSchema = z.object({
  delayDays: z.number().int().min(0),
  condition: z.enum(["ALWAYS", "NO_REPLY", "NO_OPEN"]),
  subject: z.string().nullable().optional(),
  bodyHtml: z.string().nullable().optional(),
});

const contactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  fields: z.record(z.string(), z.unknown()).nullable().optional(),
});

const createSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  bodyHtml: z.string().min(1),
  fromAlias: z.string().nullable().optional(),
  fromName: z.string().nullable().optional(),
  timezone: z.string().default("UTC"),
  sendWindowStart: z.number().int().min(0).max(23).default(9),
  sendWindowEnd: z.number().int().min(1).max(24).default(17),
  dailyCap: z.number().int().min(1).default(500),
  unsubscribeHtml: z.string().nullable().optional(),
  steps: z.array(stepSchema).default([]),
  contacts: z.array(contactSchema).default([]),
});

type ContactInput = z.infer<typeof contactSchema>;

function dedupe(contacts: ContactInput[]): ContactInput[] {
  const seen = new Set<string>();
  const out: ContactInput[] = [];
  for (const c of contacts) {
    const key = c.email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...c, email: key });
  }
  return out;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contacts: true } } },
  });
  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const campaign = await prisma.campaign.create({
    data: {
      userId: session.user.id,
      name: d.name,
      subject: d.subject,
      bodyHtml: d.bodyHtml,
      fromAlias: d.fromAlias ?? null,
      fromName: d.fromName ?? null,
      timezone: d.timezone,
      sendWindowStart: d.sendWindowStart,
      sendWindowEnd: d.sendWindowEnd,
      dailyCap: d.dailyCap,
      unsubscribeHtml: d.unsubscribeHtml ?? null,
      steps: {
        create: d.steps.map((s, i) => ({
          stepOrder: i + 1, // follow-ups start at 1; step 0 is the initial email
          delayDays: s.delayDays,
          condition: s.condition,
          subject: s.subject ?? null,
          bodyHtml: s.bodyHtml ?? null,
        })),
      },
      contacts: {
        create: dedupe(d.contacts).map((c) => ({
          email: c.email,
          firstName: c.firstName ?? null,
          lastName: c.lastName ?? null,
          company: c.company ?? null,
          fields: c.fields
            ? (c.fields as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        })),
      },
    },
    include: { _count: { select: { contacts: true } } },
  });

  return NextResponse.json(campaign, { status: 201 });
}
