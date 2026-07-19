"use client";

import { motion } from 'framer-motion';
import React from 'react';

import { Background } from './Background';
import { staggerContainer } from './motion';
import { QuestionList } from './QuestionList';
import { SectionHeader } from './SectionHeader';
import { SupportCard } from './SupportCard';

export const FAQ = () => {
  return (
    <section id="faq" className="relative w-full py-24 md:py-32 overflow-hidden bg-[#0a0a0c]" aria-label="Enterprise Knowledge Center">
      <Background />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* TOP SECTION: Centered Header & Stats */}
          <SectionHeader />
          
          {/* BOTTOM SECTION: FAQ & Support */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-start">
            {/* LEFT COLUMN: FAQ */}
            <div className="lg:col-span-8">
              <QuestionList />
            </div>
            
            {/* RIGHT COLUMN: Support Card */}
            <div className="lg:col-span-4 sticky top-24">
              <SupportCard />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
