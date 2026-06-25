/** Shared view-model types for tags. `tone` maps to a UI Badge/IconTile tone. */

export type TagTone =
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type TagItem = {
  id: string;
  name: string;
  count: number;
  tone: TagTone;
  createdAt: string;
};

/** Tones offered when creating a tag, in a stable order. */
export const TAG_TONES: TagTone[] = [
  "accent",
  "info",
  "success",
  "warning",
  "danger",
  "neutral",
];
