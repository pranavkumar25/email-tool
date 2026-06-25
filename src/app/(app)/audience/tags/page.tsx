import { PageHeader } from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import { listTags } from "@/server/audience";
import { TagsClient } from "./TagsClient";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const user = await requireUser();
  const tags = await listTags(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags"
        subtitle="Label and organize your subscribers."
      />
      <TagsClient tags={tags} />
    </div>
  );
}
