"use client";

import { motion } from 'framer-motion';
import React from 'react';

import { Background } from './Background';
import { CTAButtons } from './CTAButtons';
import { DeploymentCard } from './DeploymentCard';
import { staggerContainer } from './motion';
import { SectionHeader } from './SectionHeader';
import { TrustMetrics } from './TrustMetrics';

export const MissionCTA = () => {
  return (
    <section className="relative w-full py-32 md:py-48 overflow-hidden bg-[#0a0a0c]" aria-label="Mission Control CTA">
      <Background />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center"
        >
          <SectionHeader />
          <CTAButtons />
          <TrustMetrics />
          <DeploymentCard />
        </motion.div>
      </div>
    </section>
  );
};

export default MissionCTA;
