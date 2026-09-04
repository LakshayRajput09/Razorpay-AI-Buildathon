import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Razorpay AI — AI-Powered Merchant Intelligence",
  description: "AI-powered operating intelligence for modern merchants. Four AI agents. One business brain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans min-h-screen antialiased bg-[#0B0B0A] text-[#F2EEE5] selection:bg-[#B69A5A]/30 selection:text-[#F2EEE5] relative overflow-x-hidden">
        <ThemeProvider>
          <div className="relative z-10 min-h-screen bg-[#0B0B0A]">
            <AppShell>{children}</AppShell>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
