/** Shared view-model types for templates. `gradient` styles the thumbnail. */

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

/** Categories offered when creating a template (excludes the "All" filter). */
export const TEMPLATE_CATEGORIES = templateCategories.filter(
  (c) => c !== "All",
) as Exclude<(typeof templateCategories)[number], "All">[];

/** Thumbnail gradient choices, cycled when creating templates. Tuned to the
 *  inboxrow world — pine, marigold, and warm earth, with a couple of cools. */
export const TEMPLATE_GRADIENTS = [
  "from-accent-600 to-accent-400",
  "from-signal-600 to-amber-400",
  "from-teal-600 to-emerald-400",
  "from-sky-600 to-teal-500",
  "from-amber-600 to-rose-400",
  "from-emerald-700 to-lime-400",
  "from-stone-500 to-stone-300",
];
