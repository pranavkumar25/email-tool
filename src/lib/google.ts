import { google, type Auth } from "googleapis";
import { prisma } from "@/lib/db";

/**
 * Build an OAuth2 client for a signed-in user from their stored Google tokens,
 * with automatic refresh + write-back to the Account row.
 */
export async function getGoogleClientForUser(
  userId: string,
): Promise<Auth.OAuth2Client> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  if (!account?.access_token) {
    throw new Error("No linked Google account for this user");
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
  );
  oauth2.setCredentials({
    access_token: account.access_token ?? undefined,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Persist rotated tokens so we don't re-prompt the user.
  oauth2.on("tokens", async (tokens) => {
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokens.access_token ?? account.access_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : account.expires_at,
        ...(tokens.refresh_token
          ? { refresh_token: tokens.refresh_token }
          : {}),
      },
    });
  });

  return oauth2;
}

export const driveClient = (auth: Auth.OAuth2Client) =>
  google.drive({ version: "v3", auth });

export const sheetsClient = (auth: Auth.OAuth2Client) =>
  google.sheets({ version: "v4", auth });

export const scriptClient = (auth: Auth.OAuth2Client) =>
  google.script({ version: "v1", auth });
