# Setup Guide

This app is a mail-merge + sequencing tool that sends from **your own Gmail**
via a Google Apps Script bound to a per-campaign Google Sheet. The Next.js app
is the control plane (upload contacts, compose, schedule, analytics); the Sheet
+ Apps Script in your Drive is the execution engine; Vercel hosts the app and
the open/click tracking endpoints.

---

## Locked configuration

| Decision | Choice |
| --- | --- |
| Senders | Small team, all on the **same Workspace org** (`pickcel.com`) |
| Sending domain | `getpickcel.com` (secondary domain of the same tenant) |
| OAuth consent screen | **Internal** — no Google verification, no token expiry |
| Hosting | Vercel |
| Database | Postgres (Vercel Postgres / Neon / Supabase) |
| Sending quota | ~1,500 recipients/day per sender (Workspace, via Apps Script) |

Because the app is **Internal**, you can email **any external recipients** —
"Internal" only restricts who can *sign in to the app* (your team), not who you
can mail.

---

## 1. Google Cloud project (in the existing `pickcel.com` org)

1. **console.cloud.google.com** → create a project (e.g. `gmail-campaigns`) under
   the `pickcel.com` organization.
2. **APIs & Services → Library** → enable:
   - Google Drive API
   - Google Sheets API
   - Apps Script API
   - (Gmail API — used by the bound script at runtime)

   > **Each sender must also enable the Apps Script API for their own account**
   > at <https://script.google.com/home/usersettings> (toggle on). Without this,
   > provisioning fails with *"User has not enabled the Apps Script API."*
3. **APIs & Services → OAuth consent screen**
   - User type: **Internal**
   - App name, support email, developer email.
   - Scopes — add:
     - `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`
     - `.../auth/drive.file`
     - `.../auth/spreadsheets`
     - `.../auth/script.projects`
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`, `https://<your-vercel-domain>`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<your-vercel-domain>/api/auth/callback/google`
   - Copy the **Client ID** and **Client secret** → these become
     `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

> If your Workspace admin restricts third-party app access
> (Admin console → Security → Access and data control → API controls),
> mark this OAuth client **Trusted** for the org.

---

## 2. Sending-domain deliverability (`getpickcel.com`)

In **Admin console → Apps → Google Workspace → Gmail**:
- **SPF**: ensure `getpickcel.com` TXT record includes `include:_spf.google.com`.
- **DKIM**: *Authenticate email* → generate + publish the DKIM key for `getpickcel.com`.
- **DMARC**: publish a `_dmarc.getpickcel.com` TXT record (start with `p=none`).

Each sender who will send *as* `you@getpickcel.com` must add it as a **verified
"Send mail as" alias** in Gmail → Settings → Accounts → "Send mail as".

---

## 3. Database

Create a Postgres database (Vercel Postgres, Neon, or Supabase) and copy its
pooled connection string into `DATABASE_URL`.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm db:push                 # create tables from prisma/schema.prisma
```

Generate the remaining secrets:

```bash
openssl rand -base64 32   # AUTH_SECRET
openssl rand -base64 32   # TOKEN_ENCRYPTION_KEY
openssl rand -hex 24      # INGEST_SECRET
```

---

## 4. Run locally

```bash
pnpm dev
# open http://localhost:3000 and sign in with a getpickcel.com / pickcel.com account
```

---

## 5. Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel.
2. Add all `.env.local` values as Vercel environment variables.
3. Set `AUTH_URL` and `TRACKING_BASE_URL` to your Vercel URL.
4. Add the Vercel callback URL to the Google OAuth client (step 1.4).
5. Redeploy.

---

## 6. How a campaign runs (first-run authorize)

1. In the app: upload CSV → map fields → write subject/body → define follow-ups
   → **Provision**.
2. The app creates a Google Sheet in the sender's Drive, attaches the Apps Script
   (`apps-script/Code.gs`), and writes Contacts + Sequence + Config tabs.
3. **One-time per sender:** open the Sheet → menu **Campaign → Authorize + install
   triggers**. This is the Gmail/triggers consent that lets the script send on
   the sender's own quota and run every 10 minutes.
4. From then on the script sends within the configured window, threads follow-ups,
   detects replies (stopping the sequence), and posts events back to the app.

---

## Quotas & limits (read before scaling)

- **Apps Script email quota** is the real ceiling: ~**1,500 recipients/day** on
  Workspace (vs ~100/day on consumer Gmail). The script checks
  `MailApp.getRemainingDailyQuota()` and stops when exhausted.
- **Open tracking is approximate** — image proxies / Apple Mail Privacy Protection
  inflate or hide opens. **Reply rate** (tracked natively from Gmail threads) is the
  trustworthy metric.
- Keep volumes sane and include an unsubscribe footer to protect domain reputation.
