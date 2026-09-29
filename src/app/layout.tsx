import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miraee — Meet Miraee",
  description: "A scroll-driven introduction to Miraee, your AI travel companion.",
  icons: { icon: "/brand/icons/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
