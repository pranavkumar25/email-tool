"use client";

import * as React from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Badge, Card, EmptyState, SearchInput, cn } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Template } from "@/data/templates";

export function TemplatesGallery({
  templates,
  categories,
}: {
  templates: Template[];
  categories: string[];
}) {
  const [active, setActive] = React.useState("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (active !== "All" && t.category !== active) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [templates, active, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex flex-wrap gap-1 px-1">
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-accent-soft text-accent-700 ring-1 ring-inset ring-accent-600/15"
                    : "text-muted hover:bg-canvas hover:text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          wrapperClassName="w-full lg:max-w-xs"
          aria-label="Search templates"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={DocumentDuplicateIcon}
          title="No templates found"
          description="Try a different category or search term."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card
              key={t.id}
              className="group overflow-hidden transition-shadow hover:shadow-pop"
            >
              {/* Thumbnail */}
              <div
                className={cn(
                  "relative flex h-32 items-center justify-center bg-gradient-to-br",
                  t.gradient,
                )}
              >
                <span className="text-3xl font-bold text-white/90">
                  {t.name[0]}
                </span>
                {/* Hover actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/30 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                  <ThumbAction icon={EyeIcon} label="Preview" />
                  <ThumbAction icon={PencilSquareIcon} label="Edit" />
                  <ThumbAction icon={DocumentDuplicateIcon} label="Duplicate" />
                </div>
              </div>
              {/* Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-medium text-ink">{t.name}</h3>
                  <Badge tone="neutral">{t.category}</Badge>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted">
                  {t.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-faint tabular-nums">
                  <span>Used {t.usageCount}×</span>
                  <span>Updated {formatDate(t.updatedAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ThumbAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-ink shadow-sm transition-transform hover:scale-105"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
