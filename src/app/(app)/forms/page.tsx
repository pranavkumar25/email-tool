import {
  PlusIcon,
  CodeBracketIcon,
  WindowIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Badge,
  Button,
  Card,
  IconTile,
  PageHeader,
  Stat,
  StatusBadge,
  EmptyState,
  type IconType,
} from "@/components/ui";
import { compactNumber, formatNumber, relativeTime } from "@/lib/utils";
import { forms, type FormType } from "@/data/forms";

const TYPE_META: Record<
  FormType,
  { icon: IconType; tone: "accent" | "info" | "success" }
> = {
  Embedded: { icon: CodeBracketIcon, tone: "info" },
  Popup: { icon: WindowIcon, tone: "accent" },
  "Landing page": { icon: DocumentTextIcon, tone: "success" },
};

export default function FormsPage() {
  const totalSubs = forms.reduce((s, f) => s + f.submissions, 0);
  const totalViews = forms.reduce((s, f) => s + f.views, 0);
  const avgConv = totalViews ? (totalSubs / totalViews) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms"
        subtitle="Signup forms, popups, and landing pages that grow your audience."
        actions={
          <Button size="sm">
            <PlusIcon className="h-4 w-4" />
            Create form
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active forms" value={forms.filter((f) => f.status === "LIVE").length} accent />
        <Stat label="Total views" value={compactNumber(totalViews)} sub="all time" />
        <Stat label="Submissions" value={formatNumber(totalSubs)} sub="all time" />
        <Stat label="Avg. conversion" value={`${avgConv.toFixed(1)}%`} sub="views → signups" />
      </section>

      {forms.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="No forms yet"
          description="Create an embedded form, popup, or landing page to start collecting subscribers."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                  <th className="px-4 py-2.5 font-medium">Form</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 text-right font-medium">Views</th>
                  <th className="px-3 py-2.5 text-right font-medium">Submissions</th>
                  <th className="px-3 py-2.5 text-right font-medium">Conversion</th>
                  <th className="px-3 py-2.5 text-right font-medium">Updated</th>
                  <th className="w-10 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {forms.map((f) => {
                  const meta = TYPE_META[f.type];
                  return (
                    <tr key={f.id} className="group transition-colors hover:bg-canvas">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <IconTile icon={meta.icon} tone={meta.tone} />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-ink">
                              {f.name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                              <Badge tone="neutral">{f.type}</Badge>
                              <span>· {f.audience}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={f.status} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted">
                        {formatNumber(f.views)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted">
                        {formatNumber(f.submissions)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium text-ink">
                        {f.conversionRate}%
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-faint">
                        {relativeTime(f.updatedAt)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-faint opacity-0 transition-opacity hover:bg-subtle hover:text-ink group-hover:opacity-100"
                          aria-label="More actions"
                        >
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
