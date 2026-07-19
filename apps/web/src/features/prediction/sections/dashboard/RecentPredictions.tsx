"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar,FileSearch, FileText, FormInput, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface PastPrediction {
  id: string;
  timestamp: string;
  role: string;
  experience: any;
  salary: string;
  method: string;
}

export const RecentPredictions = () => {
  const [history, setHistory] = useState<PastPrediction[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const historyJson = localStorage.getItem("prediction_history");
        if (historyJson) {
          setHistory(JSON.parse(historyJson));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadHistory();
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  if (history.length === 0) {
    return (
      <section className="py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recent Predictions</h2>
          </div>

          <div className="w-full flex flex-col items-center justify-center p-12 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] border-dashed">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/10 shadow-inner">
              <FileSearch className="w-10 h-10 text-slate-500" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">No Predictions Yet</h3>
            <p className="text-slate-400 text-center max-w-md mb-8">
              Start your first AI Salary Prediction by analyzing a resume, uploading a CSV dataset, or entering data manually.
            </p>
            
            <Link 
              href="/predict/new"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Start First Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="recent-predictions" className="py-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recent Predictions</h2>
          <span className="text-xs text-slate-400 font-medium px-2.5 py-1 rounded bg-white/5 border border-white/5">
            {history.length} Total
          </span>
        </div>

        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-white/[0.02] text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Job Role</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold text-emerald-400">Salary Estimate</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4.5 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="truncate max-w-[180px]">{item.role}</span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/5 capitalize">
                        {item.method === "resume" ? (
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        ) : (
                          <FormInput className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        {item.method}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-mono">{item.experience} Years</td>
                    <td className="px-6 py-4.5 font-bold text-emerald-400 font-mono">
                      {item.salary}
                    </td>
                    <td className="px-6 py-4.5 text-slate-400 font-sans flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
