/**
 * Idempotent demo-data seed. Mirrors the old src/data/* sample content so the
 * Audience / Templates / Automations / Forms / Reports pages look alive after
 * the move to real DB queries. Run with: pnpm db:seed
 *
 * Safe to re-run: tags & subscribers upsert by unique key; segments/templates/
 * automations/forms are only created when the user has none yet.
 */
import { PrismaClient } from "@prisma/client";

// Seeds are a one-off admin task — use the direct (non-pooled) connection.
const datasourceUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient(
  datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : undefined,
);
const DAY = 86_400_000;
const now = Date.now();

const FIRST = ["Ada","Liam","Maya","Noah","Priya","Ethan","Sofia","Kai","Elena","Omar","Hana","Lucas","Aria","Diego","Mei","Jonas","Zara","Theo","Ines","Marcus","Yuki","Pablo","Nina","Sam"];
const LAST = ["Lovelace","Carter","Singh","Bennett","Patel","Morales","Rossi","Tanaka","Vasquez","Haddad","Kim","Müller","Novak","Costa","Chen","Berg","Ahmed","Laurent","Silva","Reed","Sato","Gómez","Petrov","Lee"];
const COMPANIES = ["Northwind","Acme Co","Pickcel","Lumen Labs","Vertex","Brightside","Caldera","Monogram","Helio","Tidal","Forge","Onyx"];
const COUNTRIES = ["United States","United Kingdom","India","Germany","Canada","Spain","Japan","Brazil","France","Australia"];
const SOURCES = ["Signup form","CSV import","API","Landing page","Checkout","Webinar"];
const TAG_POOL = ["VIP","Newsletter","Trial","Customer","Lead","Webinar","Beta","Churned"];
const STATUS_CYCLE = ["SUBSCRIBED","SUBSCRIBED","SUBSCRIBED","SUBSCRIBED","PENDING","SUBSCRIBED","UNSUBSCRIBED","SUBSCRIBED","BOUNCED","SUBSCRIBED","SUBSCRIBED","CLEANED"];

const TAGS = [
  { name: "VIP", tone: "accent" },
  { name: "Newsletter", tone: "info" },
  { name: "Trial", tone: "warning" },
  { name: "Customer", tone: "success" },
  { name: "Lead", tone: "neutral" },
  { name: "Webinar", tone: "info" },
  { name: "Beta", tone: "accent" },
  { name: "Churned", tone: "danger" },
];

const SEGMENTS = [
  { name: "Highly engaged", description: "Opened or clicked in the last 30 days", match: "ANY", growthPct: 4.1, conditions: [{ field: "Last opened", op: "is within", value: "30 days" }, { field: "Last clicked", op: "is within", value: "30 days" }] },
  { name: "VIP customers", description: "Tagged VIP with 5+ clicks", match: "ALL", growthPct: 1.8, conditions: [{ field: "Tag", op: "is", value: "VIP" }, { field: "Total clicks", op: "is at least", value: "5" }] },
  { name: "Dormant 90 days", description: "No opens in the last 90 days", match: "ALL", growthPct: -2.3, conditions: [{ field: "Last opened", op: "is before", value: "90 days" }] },
  { name: "Trial — not converted", description: "On trial, no purchase", match: "ALL", growthPct: 9.6, conditions: [{ field: "Tag", op: "is", value: "Trial" }, { field: "Tag", op: "is not", value: "Customer" }] },
  { name: "North America", description: "Subscribers in the US & Canada", match: "ANY", growthPct: 3.2, conditions: [{ field: "Country", op: "is", value: "United States" }, { field: "Country", op: "is", value: "Canada" }] },
  { name: "New this month", description: "Joined in the last 30 days", match: "ALL", growthPct: 12.4, conditions: [{ field: "Subscribed", op: "is within", value: "30 days" }] },
];

