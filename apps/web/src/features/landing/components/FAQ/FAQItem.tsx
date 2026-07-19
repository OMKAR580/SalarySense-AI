"use client";

import { AnimatePresence,motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React from 'react';

import { accordionVariants } from './motion';
import { FAQItemData } from './types';

interface FAQItemProps {
  item: FAQItemData;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem = ({ item, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
      >
        <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
          {item.question}
        </span>
        <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.03] group-hover:bg-white/[0.08] transition-all duration-300 ${isOpen ? 'rotate-45 bg-white/[0.1]' : ''}`}>
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-question-${item.id}`}
            variants={accordionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-400 leading-relaxed pr-8">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
