"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

export function CampaignActions({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function setStatus(next: "ACTIVE" | "PAUSED") {
    setBusy(true);
    try {
      await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (status === "ACTIVE") {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setStatus("PAUSED")}
        disabled={busy}
      >
        <PauseIcon className="h-4 w-4" strokeWidth={2} />
        {busy ? "…" : "Pause"}
      </Button>
    );
  }
  if (status === "PAUSED") {
    return (
      <Button size="sm" onClick={() => setStatus("ACTIVE")} disabled={busy}>
        <PlayIcon className="h-4 w-4" strokeWidth={2} />
        {busy ? "…" : "Resume"}
      </Button>
    );
  }
  return null;
}
