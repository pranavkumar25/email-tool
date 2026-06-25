"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input, Select, cn } from "@/components/ui";
import { Modal } from "@/components/Modal";
import {
  FIELD_OPTIONS,
  OP_OPTIONS,
  type SegmentCondition,
} from "@/data/segments";
import { createSegmentAction } from "../actions";

const emptyCondition = (): SegmentCondition => ({
  field: FIELD_OPTIONS[0],
  op: OP_OPTIONS[0],
  value: "",
});

export function CreateSegmentButton({
  variant = "default",
}: {
  variant?: "default" | "empty";
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [match, setMatch] = React.useState<"all" | "any">("all");
  const [conditions, setConditions] = React.useState<SegmentCondition[]>([
    emptyCondition(),
  ]);

  function reset() {
    setName("");
    setDescription("");
    setMatch("all");
    setConditions([emptyCondition()]);
    setError(null);
  }

  function update(i: number, patch: Partial<SegmentCondition>) {
    setConditions((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const cleaned = conditions.filter((c) => c.value.trim() !== "");
    setPending(true);
    setError(null);
    const res = await createSegmentAction({
      name,
      description,
      match,
      conditions: cleaned,
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Failed");
      return;
    }
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <>
      <Button
        size={variant === "empty" ? "md" : "sm"}
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
        Create segment
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create segment"
        description="Dynamic groups that update automatically as subscribers qualify."
        className="max-w-lg"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Highly engaged"
              autoFocus
            />
          </Field>
          <Field label="Description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opened or clicked in the last 30 days"
            />
          </Field>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
              Match
              <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5">
                {(["all", "any"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMatch(m)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium uppercase transition-colors",
                      match === m
                        ? "bg-accent-soft text-accent-700"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              of the conditions
            </div>

            <div className="space-y-2">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Select
                    value={c.field}
                    onChange={(e) => update(i, { field: e.target.value })}
                    className="h-9 flex-1 py-0"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </Select>
                  <Select
                    value={c.op}
                    onChange={(e) => update(i, { op: e.target.value })}
                    className="h-9 flex-1 py-0"
                  >
                    {OP_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </Select>
                  <Input
                    value={c.value}
                    onChange={(e) => update(i, { value: e.target.value })}
                    placeholder="value"
                    className="h-9 flex-1 py-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConditions((cs) =>
                        cs.length > 1 ? cs.filter((_, j) => j !== i) : cs,
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-canvas hover:text-rose-600"
                    aria-label="Remove condition"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setConditions((cs) => [...cs, emptyCondition()])}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-700 transition-colors hover:text-accent-600"
            >
              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
              Add condition
            </button>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create segment"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
