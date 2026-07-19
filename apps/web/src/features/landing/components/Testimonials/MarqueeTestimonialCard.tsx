import { Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Testimonial } from "./types";

interface MarqueeTestimonialCardProps {
  testimonial: Testimonial;
}

export function MarqueeTestimonialCard({ testimonial }: MarqueeTestimonialCardProps) {
  return (
    <div className="w-[350px] h-[360px] shrink-0 flex flex-col rounded-[2rem] bg-white/[0.01] border border-white/[0.03] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-white/[0.02] p-8 backdrop-blur-xl relative overflow-hidden group/marquee-card transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:border-blue-500/20 hover:bg-white/[0.03]">
      
      {/* Glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover/marquee-card:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/[0.02] to-transparent opacity-0 group-hover/marquee-card:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Avatar and Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 ring-2 ring-white/10 group-hover/marquee-card:ring-blue-400/30 transition-all duration-300">
            {testimonial.avatarUrl ? (
              <Image 
                src={testimonial.avatarUrl} 
                alt={testimonial.executiveName}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-xl font-bold bg-gradient-to-br from-slate-700 to-slate-900">
                {testimonial.executiveName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-base font-semibold text-white/90 group-hover/marquee-card:text-white transition-colors duration-300">
              {testimonial.executiveName}
            </div>
            <div className="text-xs text-white/50 line-clamp-1">
              {testimonial.designation}
            </div>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-sm md:text-base text-white/70 group-hover/marquee-card:text-white/90 transition-colors duration-300 leading-relaxed flex-1 mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Footer / Read more */}
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          <button className="text-sm font-medium text-blue-400/80 group-hover/marquee-card:text-blue-400 transition-colors duration-300 hover:underline underline-offset-4">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
