import { requireUser } from "@/server/auth-helpers";
import { PageHeader } from "@/components/ui";
import { NewCampaignWizard } from "./NewCampaignWizard";

export default async function NewCampaignPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New campaign"
        subtitle="Upload contacts, compose, sequence, and launch — in five steps."
      />
      <NewCampaignWizard />
    </div>
  );
}
