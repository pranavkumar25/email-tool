import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, PageHeader } from "@/components/ui";
import { templates, templateCategories } from "@/data/templates";
import { TemplatesGallery } from "./TemplatesGallery";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        subtitle="Reusable email designs for your campaigns and automations."
        actions={
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Create template
          </Button>
        }
      />
      <TemplatesGallery
        templates={templates}
        categories={[...templateCategories]}
      />
    </div>
  );
}
