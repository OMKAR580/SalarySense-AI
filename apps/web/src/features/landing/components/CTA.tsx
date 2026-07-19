"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-primary text-secondary">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl flex flex-col items-center"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-surface">
            Ready to scale your HR intelligence?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-secondary/80 max-w-2xl">
            Join the most forward-thinking enterprises using SalarySense AI to automate compensation bands, maintain equity, and secure their workforce data.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="bg-surface text-primary hover:bg-surface/90 group">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-surface/20 text-surface hover:bg-surface/10 hover:text-surface">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
