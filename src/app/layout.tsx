import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miraee — Meet Miraee",
  description: "A scroll-driven introduction to Miraee, your AI travel companion.",
  icons: { icon: "/brand/icons/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
