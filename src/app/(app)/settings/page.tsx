import { requireUser } from "@/server/auth-helpers";
import {
  Card,
  SectionTitle,
  Button,
  Field,
  Input,
  Badge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const user = await requireUser();
  const name = user.name ?? "";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <SectionTitle>Profile</SectionTitle>
          <Button size="sm" variant="secondary">
            Save changes
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input defaultValue={name} placeholder="Your name" />
          </Field>
          <Field label="Email" hint="Used to sign in. Managed by Google.">
            <Input defaultValue={user.email ?? ""} disabled />
          </Field>
        </div>
      </Card>

      {/* Workspace */}
      <Card className="p-5">
        <SectionTitle>Workspace</SectionTitle>
        <div className="mt-4 space-y-4">
          <Field label="Workspace name">
            <Input defaultValue="Pickcel" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default from name">
              <Input defaultValue={name || "Pickcel"} />
            </Field>
            <Field label="Default reply-to">
              <Input defaultValue={user.email ?? ""} />
            </Field>
          </div>
          <Field label="Time zone">
            <Input defaultValue="Asia/Kolkata (GMT+5:30)" />
          </Field>
        </div>
      </Card>

      {/* Sending model */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <SectionTitle>Sending model</SectionTitle>
          <Badge tone="success">Connected</Badge>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Provider</dt>
            <dd className="font-medium text-ink">Your Gmail · via Apps Script</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Daily quota</dt>
            <dd className="font-medium text-ink tabular-nums">~1,500 / day</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
