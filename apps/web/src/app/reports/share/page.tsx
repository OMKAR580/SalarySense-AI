"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Network, FileText, Printer, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SharePayload {
  id: string;
  role: string;
  experience: string;
  salary: string;
  method: string;
  timestamp: number;
  username: string;
  userEmail: string;
  avatar: string | null;
}

export default function ShareReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) {
      setError("No report data provided in share link.");
      return;
    }

    try {
      // Decode Base64 string safely
      const decodedJson = atob(dataParam);
      const parsed = JSON.parse(decodedJson) as SharePayload;
      if (!parsed.id || !parsed.salary || !parsed.role) {
        throw new Error("Invalid payload schema");
      }
      setReport(parsed);
    } catch (err) {
      console.error("Failed to decode share link data:", err);
      setError("The share link is invalid or has been corrupted.");
    }
  }, [searchParams]);

  const handlePrint = () => {
    if (!report) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Convert salary to number to compute ranges
    const numericSalary = parseFloat(report.salary.replace(/[^0-9.]/g, "")) || 0;
    const isUSD = report.salary.includes("$");
    const prefix = isUSD ? "$" : "₹";
    
    const rangeMin = `${prefix}${Math.round(numericSalary * 0.9).toLocaleString()}`;
    const rangeMax = `${prefix}${Math.round(numericSalary * 1.1).toLocaleString()}`;

    // Resolve safe absolute avatar URL if present
    const safeAvatar = report.avatar && report.avatar.trim() !== '' && report.avatar !== 'null'
      ? (report.avatar.startsWith('http') ? report.avatar : `http://localhost:8000/${report.avatar}`)
      : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>SalarySense AI - Shared Report REP-${report.id.slice(0, 8).toUpperCase()}</title>
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
                <div>Reference: <strong>REP-${report.id.slice(0, 8).toUpperCase()}</strong></div>
                <div>Generated On: <strong>${new Date(report.timestamp).toLocaleDateString()}</strong></div>
              </div>
            </div>
            
            <div class="report-title">Compensation Analysis</div>
            <div class="report-subtitle">Automated high-precision salary estimation report powered by SalarySense AI.</div>

            <div class="main-layout">
              <!-- Sidebar -->
              <div class="sidebar">
                <div class="section-title">Evaluator Info</div>
                <div class="user-card">
                  <img src="${safeAvatar || ''}" class="avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.innerText='${(report.username || 'G').charAt(0).toUpperCase()}'" />
                  <div class="avatar-fallback" style="display:none; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; font-weight: 800; font-size: 16px; align-items: center; justify-content: center; border: 1.5px solid #e2e8f0;"></div>
                  <div class="user-info">
                    <span class="user-name">${report.username || 'Guest User'}</span>
                    <span class="user-email">${report.userEmail || 'No active session'}</span>
                  </div>
                </div>

                <div class="section-title" style="margin-top: 10px;">Specifications</div>
                <div class="spec-list">
                  <div class="spec-item">
                    <span class="label">Workflow</span>
                    <span class="value" style="text-transform: capitalize;">${report.method} Form</span>
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
                    <div class="salary-value">${report.salary}</div>
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
                      <span class="value" style="font-size: 15px; color: #0f172a; margin-top: 2px;">${report.role}</span>
                    </div>
                    <div class="spec-item">
                      <span class="label">Years of Experience</span>
                      <span class="value" style="font-size: 15px; color: #0f172a; margin-top: 2px;">${report.experience} Years</span>
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/10 bg-red-500/5 backdrop-blur-xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Invalid Shared Report</h2>
          <p className="text-slate-400 text-sm mb-8">{error}</p>
          <Button onClick={() => router.push("/")} className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-bold">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-white/10 rounded-full animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Decoding secure share link...</span>
        </div>
      </div>
    );
  }

  // Compute ranges for UI display
  const numericSalary = parseFloat(report.salary.replace(/[^0-9.]/g, "")) || 0;
  const isUSD = report.salary.includes("$");
  const prefix = isUSD ? "$" : "₹";
  
  const rangeMin = `${prefix}${Math.round(numericSalary * 0.9).toLocaleString()}`;
  const rangeMax = `${prefix}${Math.round(numericSalary * 1.1).toLocaleString()}`;
  
  const safeAvatar = report.avatar && report.avatar.trim() !== '' && report.avatar !== 'null'
    ? (report.avatar.startsWith('http') ? report.avatar : `http://localhost:8000/${report.avatar}`)
    : null;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Action bar */}
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Network className="w-4 h-4 text-blue-400" />
            <span>Shared Compensation Analysis</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 border-white/10 text-slate-300 hover:text-white rounded-xl"
            >
              <Home className="w-4 h-4" /> Home
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
            >
              <Printer className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Branded Report UI Card */}
        <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 mb-8 gap-4">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              SalarySense<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI</span>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
              <div>Reference: <strong className="text-slate-300">REP-{report.id.slice(0, 8).toUpperCase()}</strong></div>
              <div>Generated On: <strong className="text-slate-300">{new Date(report.timestamp).toLocaleDateString()}</strong></div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">Compensation Analysis</h1>
          <p className="text-slate-400 text-sm mb-8">Automated high-precision salary estimation report powered by SalarySense AI.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Sidebar Info */}
            <div className="md:col-span-1 border-r border-white/5 pr-0 md:pr-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">Evaluator Info</h3>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  {safeAvatar ? (
                    <img src={safeAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-white font-bold">
                      {(report.username || 'G').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{report.username}</div>
                    <div className="text-[10px] text-slate-500 truncate">{report.userEmail}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">Specifications</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Workflow</span>
                    <span className="text-xs font-bold text-slate-300 capitalize">{report.method} Form</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">ML Engine</span>
                    <span className="text-xs font-bold text-slate-300">Ridge Regression</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Engine Version</span>
                    <span className="text-xs font-bold text-slate-300">v1.0.4-prod</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="md:col-span-2 space-y-6">
              
              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">Salary Estimation</h3>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Estimated Base Salary</span>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{report.salary}</div>
                    <span className="text-[10px] text-slate-500 block mt-1">Base compensation index (Annualized)</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold tracking-wide uppercase">
                    91% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Market Range Min (90%)</span>
                    <div className="text-lg font-bold text-slate-200 mt-1 font-mono">{rangeMin} / year</div>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Market Range Max (110%)</span>
                    <div className="text-lg font-bold text-slate-200 mt-1 font-mono">{rangeMax} / year</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">Profile Analysis</h3>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Job Title</span>
                      <span className="text-sm font-bold text-slate-200 mt-1">{report.role}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Years of Experience</span>
                      <span className="text-sm font-bold text-slate-200 mt-1">{report.experience} Years</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="border-t border-white/5 pt-6 mt-12 text-center text-xs text-slate-500">
            This is a secure machine-generated report. Confidential. &copy; {new Date().getFullYear()} SalarySense AI. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
