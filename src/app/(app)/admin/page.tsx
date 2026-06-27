import {
  ShieldCheckIcon,
  EyeIcon,
  UsersIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { requireAdmin, getAuthContext } from "@/server/auth-helpers";
import { prisma } from "@/server/db";
import { isAdminEmail } from "@/server/admin";
import { impersonateUserAction } from "@/server/actions";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Avatar,
  Banner,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const { isImpersonating, effectiveUser } = await getAuthContext();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { campaigns: true, subscribers: true } },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Accounts"
        subtitle="Open any workspace to view and manage it as that user. Access is granted by the ADMIN_EMAILS allowlist."
      />

      {isImpersonating && (
        <Banner
          icon={EyeIcon}
          tone="strong"
          title={`You're viewing ${effectiveUser?.email ?? "another workspace"}`}
        >
          Every page now shows that account. Use “Stop viewing” in the top bar to
          return to your own.
        </Banner>
      )}

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-line px-5 py-2.5">
          <span className="eyebrow flex-1">Workspace</span>
          <span className="eyebrow hidden w-40 sm:block">Activity</span>
          <span className="eyebrow w-24 text-right">Action</span>
        </div>

        <div className="divide-y divide-line/70">
          {users.map((u) => {
            const isYou = u.id === admin.id;
            const admined = isAdminEmail(u.email);
            return (
              <div
                key={u.id}
                className="group relative flex items-center gap-4 px-5 py-3.5"
              >
                <Avatar name={u.email ?? u.name ?? "?"} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink">
                      {u.name ?? u.email ?? "Unknown"}
                    </span>
                    {admined && (
                      <Badge tone="accent">
                        <ShieldCheckIcon className="h-3 w-3" strokeWidth={2} />
                        Admin
                      </Badge>
                    )}
                    {isYou && <Badge tone="neutral">You</Badge>}
                  </div>
                  <div className="truncate font-mono text-xs text-faint">
                    {u.email ?? "—"}
                  </div>
                </div>

                <div className="hidden w-40 items-center gap-4 font-mono text-xs text-muted tabular-nums sm:flex">
                  <span className="inline-flex items-center gap-1">
                    <PaperAirplaneIcon className="h-3.5 w-3.5 text-faint" strokeWidth={2} />
                    {u._count.campaigns}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon className="h-3.5 w-3.5 text-faint" strokeWidth={2} />
                    {u._count.subscribers.toLocaleString()}
                  </span>
                </div>

                <div className="w-24 text-right">
                  {isYou ? (
                    <span className="font-mono text-xs text-faint">current</span>
                  ) : (
                    <form action={impersonateUserAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <Button type="submit" variant="secondary" size="sm">
                        <EyeIcon className="h-4 w-4" strokeWidth={2} />
                        View as
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <p className="font-mono text-[11px] leading-relaxed text-faint">
        Grant admin by adding an email to ADMIN_EMAILS in the environment. A user
        must sign in with Google at least once before they appear here.
      </p>
    </div>
  );
}
