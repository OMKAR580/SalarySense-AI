import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import * as React from "react";
import { useEffect,useRef, useState } from "react";

import { AISalaryDashboard } from "./dashboards/AISalaryDashboard";
import { MarketIntelligenceDashboard } from "./dashboards/MarketIntelligenceDashboard";
import { PayEquityDashboard } from "./dashboards/PayEquityDashboard";
import { PredictiveAnalyticsDashboard } from "./dashboards/PredictiveAnalyticsDashboard";
import { SecurityDashboard } from "./dashboards/SecurityDashboard";

interface StoryCardProps {
  card: import("@/types/landing").StoryCardData;
  index: number;
  activeCard: number;
  setActiveCard: (index: number) => void;
  shouldReduceMotion: boolean;
}

export function StoryCard({ card, index, activeCard, setActiveCard, shouldReduceMotion }: StoryCardProps) {
  const isLeft = card.align === "left";
  const Icon = card.icon;
  
  const ref = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  
  useEffect(() => {
    if (isInView) {
      setActiveCard(index);
    }
  }, [isInView, index, setActiveCard]);

  const isActive = activeCard === index;
  
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const xStart = isMobile ? 0 : (isLeft ? -240 : 240);
  const yStart = isMobile ? 60 : 0;

  return (
    <motion.div 
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: xStart, y: yStart, filter: 'blur(16px)' }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-25% 0px -15% 0px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative py-8"
    >
      <motion.div
        animate={{ 
          opacity: isActive ? 1 : 0.45,
          scale: isActive ? 1 : 0.985,
          filter: isActive ? 'brightness(100%)' : 'brightness(80%)',
          boxShadow: isActive ? "0 20px 40px -15px rgba(0,0,0,0.4)" : "0 0px 0px 0px rgba(0,0,0,0)",
          borderColor: isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)"
        }}
        whileHover={!isMobile && isActive ? { scale: 1.015, boxShadow: "0 25px 50px -15px rgba(0,0,0,0.5)" } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 p-8 lg:p-12 rounded-[32px] bg-landing-card/78 backdrop-blur-[20px]"
      >
        <div className={`w-full lg:w-1/2 flex flex-col ${isLeft ? "order-2 lg:order-1" : "order-2"}`}>
          
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="group h-14 w-14 rounded-2xl bg-white/10 border border-white/20 shadow-sm flex items-center justify-center mb-8"
          >
            <motion.div 
              whileHover={!isMobile && isActive ? { rotate: 4 } : {}} 
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Icon className="w-7 h-7 text-blue-400" />
            </motion.div>
          </motion.div>

          <motion.h3 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6"
          >
            {card.title}
          </motion.h3>

          <motion.p 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-white/70 mb-10 leading-relaxed max-w-lg"
          >
            {card.description}
          </motion.p>

          <ul className="flex flex-col gap-5">
            {card.bullets.map((bullet: string, i: number) => (
              <motion.li 
                key={i} 
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.08), ease: "easeOut" }}
                className="flex items-center gap-4 text-white/90 font-medium text-lg"
              >
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                {bullet}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className={`w-full lg:w-1/2 ${isLeft ? "order-1 lg:order-2" : "order-1"}`}>
          {index === 0 && <AISalaryDashboard isActive={isActive} isMobile={isMobile} shouldReduceMotion={shouldReduceMotion} />}
          {index === 1 && <PayEquityDashboard isActive={isActive} isMobile={isMobile} shouldReduceMotion={shouldReduceMotion} />}
          {index === 2 && <MarketIntelligenceDashboard isActive={isActive} isMobile={isMobile} shouldReduceMotion={shouldReduceMotion} />}
          {index === 3 && <PredictiveAnalyticsDashboard isActive={isActive} isMobile={isMobile} shouldReduceMotion={shouldReduceMotion} />}
          {index === 4 && <SecurityDashboard isActive={isActive} isMobile={isMobile} shouldReduceMotion={shouldReduceMotion} />}
        </div>
      </motion.div>
    </motion.div>
  );
}
