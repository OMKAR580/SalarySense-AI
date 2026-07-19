import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { fadeUpVariant } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

interface HeroContentProps {
  shouldReduceMotion: boolean;
  currentText: string;
  blink: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({ shouldReduceMotion, currentText, blink }) => {
  const [mounted, setMounted] = useState(false);
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <motion.div 
         initial={shouldReduceMotion ? { opacity: 1, y: 0 } : fadeUpVariant().initial} 
         animate={fadeUpVariant().animate} 
         transition={fadeUpVariant().transition}
         className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
      >
        <span className="mr-2.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
        SalarySense AI 2.0 is live
      </motion.div>

      <motion.h1 
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : fadeUpVariant().initial} 
        animate={fadeUpVariant().animate} 
        transition={fadeUpVariant(0.1).transition}
        className="max-w-5xl text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-[-0.02em] text-white mb-10 leading-[1.05] h-[180px] sm:h-[240px] lg:h-[320px]"
      >
        Enterprise Salary
        <br className="hidden sm:block" /> Intelligence for{" "}
        <span className="relative inline-block text-left min-w-[300px] lg:min-w-[500px]">
          <div className="absolute -inset-4 bg-cyan-400/20 blur-[60px] -z-10 rounded-full pointer-events-none" />
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
            {currentText}
          </span>
          <span className={`relative z-10 inline-block w-[3px] h-[0.8em] ml-1 align-middle bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.8)] ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />
        </span>
      </motion.h1>

      <motion.p 
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : fadeUpVariant().initial} 
        animate={fadeUpVariant().animate} 
        transition={fadeUpVariant(0.2).transition}
        className="max-w-2xl text-lg sm:text-xl text-slate-400 mb-14 font-medium leading-relaxed"
      >
        Unify your workforce analytics, accurately classify compensation bands with machine learning, and securely optimize your organization&apos;s pay equity at scale.
      </motion.p>

      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : fadeUpVariant().initial} 
        animate={fadeUpVariant().animate} 
        transition={fadeUpVariant(0.3).transition}
        className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
      >
        {(mounted && isAuthenticated) ? (
          <Link href="/predict" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-8 rounded-full text-[15px] font-medium bg-white text-black hover:bg-gray-200 border-0 backdrop-blur-2xl shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 rounded-full text-[15px] font-medium bg-white/5 hover:bg-white/10 border-0 backdrop-blur-2xl text-white shadow-[inset_0_2px_4px_-1px_rgba(255,255,255,0.6),inset_0_-2px_4px_-1px_rgba(255,255,255,0.2),0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-1 hover:ring-blue-500 hover:shadow-[inset_0_2px_4px_-1px_rgba(255,255,255,0.6),inset_0_-2px_4px_-1px_rgba(255,255,255,0.2),0_0_30px_rgba(59,130,246,0.6)]">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 rounded-full text-[15px] font-medium bg-transparent hover:bg-white/5 border-0 backdrop-blur-2xl text-white shadow-[inset_0_2px_4px_-1px_rgba(255,255,255,0.4),inset_0_-2px_4px_-1px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-1 hover:ring-blue-500/70 hover:shadow-[inset_0_2px_4px_-1px_rgba(255,255,255,0.4),inset_0_-2px_4px_-1px_rgba(255,255,255,0.1),0_0_30px_rgba(59,130,246,0.3)]">
                Book a Demo
              </Button>
            </Link>
          </>
        )}
      </motion.div>
    </>
  );
};
