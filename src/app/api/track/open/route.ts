import { recordTrackingEvent } from "@/server/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("c");
  const contactId = searchParams.get("u");
  const step = searchParams.get("s");

  if (campaignId && contactId) {
    try {
      await recordTrackingEvent({
        campaignId,
        contactId,
        type: "OPEN",
        stepOrder: step ? Number(step) : null,
      });
    } catch {
      // never block the pixel response on a write error
    }
  }

  return new Response(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      "Content-Length": String(PIXEL.length),
    },
  });
}
