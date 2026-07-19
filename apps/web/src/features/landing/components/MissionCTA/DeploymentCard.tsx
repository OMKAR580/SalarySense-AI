"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import React from 'react';

import { DEPLOYMENT_STATUS } from './constants';
import { scaleUpVariant } from './motion';

export const DeploymentCard = () => {
  return (
    <motion.div 
      variants={scaleUpVariant}
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8 text-center">
        Enterprise Deployment Status
      </h3>
      
      <div className="space-y-4 mb-8">
        {DEPLOYMENT_STATUS.map((item, i) => (
          <div key={i} className="flex justify-between items-center border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
            <span className="text-gray-300 font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.status === 'VERIFIED' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              )}
              <span className={`text-sm font-bold tracking-wide ${item.status === 'VERIFIED' ? 'text-emerald-400' : 'text-blue-400'}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-6 border-t border-white/[0.1] flex justify-between items-center">
        <span className="text-gray-400 font-medium">Final Status</span>
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold tracking-widest text-sm">
          DEPLOYMENT READY
        </div>
      </div>
    </motion.div>
  );
};
