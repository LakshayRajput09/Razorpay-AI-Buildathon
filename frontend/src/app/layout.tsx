import React, { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MerchantProvider } from "@/context/MerchantContext";

export const metadata: Metadata = {
  title: "Razorpay AI — AI-Powered Merchant Intelligence",
  description: "AI-powered operating intelligence for modern merchants. Four AI agents. One business brain.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0B0A",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className="font-sans min-h-screen antialiased bg-[#0B0B0A] text-[#F2EEE5] selection:bg-[#B69A5A]/30 selection:text-[#F2EEE5] relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <MerchantProvider>
            <div className="relative z-10 min-h-screen bg-[#0B0B0A]">
              <AppShell>{children}</AppShell>
            </div>
          </MerchantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
