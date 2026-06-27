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

// Chart palette, tuned to the brand: pine for your sends, then warm + cool
// hues for engagement. Distinguished by hue + dash pattern (never color alone).
const AXIS = "#869089";
const GRID = "#e3e7df";
const LINE = "#e0e4dd";
const TOOLTIP = {
  borderRadius: 12,
  border: "1px solid #e0e4dd",
  background: "#ffffff",
  boxShadow: "0 16px 40px -12px rgb(21 32 28 / 0.22)",
  fontSize: 12,
} as const;

const SERIES: {
  key: keyof Omit<ChartPoint, "date">;
  label: string;
  color: string;
  dash?: string;
  width: number;
}[] = [
  { key: "OPEN", label: "Opened", color: "#dd8e22", dash: "6 3", width: 2 },
  { key: "CLICK", label: "Clicked", color: "#0284c7", dash: "2 3", width: 2 },
  { key: "REPLY", label: "Replied", color: "#7c5cff", dash: "8 2 2 2", width: 2 },
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
              <stop offset="0%" stopColor="#1c7a59" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#1c7a59" stopOpacity={0} />
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
            cursor={{ stroke: "#cad0c6", strokeWidth: 1 }}
            contentStyle={TOOLTIP}
            labelStyle={{ color: "#15201c", fontWeight: 600 }}
            itemStyle={{ color: "#586059" }}
          />
          <Legend
            iconType="plainline"
            formatter={(v) => (
              <span style={{ color: "#586059", fontSize: 12 }}>{v}</span>
            )}
          />
          <Area
            name="Sent"
            type="monotone"
            dataKey="SENT"
            stroke="#136548"
            strokeWidth={2.25}
            fill="url(#sentFill)"
            dot={false}
            activeDot={{ r: 3.5, fill: "#136548", strokeWidth: 0 }}
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
