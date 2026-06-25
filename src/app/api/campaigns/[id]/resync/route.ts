import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getGoogleClientForUser } from "@/server/google/client";
import { resyncCampaignConfig } from "@/server/google/campaignSheet";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Repairs an already-provisioned campaign's Sheet Config — pushes the current
 * trackingBaseUrl / ingestUrl / ingestSecret + send settings. Used to fix
 * campaigns that were provisioned while the env pointed at localhost.
 */
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
  if (!campaign.spreadsheetId) {
    return NextResponse.json(
      { error: "Campaign is not provisioned yet" },
      { status: 409 },
    );
  }

  try {
    const client = await getGoogleClientForUser(session.user.id);
    const { baseUrl } = await resyncCampaignConfig(client, id);
    return NextResponse.json({ ok: true, baseUrl });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
