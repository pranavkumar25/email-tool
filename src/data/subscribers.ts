/** Shared view-model types for the audience UI. Data comes from @/server/audience. */

export type SubscriberStatus =
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "PENDING"
  | "BOUNCED"
  | "CLEANED";

export type Subscriber = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  status: SubscriberStatus;
  rating: number; // 1–5 engagement
  opens: number;
  clicks: number;
  tags: string[];
  source: string;
  subscribedAt: string; // ISO
  lastActivityAt: string; // ISO
};

export type AudienceStats = {
  total: number;
  subscribed: number;
  unsubscribed: number;
  pending: number;
  bounced: number;
  avgOpenRate: number;
  avgClickRate: number;
  growthLast30: number;
};
