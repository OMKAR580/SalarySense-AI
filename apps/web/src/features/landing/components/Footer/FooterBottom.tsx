import { Heart } from 'lucide-react';
import React from 'react';

export const FooterBottom = () => {
  return (
    <div className="mt-20 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-gray-500 text-sm">
        © 2026 SalarySense AI. All rights reserved.
      </p>
      <p className="text-gray-500 text-sm flex items-center gap-1.5">
        Made by Omkar Dubey <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> using AI & Machine Learning
      </p>
    </div>
  );
};
