"use client";

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { FAQ_QUESTIONS } from './constants';
import { FAQItem } from './FAQItem';
import { fadeUpVariant } from './motion';

export const QuestionList = () => {
  const [openId, setOpenId] = useState<string | null>("q1");

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <motion.div 
      variants={fadeUpVariant}
      className="flex flex-col rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-6 md:p-8 hover:bg-white/[0.03] transition-colors duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {FAQ_QUESTIONS.map((q) => (
        <FAQItem 
          key={q.id}
          item={q}
          isOpen={openId === q.id}
          onToggle={() => handleToggle(q.id)}
        />
      ))}
    </motion.div>
  );
};
