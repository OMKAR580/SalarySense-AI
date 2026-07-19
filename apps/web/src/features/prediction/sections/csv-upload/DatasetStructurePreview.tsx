"use client";

import { motion } from "framer-motion";
import { TableProperties } from "lucide-react";
import React from "react";

const DUMMY_DATA = [
  { ed: "Bachelors", exp: "5", role: "Software Engineer", skills: "React, Node", loc: "New York", sal: "$120,000" },
  { ed: "Masters", exp: "8", role: "Data Scientist", skills: "Python, SQL", loc: "San Francisco", sal: "$150,000" },
  { ed: "PhD", exp: "3", role: "ML Engineer", skills: "PyTorch, AWS", loc: "Seattle", sal: "$165,000" },
  { ed: "Bachelors", exp: "2", role: "Frontend Dev", skills: "Vue, CSS", loc: "Remote", sal: "$95,000" },
];

export const DatasetStructurePreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <TableProperties className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Dataset Structure Preview</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium px-2 py-1 rounded bg-white/5">Preview UI Only</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-white/[0.02] text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 font-medium">Education</th>
              <th className="px-4 py-3 font-medium">Experience (Yrs)</th>
              <th className="px-4 py-3 font-medium">Job Role</th>
              <th className="px-4 py-3 font-medium">Core Skills</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium text-emerald-400">Target: Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {DUMMY_DATA.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">{row.ed}</td>
                <td className="px-4 py-3">{row.exp}</td>
                <td className="px-4 py-3">{row.role}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{row.skills}</td>
                <td className="px-4 py-3">{row.loc}</td>
                <td className="px-4 py-3 font-medium text-emerald-400/80">{row.sal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
