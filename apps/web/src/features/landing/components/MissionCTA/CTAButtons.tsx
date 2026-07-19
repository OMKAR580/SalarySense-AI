"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { fadeUpVariant } from './motion';
import { useAuthStore } from "@/store/useAuthStore";

export const CTAButtons = () => {
  const [mounted, setMounted] = useState(false);
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <motion.div 
      variants={fadeUpVariant}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full"
    >
      <Link 
        href={(mounted && isAuthenticated) ? "/predict" : "/login"}
        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] w-full sm:w-auto text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        Launch Prediction Platform
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto backdrop-blur-xl">
        <Calendar className="w-5 h-5" />
        Book Enterprise Demo
      </button>
    </motion.div>
  );
};
