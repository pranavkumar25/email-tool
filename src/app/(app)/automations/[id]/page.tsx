import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  BoltIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  Badge,
  Card,
  IconTile,
  PageHeader,
  Stat,
  StatusBadge,
  type IconType,
} from "@/components/ui";
import { requireUser } from "@/server/auth-helpers";
import { getAutomation } from "@/server/automations";
import type { AutomationStep, StepType } from "@/data/automations";
import { formatNumber } from "@/lib/utils";
import { AutomationActions } from "./AutomationActions";
import { AddStepButton } from "./AddStepButton";

type StepStyle = { icon: IconType; tone: "accent" | "info" | "neutral" | "warning" | "success"; kind: string };

const STEP_STYLE: Record<StepType, StepStyle> = {
  trigger: { icon: BoltIcon, tone: "accent", kind: "Trigger" },
  email: { icon: EnvelopeIcon, tone: "info", kind: "Email" },
  delay: { icon: ClockIcon, tone: "neutral", kind: "Delay" },
  condition: { icon: ArrowsRightLeftIcon, tone: "warning", kind: "Condition" },
  action: { icon: TagIcon, tone: "success", kind: "Action" },
};

/** Thin vertical line + chevron joining two steps in the canvas. */
function Connector() {
  return (
    <div className="flex flex-col items-center" aria-hidden>
      <div className="h-6 w-1.5 rounded-full bg-line" />
      <ChevronDownIcon className="-mt-1 h-4 w-4 text-faint" strokeWidth={2.25} />
    </div>
  );
}

function StepCard({ step }: { step: AutomationStep }) {
  const style = STEP_STYLE[step.type];
  return (
    <Card className="w-full p-4 transition-colors hover:border-line-strong">
      <div className="flex items-start gap-3">
        <IconTile icon={style.icon} tone={style.tone} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
            {style.kind}
          </div>
          <div className="mt-0.5 font-medium text-ink">{step.title}</div>
          {step.detail && (
            <p className="mt-1 text-sm text-muted">{step.detail}</p>
          )}
          {step.type === "condition" && (
            <div className="mt-3 flex gap-2">
              <Badge tone="success">Yes</Badge>
              <Badge tone="danger">No</Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default async function AutomationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const automation = await getAutomation(user.id, id);
  if (!automation) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link
            href="/automations"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.25} />
            Automations
          </Link>
        }
        title={automation.name}
        subtitle={`Trigger: ${automation.trigger}`}
        actions={
          <>
            <StatusBadge status={automation.status} />
            <AutomationActions id={automation.id} status={automation.status} />
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Entered"
          value={formatNumber(automation.entered)}
          sub="contacts"
          accent
        />
        <Stat
          label="Active now"
          value={formatNumber(automation.active)}
          sub="mid-journey"
        />
        <Stat
          label="Completed"
          value={formatNumber(automation.completed)}
          sub="finished"
        />
        <Stat
          label="Open rate"
          value={`${automation.openRate}%`}
          sub={`${automation.clickRate}% clicks`}
        />
      </section>

      <section className="rounded-xl border border-line bg-canvas/60 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col items-stretch">
          {automation.steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-stretch">
              {i > 0 && (
                <div className="flex justify-center">
                  <Connector />
                </div>
              )}
              <StepCard step={step} />
            </div>
          ))}

          <div className="flex justify-center">
            <Connector />
          </div>
          <AddStepButton automationId={automation.id} />
        </div>
      </section>
    </div>
  );
}
