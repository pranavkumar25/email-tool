/** Shared view-model types for forms. Data comes from @/server/forms. */

export type FormType = "Embedded" | "Popup" | "Landing page";
export type FormStatus = "LIVE" | "DRAFT" | "PAUSED";

export type FormItem = {
  id: string;
  name: string;
  type: FormType;
  status: FormStatus;
  views: number;
  submissions: number;
  conversionRate: number;
  audience: string;
  updatedAt: string;
};

export const FORM_TYPES: FormType[] = ["Embedded", "Popup", "Landing page"];
