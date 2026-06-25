"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ArrowUpTrayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  PageHeader,
  Select,
  Textarea,
  cn,
} from "@/components/ui";

const STEPS = ["Upload", "Map fields", "Review"];

const FIELD_OPTIONS = [
  "Email",
  "First name",
  "Last name",
  "Company",
  "Country",
  "Custom field",
  "Ignore",
];

const CSV_COLUMNS: { name: string; mapTo: string }[] = [
  { name: "email", mapTo: "Email" },
  { name: "first_name", mapTo: "First name" },
  { name: "company", mapTo: "Company" },
  { name: "country", mapTo: "Country" },
];

export default function ImportPage() {
  const [step, setStep] = useState(0);
  const [mapping, setMapping] = useState<Record<string, string>>(
    Object.fromEntries(CSV_COLUMNS.map((c) => [c.name, c.mapTo])),
  );

  const mappedCount = Object.values(mapping).filter(
    (v) => v !== "Ignore",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import subscribers"
        subtitle="Upload a CSV or paste a list."
        breadcrumb={
          <Link
            href="/audience/subscribers"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeftIcon className="h-4 w-4" strokeWidth={2} />
            Subscribers
          </Link>
        }
      />

      {/* Stepper */}
      <ol className="flex items-center">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    (active || done) && "bg-accent text-white",
                    active && "shadow-glow-sm",
                    !active && !done && "border border-line bg-surface text-faint",
                  )}
                >
                  {done ? (
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-[13px] font-medium sm:inline",
                    active ? "text-ink" : "text-faint",
                  )}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    i < step ? "bg-accent-500" : "bg-line",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <Card className="p-6">
        {/* Step 0 — Upload */}
        {step === 0 && (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center transition-colors hover:border-accent-500/50 hover:bg-accent-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-600 ring-1 ring-inset ring-accent-600/15">
                <ArrowUpTrayIcon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-ink">
                Drop a CSV or click to upload
              </span>
              <span className="text-xs text-faint">or paste below</span>
              <input type="file" accept=".csv,text/csv" className="hidden" />
            </label>

            <Textarea
              placeholder={
                "email,first_name,company,country\nada@example.com,Ada,Analytical Engines,United Kingdom"
              }
              className="min-h-[120px] font-mono text-[13px]"
            />
          </div>
        )}

        {/* Step 1 — Map fields */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              We detected {CSV_COLUMNS.length} columns. Match each to a
              subscriber field.
            </p>
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="grid grid-cols-2 gap-3 border-b border-line bg-canvas px-3 py-2 text-xs font-medium uppercase tracking-wide text-faint">
                <span>CSV column</span>
                <span>Maps to</span>
              </div>
              <div className="divide-y divide-line/70">
                {CSV_COLUMNS.map((col) => (
                  <div
                    key={col.name}
                    className="grid grid-cols-2 items-center gap-3 px-3 py-2.5"
                  >
                    <span className="truncate font-mono text-[13px] text-muted">
                      {col.name}
                    </span>
                    <Select
                      value={mapping[col.name]}
                      onChange={(e) =>
                        setMapping((m) => ({
                          ...m,
                          [col.name]: e.target.value,
                        }))
                      }
                    >
                      {FIELD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="space-y-1">
            <Row k="Contacts ready" v="412 contacts" />
            <Row k="Fields mapped" v={`${mappedCount} fields`} />
            <Row k="Duplicates" v="Skipped (matched by email)" />
            <Row k="Add to" v="Newsletter" />
            <p className="pt-3 text-xs leading-relaxed text-faint">
              New subscribers receive a single confirmation email. Existing
              contacts are updated in place — none are duplicated.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </Button>
          ) : (
            <Button>
              <RocketLaunchIcon className="h-4 w-4" strokeWidth={2} />
              Import 412 subscribers
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/70 py-2.5 text-sm last:border-0">
      <span className="shrink-0 text-muted">{k}</span>
      <span className="truncate text-right font-medium text-ink">{v}</span>
    </div>
  );
}
