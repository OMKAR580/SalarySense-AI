import { Network } from 'lucide-react';
import React from 'react';

import { FooterSocial } from './FooterSocial';

export const FooterBrand = () => {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-start">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-semibold text-white tracking-tight">SalarySense AI</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
        Building trustworthy AI for enterprise compensation. Fair, accurate, and fully explainable salary predictions powered by global data.
      </p>
      <FooterSocial />
    </div>
  );
};
