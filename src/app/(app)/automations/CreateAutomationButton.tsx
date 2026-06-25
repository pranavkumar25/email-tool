"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { createAutomationAction } from "./actions";

export function CreateAutomationButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await createAutomationAction({
      name: String(fd.get("name") ?? ""),
      trigger: String(fd.get("trigger") ?? ""),
    });
    // On success the action redirects; we only get here on validation error.
    setPending(false);
    if (res && !res.ok) {
      setError(res.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
        Create automation
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create automation"
        description="Start a blank trigger-based journey, then add steps."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name" required>
            <Input name="name" placeholder="Welcome series" autoFocus required />
          </Field>
          <Field label="Trigger" hint="What starts a contact on this journey.">
            <Input name="trigger" placeholder="Subscriber joins" />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create automation"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
