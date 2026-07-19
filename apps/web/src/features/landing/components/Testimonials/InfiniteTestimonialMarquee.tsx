import * as React from "react";

import { TESTIMONIALS } from "./constants";
import { MarqueeTestimonialCard } from "./MarqueeTestimonialCard";

export function InfiniteTestimonialMarquee() {
  // Duplicate for seamless loop
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative w-full overflow-hidden py-10 group">
      {/* Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" aria-hidden="true" />
      
      {/* Inline styles for marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 80s linear infinite;
        }
        .group:hover .animate-custom-marquee {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-custom-marquee {
            animation-duration: 200s;
          }
        }
      `}} />

      {/* Marquee Track */}
      <div className="flex w-max gap-8 animate-custom-marquee">
        {duplicatedTestimonials.map((testimonial, idx) => (
          <MarqueeTestimonialCard 
            key={`${testimonial.id}-${idx}`} 
            testimonial={testimonial} 
          />
        ))}
      </div>
    </div>
  );
}
