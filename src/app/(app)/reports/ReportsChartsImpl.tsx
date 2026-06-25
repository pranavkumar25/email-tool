"use client";

import * as React from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = "#8b909c";
const GRID = "#eef0f3";
const TOOLTIP = {
  borderRadius: 10,
  border: "1px solid #e6e7eb",
  background: "#ffffff",
  boxShadow: "0 12px 32px -8px rgb(16 24 40 / 0.18)",
  fontSize: 12,
} as const;

function fmtDate(d: string) {
  const [, m, day] = d.split("-");
  return `${m}/${day}`;
}

/** Render nothing on the server; recharts needs a real width to lay out. */
function useMounted() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => setM(true), []);
  return m;
}

export function EngagementChart({
  data,
}: {
  data: { date: string; sent: number; opens: number; clicks: number }[];
}) {
  const mounted = useMounted();
  if (!mounted) return <div className="h-[300px]" />;
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="repSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={{ stroke: "#e6e7eb" }} />
          <YAxis allowDecimals={false} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={false} width={34} />
          <Tooltip cursor={{ stroke: "#d3d5db" }} contentStyle={TOOLTIP} labelStyle={{ color: "#16181d", fontWeight: 600 }} itemStyle={{ color: "#5a5f6b" }} />
          <Legend iconType="plainline" formatter={(v) => <span style={{ color: "#5a5f6b", fontSize: 12 }}>{v}</span>} />
          <Area name="Sent" type="monotone" dataKey="sent" stroke="#4f46e5" strokeWidth={2.25} fill="url(#repSent)" dot={false} activeDot={{ r: 3.5, fill: "#4f46e5", strokeWidth: 0 }} />
          <Line name="Opens" type="monotone" dataKey="opens" stroke="#818cf8" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 3.5, fill: "#818cf8", strokeWidth: 0 }} />
          <Line name="Clicks" type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="2 3" dot={false} activeDot={{ r: 3.5, fill: "#0ea5e9", strokeWidth: 0 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AudienceGrowthChart({
  data,
}: {
  data: { date: string; gained: number; lost: number }[];
}) {
  const mounted = useMounted();
  if (!mounted) return <div className="h-[260px]" />;
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={{ stroke: "#e6e7eb" }} />
          <YAxis allowDecimals={false} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={false} width={34} />
          <Tooltip cursor={{ fill: "#f1f2f5" }} contentStyle={TOOLTIP} labelStyle={{ color: "#16181d", fontWeight: 600 }} itemStyle={{ color: "#5a5f6b" }} />
          <Legend formatter={(v) => <span style={{ color: "#5a5f6b", fontSize: 12 }}>{v}</span>} />
          <Bar name="Subscribed" dataKey="gained" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
          <Bar name="Unsubscribed" dataKey="lost" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
