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

// Brand palette: blue carries your sends; black + red read the engagement,
// distinguished by hue + dash pattern (never color alone).
const BLUE = "#004FFF";
const RED = "#FB4B4E";
const INK = "#050505";
const GRAY = "#9AA0AD";
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
              <stop offset="0%" stopColor={BLUE} stopOpacity={0.2} />
              <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmtDate} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={{ stroke: LINE }} />
          <YAxis allowDecimals={false} fontSize={11} tick={{ fill: AXIS }} tickLine={false} axisLine={false} width={34} />
          <Tooltip cursor={{ stroke: "#D4D8E0" }} contentStyle={TOOLTIP} labelStyle={{ color: "#050505", fontWeight: 600 }} itemStyle={{ color: "#5B616E" }} />
          <Legend iconType="plainline" formatter={(v) => <span style={{ color: "#5B616E", fontSize: 12 }}>{v}</span>} />
          <Area name="Sent" type="monotone" dataKey="sent" stroke={BLUE} strokeWidth={2.25} fill="url(#repSent)" dot={false} activeDot={{ r: 3.5, fill: BLUE, strokeWidth: 0 }} />
          <Line name="Opens" type="monotone" dataKey="opens" stroke={GRAY} strokeWidth={2} strokeDasharray="6 3" dot={false} activeDot={{ r: 3.5, fill: GRAY, strokeWidth: 0 }} />
          <Line name="Clicks" type="monotone" dataKey="clicks" stroke={RED} strokeWidth={2} strokeDasharray="2 3" dot={false} activeDot={{ r: 3.5, fill: RED, strokeWidth: 0 }} />
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
          <Tooltip cursor={{ fill: "#F1F3F6" }} contentStyle={TOOLTIP} labelStyle={{ color: "#050505", fontWeight: 600 }} itemStyle={{ color: "#5B616E" }} />
          <Legend formatter={(v) => <span style={{ color: "#5B616E", fontSize: 12 }}>{v}</span>} />
          <Bar name="Subscribed" dataKey="gained" fill={BLUE} radius={[3, 3, 0, 0]} maxBarSize={14} />
          <Bar name="Unsubscribed" dataKey="lost" fill={RED} radius={[3, 3, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
