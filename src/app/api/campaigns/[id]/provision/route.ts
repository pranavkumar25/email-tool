import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getGoogleClientForUser } from "@/server/google/client";
import { provisionCampaign } from "@/server/google/provision";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, spreadsheetId: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (campaign.spreadsheetId) {
    return NextResponse.json(
      { error: "already provisioned" },
      { status: 409 },
    );
  }

  try {
    const client = await getGoogleClientForUser(session.user.id);
    const result = await provisionCampaign(client, id);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
