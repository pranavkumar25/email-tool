"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

export function ProvisionButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function provision() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/provision`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(
          typeof body.error === "string"
            ? body.error
            : "Provisioning failed. Check the server logs.",
        );
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Provisioning failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={provision} disabled={loading}>
        <WrenchIcon className="h-4 w-4" strokeWidth={2} />
        {loading ? "Provisioning…" : "Provision Sheet + script"}
      </Button>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
