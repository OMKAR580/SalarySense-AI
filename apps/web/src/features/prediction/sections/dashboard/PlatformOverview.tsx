"use client";

import { motion } from "framer-motion";
import { Activity, Database, FileBarChart2,Target } from "lucide-react";
import React, { useEffect, useState } from "react";

import { StatCard } from "../../components/cards";

export const PlatformOverview = () => {
  const [totalPredictions, setTotalPredictions] = useState(0);

  useEffect(() => {
    const loadStats = () => {
      try {
        const historyJson = localStorage.getItem("prediction_history");
        if (historyJson) {
          const history = JSON.parse(historyJson);
          setTotalPredictions(history.length);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadStats();
    window.addEventListener("storage", loadStats);
    return () => window.removeEventListener("storage", loadStats);
  }, []);

  const stats = [
    { 
      label: "Total Predictions", 
      value: totalPredictions.toString(), 
      icon: Database, 
      trend: totalPredictions > 0 ? { value: `+${totalPredictions * 100}%`, isPositive: true } : { value: "0%", isPositive: true }
    },
    { 
      label: "Generated Reports", 
      value: totalPredictions.toString(), 
      icon: FileBarChart2, 
      trend: totalPredictions > 0 ? { value: `+${totalPredictions * 100}%`, isPositive: true } : { value: "0%", isPositive: true }
    },
    { label: "Active AI Models", value: "3", icon: Activity },
    { label: "Avg. Accuracy", value: "98.4%", icon: Target, trend: { value: "0.2%", isPositive: true } },
  ];

  return (
    <section className="py-8 w-full border-t border-white/5 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h2>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Cycle</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard 
              key={i}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
