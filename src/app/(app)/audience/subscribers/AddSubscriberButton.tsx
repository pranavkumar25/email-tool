"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { addSubscriberAction } from "../actions";

export function AddSubscriberButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await addSubscriberAction({
      email: String(fd.get("email") ?? ""),
      firstName: String(fd.get("firstName") ?? "") || null,
      lastName: String(fd.get("lastName") ?? "") || null,
      company: String(fd.get("company") ?? "") || null,
      country: String(fd.get("country") ?? "") || null,
      source: "Manual",
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
        Add subscriber
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add subscriber"
        description="Add a single contact to your audience."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" required>
            <Input name="email" type="email" required placeholder="ada@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <Input name="firstName" placeholder="Ada" />
            </Field>
            <Field label="Last name">
              <Input name="lastName" placeholder="Lovelace" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <Input name="company" placeholder="Acme Co" />
            </Field>
            <Field label="Country">
              <Input name="country" placeholder="United States" />
            </Field>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add subscriber"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
