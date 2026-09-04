"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Marketing landing page and login screens do not show the internal dashboard sidebar and app topnav
  const isMarketing = pathname === "/" || pathname === "/landing" || pathname === "/login";

  if (isMarketing) {
    return <main className="min-h-screen w-full bg-transparent">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
