"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart2, TrendingUp, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { FutureAnalyticsPlaceholder } from "@/features/prediction/components/dashboard";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    total: 0,
    avgSalary: 0,
    highestSalary: 0
  });

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("prediction_history");
      if (historyJson) {
        const history = JSON.parse(historyJson);
        if (history.length > 0) {
          const salaries = history.map((item: any) => {
            const cleanVal = item.salary.replace(/[^0-9.]/g, "");
            return parseFloat(cleanVal) || 0;
          }).filter(Boolean);
          
          const totalVal = salaries.reduce((a: number, b: number) => a + b, 0);
          const maxVal = salaries.length > 0 ? Math.max(...salaries) : 0;
          const avgVal = salaries.length > 0 ? totalVal / salaries.length : 0;

          setStats({
            total: history.length,
            avgSalary: Math.round(avgVal),
            highestSalary: Math.round(maxVal)
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wide uppercase mb-2">
            <BarChart2 className="w-4 h-4" />
            Insights & Data
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Prediction Analytics</h1>
          <p className="text-slate-400 mt-2 font-medium">
            Aggregated statistical insights and model performance reviews from your prediction workflows.
          </p>
        </div>

        <Link
          href="/predict"
          className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-300 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Run</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">{stats.total}</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Predictions computed successfully</p>
          </div>
        </motion.div>

        {/* Average Predicted Salary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Average Salary</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              {stats.avgSalary > 0 ? `$${stats.avgSalary.toLocaleString()}` : "$0"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Estimated average across history</p>
          </div>
        </motion.div>

        {/* Highest Predicted Salary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Peak Estimate</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              {stats.highestSalary > 0 ? `$${stats.highestSalary.toLocaleString()}` : "$0"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Highest calculated band</p>
          </div>
        </motion.div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="mt-8 border-t border-white/5 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Advanced Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Detailed feature correlations and predictions distribution mappings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FutureAnalyticsPlaceholder title="Feature Importance" delay={0.3} />
          <FutureAnalyticsPlaceholder title="Industry Comparison" delay={0.4} />
          <FutureAnalyticsPlaceholder title="Future Salary Trend" delay={0.5} />
        </div>
      </div>
    </div>
  );
}
