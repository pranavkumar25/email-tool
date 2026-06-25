"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  ChevronLeftIcon,
  ArrowUpTrayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
  cn,
} from "@/components/ui";
import type { SubscriberInput } from "@/server/audience";
import { importSubscribersAction } from "../actions";

const STEPS = ["Upload", "Map fields", "Review"];

const FIELD_OPTIONS = [
  "Email",
  "First name",
  "Last name",
  "Company",
  "Country",
  "Ignore",
] as const;
type FieldKey = (typeof FIELD_OPTIONS)[number];

function guessField(header: string): FieldKey {
  const h = header.toLowerCase();
  if (/e-?mail/.test(h)) return "Email";
  if (/first.?name|fname|given/.test(h)) return "First name";
  if (/last.?name|lname|surname/.test(h)) return "Last name";
  if (/company|organi[sz]ation|\borg\b|account/.test(h)) return "Company";
  if (/country|region|location/.test(h)) return "Country";
  return "Ignore";
}

const FIELD_TO_KEY: Record<Exclude<FieldKey, "Ignore">, keyof SubscriberInput> = {
  Email: "email",
  "First name": "firstName",
  "Last name": "lastName",
  Company: "company",
  Country: "country",
};

export default function ImportPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [pasted, setPasted] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, FieldKey>>({});
  const [tagName, setTagName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);

  function ingest(parsed: Papa.ParseResult<Record<string, string>>) {
    const hs = (parsed.meta.fields ?? []).filter(Boolean);
    const m: Record<string, FieldKey> = {};
    for (const h of hs) m[h] = guessField(h);
    setHeaders(hs);
    setRows(parsed.data);
    setMapping(m);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ingest,
    });
  }

  function parsePasted() {
    if (!pasted.trim()) return false;
    const parsed = Papa.parse<Record<string, string>>(pasted.trim(), {
      header: true,
      skipEmptyLines: true,
    });
    ingest(parsed);
    return (parsed.meta.fields ?? []).length > 0;
  }

  const emailHeader = useMemo(
    () => headers.find((h) => mapping[h] === "Email"),
    [headers, mapping],
  );

  const builtRows = useMemo<SubscriberInput[]>(() => {
    if (!emailHeader) return [];
    const out: SubscriberInput[] = [];
    const seen = new Set<string>();
    for (const row of rows) {
      const email = (row[emailHeader] ?? "").trim().toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      const rec: SubscriberInput = { email };
      for (const h of headers) {
        const field = mapping[h];
        if (field === "Ignore" || field === "Email") continue;
        const val = (row[h] ?? "").trim();
        if (val) rec[FIELD_TO_KEY[field]] = val;
      }
      out.push(rec);
    }
    return out;
  }, [rows, headers, mapping, emailHeader]);

  const mappedCount = Object.values(mapping).filter((v) => v !== "Ignore").length;

  function next() {
    setError(null);
    if (step === 0) {
      if (headers.length === 0 && !parsePasted()) {
        setError("Upload a CSV or paste rows with a header line first.");
        return;
      }
      if (headers.length === 0 && rows.length === 0) {
        setError("No rows detected. Check your CSV has a header row.");
        return;
      }
    }
    if (step === 1 && !emailHeader) {
      setError("Map one column to “Email” — it's required.");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  async function onImport() {
    if (builtRows.length === 0) {
      setError("Nothing to import.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await importSubscribersAction({
      rows: builtRows,
      tagName: tagName.trim() || null,
      source: "CSV import",
    });
    setPending(false);
    if (!res.ok) {
      setError("Import failed. Please try again.");
      return;
    }
    setResult({ created: res.created, updated: res.updated });
  }

  if (result) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Import subscribers"
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
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/15">
            <CheckCircleIcon className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-semibold text-ink">Import complete</h2>
          <p className="text-sm text-muted">
            {result.created} added · {result.updated} updated
            {tagName.trim() ? ` · tagged “${tagName.trim()}”` : ""}
          </p>
          <Button onClick={() => router.push("/audience/subscribers")}>
            View subscribers
          </Button>
        </Card>
      </div>
    );
  }

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
                {fileName || "Drop a CSV or click to upload"}
              </span>
              <span className="text-xs text-faint">or paste below</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFile}
              />
            </label>

            <Textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder={
                "email,first_name,company,country\nada@example.com,Ada,Analytical Engines,United Kingdom"
              }
              className="min-h-[120px] font-mono text-[13px]"
            />
            {headers.length > 0 && (
              <p className="text-xs text-emerald-600">
                Detected {headers.length} columns · {rows.length} rows.
              </p>
            )}
          </div>
        )}

        {/* Step 1 — Map fields */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              We detected {headers.length} columns. Match each to a subscriber
              field. <span className="text-ink">Email</span> is required.
            </p>
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="grid grid-cols-2 gap-3 border-b border-line bg-canvas px-3 py-2 text-xs font-medium uppercase tracking-wide text-faint">
                <span>CSV column</span>
                <span>Maps to</span>
              </div>
              <div className="divide-y divide-line/70">
                {headers.map((h) => (
                  <div
                    key={h}
                    className="grid grid-cols-2 items-center gap-3 px-3 py-2.5"
                  >
                    <span className="truncate font-mono text-[13px] text-muted">
                      {h}
                    </span>
                    <Select
                      value={mapping[h]}
                      onChange={(e) =>
                        setMapping((m) => ({
                          ...m,
                          [h]: e.target.value as FieldKey,
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
            <Field
              label="Add a tag to everyone imported (optional)"
              hint="Created automatically if it doesn't exist."
            >
              <Input
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. Newsletter"
              />
            </Field>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="space-y-1">
            <Row k="Contacts ready" v={`${builtRows.length} contacts`} />
            <Row k="Fields mapped" v={`${mappedCount} fields`} />
            <Row k="Duplicates" v="Skipped (matched by email)" />
            <Row k="Add tag" v={tagName.trim() || "None"} />
            {error && <p className="pt-2 text-sm text-rose-600">{error}</p>}
            <p className="pt-3 text-xs leading-relaxed text-faint">
              Existing contacts are matched by email and updated in place — none
              are duplicated.
            </p>
          </div>
        )}

        {error && step !== 2 && (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        )}

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Continue
              <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
            </Button>
          ) : (
            <Button onClick={onImport} disabled={pending || builtRows.length === 0}>
              <RocketLaunchIcon className="h-4 w-4" strokeWidth={2} />
              {pending
                ? "Importing…"
                : `Import ${builtRows.length} subscriber${builtRows.length === 1 ? "" : "s"}`}
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
