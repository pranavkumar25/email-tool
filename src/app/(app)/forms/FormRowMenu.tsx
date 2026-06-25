"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  EllipsisHorizontalIcon,
  PlayIcon,
  PauseIcon,
  CodeBracketIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/components/ui";
import type { FormStatus } from "@/data/forms";
import { toggleFormStatusAction, deleteFormAction } from "./actions";

export function FormRowMenu({
  id,
  name,
  status,
}: {
  id: string;
  name: string;
  status: FormStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const isLive = status === "LIVE";

  async function onToggle() {
    setOpen(false);
    await toggleFormStatusAction(id);
    router.refresh();
  }

  async function onDelete() {
    setOpen(false);
    if (!confirm(`Delete the form “${name}”?`)) return;
    await deleteFormAction(id);
    router.refresh();
  }

  function onCopyEmbed() {
    const origin = window.location.origin;
    const snippet = `<form onsubmit="event.preventDefault();fetch('${origin}/api/forms/${id}/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:this.email.value})}).then(()=>this.reset())">
  <input name="email" type="email" placeholder="you@example.com" required />
  <button type="submit">Subscribe</button>
</form>`;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    });
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-faint transition-opacity hover:bg-subtle hover:text-ink"
        aria-label={`Actions for ${name}`}
      >
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-pop">
            <MenuItem icon={isLive ? PauseIcon : PlayIcon} onClick={onToggle}>
              {isLive ? "Pause" : "Activate"}
            </MenuItem>
            <MenuItem
              icon={copied ? CheckIcon : CodeBracketIcon}
              onClick={onCopyEmbed}
            >
              {copied ? "Copied!" : "Copy embed code"}
            </MenuItem>
            <MenuItem icon={TrashIcon} danger onClick={onDelete}>
              Delete
            </MenuItem>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-canvas",
        danger ? "text-rose-600 hover:text-rose-700" : "text-ink",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {children}
    </button>
  );
}
