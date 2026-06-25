"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlayIcon, PauseIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";
import type { AutomationStatus } from "@/data/automations";
import {
  toggleAutomationStatusAction,
  deleteAutomationAction,
} from "../actions";

export function AutomationActions({
  id,
  status,
}: {
  id: string;
  status: AutomationStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const isLive = status === "LIVE";

  async function onToggle() {
    setPending(true);
    await toggleAutomationStatusAction(id);
    setPending(false);
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete this automation? This can't be undone.")) return;
    await deleteAutomationAction(id);
  }

  return (
    <>
      <Button variant="secondary" size="sm" disabled={pending} onClick={onDelete}>
        <TrashIcon className="h-4 w-4" strokeWidth={2} />
        Delete
      </Button>
      <Button size="sm" disabled={pending} onClick={onToggle}>
        {isLive ? (
          <>
            <PauseIcon className="h-4 w-4" strokeWidth={2.25} />
            Pause
          </>
        ) : (
          <>
            <PlayIcon className="h-4 w-4" strokeWidth={2.25} />
            Activate
          </>
        )}
      </Button>
    </>
  );
}
