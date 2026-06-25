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

/** Thumbnail gradient choices, cycled when creating templates. */
export const TEMPLATE_GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-indigo-500",
  "from-amber-500 to-rose-500",
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
];
