"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Bell, CheckCircle2, ChevronsLeft, ChevronsRight, LogOut, Menu, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import apiClient, { getStaticUrl } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { usePredictionStore } from "../../store";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "success" | "info" | "warning";
}

export const Topbar = () => {
  const router = useRouter();

  const { username, userEmail, avatar, refreshToken, clearAuthSession } = useAuthStore();
  const sidebarCollapsed = usePredictionStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = usePredictionStore((state) => state.setSidebarCollapsed);
  const selectedCurrency = usePredictionStore((state) => state.selectedCurrency);
  const setCurrency = usePredictionStore((state) => state.setCurrency);
  const safeAvatar = typeof avatar === 'string' && avatar !== 'null' && avatar.trim() !== '' ? getStaticUrl(avatar) : null;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Best-effort: inform backend to revoke session
      if (refreshToken) {
        await apiClient.post("/auth/logout", {
          refresh_token: refreshToken,
          all_devices: false,
        });
      }
    } catch {
      // Always clear frontend state even if backend call fails
    } finally {
      clearAuthSession();
      setLogoutLoading(false);
      router.push("/login");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Workspace Configured",
      message: "Ridge Regression ML model successfully loaded and configured.",
      time: "Just now",
      unread: true,
      type: "success",
    },
    {
      id: "2",
      title: "Performance Optimized",
      message: "Feature engineering pipelines initialized and cached.",
      time: "10 mins ago",
      unread: true,
      type: "info",
    },
    {
      id: "3",
      title: "Welcome to SalarySense",
      message: "Start predicting salaries via manual form or bulk upload.",
      time: "1 hour ago",
      unread: false,
      type: "info",
    }
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    
    try {
      const historyJson = localStorage.getItem("prediction_history") || "[]";
      const history = JSON.parse(historyJson);
      const filtered = history.filter((item: any) =>
        item.role.toLowerCase().includes(query.toLowerCase()) ||
        item.salary.toLowerCase().includes(query.toLowerCase()) ||
        item.method.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } catch (err) {
      console.error("Search history read failure:", err);
    }
  };

  const handleResultClick = (item: any) => {
    try {
      const fullSummaryJson = localStorage.getItem(`prediction_summary_${item.id}`);
      if (fullSummaryJson) {
        const fullSummary = JSON.parse(fullSummaryJson);
        
        // Initialize mock session state to fit the UI expectations
        const initializeSession = usePredictionStore.getState().initializeSession;
        initializeSession(item.method);
        
        // Set result
        usePredictionStore.getState().setResult(fullSummary);
        
        // Push to result page
        router.push("/predict/result");
      } else {
        alert(`Prediction details for "${item.role}" could not be retrieved.`);
      }
    } catch (err) {
      console.error(err);
    }
    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#030712]/60 backdrop-blur-2xl border-b border-white/5">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Toggle navigation button on desktop */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title={sidebarCollapsed ? "Expand Navigation" : "Collapse Navigation"}
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </button>

        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <span className="text-slate-500">Workspace</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 cursor-pointer" onClick={() => router.push("/predict")}>Dashboard</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Search Input Panel */}
        <div ref={searchRef} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search predictions..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
            className="w-64 h-9 pl-9 pr-4 rounded-full bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
          />
          
          <AnimatePresence>
            {showSearchDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0b0f19] p-2 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 border-b border-white/5 mb-1">
                  Predictions Matches ({searchResults.length})
                </div>
                
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching predictions found.
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white truncate max-w-[170px]">{item.role}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{item.method} entry • {item.experience} yrs</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400 font-mono">{item.salary}</div>
                          <div className="text-[9px] text-slate-600">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Currency Switcher */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none transition-all cursor-pointer appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 8px center",
              backgroundSize: "16px 16px",
              backgroundRepeat: "no-repeat"
            }}
          >
            <option value="INR" className="bg-[#0b0f19] text-white">₹ INR</option>
            <option value="USD" className="bg-[#0b0f19] text-white">$ USD</option>
            <option value="EUR" className="bg-[#0b0f19] text-white">€ EUR</option>
            <option value="GBP" className="bg-[#0b0f19] text-white">£ GBP</option>
          </select>
        </div>

        {/* Notifications Dropdown Panel */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              markAllRead();
            }}
            className={`relative p-2 rounded-lg hover:bg-white/5 transition-colors ${showNotifications ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'}`}
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)] animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0b0f19] p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-2">
                  <span className="text-sm font-bold text-white">Notifications</span>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs text-slate-500 hover:text-slate-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No new notifications.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border border-white/5 flex gap-2.5 transition-colors ${n.unread ? 'bg-white/[0.02]' : ''}`}
                      >
                        {n.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-1">
                            <span className="text-xs font-semibold text-white truncate">{n.title}</span>
                            <span className="text-[9px] text-slate-500 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* User Profile Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`relative flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-white/5 transition-colors ${showUserMenu ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white'}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {safeAvatar ? (
                <img src={safeAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-blue-300" />
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[100px] truncate">
              {username || "Account"}
            </span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b0f19] p-3 shadow-2xl backdrop-blur-xl z-50"
              >
                {/* User info */}
                <div className="flex items-center gap-3 p-2 mb-2 border-b border-white/5 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {safeAvatar ? (
                      <img src={safeAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-blue-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {username || "User"}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {userEmail || ""}
                    </div>
                  </div>
                </div>

                {/* Profile Settings */}
                <button
                  onClick={() => router.push("/predict/profile")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-sm font-medium mb-1"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {logoutLoading ? "Signing out..." : "Sign Out"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
