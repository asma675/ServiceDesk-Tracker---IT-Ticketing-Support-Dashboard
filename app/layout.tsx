import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServiceDesk Tracker",
  description: "Ticketing & IT support dashboard (Next.js + TypeScript + SQL)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
