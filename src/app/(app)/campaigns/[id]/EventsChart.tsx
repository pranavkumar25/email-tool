"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

export type ChartPoint = {
  date: string;
  SENT: number;
  OPEN: number;
  CLICK: number;
  REPLY: number;
};

/**
 * recharts is ~hundreds of KB; defer it so it never blocks the detail page's
 * initial render. A shimmer skeleton holds the exact chart height (no layout
 * shift) until the library and data are ready.
 */
const Impl = dynamic(
  () => import("./EventsChartImpl").then((m) => m.EventsChartImpl),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />,
  },
);

export function EventsChart({ data }: { data: ChartPoint[] }) {
  return <Impl data={data} />;
}
