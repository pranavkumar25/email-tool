/** Sample signup forms & landing pages (UI-first). */

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

export const forms: FormItem[] = [
  { id: "form_news", name: "Newsletter footer", type: "Embedded", status: "LIVE", views: 18420, submissions: 1342, conversionRate: 7.3, audience: "Newsletter", updatedAt: "2026-06-20" },
  { id: "form_exit", name: "Exit-intent 10% off", type: "Popup", status: "LIVE", views: 9610, submissions: 884, conversionRate: 9.2, audience: "Leads", updatedAt: "2026-06-18" },
  { id: "form_webinar", name: "Webinar registration", type: "Landing page", status: "LIVE", views: 4205, submissions: 1010, conversionRate: 24.0, audience: "Webinar", updatedAt: "2026-06-14" },
  { id: "form_ebook", name: "Ebook download", type: "Landing page", status: "PAUSED", views: 2870, submissions: 612, conversionRate: 21.3, audience: "Leads", updatedAt: "2026-06-02" },
  { id: "form_beta", name: "Beta waitlist", type: "Embedded", status: "DRAFT", views: 0, submissions: 0, conversionRate: 0, audience: "Beta", updatedAt: "2026-06-21" },
];

export function getForm(id: string) {
  return forms.find((f) => f.id === id);
}
