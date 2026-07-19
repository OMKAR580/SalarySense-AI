"use client";

import { motion } from "framer-motion";
import React from "react";

import { SelectableCard } from "../../components/cards";
import { PREDICTION_METHODS } from "../../constants/predictionMethods";

interface MethodCardsProps {
  selectedMethodId: string | null;
  onSelectMethod: (id: string) => void;
}

export const MethodCards: React.FC<MethodCardsProps> = ({ selectedMethodId, onSelectMethod }) => {
  return (
    <section className="py-8 w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {PREDICTION_METHODS.map((method) => (
          <SelectableCard
            key={method.id}
            method={method}
            isSelected={selectedMethodId === method.id}
            onSelect={onSelectMethod}
          />
        ))}
      </motion.div>
    </section>
  );
};
