"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Select,
  cn,
} from "@/components/ui";
import { Modal } from "@/components/Modal";
import { formatDate, formatNumber } from "@/lib/utils";
import { type TagItem, type TagTone, TAG_TONES } from "@/data/tags";
import { createTagAction, deleteTagAction } from "../actions";

const DOT_TONE: Record<TagTone, string> = {
  accent: "bg-accent-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-faint",
};

export function TagsClient({ tags }: { tags: TagItem[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const tone = String(fd.get("tone") ?? "neutral");
    setPending(true);
    setError(null);
    const res = await createTagAction(name, tone);
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Failed");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete the tag “${name}”? Subscribers keep their other tags.`))
      return;
    await deleteTagAction(id);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted tabular-nums">
          {tags.length} {tags.length === 1 ? "tag" : "tags"}
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
          Create tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="No tags yet"
          description="Create tags to label and organize subscribers — then filter and segment by them."
          action={
            <Button onClick={() => setOpen(true)}>
              <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
              Create tag
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium uppercase tracking-wide text-faint">
                <th className="px-4 py-2.5 font-medium">Tag</th>
                <th className="px-4 py-2.5 text-right font-medium">Subscribers</th>
                <th className="px-4 py-2.5 text-right font-medium">Created</th>
                <th className="w-px px-4 py-2.5 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {tags.map((tag) => (
                <tr key={tag.id} className="group transition-colors hover:bg-canvas">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 shrink-0 rounded-full",
                          DOT_TONE[tag.tone],
                        )}
                        aria-hidden
                      />
                      <span className="font-medium text-ink">{tag.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {formatNumber(tag.count)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {formatDate(tag.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 text-faint opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100"
                      aria-label={`Delete ${tag.name}`}
                      onClick={() => onDelete(tag.id, tag.name)}
                    >
                      <TrashIcon className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create tag"
        description="Tags label subscribers for filtering and segmentation."
      >
        <form onSubmit={onCreate} className="space-y-4">
          <Field label="Name" required>
            <Input name="name" placeholder="VIP" autoFocus required />
          </Field>
          <Field label="Color">
            <Select name="tone" defaultValue="accent">
              {TAG_TONES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create tag"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
