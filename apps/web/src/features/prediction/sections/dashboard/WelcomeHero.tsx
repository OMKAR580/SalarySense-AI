"use client";

import { motion } from "framer-motion";
import { History, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useAuthStore } from "@/store/useAuthStore";

export const WelcomeHero = () => {
  const { username } = useAuthStore();
  return (
    <section className="relative flex flex-col items-start pt-8 pb-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">Workspace Ready</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          Welcome Back {username || "User"} <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-8">
          Predict salaries using AI-powered intelligence. Upload your data or start a manual analysis to get actionable compensation insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/predict/new"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold bg-white text-[#030712] hover:scale-105 hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <PlusCircle className="w-5 h-5" />
            New Prediction
          </Link>
          
          <Link 
            href="#recent-predictions"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.1] transition-all duration-300 backdrop-blur-md"
          >
            <History className="w-5 h-5" />
            View History
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
