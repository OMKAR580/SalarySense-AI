"use client";

import React from "react";
import { usePredictionStore } from "../../store";
import { Sidebar, Topbar } from "../navigation";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const sidebarCollapsed = usePredictionStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = usePredictionStore((state) => state.setSidebarCollapsed);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased selection:bg-blue-500/30 flex">
      {/* 
        Background Ambient Glow 
        A very subtle deep blue glow coming from the top left behind the sidebar and workspace.
      */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-900/[0.03] to-transparent pointer-events-none -z-10" />

      {/* Backdrop for mobile */}
      {!sidebarCollapsed && (
        <div 
          onClick={() => setSidebarCollapsed(true)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar - fixed on desktop, hidden on mobile */}
      <Sidebar />

      {/* Main Content Area - margin left handles the fixed sidebar width on desktop */}
      <div className={`flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "lg:pl-0" : "lg:pl-64"
      }`}>
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden relative">
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
