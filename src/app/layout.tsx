import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InboxRow — earn a row in the inbox",
  description:
    "Send personalized campaigns and follow-up sequences from your own Gmail — on your own deliverability and quota.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* One typeface — Inter, hosted at rsms.me (InterVariable when supported). */}
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
