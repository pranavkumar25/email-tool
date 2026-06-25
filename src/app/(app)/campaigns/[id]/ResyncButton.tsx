"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

/**
 * Pushes the current tracking/ingest config into an already-provisioned Sheet.
 * Repairs campaigns provisioned while the env pointed at localhost.
 */
export function ResyncButton({
  campaignId,
  variant = "secondary",
}: {
  campaignId: string;
  variant?: "primary" | "secondary";
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function resync() {
    setState("busy");
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/resync`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(typeof body.error === "string" ? body.error : "Re-sync failed.");
        setState("idle");
        return;
      }
      setState("done");
      router.refresh();
      setTimeout(() => setState("idle"), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Re-sync failed.");
      setState("idle");
    }
  }

  return (
    <div>
      <Button variant={variant} size="sm" onClick={resync} disabled={state === "busy"}>
        {state === "done" ? (
          <CheckIcon className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <ArrowPathIcon className={`h-4 w-4 ${state === "busy" ? "animate-spin" : ""}`} strokeWidth={2} />
        )}
        {state === "busy" ? "Syncing…" : state === "done" ? "Synced" : "Re-sync settings"}
      </Button>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
