import * as React from "react";

import { AIEngineShowcase } from "@/features/landing/components/AIEngineShowcase";
import { FAQ } from "@/features/landing/components/FAQ";
import { Features } from "@/features/landing/components/Features";
import { Footer } from "@/features/landing/components/Footer/index";
import { Hero } from "@/features/landing/components/Hero";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { InteractiveExperience } from "@/features/landing/components/InteractiveExperience";
import { MissionCTA } from "@/features/landing/components/MissionCTA";
import { Navbar } from "@/features/landing/components/Navbar";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { WhySalarySense } from "@/features/landing/components/WhySalarySense";

// All components statically imported to prevent layout shifts and white screens on navigation
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <WhySalarySense />
        <HowItWorks />
        <Features />
        <InteractiveExperience />
        <AIEngineShowcase />
        <Testimonials />
        <FAQ />
        <MissionCTA />
      </main>
      <Footer />
    </div>
  );
}
