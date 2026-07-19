"use client";

import { motion } from "framer-motion";
import { ChevronsLeft, Network } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { PREDICTION_BOTTOM_NAV, PREDICTION_SIDEBAR_NAV } from "@/features/prediction/constants/navigation";
import { usePredictionStore } from "../../store";
import { NavItem } from "../../types";

const NavItemLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
  const Icon = item.icon;
  return (
    <Link 
      href={item.disabled ? "#" : item.href}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 relative ${
        item.disabled 
          ? "opacity-50 cursor-not-allowed text-slate-500" 
          : isActive 
            ? "text-white bg-blue-500/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" 
            : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
      <span className="text-sm tracking-wide">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  const sidebarCollapsed = usePredictionStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = usePredictionStore((state) => state.setSidebarCollapsed);

  return (
    <aside className={`fixed top-0 left-0 bottom-0 w-64 border-r border-white/5 bg-[#030712]/95 lg:bg-[#030712]/80 backdrop-blur-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out ${
      sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
    }`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <Link href="/predict" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Network className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-200">Prediction Engine</span>
        </Link>
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-none">
        {PREDICTION_SIDEBAR_NAV.map((group) => (
          <div key={group.id} className="flex flex-col gap-1.5">
            {group.label && (
              <span className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                {group.label}
              </span>
            )}
            {group.items.map((item) => (
              <NavItemLink key={item.id} item={item} isActive={pathname === item.href} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-white/5">
        <div className="flex flex-col gap-1.5">
          {PREDICTION_BOTTOM_NAV.items.map((item) => (
            <NavItemLink key={item.id} item={item} isActive={pathname === item.href} />
          ))}
        </div>
      </div>
    </aside>
  );
};
