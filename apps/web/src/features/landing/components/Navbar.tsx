"use client";

import { Network, Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { href: "#", label: "Home", id: "" },
  { href: "#why-salarysense", label: "Why Us", id: "why-salarysense" },
  { href: "#how-it-works", label: "How it Works", id: "how-it-works" },
  { href: "#features", label: "Features", id: "features" },
  { href: "#interactive-demo", label: "Experience", id: "interactive-demo" },
  { href: "#ai-engine", label: "AI Engine", id: "ai-engine" },
  { href: "#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "#faq", label: "FAQ", id: "faq" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => link.id).filter(Boolean);
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
            break;
          }
        }
      }
      
      if (window.scrollY < 100) {
        current = "";
      }
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    setMounted(true);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#030712]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030712]/60 transition-colors duration-300">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="#" className="flex items-center gap-2 font-extrabold text-xl tracking-tight drop-shadow-md group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all">
                <Network className="h-4 w-4 text-blue-400" aria-hidden="true" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">SalarySense AI</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium group">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`relative px-1 py-2 transition-all duration-300 group-hover:text-slate-500 hover:!text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:scale-105 ${
                    isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-slate-300"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            {(mounted && isAuthenticated) ? (
              <Link href="/predict" className="hidden sm:inline-block">
                <Button className="bg-white text-black hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 font-semibold rounded-full px-5">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <Button className="bg-white text-black hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 font-semibold rounded-full px-5">Log in</Button>
                </Link>
                <Link href="/login" className="hidden sm:inline-block">
                  <Button className="bg-white text-black hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300 font-semibold rounded-full px-5">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-white/5 bg-[#030712]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors py-1 ${
                      isActive ? "text-blue-400 font-semibold" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Mobile CTA */}
              <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3">
                {(mounted && isAuthenticated) ? (
                  <Link href="/predict" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-xl py-2.5">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-white/5 text-white hover:bg-white/10 border border-white/10 font-semibold rounded-xl py-2.5">Log in</Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold rounded-xl py-2.5">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
