/** Shared view-model types for automations. Data comes from @/server/automations. */

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

export const STEP_TYPES: StepType[] = [
  "email",
  "delay",
  "condition",
  "action",
];
