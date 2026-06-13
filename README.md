# Gmail Campaigns

Send personalized email campaigns and follow-up sequences from **your own
Gmail**, driven by a Google Apps Script bound to a per-campaign Google Sheet —
with a Next.js dashboard for composing, scheduling, and analytics.

> Not a third-party SMTP relay. Mail goes out from your real mailbox on your own
> sending quota, which is better for deliverability and keeps you in control.

## Architecture

```
┌─────────────────────────┐     OAuth (Internal)      ┌──────────────────────┐
│  Next.js app (Vercel)   │ ───────────────────────▶  │  Google APIs         │
│  • Google sign-in       │                            │  Drive / Sheets /    │
│  • CSV upload + mapping  │  create Sheet + push       │  Apps Script         │
│  • Compose + sequences   │  bound script + data       └──────────────────────┘
│  • Dashboard / analytics │                                      │
│  • /api/track/{open,click}│ ◀──── pixel + link hits ───┐        │ provisions
│  • /api/ingest (SENT/REPLY)│◀── webhook ──┐            │        ▼
└─────────────────────────┘                 │   ┌──────────────────────────────┐
            ▲                                │   │  Per-campaign Google Sheet   │
            │ reads Events                   └───│  + bound Apps Script         │
        ┌───────────┐                            │  • time trigger sends mail   │
        │ Postgres  │                            │  • threads follow-ups        │
        └───────────┘                            │  • detects replies           │
                                                 └──────────────────────────────┘
```

## Stack

- **Next.js 15** (App Router, TypeScript) + Tailwind
- **Auth.js (NextAuth v5)** — Google provider, Internal app
- **Prisma + Postgres**
- **googleapis** — Drive / Sheets / Apps Script
- **Google Apps Script** (`apps-script/`) — the sending engine
- **Recharts** — analytics

## Getting started

See **[SETUP.md](./SETUP.md)** for the full Google Cloud + deploy walkthrough.

```bash
pnpm install
cp .env.example .env.local   # fill in
pnpm db:push
pnpm dev
```

## Project layout

```
apps-script/        Bound Apps Script template (Code.gs + appsscript.json)
prisma/schema.prisma  Data model
src/auth.ts         Auth.js config (Google, Internal scopes)
src/lib/db.ts       Prisma client
src/lib/google.ts   Drive/Sheets/Script client helpers (per-user OAuth)
src/lib/crypto.ts   At-rest encryption + ingest auth
src/app/            Next.js routes (UI + API)
```
