/** Sample email templates (UI-first). `gradient` styles the thumbnail. */

export type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  updatedAt: string;
  usageCount: number;
  gradient: string; // tailwind gradient classes for the thumbnail
};

export const templateCategories = [
  "All",
  "Newsletter",
  "Promotion",
  "Announcement",
  "Welcome",
  "Transactional",
  "Event",
] as const;

export const templates: Template[] = [
  { id: "tpl_news_min", name: "Minimal Newsletter", category: "Newsletter", description: "Clean single-column digest", updatedAt: "2026-06-12", usageCount: 142, gradient: "from-indigo-500 to-violet-500" },
  { id: "tpl_promo_sale", name: "Flash Sale", category: "Promotion", description: "Bold hero + countdown", updatedAt: "2026-06-10", usageCount: 98, gradient: "from-rose-500 to-orange-500" },
  { id: "tpl_welcome", name: "Warm Welcome", category: "Welcome", description: "Friendly onboarding intro", updatedAt: "2026-06-08", usageCount: 211, gradient: "from-emerald-500 to-teal-500" },
  { id: "tpl_product", name: "Product Launch", category: "Announcement", description: "Feature spotlight grid", updatedAt: "2026-06-05", usageCount: 76, gradient: "from-sky-500 to-indigo-500" },
  { id: "tpl_event", name: "Event Invite", category: "Event", description: "RSVP with agenda", updatedAt: "2026-05-30", usageCount: 54, gradient: "from-amber-500 to-rose-500" },
  { id: "tpl_receipt", name: "Order Receipt", category: "Transactional", description: "Itemized confirmation", updatedAt: "2026-05-22", usageCount: 320, gradient: "from-slate-500 to-slate-700" },
  { id: "tpl_digest", name: "Weekly Digest", category: "Newsletter", description: "Multi-story roundup", updatedAt: "2026-05-18", usageCount: 134, gradient: "from-violet-500 to-fuchsia-500" },
  { id: "tpl_blackfri", name: "Black Friday", category: "Promotion", description: "High-contrast discount push", updatedAt: "2026-05-12", usageCount: 67, gradient: "from-zinc-700 to-zinc-900" },
  { id: "tpl_reengage", name: "We Miss You", category: "Promotion", description: "Win-back with incentive", updatedAt: "2026-05-04", usageCount: 41, gradient: "from-cyan-500 to-blue-500" },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id);
}
