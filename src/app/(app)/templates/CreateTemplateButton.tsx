"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { TEMPLATE_CATEGORIES } from "@/data/templates";
import { createTemplateAction } from "./actions";

export function CreateTemplateButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await createTemplateAction({
      name: String(fd.get("name") ?? ""),
      category: String(fd.get("category") ?? "Newsletter"),
      description: String(fd.get("description") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      bodyHtml: String(fd.get("bodyHtml") ?? ""),
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
        Create template
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create template"
        description="Save a reusable email design for campaigns and automations."
        className="max-w-lg"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" required>
              <Input name="name" placeholder="Minimal Newsletter" autoFocus required />
            </Field>
            <Field label="Category">
              <Select name="category" defaultValue="Newsletter">
                {TEMPLATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <Input name="description" placeholder="Clean single-column digest" />
          </Field>
          <Field label="Subject">
            <Input name="subject" placeholder="Your monthly update from {{company}}" />
          </Field>
          <Field label="Body (HTML)" hint="Used to prefill the campaign composer.">
            <Textarea
              name="bodyHtml"
              className="min-h-[140px] font-mono text-[13px]"
              placeholder="<h1>Hello {{firstName}}</h1><p>…</p>"
            />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create template"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
