import { requireUser } from "@/lib/auth-helpers";
import { Header } from "@/components/Header";
import { NewCampaignWizard } from "./NewCampaignWizard";

export default async function NewCampaignPage() {
  await requireUser();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold tracking-tight">New campaign</h1>
        <NewCampaignWizard />
      </main>
    </>
  );
}
