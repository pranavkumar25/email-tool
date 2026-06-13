import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  name: z.string().min(1).optional(),
});

export async function GET(_req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
    include: { steps: { orderBy: { stepOrder: "asc" } }, contacts: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(campaign);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const campaign = await prisma.campaign.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(campaign);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
