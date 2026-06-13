import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * Scopes the WEB APP needs to provision and manage the per-campaign Sheet.
 * Note: the Gmail SEND/READ permissions are NOT here — those are authorized
 * separately by the bound Apps Script at first run (under the sender's own
 * account), which is what lets us send on the sender's Gmail quota.
 *
 *   drive.file       create the campaign spreadsheet (per-file, least-privilege)
 *   spreadsheets     write contacts + config + read status back
 *   script.projects  create/update the bound Apps Script attached to the Sheet
 */
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/script.projects",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline", // get a refresh_token
          prompt: "consent", // force refresh_token issuance on re-consent
          include_granted_scopes: "true",
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
