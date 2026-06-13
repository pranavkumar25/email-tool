"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <button
        onClick={provision}
        disabled={loading}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {loading ? "Provisioning…" : "Provision Google Sheet + script"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
