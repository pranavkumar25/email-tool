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
              <stop offset="0%" stopColor="#1c7a59" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#1c7a59" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={{ stroke: LINE }} />
          <YAxis allowDecimals={false} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={false} width={34} />
          <Tooltip cursor={{ stroke: "#cad0c6" }} contentStyle={TOOLTIP} labelStyle={{ color: "#15201c", fontWeight: 600 }} itemStyle={{ color: "#586059" }} />
          <Legend iconType="plainline" formatter={(v) => <span style={{ color: "#586059", fontSize: 12 }}>{v}</span>} />
          <Area name="Sent" type="monotone" dataKey="sent" stroke="#136548" strokeWidth={2.25} fill="url(#repSent)" dot={false} activeDot={{ r: 3.5, fill: "#136548", strokeWidth: 0 }} />
          <Line name="Opens" type="monotone" dataKey="opens" stroke="#dd8e22" strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 3.5, fill: "#dd8e22", strokeWidth: 0 }} />
          <Line name="Clicks" type="monotone" dataKey="clicks" stroke="#0284c7" strokeWidth={2} strokeDasharray="2 3" dot={false} activeDot={{ r: 3.5, fill: "#0284c7", strokeWidth: 0 }} />
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
          <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={{ stroke: LINE }} />
          <YAxis allowDecimals={false} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={false} width={34} />
          <Tooltip cursor={{ fill: "#e9ece7" }} contentStyle={TOOLTIP} labelStyle={{ color: "#15201c", fontWeight: 600 }} itemStyle={{ color: "#586059" }} />
          <Legend formatter={(v) => <span style={{ color: "#586059", fontSize: 12 }}>{v}</span>} />
          <Bar name="Subscribed" dataKey="gained" fill="#136548" radius={[3, 3, 0, 0]} maxBarSize={14} />
          <Bar name="Unsubscribed" dataKey="lost" fill="#e11d48" radius={[3, 3, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
