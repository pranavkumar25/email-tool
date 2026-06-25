/** Shared view-model types for segments. Data comes from @/server/audience. */

export type SegmentCondition = {
  field: string;
  op: string;
  value: string;
};

export type Segment = {
  id: string;
  name: string;
  description: string;
  count: number;
  match: "all" | "any";
  conditions: SegmentCondition[];
  updatedAt: string; // ISO date
  growthPct: number;
};

export const FIELD_OPTIONS = [
  "Tag",
  "Country",
  "Last opened",
  "Last clicked",
  "Total opens",
  "Total clicks",
  "Subscribed",
  "Source",
  "Company",
];

export const OP_OPTIONS = [
  "is",
  "is not",
  "is at least",
  "is at most",
  "is within",
  "is before",
  "contains",
];
