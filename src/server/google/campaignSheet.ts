import { type Auth } from "googleapis";
import { sheetsClient } from "@/server/google/client";
import { prisma } from "@/server/db";
import { trackingBaseUrl } from "@/server/config";

type CampaignConfig = {
  id: string;
  fromAlias: string | null;
  fromName: string | null;
  timezone: string;
  sendWindowStart: number;
  sendWindowEnd: number;
  dailyCap: number;
  unsubscribeHtml: string | null;
  subject: string;
  bodyHtml: string;
  status: string;
};

/**
 * Canonical Config tab contents for a campaign. Shared by initial provisioning
 * and by the "re-sync settings" repair so the two never drift.
 */
export function campaignConfigRows(
  campaign: CampaignConfig,
  baseUrl: string,
): string[][] {
  return [
    ["key", "value"],
    ["campaignId", campaign.id],
    ["status", campaign.status === "PAUSED" ? "PAUSED" : "ACTIVE"],
    ["trackingBaseUrl", baseUrl],
    ["ingestUrl", baseUrl ? `${baseUrl}/api/ingest` : ""],
    ["ingestSecret", process.env.INGEST_SECRET ?? ""],
    ["fromAlias", campaign.fromAlias ?? ""],
    ["fromName", campaign.fromName ?? ""],
    ["timezone", campaign.timezone],
    ["sendWindowStart", String(campaign.sendWindowStart)],
    ["sendWindowEnd", String(campaign.sendWindowEnd)],
    ["dailyCap", String(campaign.dailyCap)],
    ["unsubscribeHtml", campaign.unsubscribeHtml ?? ""],
    ["defaultSubject", campaign.subject],
    ["defaultBodyHtml", campaign.bodyHtml],
  ];
}

/**
 * Rewrite the Config tab of an already-provisioned campaign's Sheet with the
 * current canonical values — primarily to repair a `trackingBaseUrl` /
 * `ingestUrl` that was stamped while the env pointed at localhost.
 */
export async function resyncCampaignConfig(
  auth: Auth.OAuth2Client,
  campaignId: string,
): Promise<{ baseUrl: string }> {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) throw new Error("Campaign not found");
  if (!campaign.spreadsheetId) throw new Error("Campaign is not provisioned yet");

  const baseUrl = trackingBaseUrl();
  const rows = campaignConfigRows(campaign, baseUrl);
  const sheets = sheetsClient(auth);

  // Clear then rewrite so stale keys never linger.
  await sheets.spreadsheets.values.clear({
    spreadsheetId: campaign.spreadsheetId,
    range: "Config!A:B",
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: campaign.spreadsheetId,
    range: "Config!A1",
    valueInputOption: "RAW",
    requestBody: { values: rows },
  });

  return { baseUrl };
}