const TEMPLATES = [
  { name: "Minimal Newsletter", category: "Newsletter", description: "Clean single-column digest", usageCount: 142, gradient: "from-indigo-500 to-violet-500" },
  { name: "Flash Sale", category: "Promotion", description: "Bold hero + countdown", usageCount: 98, gradient: "from-rose-500 to-orange-500" },
  { name: "Warm Welcome", category: "Welcome", description: "Friendly onboarding intro", usageCount: 211, gradient: "from-emerald-500 to-teal-500" },
  { name: "Product Launch", category: "Announcement", description: "Feature spotlight grid", usageCount: 76, gradient: "from-sky-500 to-indigo-500" },
  { name: "Event Invite", category: "Event", description: "RSVP with agenda", usageCount: 54, gradient: "from-amber-500 to-rose-500" },
  { name: "Order Receipt", category: "Transactional", description: "Itemized confirmation", usageCount: 320, gradient: "from-slate-500 to-slate-700" },
  { name: "Weekly Digest", category: "Newsletter", description: "Multi-story roundup", usageCount: 134, gradient: "from-violet-500 to-fuchsia-500" },
  { name: "We Miss You", category: "Promotion", description: "Win-back with incentive", usageCount: 41, gradient: "from-cyan-500 to-blue-500" },
];

const AUTOMATIONS = [
  { name: "Welcome series", status: "LIVE", trigger: "Subscriber joins", entered: 1840, active: 212, completed: 1503, openRate: 62.4, clickRate: 24.1, steps: [
    { type: "trigger", title: "Joins audience", detail: "When a contact subscribes via any form" },
    { type: "email", title: "Welcome email", detail: "Sent immediately" },
    { type: "delay", title: "Wait 2 days", detail: "" },
    { type: "email", title: "Getting started guide", detail: "Tips + best first actions" },
    { type: "condition", title: "Opened guide?", detail: "Branch on engagement" },
    { type: "email", title: "Case study", detail: "Sent to non-openers after 3 days" },
  ] },
  { name: "Abandoned cart recovery", status: "LIVE", trigger: "Cart abandoned", entered: 920, active: 64, completed: 786, openRate: 54.0, clickRate: 31.8, steps: [
    { type: "trigger", title: "Abandons cart", detail: "No checkout within 1 hour" },
    { type: "delay", title: "Wait 1 hour", detail: "" },
    { type: "email", title: "Did you forget something?", detail: "Cart contents reminder" },
    { type: "delay", title: "Wait 1 day", detail: "" },
    { type: "email", title: "10% off to finish", detail: "Discount incentive" },
  ] },
  { name: "Re-engagement", status: "PAUSED", trigger: "No opens in 60 days", entered: 1340, active: 0, completed: 1180, openRate: 18.2, clickRate: 4.4, steps: [
    { type: "trigger", title: "Goes dormant", detail: "No opens in 60 days" },
    { type: "email", title: "We miss you", detail: "Win-back offer" },
    { type: "delay", title: "Wait 5 days", detail: "" },
    { type: "condition", title: "Re-engaged?", detail: "Opened or clicked" },
    { type: "action", title: "Tag as churned", detail: "If still dormant" },
  ] },
  { name: "Trial onboarding", status: "DRAFT", trigger: "Tag added: Trial", entered: 0, active: 0, completed: 0, openRate: 0, clickRate: 0, steps: [
    { type: "trigger", title: "Trial starts", detail: "Tag 'Trial' added" },
    { type: "email", title: "Day 0 — Activate", detail: "" },
    { type: "delay", title: "Wait 3 days", detail: "" },
    { type: "email", title: "Day 3 — Power features", detail: "" },
  ] },
];

