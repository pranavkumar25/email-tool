import { PageHeader } from "@/components/ui";
import { Tabs, type TabItem } from "@/components/layout/Tabs";

const TABS: TabItem[] = [
  { label: "Account", href: "/settings", exact: true },
  { label: "Sending domains", href: "/settings/domains" },
  { label: "API keys", href: "/settings/api" },
  { label: "Team", href: "/settings/team" },
  { label: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, deliverability, team, and billing."
      />
      <Tabs items={TABS} />
      <div>{children}</div>
    </div>
  );
}
