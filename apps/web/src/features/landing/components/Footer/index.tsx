import React from 'react';

import { FooterBottom } from './FooterBottom';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';

export const Footer = () => {
  return (
    <footer className="relative w-full bg-[#050505] overflow-hidden pt-24 pb-8 border-t border-white/[0.02]" aria-label="Enterprise Footer">
      {/* Very subtle glow to give it that "OS" feel */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-11 gap-12 lg:gap-8">
          <FooterBrand />
          <FooterLinks />
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
