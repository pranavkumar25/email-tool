import { PageHeader } from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import { listTemplates } from "@/server/templates";
import { templateCategories } from "@/data/templates";
import { TemplatesGallery } from "./TemplatesGallery";
import { CreateTemplateButton } from "./CreateTemplateButton";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const user = await requireUser();
  const templates = await listTemplates(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        subtitle="Reusable email designs for your campaigns and automations."
        actions={<CreateTemplateButton />}
      />
      <TemplatesGallery
        templates={templates}
        categories={[...templateCategories]}
      />
    </div>
  );
}
