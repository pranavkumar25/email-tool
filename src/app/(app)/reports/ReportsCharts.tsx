"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

/**
 * recharts is heavy; defer it so it never lands in the reports route's initial
 * bundle. Skeletons hold the chart heights (no layout shift) until it loads.
 */
export const EngagementChart = dynamic(
  () => import("./ReportsChartsImpl").then((m) => m.EngagementChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-xl" /> },
);

export const AudienceGrowthChart = dynamic(
  () => import("./ReportsChartsImpl").then((m) => m.AudienceGrowthChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full rounded-xl" /> },
);
