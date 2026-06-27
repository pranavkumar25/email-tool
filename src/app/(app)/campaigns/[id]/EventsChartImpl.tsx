"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "./EventsChart";

// Brand palette: blue carries your sends, then black + red read the
// engagement. Distinguished by hue + dash pattern (never color alone).
const BLUE = "#004FFF";
const AXIS = "#9AA0AD";
const GRID = "#E7E9EE";
const LINE = "#E7E9EE";
const TOOLTIP = {
  borderRadius: 12,
  border: "1px solid #E7E9EE",
  background: "#ffffff",
  boxShadow: "0 16px 40px -12px rgb(5 5 5 / 0.18)",
  fontSize: 12,
} as const;

const SERIES: {
  key: keyof Omit<ChartPoint, "date">;
  label: string;
  color: string;
  dash?: string;
  width: number;
}[] = [
  { key: "OPEN", label: "Opened", color: "#9AA0AD", dash: "6 3", width: 2 },
  { key: "CLICK", label: "Clicked", color: "#FB4B4E", dash: "2 3", width: 2 },
  { key: "REPLY", label: "Replied", color: "#050505", dash: "8 2 2 2", width: 2 },
];

function fmtDate(d: string) {
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

export function EventsChartImpl({ data }: { data: ChartPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-faint">
        No activity yet — events appear here once the campaign starts sending.
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity={0.2} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            fontSize={11}
            tick={{ fill: AXIS }}
            tickLine={false}
            axisLine={{ stroke: LINE }}
          />
          <YAxis
            allowDecimals={false}
            fontSize={11}
            tick={{ fill: AXIS }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "#D4D8E0", strokeWidth: 1 }}
            contentStyle={TOOLTIP}
            labelStyle={{ color: "#050505", fontWeight: 600 }}
            itemStyle={{ color: "#5B616E" }}
          />
          <Legend
            iconType="plainline"
            formatter={(v) => (
              <span style={{ color: "#5B616E", fontSize: 12 }}>{v}</span>
            )}
          />
          <Area
            name="Sent"
            type="monotone"
            dataKey="SENT"
            stroke={BLUE}
            strokeWidth={2.25}
            fill="url(#sentFill)"
            dot={false}
            activeDot={{ r: 3.5, fill: BLUE, strokeWidth: 0 }}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              name={s.label}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={s.width}
              strokeDasharray={s.dash}
              dot={false}
              activeDot={{ r: 3.5, fill: s.color, strokeWidth: 0 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
