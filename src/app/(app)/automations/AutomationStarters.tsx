"use client";

import * as React from "react";
import {
  SparklesIcon,
  ShoppingCartIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, IconTile, SectionTitle, type IconType } from "@/components/ui";
import { createAutomationAction } from "./actions";

const STARTERS: { key: string; icon: IconType; title: string; desc: string }[] = [
  {
    key: "welcome",
    icon: SparklesIcon,
    title: "Welcome series",
    desc: "Greet new subscribers and guide their first steps.",
  },
  {
    key: "abandoned",
    icon: ShoppingCartIcon,
    title: "Abandoned cart",
    desc: "Win back shoppers who left items behind.",
  },
  {
    key: "reengage",
    icon: ArrowPathRoundedSquareIcon,
    title: "Re-engagement",
    desc: "Reignite contacts who have gone quiet.",
  },
];

export function AutomationStarters() {
  const [pending, setPending] = React.useState<string | null>(null);

  async function use(key: string) {
    setPending(key);
    await createAutomationAction({ starter: key });
    setPending(null);
  }

  return (
    <section className="space-y-3">
      <SectionTitle>Start from a template</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STARTERS.map((t) => (
          <Card
            key={t.key}
            className="flex flex-col gap-3 p-4 transition-colors hover:border-line-strong"
          >
            <div className="flex items-start gap-3">
              <IconTile icon={t.icon} tone="accent" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink">{t.title}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {t.desc}
                </p>
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled={pending !== null}
                onClick={() => use(t.key)}
              >
                {pending === t.key ? "Creating…" : "Use"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
