"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, StatusBadge, cn } from "@/components/ui";

export type CampaignRow = {
  id: string;
  name: string;
  status: string;
  contacts: number;
  created: string;
};

const FILTERS = ["All", "Draft", "Active", "Paused", "Completed"] as const;

export function CampaignsTable({ campaigns }: { campaigns: CampaignRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (filter !== "All" && c.status !== filter.toUpperCase()) return false;
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [campaigns, q, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search campaigns"
            aria-label="Search campaigns"
            className="h-9 w-full rounded-lg border border-line bg-elevated pl-9 pr-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-accent-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                filter === f
                  ? "bg-accent-soft text-accent-600 ring-1 ring-inset ring-accent-600/15"
                  : "text-muted hover:bg-subtle hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-medium uppercase tracking-wide text-faint">
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Contacts</th>
              <th className="px-4 py-2.5 text-right font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-faint"
                >
                  No campaigns match.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className="group transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/campaigns/${c.id}`}
                      className="font-medium text-ink transition-colors group-hover:text-accent-600"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {c.contacts.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-faint">
                    {c.created}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