const FORMS = [
  { name: "Newsletter footer", type: "EMBEDDED", status: "LIVE", views: 18420, submissions: 1342, audience: "Newsletter" },
  { name: "Exit-intent 10% off", type: "POPUP", status: "LIVE", views: 9610, submissions: 884, audience: "Lead" },
  { name: "Webinar registration", type: "LANDING", status: "LIVE", views: 4205, submissions: 1010, audience: "Webinar" },
  { name: "Ebook download", type: "LANDING", status: "PAUSED", views: 2870, submissions: 612, audience: "Lead" },
  { name: "Beta waitlist", type: "EMBEDDED", status: "DRAFT", views: 0, submissions: 0, audience: "Beta" },
];

async function seedUser(user) {
  const userId = user.id;

  // Tags
  for (const t of TAGS) {
    await prisma.tag.upsert({
      where: { userId_name: { userId, name: t.name } },
      create: { userId, name: t.name, tone: t.tone },
      update: { tone: t.tone },
    });
  }

  // Subscribers
  for (let i = 0; i < FIRST.length; i++) {
    const first = FIRST[i];
    const last = LAST[i % LAST.length];
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const opens = status === "SUBSCRIBED" ? ((i * 7) % 40) + 3 : (i * 2) % 6;
    const clicks = Math.max(0, Math.round(opens * 0.32) - (i % 3));
    const rating = Math.max(1, Math.min(5, Math.round(opens / 9) + 1));
    const company = COMPANIES[i % COMPANIES.length];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`;
    const tagNames = [TAG_POOL[i % TAG_POOL.length], ...(i % 3 === 0 ? [TAG_POOL[(i + 3) % TAG_POOL.length]] : [])];
    const tagConnect = tagNames.map((name) => ({
      where: { userId_name: { userId, name } },
      create: { userId, name },
    }));

    await prisma.subscriber.upsert({
      where: { userId_email: { userId, email } },
      create: {
        userId, email, firstName: first, lastName: last, company,
        country: COUNTRIES[i % COUNTRIES.length], status, rating, opens, clicks,
        source: SOURCES[i % SOURCES.length],
        subscribedAt: new Date(now - (((i * 13) % 180) + 2) * DAY),
        lastActivityAt: new Date(now - ((i * 3) % 28) * DAY),
        tags: { connectOrCreate: tagConnect },
      },
      update: {
        firstName: first, lastName: last, company, status, rating, opens, clicks,
        tags: { connectOrCreate: tagConnect },
      },
    });
  }

  if ((await prisma.segment.count({ where: { userId } })) === 0) {
    for (const s of SEGMENTS) {
      await prisma.segment.create({
        data: { userId, name: s.name, description: s.description, match: s.match, conditions: s.conditions, growthPct: s.growthPct },
      });
    }
  }

  if ((await prisma.template.count({ where: { userId } })) === 0) {
    for (const t of TEMPLATES) {
      await prisma.template.create({
        data: {
          userId, name: t.name, category: t.category, description: t.description,
          subject: `${t.name} — your update`,
          bodyHtml: `<h1>${t.name}</h1><p>Hi {{firstName}},</p><p>${t.description}.</p>`,
          gradient: t.gradient, usageCount: t.usageCount,
        },
      });
    }
  }

  if ((await prisma.automation.count({ where: { userId } })) === 0) {
    for (const a of AUTOMATIONS) {
      await prisma.automation.create({
        data: {
          userId, name: a.name, status: a.status, trigger: a.trigger,
          entered: a.entered, active: a.active, completed: a.completed,
          openRate: a.openRate, clickRate: a.clickRate,
          steps: { create: a.steps.map((s, i) => ({ stepOrder: i, type: s.type, title: s.title, detail: s.detail })) },
        },
      });
    }
  }

  if ((await prisma.form.count({ where: { userId } })) === 0) {
    for (const f of FORMS) {
      await prisma.form.create({
        data: { userId, name: f.name, type: f.type, status: f.status, views: f.views, submissions: f.submissions, audience: f.audience },
      });
    }
  }
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  if (users.length === 0) {
    console.log("No users found — sign in once, then re-run the seed.");
    return;
  }
  for (const user of users) {
    await seedUser(user);
    console.log(`Seeded demo data for ${user.email ?? user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
