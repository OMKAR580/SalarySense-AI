"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { childFadeIn, staggerContainer, VIEWPORT_CONFIG } from "../motion";

const NETWORK_LAYERS = [
  { nodes: 4, color: "bg-blue-500/40", label: "Input" },
  { nodes: 6, color: "bg-indigo-500/40", label: "Hidden 1" },
  { nodes: 5, color: "bg-purple-500/40", label: "Hidden 2" },
  { nodes: 3, color: "bg-pink-500/40", label: "Ensemble" },
  { nodes: 1, color: "bg-emerald-500/60", label: "Output" }
];

export const NeuralNetworkPreview = memo(function NeuralNetworkPreview() {

  const prefersReducedMotion = useReducedMotion();

  // Generate dynamic network connections
  const connections = React.useMemo(() => {
    const lines = [];
    const layers = NETWORK_LAYERS.length;
    for (let l = 0; l < layers - 1; l++) {
      const layerA = NETWORK_LAYERS[l];
      const layerB = NETWORK_LAYERS[l+1];
      if (!layerA || !layerB) continue;
      const nodesA = layerA.nodes;
      const nodesB = layerB.nodes;
      const startX = (l / (layers - 1)) * 100;
      const endX = ((l + 1) / (layers - 1)) * 100;
      
      for (let i = 0; i < nodesA; i++) {
        for (let j = 0; j < nodesB; j++) {
          // Only draw a subset of connections to avoid clutter
          if ((i + j) % 2 === 0 || l === layers - 2) {
            const startY = 50 + (i - (nodesA - 1) / 2) * 15; // Rough estimate based on flex gap
            const endY = 50 + (j - (nodesB - 1) / 2) * 15;
            lines.push({ startX, startY, endX, endY, layerIdx: l });
          }
        }
      }
    }
    return lines;
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-lg bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-[0_4px_30px_rgba(59,130,246,0.15)] relative overflow-hidden group min-h-[300px] flex flex-col"
      >
        {/* Core Breathing Ambient Glow */}
        <motion.div 
          animate={prefersReducedMotion ? {} : { opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/10 blur-[40px] pointer-events-none"
          aria-hidden="true"
        />

        <motion.div variants={childFadeIn} className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <BrainCircuit className="w-4 h-4 text-white/30" />
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Inference Core</span>
        </motion.div>

        <div className="mt-8 flex-1 flex justify-between items-center w-full px-4 relative">
          
          {/* Connection Lines Rendering */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30" aria-hidden="true">
            <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
              {/* Dense static connections */}
              {connections.map((conn, idx) => (
                <motion.line 
                  key={`static-${idx}`}
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 1.5, ease: "easeInOut", delay: conn.layerIdx * 0.2 }}
                  x1={`${conn.startX}%`} y1={`${conn.startY}%`} 
                  x2={`${conn.endX}%`} y2={`${conn.endY}%`} 
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1" 
                />
              ))}
              
              {/* Traveling Pulses */}
              {!prefersReducedMotion && connections.filter((_, i) => i % 4 === 0).map((conn, idx) => (
                <motion.line 
                  key={`pulse-${idx}`}
                  x1={`${conn.startX}%`} y1={`${conn.startY}%`} 
                  x2={`${conn.endX}%`} y2={`${conn.endY}%`} 
                  stroke="rgba(96,165,250,0.8)" strokeWidth="1.5"
                  strokeDasharray="0 1"
                  animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: ((conn.layerIdx * 5 + idx) % 10) * 0.2 
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Node Layers */}
          {NETWORK_LAYERS.map((layer, layerIdx) => (
            <motion.div variants={childFadeIn} key={layerIdx} className="flex flex-col gap-3 relative z-10">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-white/90 font-mono font-bold tracking-widest text-center w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                {layer.label}
              </span>
              {Array.from({ length: layer.nodes }).map((_, nodeIdx) => (
                <motion.div 
                  key={nodeIdx} 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.5, zIndex: 50, filter: "brightness(1.8) drop-shadow(0 0 20px rgba(255,255,255,0.5))" }}
                  transition={{ delay: (layerIdx * 0.1) + (nodeIdx * 0.05), type: "spring", stiffness: 200, damping: 20 }}
                  viewport={{ once: false }}
                  className={`w-3.5 h-3.5 rounded-full border border-white/60 relative ${layer.color} shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer backdrop-blur-md`}
                >
                  <motion.div
                    animate={prefersReducedMotion ? {} : { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: (layerIdx + nodeIdx) * 0.2 }}
                    className={`absolute inset-0 rounded-full ${layer.color.replace('/40', '/60').replace('/60', '/80')} blur-[4px] pointer-events-none`}
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});
