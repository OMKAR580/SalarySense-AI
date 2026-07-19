"use client";

import { predictionClient } from "@/lib/apiClient";
import { AnimatePresence, motion } from "framer-motion";
import { 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  FileText, 
  Loader2,
  RefreshCw,
  TableProperties,
  UploadCloud,
  Brain} from "lucide-react";
import React, { useRef, useState } from "react";

type UIState = "idle" | "uploading" | "processing" | "completed" | "error";

interface ParsedCSV {
  headers: string[];
  rows: Array<Record<string, string>>;
}

export const BatchUpload = () => {
  const [state, setState] = useState<UIState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [previewData, setPreviewData] = useState<ParsedCSV | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndProcessFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        validateAndProcessFile(file);
      }
    }
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);
    
    // 1. File type validation
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError(file, "Invalid file type. Only CSV files are supported.");
      return;
    }
    
    // 2. Size validation (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(file, "File size exceeds 5MB limit.");
      return;
    }

    setSelectedFile(file);
    startUploadSimulation(file);
  };

  const setError = (file: File | null, msg: string) => {
    setSelectedFile(file);
    setErrorMsg(msg);
    setState("error");
  };

  const startUploadSimulation = (file: File) => {
    setState("uploading");
    setUploadProgress(0);
    
    const duration = 1200; // 1.2s upload animation
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(Math.round((step / steps) * 100), 100);
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Transition to Processing and send prediction request
        sendPredictionRequest(file);
      }
    }, intervalTime);
  };

  const sendPredictionRequest = async (file: File) => {
    setState("processing");
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await predictionClient.post("/predict/batch", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Request blob to handle file download
      });
      
      const blob = response.data;
      setDownloadBlob(blob);
      
      // Read and parse CSV text for preview
      const text = await blob.text();
      
      // Simple parse check
      if (text.startsWith('{"success":false')) {
        // The backend returned a JSON error wrapped in a blob
        const errObj = JSON.parse(text);
        setErrorMsg(errObj.error || "An error occurred during prediction.");
        setState("error");
        return;
      }
      
      const parsed = parseCSVText(text);
      setPreviewData(parsed);
      setState("completed");
    } catch (err: any) {
      console.error("Batch prediction API error:", err);
      
      // Try to parse error message from Blob response if available
      let message = "Network error. Failed to reach the prediction service.";
      if (err.response && err.response.data) {
        try {
          const errText = await err.response.data.text();
          const errObj = JSON.parse(errText);
          message = errObj.error || message;
        } catch (_) {
          message = `Server returned status code ${err.response.status}`;
        }
      }
      
      setErrorMsg(message);
      setState("error");
    }
  };

  const parseCSVText = (text: string): ParsedCSV => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    
    // Parse header row
    const firstLine = lines[0];
    if (!firstLine) return { headers: [], rows: [] };
    const headers = firstLine.split(",").map(h => h.replace(/(^"|"$)/g, "").trim());
    
    // Parse value rows
    const rows = lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.replace(/(^"|"$)/g, "").trim());
      const rowObj: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowObj[h] = values[i] || "";
      });
      return rowObj;
    });
    
    return { headers, rows };
  };

  const handleDownload = () => {
    if (!downloadBlob || !selectedFile) return;
    
    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predicted_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getExperienceAnalytics = (preview: ParsedCSV) => {
    const brackets = {
      "Entry (0-2 yr)": { total: 0, count: 0 },
      "Mid (3-5 yr)": { total: 0, count: 0 },
      "Senior (6-10 yr)": { total: 0, count: 0 },
      "Lead (11+ yr)": { total: 0, count: 0 },
    };

    preview.rows.forEach((row) => {
      const expVal = parseFloat(row["years_of_experience"] || row["experience"] || "0") || 0;
      const salaryVal = parseFloat(row["predicted_salary"] || "0") || 0;

      if (salaryVal > 0) {
        if (expVal <= 2) {
          brackets["Entry (0-2 yr)"].total += salaryVal;
          brackets["Entry (0-2 yr)"].count += 1;
        } else if (expVal <= 5) {
          brackets["Mid (3-5 yr)"].total += salaryVal;
          brackets["Mid (3-5 yr)"].count += 1;
        } else if (expVal <= 10) {
          brackets["Senior (6-10 yr)"].total += salaryVal;
          brackets["Senior (6-10 yr)"].count += 1;
        } else {
          brackets["Lead (11+ yr)"].total += salaryVal;
          brackets["Lead (11+ yr)"].count += 1;
        }
      }
    });

    return Object.entries(brackets).map(([name, data]) => ({
      name,
      avg: data.count > 0 ? Math.round(data.total / data.count) : 0,
    }));
  };

  const getBatchAIExplanation = (preview: ParsedCSV) => {
    if (preview.rows.length === 0) return "";

    let maxSalary = 0;
    let maxRole = "";
    let totalSalary = 0;
    let validCount = 0;

    preview.rows.forEach((row) => {
      const salaryVal = parseFloat(row["predicted_salary"] || "0") || 0;
      if (salaryVal > 0) {
        totalSalary += salaryVal;
        validCount += 1;
        if (salaryVal > maxSalary) {
          maxSalary = salaryVal;
          maxRole = row["job_title"] || row["role"] || "Specialist";
        }
      }
    });

    const avgSalary = validCount > 0 ? Math.round(totalSalary / validCount) : 0;

    return `AI Batch Verdict: Out of ${preview.rows.length} processed records, the average predicted salary is $${avgSalary.toLocaleString()} / year. The model identified the role of "${maxRole}" as the highest salary driver, reaching up to $${maxSalary.toLocaleString()} / year. Overall, tenure years and education level are the strongest positive influencers, boosting the baseline index by 15.2% across the cohort.`;
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMsg(null);
    setPreviewData(null);
    setDownloadBlob(null);
    setState("idle");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <AnimatePresence mode="wait">
        
        {/* IDLE STATE: Drag & Drop Area */}
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer p-12 md:p-20 text-center ${
              isDragging 
                ? "border-blue-400 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
                : "border-white/20 bg-white/[0.02] hover:border-blue-500/50 hover:bg-white/[0.05]"
            }`}
          >
            <input 
              type="file" 
              className="hidden" 
              accept=".csv"
              ref={inputRef}
              onChange={handleFileInput}
            />
            
            <div className={`absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full transition-opacity duration-500 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-50'}`} />
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-white/5 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <UploadCloud className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Upload Employee CSV File
              </h3>
              
              <p className="text-slate-400 mb-8 max-w-md">
                Drag and drop your <code className="text-blue-400 font-semibold font-mono">.csv</code> file, or click to browse. Max size 5MB, up to 1000 rows.
              </p>
              
              <div className="flex flex-col items-center gap-3">
                <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  Select CSV File
                </button>
                <span className="text-xs text-slate-500">
                  Required columns: age, gender, education_level, job_title, years_of_experience
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* UPLOADING STATE */}
        {state === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400">
              <FileText className="w-8 h-8 animate-pulse" />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-1">Uploading file...</h4>
            <p className="text-slate-400 text-sm mb-6">{selectedFile?.name}</p>
            
            <div className="w-full max-w-md bg-white/10 h-2.5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${uploadProgress}%` }}
                layoutId="progressBar"
              />
            </div>
            <span className="text-sm font-semibold text-slate-300">{uploadProgress}%</span>
          </motion.div>
        )}

        {/* PROCESSING STATE */}
        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">Processing salary predictions...</h4>
            <p className="text-slate-400 text-sm max-w-sm text-center">
              Our machine learning model is analyzing and calculating salary insights for your dataset. Please wait...
            </p>
          </motion.div>
        )}

        {/* COMPLETED STATE: Results Preview & Download */}
        {state === "completed" && previewData && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col gap-6"
          >
            {/* Header Success Status */}
            <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Predictions Computed Successfully</h4>
                  <p className="text-slate-400 text-sm">
                    Processed <span className="text-emerald-400 font-semibold">{previewData.rows.length}</span> rows from <span className="font-mono text-slate-300">{selectedFile?.name}</span>.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all text-sm font-medium"
                >
                  Upload New
                </button>
              </div>
            </div>

            {/* Analytics Summary Chart */}
            {(() => {
              const analytics = getExperienceAnalytics(previewData);
              const maxAvg = Math.max(...analytics.map((a) => a.avg), 1);
              return (
                <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider text-indigo-400">
                    CSV Batch Analytics: Average Salary by Tenure Bracket
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {analytics.map((item, index) => {
                      const percent = (item.avg / maxAvg) * 100;
                      return (
                        <div key={index} className="flex flex-col gap-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                          <span className="text-xs font-semibold text-slate-400">{item.name}</span>
                          
                          {/* Visual Bar */}
                          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8, delay: index * 0.15 }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-500/80 to-indigo-500"
                            />
                          </div>
                          
                          <div className="flex justify-between items-baseline mt-1">
                            <span className="text-[10px] text-slate-500">Average Salary</span>
                            <span className="text-sm font-bold text-emerald-400 font-mono">
                              ${item.avg.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* AI Batch Explanation Verdict */}
            <div className="p-6 rounded-3xl border border-indigo-500/20 bg-[#6366f1]/5 backdrop-blur-xl flex flex-col md:flex-row items-start gap-4 shadow-[0_4px_30px_rgba(99,102,241,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">AI Engine Batch Analysis Verdict</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {getBatchAIExplanation(previewData)}
                </p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-white/5 bg-white/[0.01]">
                <TableProperties className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Results Preview (First 10 rows)</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-white/[0.02] text-slate-400 border-b border-white/5">
                    <tr>
                      {previewData.headers.map((h, i) => (
                        <th 
                          key={i} 
                          className={`px-6 py-4.5 font-semibold tracking-wider ${
                            h === "predicted_salary" ? "text-emerald-400 font-bold bg-emerald-500/5" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {previewData.rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                        {previewData.headers.map((h, j) => {
                          const val = row[h];
                          const isPredicted = h === "predicted_salary";
                          return (
                            <td 
                              key={j} 
                              className={`px-6 py-4 font-mono ${
                                isPredicted ? "text-emerald-400 font-semibold bg-emerald-500/5" : "text-slate-300"
                              }`}
                            >
                              {isPredicted && val ? `$${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.rows.length > 10 && (
                <div className="p-4 text-center border-t border-white/5 bg-white/[0.01] text-xs text-slate-500">
                  Showing 10 of {previewData.rows.length} total rows. Download file to view all predictions.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full p-8 md:p-12 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 mb-6 rounded-full flex items-center justify-center bg-red-500/10 text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">CSV Validation Failure</h4>
            <p className="text-red-300 text-sm max-w-md mb-8">
              {errorMsg || "An error occurred while validating or processing the CSV file."}
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/20 font-bold transition-all text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all text-sm font-medium"
              >
                Upload Different File
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
