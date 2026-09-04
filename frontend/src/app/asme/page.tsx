"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";

export default function AsmeLandingPage() {
  return (
    <main className="relative bg-black h-screen w-screen flex flex-col justify-between overflow-hidden selection:bg-white selection:text-black shrink-0">
      <LandingNavbar />
      <LandingHero />
    </main>
  );
}

