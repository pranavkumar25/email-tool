import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { Header } from "@/components/Header";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PROVISIONING: "bg-amber-100 text-amber-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function CampaignsPage() {
  const user = await requireUser();
  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { contacts: true } } },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Campaigns</h1>
          <Link
            href="/campaigns/new"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            New campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-12 text-center text-sm text-neutral-500">
            No campaigns yet. Create your first one to upload contacts and start
            sending.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Contacts</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="font-medium text-neutral-900 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[c.status] ?? "bg-neutral-100"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {c._count.contacts}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {c.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
