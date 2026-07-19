"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { Container } from "@/components/ui/Container";

export function TrustedBy() {
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-12">
      <Container>
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-sm font-medium text-muted uppercase tracking-widest">
            Trusted by forward-thinking HR teams
          </p>
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale transition-all duration-1000 hover:grayscale-0 hover:opacity-100"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xl md:text-2xl font-bold font-sans tracking-tight">ACME Corp</span>
            <span className="text-lg md:text-xl font-semibold font-mono tracking-widest uppercase">Globex</span>
            <span className="text-2xl md:text-3xl font-extrabold font-sans tracking-tighter">Soylent</span>
            <span className="text-xl md:text-2xl font-medium font-mono italic">Initech</span>
            <span className="text-xl md:text-2xl font-bold font-sans">Umbrella</span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
