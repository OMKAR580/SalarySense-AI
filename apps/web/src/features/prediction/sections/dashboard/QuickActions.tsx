"use client";

import { motion } from "framer-motion";
import { FileText, FormInput,Table } from "lucide-react";
import React from "react";

import { ActionCard } from "../../components/cards";

const ACTIONS = [
  {
    id: "resume",
    title: "Resume Analysis",
    description: "Upload a candidate's PDF resume to instantly extract and predict appropriate salary bands.",
    icon: FileText,
    primaryColor: "blue-500",
  },
  {
    id: "csv",
    title: "Batch Dataset (CSV)",
    description: "Upload a CSV file of employee data to perform bulk predictions and identify pay equity gaps.",
    icon: Table,
    primaryColor: "indigo-500",
  },
  {
    id: "manual",
    title: "Manual Prediction",
    description: "Enter employee attributes manually through our structured form for a quick one-off analysis.",
    icon: FormInput,
    primaryColor: "sky-500",
  }
];

export const QuickActions = () => {
  return (
    <section className="py-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACTIONS.map((action) => (
            <ActionCard 
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              primaryColor={action.primaryColor}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
