import { requireUser } from "@/server/auth-helpers";
import { PageHeader } from "@/components/ui";
import { getTemplateContent } from "@/server/templates";
import { prisma } from "@/server/db";
import { NewCampaignWizard } from "./NewCampaignWizard";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const user = await requireUser();
  const { template } = await searchParams;

  let initial:
    | { name?: string; subject?: string; bodyHtml?: string }
    | undefined;
  if (template) {
    const tpl = await getTemplateContent(user.id, template);
    if (tpl) {
      initial = { name: tpl.name, subject: tpl.subject, bodyHtml: tpl.bodyHtml };
      // Soft usage metric — bump the count when a template seeds a campaign.
      await prisma.template.update({
        where: { id: tpl.id },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="New campaign"
        subtitle="Upload contacts, compose, sequence, and launch — in five steps."
      />
      <NewCampaignWizard initial={initial} />
    </div>
  );
}
