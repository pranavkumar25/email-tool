/** Sample automations / workflows (UI-first). */

export type AutomationStatus = "LIVE" | "DRAFT" | "PAUSED";
export type StepType = "trigger" | "email" | "delay" | "condition" | "action";

export type AutomationStep = {
  id: string;
  type: StepType;
  title: string;
  detail: string;
};

export type Automation = {
  id: string;
  name: string;
  status: AutomationStatus;
  trigger: string;
  entered: number;
  active: number;
  completed: number;
  openRate: number;
  clickRate: number;
  updatedAt: string;
  steps: AutomationStep[];
};

export const automations: Automation[] = [
  {
    id: "auto_welcome",
    name: "Welcome series",
    status: "LIVE",
    trigger: "Subscriber joins",
    entered: 1840,
    active: 212,
    completed: 1503,
    openRate: 62.4,
    clickRate: 24.1,
    updatedAt: "2026-06-19",
    steps: [
      { id: "s1", type: "trigger", title: "Joins audience", detail: "When a contact subscribes via any form" },
      { id: "s2", type: "email", title: "Welcome email", detail: "Sent immediately" },
      { id: "s3", type: "delay", title: "Wait 2 days", detail: "" },
      { id: "s4", type: "email", title: "Getting started guide", detail: "Tips + best first actions" },
      { id: "s5", type: "condition", title: "Opened guide?", detail: "Branch on engagement" },
      { id: "s6", type: "email", title: "Case study", detail: "Sent to non-openers after 3 days" },
    ],
  },
  {
    id: "auto_abandon",
    name: "Abandoned cart recovery",
    status: "LIVE",
    trigger: "Cart abandoned",
    entered: 920,
    active: 64,
    completed: 786,
    openRate: 54.0,
    clickRate: 31.8,
    updatedAt: "2026-06-17",
    steps: [
      { id: "s1", type: "trigger", title: "Abandons cart", detail: "No checkout within 1 hour" },
      { id: "s2", type: "delay", title: "Wait 1 hour", detail: "" },
      { id: "s3", type: "email", title: "Did you forget something?", detail: "Cart contents reminder" },
      { id: "s4", type: "delay", title: "Wait 1 day", detail: "" },
      { id: "s5", type: "email", title: "10% off to finish", detail: "Discount incentive" },
    ],
  },
  {
    id: "auto_reengage",
    name: "Re-engagement",
    status: "PAUSED",
    trigger: "No opens in 60 days",
    entered: 1340,
    active: 0,
    completed: 1180,
    openRate: 18.2,
    clickRate: 4.4,
    updatedAt: "2026-06-02",
    steps: [
      { id: "s1", type: "trigger", title: "Goes dormant", detail: "No opens in 60 days" },
      { id: "s2", type: "email", title: "We miss you", detail: "Win-back offer" },
      { id: "s3", type: "delay", title: "Wait 5 days", detail: "" },
      { id: "s4", type: "condition", title: "Re-engaged?", detail: "Opened or clicked" },
      { id: "s5", type: "action", title: "Tag as churned", detail: "If still dormant" },
    ],
  },
  {
    id: "auto_trial",
    name: "Trial onboarding",
    status: "DRAFT",
    trigger: "Tag added: Trial",
    entered: 0,
    active: 0,
    completed: 0,
    openRate: 0,
    clickRate: 0,
    updatedAt: "2026-06-21",
    steps: [
      { id: "s1", type: "trigger", title: "Trial starts", detail: "Tag 'Trial' added" },
      { id: "s2", type: "email", title: "Day 0 — Activate", detail: "" },
      { id: "s3", type: "delay", title: "Wait 3 days", detail: "" },
      { id: "s4", type: "email", title: "Day 3 — Power features", detail: "" },
    ],
  },
  {
    id: "auto_birthday",
    name: "Birthday reward",
    status: "LIVE",
    trigger: "Birthday field matches",
    entered: 410,
    active: 9,
    completed: 388,
    openRate: 71.5,
    clickRate: 38.0,
    updatedAt: "2026-05-28",
    steps: [
      { id: "s1", type: "trigger", title: "It's their birthday", detail: "Birthday = today" },
      { id: "s2", type: "email", title: "Happy birthday 🎁", detail: "Reward code" },
    ],
  },
];

export function getAutomation(id: string) {
  return automations.find((a) => a.id === id);
}
