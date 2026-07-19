"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Eye, Settings, ShieldCheck, Sliders, CheckCircle2, Lock, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("workspace");
  
  // Workspace Settings
  const [modelType, setModelType] = useState("ridge");
  const [currency, setCurrency] = useState("USD");
  const [reduceMotion, setReduceMotion] = useState(false);

  // Pipeline Settings
  const [splitRatio, setSplitRatio] = useState(80);
  const [scaler, setScaler] = useState("standard");
  const [epochs, setEpochs] = useState(1000);

  // Security Settings
  const [enableCache, setEnableCache] = useState(true);
  const [enableMFA, setEnableMFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1h");

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCurrency = localStorage.getItem("selected_currency") || "USD";
        setCurrency(storedCurrency);
        
        const storedModel = localStorage.getItem("selected_model") || "ridge";
        setModelType(storedModel);
        
        const storedReduceMotion = localStorage.getItem("reduce_motion") === "true";
        setReduceMotion(storedReduceMotion);
        
        // Pipeline
        const storedSplit = localStorage.getItem("pipeline_split_ratio");
        if (storedSplit) setSplitRatio(parseInt(storedSplit));
        const storedScaler = localStorage.getItem("pipeline_scaler") || "standard";
        setScaler(storedScaler);
        const storedEpochs = localStorage.getItem("pipeline_epochs");
        if (storedEpochs) setEpochs(parseInt(storedEpochs));

        // Security
        const storedCache = localStorage.getItem("security_enable_cache") !== "false";
        setEnableCache(storedCache);
        const storedMFA = localStorage.getItem("security_enable_mfa") === "true";
        setEnableMFA(storedMFA);
        const storedTimeout = localStorage.getItem("security_timeout") || "1h";
        setSessionTimeout(storedTimeout);
      } catch (e) {
        console.error("Load settings error:", e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("selected_currency", currency);
        localStorage.setItem("selected_model", modelType);
        localStorage.setItem("reduce_motion", reduceMotion ? "true" : "false");
        
        localStorage.setItem("pipeline_split_ratio", splitRatio.toString());
        localStorage.setItem("pipeline_scaler", scaler);
        localStorage.setItem("pipeline_epochs", epochs.toString());
        
        localStorage.setItem("security_enable_cache", enableCache ? "true" : "false");
        localStorage.setItem("security_enable_mfa", enableMFA ? "true" : "false");
        localStorage.setItem("security_timeout", sessionTimeout);

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (e) {
        console.error("Save settings error:", e);
      }
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all prediction history and local session data? This action is irreversible.")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-full flex flex-col pb-24 max-w-4xl mx-auto space-y-8">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mt-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-500 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/20 mb-6"
        >
          <Settings className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
        >
          Settings
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
        >
          Configure your prediction workspace settings, ML model parameters, and interface preferences.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {/* Left Side Menu List */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`p-4 rounded-xl text-left flex items-center gap-3 font-semibold text-sm transition-all border ${activeTab === "workspace" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03]"}`}
          >
            <Sliders className="w-4 h-4" /> Workspace Configuration
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`p-4 rounded-xl text-left flex items-center gap-3 font-semibold text-sm transition-all border ${activeTab === "pipeline" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03]"}`}
          >
            <Cpu className="w-4 h-4" /> ML Pipeline Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`p-4 rounded-xl text-left flex items-center gap-3 font-semibold text-sm transition-all border ${activeTab === "security" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03]"}`}
          >
            <ShieldCheck className="w-4 h-4" /> Security & Privacy
          </button>
        </div>

        {/* Right Side Settings Panel */}
        <div className="md:col-span-2 flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          
          {/* TAB 1: WORKSPACE CONFIGURATION */}
          {activeTab === "workspace" && (
            <div className="flex flex-col gap-6">
              {/* Setting 1: Model Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" /> Active ML Regressor Model
                </label>
                <span className="text-xs text-slate-500 mb-2">Select which model architecture to execute predictions.</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setModelType("ridge")}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${modelType === "ridge" ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/5 text-slate-400"}`}
                  >
                    Ridge Regression (Active)
                  </button>
                  <button 
                    disabled
                    className="p-3 rounded-xl border border-white/5 bg-white/5 text-slate-500 text-xs font-semibold cursor-not-allowed text-left opacity-40 flex justify-between items-center"
                  >
                    <span>Random Forest</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-white/5 text-slate-500">Soon</span>
                  </button>
                </div>
              </div>

              {/* Setting 2: Currency */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-white">Default Currency Preference</label>
                <span className="text-xs text-slate-500 mb-2">Configure target outputs display currency.</span>
                <div className="flex gap-2">
                  {["USD", "EUR", "INR", "GBP"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${currency === curr ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/5 text-slate-400"}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 3: Reduce Motion */}
              <div className="flex justify-between items-center border-t border-white/5 pt-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" /> Reduce Motion
                  </label>
                  <span className="text-xs text-slate-500">Minimize background animations and layout transitions.</span>
                </div>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${reduceMotion ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ML PIPELINE DETAILS */}
          {activeTab === "pipeline" && (
            <div className="flex flex-col gap-6">
              {/* Split Ratio */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Train-Test Split Ratio</span>
                  <span className="text-blue-400 font-mono text-xs">{splitRatio}% / {100 - splitRatio}%</span>
                </label>
                <span className="text-xs text-slate-500 mb-2">Set data splitting distribution for local verification.</span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Feature Scaling */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-white">Target Feature Scaling</label>
                <span className="text-xs text-slate-500 mb-2">Select features normalization scaler.</span>
                <div className="grid grid-cols-3 gap-2">
                  {["standard", "minmax", "robust"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScaler(s)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${scaler === s ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/5 text-slate-400"}`}
                    >
                      {s}Scaler
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Epochs */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-white">Training Max Iterations</label>
                <span className="text-xs text-slate-500 mb-2">Maximum iterations threshold for Ridge Regression convergence.</span>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value) || 1000)}
                  className="w-full max-w-xs h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & PRIVACY */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              {/* Local Caching */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" /> Enable Local Storage Caching
                  </label>
                  <span className="text-xs text-slate-500">Cache results locally to prevent duplicate calculations.</span>
                </div>
                <button
                  onClick={() => setEnableCache(!enableCache)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${enableCache ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableCache ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* High-Value MFA */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" /> High-Value Prediction MFA
                  </label>
                  <span className="text-xs text-slate-500">Require code confirmation for predictions exceeding $150k.</span>
                </div>
                <button
                  onClick={() => setEnableMFA(!enableMFA)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${enableMFA ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enableMFA ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Session Timeout */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-white">Default Session Timeout</label>
                <span className="text-xs text-slate-500 mb-2">Duration after which workspace auth tokens are cleared automatically.</span>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full max-w-xs h-10 px-4 rounded-xl bg-[#090d16] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="15m">15 Minutes</option>
                  <option value="30m">30 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                </select>
              </div>

              {/* Clear data button */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-red-400">Clear Workspace Data</label>
                <span className="text-xs text-slate-500 mb-2">Instantly wipe all prediction histories, cached files, and session keys.</span>
                <button
                  onClick={handleClearData}
                  className="w-full max-w-xs flex items-center justify-center gap-2 h-10 rounded-xl bg-red-650 bg-red-950/20 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-bold transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Clear All Local Data
                </button>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
            <button
              onClick={handleSaveSettings}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Save Configuration Settings
            </button>
            
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 animate-bounce" />
                <span>Settings saved successfully! Updating workspace preferences...</span>
              </motion.div>
            )}

            {!saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Workspace is connected securely. All predictions run locally on your browser session.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
