"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";

import { SalaryResult } from "../../../types";
import { usePredictionStore } from "../../../store/usePredictionStore";
import { formatCurrency } from "../../../utils/formatters";

interface SalaryHighlightCardProps {
  salary: SalaryResult;
}

export const SalaryHighlightCard: React.FC<SalaryHighlightCardProps> = ({ salary }) => {
  // We'll animate the number from 0 to the median
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [hasAnimated, setHasAnimated] = useState(false);

  const selectedCurrency = usePredictionStore((state) => state.selectedCurrency);

  let symbol = "$";
  let factor = 1;
  if (selectedCurrency === "INR") {
    symbol = "₹";
    factor = 83;
  } else if (selectedCurrency === "EUR") {
    symbol = "€";
    factor = 0.92;
  } else if (selectedCurrency === "GBP") {
    symbol = "£";
    factor = 0.78;
  }

  const convertedMedian = salary.median * factor;

  useEffect(() => {
    const animation = animate(count, convertedMedian, {
      duration: 1.5,
      ease: "easeOut",
      onComplete: () => setHasAnimated(true),
    });
    return animation.stop;
  }, [count, convertedMedian]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative col-span-1 lg:col-span-2 flex flex-col justify-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden group"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />
      
      <div className="z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-white/40 text-sm uppercase tracking-widest font-medium mb-4">Predicted Base Salary</h3>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-5xl md:text-7xl font-light text-white tracking-tighter">
              {symbol}<motion.span>{hasAnimated ? Math.round(convertedMedian).toLocaleString() : rounded}</motion.span>
            </span>
            <span className="text-white/30 text-xl font-medium tracking-wide">{selectedCurrency} / yr</span>
          </div>
        </div>

        <div className="flex flex-col text-sm text-white/50 bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="mb-1 flex justify-between gap-4">
            <span>Range Min</span>
            <span className="text-white">{formatCurrency(salary.min)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Range Max</span>
            <span className="text-white">{formatCurrency(salary.max)}</span>
          </div>
        </div>
      </div>

      <div className="z-10 mt-10 relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "60%", opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-0 bottom-0 left-[20%] bg-gradient-to-r from-blue-600/20 via-blue-400 to-blue-600/20 rounded-full"
        />
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
      </div>
    </motion.div>
  );
};
