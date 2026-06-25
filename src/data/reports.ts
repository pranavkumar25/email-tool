/** Sample analytics data for the Reports area (UI-first). Deterministic. */

const DAY = 86_400_000;
const BASE = Date.UTC(2026, 5, 22);
const dayStr = (daysAgo: number) =>
  new Date(BASE - daysAgo * DAY).toISOString().slice(0, 10);

export const engagementSeries = Array.from({ length: 30 }, (_, i) => {
  const day = 29 - i;
  const sent = 800 + ((i * 37) % 220);
  return {
    date: dayStr(day),
    sent,
    opens: Math.round(sent * (0.42 + ((i % 5) * 0.02))),
    clicks: Math.round(sent * (0.11 + ((i % 4) * 0.01))),
  };
});

export const audienceGrowthSeries = Array.from({ length: 30 }, (_, i) => {
  const day = 29 - i;
  return {
    date: dayStr(day),
    gained: 28 + ((i * 5) % 22),
    lost: 4 + (i % 6),
  };
});

export const topLinks = [
  { url: "getpickcel.com/pricing", clicks: 1284, ctr: 8.9 },
  { url: "getpickcel.com/case-studies", clicks: 962, ctr: 6.7 },
  { url: "getpickcel.com/demo", clicks: 738, ctr: 5.1 },
  { url: "getpickcel.com/blog/deliverability", clicks: 511, ctr: 3.5 },
  { url: "getpickcel.com/changelog", clicks: 388, ctr: 2.7 },
];

export const topCampaigns = [
  { name: "June product update", sent: 12480, openRate: 58.1, clickRate: 19.4 },
  { name: "Summer sale — 20% off", sent: 9820, openRate: 49.7, clickRate: 22.8 },
  { name: "Webinar invite: scaling email", sent: 4205, openRate: 61.2, clickRate: 27.0 },
  { name: "Feature spotlight: automations", sent: 8740, openRate: 44.3, clickRate: 14.1 },
  { name: "Re-engagement: we miss you", sent: 3310, openRate: 21.9, clickRate: 5.2 },
];

export const deviceBreakdown = [
  { label: "Desktop", value: 52 },
  { label: "Mobile", value: 41 },
  { label: "Tablet", value: 7 },
];

export const locationBreakdown = [
  { label: "United States", value: 38 },
  { label: "United Kingdom", value: 16 },
  { label: "India", value: 12 },
  { label: "Germany", value: 9 },
  { label: "Canada", value: 7 },
  { label: "Other", value: 18 },
];

export const deliverability = {
  delivered: 98.4,
  bounceRate: 1.6,
  spamRate: 0.04,
  unsubscribeRate: 0.21,
};

export const reportTotals = {
  sent: 248_900,
  openRate: 48.2,
  clickRate: 12.7,
  revenue: 184_300,
};
