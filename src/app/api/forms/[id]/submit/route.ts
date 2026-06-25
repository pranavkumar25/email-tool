import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { upsertSubscriber } from "@/server/audience";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
});

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/** View beacon + lightweight config for an embedded form. */
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const form = await prisma.form.findUnique({
    where: { id },
    select: { id: true, name: true, status: true, audience: true },
  });
  if (!form || form.status !== "LIVE") {
    return NextResponse.json({ error: "not found" }, { status: 404, headers: CORS });
  }
  await prisma.form.update({ where: { id }, data: { views: { increment: 1 } } });
  return NextResponse.json(
    { ok: true, name: form.name, audience: form.audience },
    { headers: CORS },
  );
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) {
    return NextResponse.json({ error: "not found" }, { status: 404, headers: CORS });
  }
  if (form.status !== "LIVE") {
    return NextResponse.json(
      { error: "This form is not accepting submissions." },
      { status: 403, headers: CORS },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400, headers: CORS });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400, headers: CORS },
    );
  }
  const d = parsed.data;

  await upsertSubscriber(
    form.userId,
    {
      email: d.email,
      firstName: d.firstName ?? null,
      lastName: d.lastName ?? null,
      company: d.company ?? null,
      country: d.country ?? null,
      source: "Signup form",
    },
    form.audience || null,
  );

  await prisma.$transaction([
    prisma.formSubmission.create({
      data: { formId: form.id, email: d.email.toLowerCase(), data: d },
    }),
    prisma.form.update({
      where: { id: form.id },
      data: { submissions: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true }, { headers: CORS });
}
