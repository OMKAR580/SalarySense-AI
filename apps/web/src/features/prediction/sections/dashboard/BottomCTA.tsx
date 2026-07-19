"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const BottomCTA = () => {
  const [hasPrediction, setHasPrediction] = useState(false);

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("prediction_history");
      if (historyJson && JSON.parse(historyJson).length > 0) {
        setHasPrediction(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <section className="py-12 w-full mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to predict?
        </h2>
        <p className="text-lg text-slate-400 mb-8">
          Join thousands of enterprise teams making fairer, data-driven compensation decisions.
        </p>
        
        <Link 
          href="/predict/new"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg transition-all hover:scale-105 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          {hasPrediction ? "Start Your Prediction" : "Start Your First Prediction"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
};
