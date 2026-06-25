import { NextResponse } from "next/server";
import { recordTrackingEvent } from "@/server/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("c");
  const contactId = searchParams.get("u");
  const target = searchParams.get("url");

  let dest = new URL(req.url).origin;
  if (target) {
    try {
      const u = new URL(target);
      if (u.protocol === "http:" || u.protocol === "https:") {
        dest = u.toString();
      }
    } catch {
      // fall back to origin on malformed url
    }
  }

  if (campaignId && contactId) {
    try {
      await recordTrackingEvent({
        campaignId,
        contactId,
        type: "CLICK",
        metadata: { url: dest },
      });
    } catch {
      // never block the redirect on a write error
    }
  }

  return NextResponse.redirect(dest, 302);
}
