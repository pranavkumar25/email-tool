import { UserPlusIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  Card,
  SectionTitle,
  Button,
  Badge,
  Avatar,
  Input,
  Select,
} from "@/components/ui";

type Role = "Owner" | "Admin" | "Editor" | "Viewer";
type Member = {
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited";
};

const MEMBERS: Member[] = [
  { name: "Pranav Kumar", email: "pranavsao50@gmail.com", role: "Owner", status: "Active" },
  { name: "Ada Lovelace", email: "ada@pickcel.com", role: "Admin", status: "Active" },
  { name: "Liam Carter", email: "liam@pickcel.com", role: "Editor", status: "Active" },
  { name: "Maya Singh", email: "maya@pickcel.com", role: "Viewer", status: "Invited" },
];

const ROLE_TONE: Record<Role, "accent" | "info" | "neutral"> = {
  Owner: "accent",
  Admin: "info",
  Editor: "neutral",
  Viewer: "neutral",
};

export default function TeamSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Invite */}
      <Card className="p-5">
        <SectionTitle>Invite teammates</SectionTitle>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="teammate@company.com"
            className="flex-1"
          />
          <Select className="sm:w-40" defaultValue="Editor">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </Select>
          <Button>
            <UserPlusIcon className="h-4 w-4" />
            Send invite
          </Button>
        </div>
      </Card>

      {/* Members */}
      <Card className="overflow-hidden">
        <div className="px-5 pt-5">
          <SectionTitle>Members · {MEMBERS.length}</SectionTitle>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
              <th className="px-5 py-2.5 font-medium">Member</th>
              <th className="px-3 py-2.5 font-medium">Role</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="w-10 px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {MEMBERS.map((m) => (
              <tr key={m.email} className="group transition-colors hover:bg-canvas">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="md" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-ink">{m.name}</div>
                      <div className="truncate text-xs text-muted">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={m.status === "Active" ? "success" : "warning"}>
                    {m.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    disabled={m.role === "Owner"}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-faint opacity-0 transition-opacity hover:bg-subtle hover:text-ink group-hover:opacity-100 disabled:opacity-0"
                    aria-label="Manage member"
                  >
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
