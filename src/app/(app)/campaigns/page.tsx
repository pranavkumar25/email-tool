import { PlusIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { ButtonLink, EmptyState, PageHeader } from "@/components/ui";
import { CampaignsTable, type CampaignRow } from "./CampaignsTable";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const user = await requireUser();
  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contacts: true } } },
  });

  const rows: CampaignRow[] = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    contacts: c._count.contacts,
    created: c.createdAt.toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle={
          rows.length > 0
            ? `${rows.length} campaign${rows.length === 1 ? "" : "s"} in your workspace.`
            : undefined
        }
        actions={
          <ButtonLink href="/campaigns/new" size="sm">
            <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
            New campaign
          </ButtonLink>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={PaperAirplaneIcon}
          title="No campaigns yet"
          description="Create your first campaign to upload contacts, compose, and start sending from your own Gmail."
          action={
            <ButtonLink href="/campaigns/new">
              <PlusIcon className="h-4 w-4" strokeWidth={2.25} />
              New campaign
            </ButtonLink>
          }
        />
      ) : (
        <CampaignsTable campaigns={rows} />
      )}
    </div>
  );
}
