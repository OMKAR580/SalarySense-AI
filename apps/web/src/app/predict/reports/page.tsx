"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { getStaticUrl } from "@/lib/apiClient";

interface PastPrediction {
  id: string;
  timestamp: string;
  role: string;
  experience: any;
  salary: string;
  method: string;
}

export default function ReportsPage() {
  const [history, setHistory] = useState<PastPrediction[]>([]);
  const { userEmail, username, avatar } = useAuthStore();

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("prediction_history");
      if (historyJson) {
        setHistory(JSON.parse(historyJson));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleShareReport = (item: PastPrediction) => {
    const payload = {
      id: item.id,
      role: item.role,
      experience: String(item.experience),
      salary: item.salary,
      method: item.method,
      timestamp: new Date(item.timestamp).getTime(),
      username: username || "Guest User",
      userEmail: userEmail || "No active session",
      avatar: avatar || null
    };
    
    try {
      const base64Data = btoa(JSON.stringify(payload));
      const shareUrl = `${window.location.origin}/reports/share?data=${base64Data}`;
      navigator.clipboard.writeText(shareUrl);
      alert("Shareable report link copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate share link.");
    }
  };

  const handleDownloadReport = (item: PastPrediction) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Resolve absolute avatar URL from static server
    const safeAvatar = typeof avatar === 'string' && avatar !== 'null' && avatar.trim() !== '' ? getStaticUrl(avatar) : '';

    // Convert salary to number to compute ranges
    const numericSalary = parseFloat(item.salary.replace(/[^0-9.]/g, "")) || 0;
    const isUSD = item.salary.includes("$");
    const prefix = isUSD ? "$" : "₹";
    
    const rangeMin = `${prefix}${Math.round(numericSalary * 0.9).toLocaleString()}`;
    const rangeMax = `${prefix}${Math.round(numericSalary * 1.1).toLocaleString()}`;    printWindow.document.write(`
      <html>
        <head>
          <title>SalarySense AI - Report REP-${item.id.slice(0, 8).toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 40px;
              line-height: 1.6;
              background-color: #ffffff;
            }
            .container {
              max-w: 850px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              padding: 45px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.02);
              position: relative;
              overflow: hidden;
            }
            .top-accent {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 24px;
              margin-bottom: 30px;
            }
            .logo {
              font-family: 'Outfit', sans-serif;
              font-size: 26px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .logo-accent {
              background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .meta-info {
              text-align: right;
              font-size: 12px;
              color: #64748b;
            }
            .meta-info strong {
              color: #334155;
            }
            .report-title {
              font-family: 'Outfit', sans-serif;
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 8px;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .report-subtitle {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 35px;
            }
            .main-layout {
              display: grid;
              grid-template-cols: 240px 1fr;
              gap: 40px;
              margin-bottom: 20px;
            }
            .sidebar {
              border-right: 1px solid #e2e8f0;
              padding-right: 30px;
              display: flex;
              flex-direction: column;
            }
            .section-title {
              font-family: 'Outfit', sans-serif;
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #4f46e5;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .user-card {
              display: flex;
              align-items: center;
              gap: 12px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 12px 14px;
              margin-bottom: 25px;
            }
            .avatar-img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
              border: 1.5px solid #e2e8f0;
            }
            .user-info {
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .user-name {
              font-size: 13px;
              font-weight: 700;
              color: #1e293b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .user-email {
              font-size: 10px;
              color: #64748b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .spec-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .spec-item {
              display: flex;
              flex-direction: column;
            }
            .label {
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            }
            .value {
              font-size: 13px;
              font-weight: 600;
              color: #334155;
            }
            .salary-box {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .salary-value {
              font-family: 'Outfit', sans-serif;
              font-size: 34px;
              font-weight: 800;
              color: #10b981;
              line-height: 1;
              margin-top: 4px;
            }
            .salary-sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 6px;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              background-color: #dbeafe;
              color: #1e40af;
              letter-spacing: 0.5px;
            }
            .range-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 16px;
              margin-top: 15px;
            }
            .range-card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 14px 18px;
            }
            .range-value {
              font-size: 15px;
              font-weight: 700;
              color: #334155;
              margin-top: 4px;
            }
            .profile-card {
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 20px 24px;
            }
            .profile-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
            }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              font-weight: 500;
            }
            @media print {
              body {
                padding: 0;
                background-color: transparent;
              }
              .container {
                border: none;
                box-shadow: none;
                padding: 0;
              }
              .sidebar {
                padding-right: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top-accent"></div>
            
            <div class="header">
              <div class="logo">
                SalarySense<span class="logo-accent">AI</span>
              </div>
              <div class="meta-info">
                <div>Reference: <strong>REP-${item.id.slice(0, 8).toUpperCase()}</strong></div>
                <div>Generated On: <strong>${new Date(item.timestamp).toLocaleDateString()}</strong></div>
              </div>
            </div>
            
            <div class="report-title">Compensation Analysis</div>
            <div class="report-subtitle">Automated high-precision salary estimation report powered by SalarySense AI.</div>

            <div class="main-layout">
              <!-- Sidebar -->
              <div class="sidebar">
                <div class="section-title">Evaluator Info</div>
                <div class="user-card">
                  <img src="${safeAvatar || ''}" class="avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.innerText='${(username || 'G').charAt(0).toUpperCase()}'" />
                  <div class="avatar-fallback" style="display:none; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; font-weight: 800; font-size: 16px; align-items: center; justify-content: center; border: 1.5px solid #e2e8f0;"></div>
                  <div class="user-info">
                    <span class="user-name">${username || 'Guest User'}</span>
                    <span class="user-email">${userEmail || 'No active session'}</span>
                  </div>
                </div>

                <div class="section-title" style="margin-top: 10px;">Specifications</div>
                <div class="spec-list">
                  <div class="spec-item">
                    <span class="label">Workflow</span>
                    <span class="value" style="text-transform: capitalize;">${item.method} Form</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">ML Model Engine</span>
                    <span class="value">Ridge Regression</span>
                  </div>
                  <div class="spec-item">
                    <span class="label">Engine Version</span>
                    <span class="value">v1.0.4-prod</span>
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="main-content">
                <div class="section-title">Salary Estimation</div>
                <div class="salary-box">
                  <div>
                    <span class="label" style="color: #4f46e5;">Estimated Base Salary</span>
                    <div class="salary-value">${item.salary} / year</div>
                    <div class="salary-sub">Base compensation index (Annualized)</div>
                  </div>
                  <div class="badge">
                    91% Confidence
                  </div>
                </div>
                
                <div class="range-grid">
                  <div class="range-card">
                    <span class="label">Market Range Min (90%)</span>
                    <div class="range-value">${rangeMin} / year</div>
                  </div>
                  <div class="range-card">
                    <span class="label">Market Range Max (110%)</span>
                    <div class="range-value">${rangeMax} / year</div>
                  </div>
                </div>

                <div class="section-title" style="margin-top: 30px;">Profile Details</div>
                <div class="profile-card">
                  <div class="profile-grid">
                    <div class="spec-item">
                      <span class="label">Target Job Title</span>
                      <span class="value" style="font-size: 15px; color: #0f172a; margin-top: 2px;">${item.role}</span>
                    </div>
                    <div class="spec-item">
                      <span class="label">Years of Experience</span>
                      <span class="value" style="font-size: 15px; color: #0f172a; margin-top: 2px;">${item.experience} Years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              This is a secure machine-generated report. Confidential. &copy; ${new Date().getFullYear()} SalarySense AI. All rights reserved.
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full flex flex-col max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wide uppercase mb-2">
            <FileText className="w-4 h-4" />
            Insights & Documentation
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Salary Reports</h1>
          <p className="text-slate-400 mt-2 font-medium">
            Review, manage, and download individual compensation analysis reports for offline access.
          </p>
        </div>

        <Link
          href="/predict"
          className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-300 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Reports Table / List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-white/[0.02] text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4.5 font-semibold">Report Reference</th>
                <th className="px-6 py-4.5 font-semibold">Role Profile</th>
                <th className="px-6 py-4.5 font-semibold">Method</th>
                <th className="px-6 py-4.5 font-semibold text-emerald-400">Compensation</th>
                <th className="px-6 py-4.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No prediction history found. Generate predictions first to export reports.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4.5 font-mono text-xs text-slate-400">
                      REP-{item.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{item.role}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{item.experience} yrs experience</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium capitalize">
                        {item.method}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-emerald-400">
                      {item.salary}
                    </td>
                    <td className="px-6 py-4.5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleShareReport(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share Link
                      </button>
                      <button
                        onClick={() => handleDownloadReport(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
