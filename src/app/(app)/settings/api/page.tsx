import {
  PlusIcon,
  KeyIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  SectionTitle,
  Button,
  Banner,
  IconTile,
} from "@/components/ui";

const KEYS = [
  { id: "k1", name: "Production", token: "sk_live_••••••••4a2f", created: "Mar 12, 2026", lastUsed: "2h ago" },
  { id: "k2", name: "CI / CD", token: "sk_live_••••••••9c7b", created: "May 1, 2026", lastUsed: "3d ago" },
  { id: "k3", name: "Zapier", token: "sk_live_••••••••1d05", created: "May 28, 2026", lastUsed: "12d ago" },
];

export default function ApiSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Banner icon={InformationCircleIcon}>
        API keys carry full access to your account. Keep them secret — never
        commit them to source control or expose them in client code.
      </Banner>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5">
          <SectionTitle>API keys</SectionTitle>
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Create API key
          </Button>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
              <th className="px-5 py-2.5 font-medium">Name</th>
              <th className="px-3 py-2.5 font-medium">Key</th>
              <th className="px-3 py-2.5 font-medium">Created</th>
              <th className="px-3 py-2.5 font-medium">Last used</th>
              <th className="w-10 px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {KEYS.map((k) => (
              <tr key={k.id} className="group transition-colors hover:bg-canvas">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <IconTile icon={KeyIcon} tone="neutral" />
                    <span className="font-medium text-ink">{k.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 font-mono text-[13px] text-muted">
                  {k.token}
                </td>
                <td className="px-3 py-3 text-muted">{k.created}</td>
                <td className="px-3 py-3 text-muted">{k.lastUsed}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-faint opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    aria-label={`Revoke ${k.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
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
