"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input, Select } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { FORM_TYPES, type FormType } from "@/data/forms";
import { createFormAction } from "./actions";

export function CreateFormButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await createFormAction({
      name: String(fd.get("name") ?? ""),
      type: String(fd.get("type") ?? "Embedded") as FormType,
      audience: String(fd.get("audience") ?? ""),
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
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4" />
        Create form
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create form"
        description="A signup form, popup, or landing page that grows your audience."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name" required>
            <Input name="name" placeholder="Newsletter footer" autoFocus required />
          </Field>
          <Field label="Type">
            <Select name="type" defaultValue="Embedded">
              {FORM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Add submitters to tag"
            hint="New subscribers from this form get this tag (created if needed)."
          >
            <Input name="audience" placeholder="e.g. Newsletter" />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create form"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
