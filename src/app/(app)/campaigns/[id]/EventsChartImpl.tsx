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

// Distinguished by hue + dash pattern (never color alone).
const SERIES: {
  key: keyof Omit<ChartPoint, "date">;
  label: string;
  color: string;
  dash?: string;
  width: number;
}[] = [
  { key: "OPEN", label: "Opened", color: "#818cf8", dash: "6 3", width: 2 },
  { key: "CLICK", label: "Clicked", color: "#0ea5e9", dash: "2 3", width: 2 },
  { key: "REPLY", label: "Replied", color: "#10b981", dash: "8 2 2 2", width: 2 },
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
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            fontSize={11}
            tick={{ fill: "#8b909c" }}
            tickLine={false}
            axisLine={{ stroke: "#e6e7eb" }}
          />
          <YAxis
            allowDecimals={false}
            fontSize={11}
            tick={{ fill: "#8b909c" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "#d3d5db", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e6e7eb",
              background: "#ffffff",
              boxShadow: "0 12px 32px -8px rgb(16 24 40 / 0.18)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#16181d", fontWeight: 600 }}
            itemStyle={{ color: "#5a5f6b" }}
          />
          <Legend
            iconType="plainline"
            formatter={(v) => (
              <span style={{ color: "#5a5f6b", fontSize: 12 }}>{v}</span>
            )}
          />
          <Area
            name="Sent"
            type="monotone"
            dataKey="SENT"
            stroke="#4f46e5"
            strokeWidth={2.25}
            fill="url(#sentFill)"
            dot={false}
            activeDot={{ r: 3.5, fill: "#4f46e5", strokeWidth: 0 }}
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
