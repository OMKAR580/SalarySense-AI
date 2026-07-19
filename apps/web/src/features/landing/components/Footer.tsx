import Link from "next/link";
import * as React from "react";

import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <div className="h-5 w-5 rounded bg-accent" aria-hidden="true" />
              <span>SalarySense AI</span>
            </div>
            <p className="text-sm text-muted">
              Enterprise Grade HR Intelligence built for the modern workforce.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#security" className="hover:text-foreground transition-colors">Security</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="#about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} SalarySense AI. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="sr-only">Social links would go here</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
