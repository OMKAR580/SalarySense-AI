"use client";

import { useScroll } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { Container } from "@/components/ui/Container";

import { howItWorksSteps } from "./constants";
import { AIAnalysisPreview } from "./Preview/AIAnalysisPreview";
import { InsightsPreview } from "./Preview/InsightsPreview";
import { PredictionPreview } from "./Preview/PredictionPreview";
import { UploadPreview } from "./Preview/UploadPreview";
import { Step } from "./Step";
import { StepHeader } from "./StepHeader";
import { Timeline } from "./Timeline";

const PREVIEWS = [
  <UploadPreview key="upload" />,
  <AIAnalysisPreview key="ai" />,
  <PredictionPreview key="predict" />,
  <InsightsPreview key="insights" />
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="how-it-works" className="relative bg-landing-bg py-24 lg:py-40 overflow-hidden z-10 w-full" ref={containerRef}>
      {/* Continuous Background Elements (No harsh section breaks) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] z-0" />
      </div>

      <Container className="max-w-7xl mx-auto relative z-10">
        <StepHeader />

        <div className="relative mt-12 lg:mt-24 w-full">
          <Timeline scrollYProgress={scrollYProgress} />
          
          <div className="flex flex-col w-full relative z-10">
            {howItWorksSteps.map((step, index) => {

              return (
                <Step 
                  key={step.id} 
                  step={step} 
                  index={index} 
                  preview={PREVIEWS[index]!} 
                />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
