"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UsersIcon,
  TagIcon,
  FunnelIcon,
  NoSymbolIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Avatar,
  Tag,
  Progress,
  StatusBadge,
  EmptyState,
  SearchInput,
  Select,
  Checkbox,
  Button,
  Field,
  Input,
  cn,
} from "@/components/ui";
import { Modal } from "@/components/Modal";
import { relativeTime } from "@/lib/utils";
import type { Subscriber, SubscriberStatus } from "@/data/subscribers";
import { setSubscriberStatusAction, tagSubscribersAction } from "../actions";

type SortKey = "recent" | "newest" | "opens";

const STATUS_FILTERS: { label: string; value: "ALL" | SubscriberStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Subscribed", value: "SUBSCRIBED" },
  { label: "Pending", value: "PENDING" },
  { label: "Unsubscribed", value: "UNSUBSCRIBED" },
  { label: "Bounced", value: "BOUNCED" },
];

const fullName = (s: Subscriber) => `${s.firstName} ${s.lastName}`;

export function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"ALL" | SubscriberStatus>("ALL");
  const [sort, setSort] = React.useState<SortKey>("recent");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [pending, setPending] = React.useState(false);
  const [tagModal, setTagModal] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = subscribers.filter((s) => {
      if (status === "BOUNCED") {
        if (s.status !== "BOUNCED" && s.status !== "CLEANED") return false;
      } else if (status !== "ALL" && s.status !== status) {
        return false;
      }
      if (!q) return true;
      return (
        fullName(s).toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q)
      );
    });

    const sorted = [...rows];
    if (sort === "recent") {
      sorted.sort(
        (a, b) => +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt),
      );
    } else if (sort === "newest") {
      sorted.sort(
        (a, b) => +new Date(b.subscribedAt) - +new Date(a.subscribedAt),
      );
    } else {
      sorted.sort((a, b) => b.opens - a.opens);
    }
    return sorted;
  }, [subscribers, query, status, sort]);

  // Keep selection scoped to currently-visible rows.
  const filteredIds = React.useMemo(
    () => new Set(filtered.map((s) => s.id)),
    [filtered],
  );
  const visibleSelected = React.useMemo(
    () => filtered.filter((s) => selected.has(s.id)),
    [filtered, selected],
  );
  const allSelected =
    filtered.length > 0 && visibleSelected.length === filtered.length;
  const someSelected = visibleSelected.length > 0 && !allSelected;

  const headerRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerRef.current) headerRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const selectedIds = React.useMemo(
    () => visibleSelected.map((s) => s.id),
    [visibleSelected],
  );

  async function onUnsubscribe() {
    if (selectedIds.length === 0) return;
    setPending(true);
    await setSubscriberStatusAction(selectedIds, "UNSUBSCRIBED");
    setPending(false);
    clearSelection();
    router.refresh();
  }

  async function onApplyTag(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("tag") ?? "").trim();
    if (!name || selectedIds.length === 0) return;
    setPending(true);
    await tagSubscribersAction(selectedIds, name);
    setPending(false);
    setTagModal(false);
    clearSelection();
    router.refresh();
  }

  function onExport() {
    const header = [
      "email", "firstName", "lastName", "company", "country",
      "status", "opens", "clicks", "tags", "source", "subscribedAt",
    ];
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [header.join(",")];
    for (const s of visibleSelected) {
      lines.push(
        [
          s.email, s.firstName, s.lastName, s.company, s.country,
          s.status, String(s.opens), String(s.clicks),
          s.tags.join("; "), s.source, s.subscribedAt,
        ]
          .map((v) => esc(String(v)))
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or company…"
            wrapperClassName="w-full sm:max-w-xs"
            aria-label="Search subscribers"
          />
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-xs">
            {STATUS_FILTERS.map((f) => {
              const active = status === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatus(f.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-accent-soft text-accent-700 ring-1 ring-inset ring-accent-600/15"
                      : "text-muted hover:bg-canvas hover:text-ink",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-4 w-4 shrink-0 text-faint" strokeWidth={2} />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort subscribers"
            className="h-9 w-44 py-0"
          >
            <option value="recent">Recently active</option>
            <option value="newest">Newest</option>
            <option value="opens">Most opens</option>
          </Select>
        </div>
      </div>

      {/* Bulk-action bar */}
      {visibleSelected.length > 0 && (
        <div className="sticky top-3 z-10 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-accent-300 bg-accent-soft px-3 py-2 shadow-card">
            <button
              type="button"
              onClick={clearSelection}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-accent-700 transition-colors hover:bg-accent-100"
              aria-label="Clear selection"
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
            <span className="text-sm font-medium tabular-nums text-accent-700">
              {visibleSelected.length} selected
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pending}
                onClick={() => setTagModal(true)}
              >
                <TagIcon className="h-4 w-4" strokeWidth={2} />
                Add tag
              </Button>
              <Button variant="secondary" size="sm" onClick={onExport}>
                <ArrowDownTrayIcon className="h-4 w-4" strokeWidth={2} />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={onUnsubscribe}
              >
                <NoSymbolIcon
                  className="h-4 w-4 text-rose-600"
                  strokeWidth={2}
                />
                <span className="text-rose-700">Unsubscribe</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No subscribers found"
            description="Try a different search term or clear your filters to see everyone in your audience."
            className="border-0 shadow-none"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                  <th className="w-10 py-2.5 pl-4 pr-2">
                    <Checkbox
                      ref={headerRef}
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all subscribers"
                    />
                  </th>
                  <th className="px-3 py-2.5 font-medium">Subscriber</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Tags</th>
                  <th className="px-3 py-2.5 font-medium">Engagement</th>
                  <th className="px-3 py-2.5 font-medium">Country</th>
                  <th className="px-3 py-2.5 pr-4 text-right font-medium">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {filtered.map((s) => {
                  const isSelected = selected.has(s.id);
                  const extraTags = s.tags.length - 2;
                  return (
                    <tr
                      key={s.id}
                      className={cn(
                        "group transition-colors hover:bg-canvas",
                        isSelected && "bg-accent-soft/40",
                      )}
                    >
                      <td className="py-3 pl-4 pr-2 align-middle">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleOne(s.id)}
                          aria-label={`Select ${fullName(s)}`}
                        />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar name={fullName(s)} size="md" />
                          <div className="min-w-0">
                            <Link
                              href={`/audience/subscribers/${s.id}`}
                              className="block truncate font-medium text-ink transition-colors hover:text-accent-700"
                            >
                              {fullName(s)}
                            </Link>
                            <div className="truncate text-xs text-muted">
                              {s.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex flex-wrap items-center gap-1">
                          {s.tags.slice(0, 2).map((t) => (
                            <Tag key={t}>{t}</Tag>
                          ))}
                          {extraTags > 0 && (
                            <span className="text-xs font-medium text-faint">
                              +{extraTags}
                            </span>
                          )}
                          {s.tags.length === 0 && (
                            <span className="text-xs text-faint">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="w-32 max-w-full">
                          <Progress value={s.rating * 20} />
                          <div className="mt-1 text-xs tabular-nums text-muted">
                            {s.opens} opens · {s.clicks} clicks
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle text-muted">
                        {s.country}
                      </td>
                      <td className="px-3 py-3 pr-4 text-right align-middle text-muted tabular-nums">
                        {relativeTime(s.subscribedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {filtered.length > 0 && (
        <p className="px-1 text-xs text-faint tabular-nums">
          Showing {filtered.length} of {subscribers.length} subscribers
        </p>
      )}

      <Modal
        open={tagModal}
        onClose={() => setTagModal(false)}
        title="Add tag"
        description={`Apply a tag to ${selectedIds.length} subscriber${selectedIds.length === 1 ? "" : "s"}.`}
      >
        <form onSubmit={onApplyTag} className="space-y-4">
          <Field label="Tag name" required>
            <Input name="tag" placeholder="VIP" autoFocus required />
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setTagModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Applying…" : "Apply tag"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
