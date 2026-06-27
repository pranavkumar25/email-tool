import { ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  Card,
  SectionTitle,
  Button,
  Badge,
  Progress,
  Divider,
} from "@/components/ui";
import { formatNumber } from "@/lib/utils";

const USAGE = [
  { label: "Emails sent", used: 248_900, limit: 500_000 },
  { label: "Subscribers", used: 4_820, limit: 10_000 },
  { label: "Automations", used: 5, limit: 25 },
];

const INVOICES = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
];

export default function BillingSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Current plan */}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <SectionTitle>Current plan</SectionTitle>
              <Badge tone="accent">Pro</Badge>
            </div>
            <p className="mt-2 font-mono text-[28px] font-medium tracking-[-0.02em] text-ink">
              $49
              <span className="font-sans text-base font-normal text-muted">
                /month
              </span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Renews on Jul 1, 2026 · billed monthly
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Change plan
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>

        <Divider className="my-5" />

        <div className="space-y-4">
          {USAGE.map((u) => {
            const pct = Math.round((u.used / u.limit) * 100);
            return (
              <div key={u.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-muted">{u.label}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {formatNumber(u.used)}{" "}
                    <span className="text-faint">/ {formatNumber(u.limit)}</span>
                  </span>
                </div>
                <Progress value={pct} tone={pct > 85 ? "warning" : "accent"} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Payment method */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <SectionTitle>Payment method</SectionTitle>
          <Button variant="secondary" size="sm">
            Update
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-12 items-center justify-center rounded-md bg-ink text-[11px] font-bold text-white">
            VISA
          </span>
          <div className="text-sm">
            <div className="font-medium text-ink">•••• •••• •••• 4242</div>
            <div className="text-xs text-muted">Expires 08/2028</div>
          </div>
        </div>
      </Card>

      {/* Invoices */}
      <Card className="overflow-hidden">
        <div className="px-5 pt-5">
          <SectionTitle>Invoices</SectionTitle>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
              <th className="px-5 py-2.5 font-medium">Invoice</th>
              <th className="px-3 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Amount</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="w-10 px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {INVOICES.map((inv) => (
              <tr key={inv.id} className="group transition-colors hover:bg-canvas">
                <td className="px-5 py-3 font-mono text-[13px] text-ink">
                  {inv.id}
                </td>
                <td className="px-3 py-3 text-muted">{inv.date}</td>
                <td className="px-3 py-3 tabular-nums text-ink">{inv.amount}</td>
                <td className="px-3 py-3">
                  <Badge tone="success">
                    <CheckIcon className="h-3 w-3" />
                    {inv.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-faint transition-colors hover:bg-subtle hover:text-ink"
                    aria-label={`Download ${inv.id}`}
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
