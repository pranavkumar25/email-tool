"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input, Select } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { STEP_TYPES, type StepType } from "@/data/automations";
import { addAutomationStepAction } from "../actions";

export function AddStepButton({ automationId }: { automationId: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await addAutomationStepAction(automationId, {
      type: String(fd.get("type") ?? "email") as StepType,
      title: String(fd.get("title") ?? ""),
      detail: String(fd.get("detail") ?? ""),
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Failed");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface/60 px-4 py-4 text-sm font-medium text-muted transition-colors hover:border-accent-300 hover:bg-accent-soft/40 hover:text-accent-700"
      >
        <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
        Add step
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add step"
        description="Add a step to the end of this journey."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Type">
            <Select name="type" defaultValue="email">
              {STEP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Title" required>
            <Input name="title" placeholder="Send follow-up email" autoFocus required />
          </Field>
          <Field label="Detail">
            <Input name="detail" placeholder="Optional description" />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add step"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
