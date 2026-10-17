import React from 'react';
import { ShieldCheck, Info, CheckCircle2, Lock, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 sm:pb-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#172A47] to-[#0C1830] border border-[#E8C66D]/50 flex items-center justify-center font-black text-2xl text-[#E8C66D] shadow-lg mx-auto">
          MG
        </div>
        <h1 className="text-2xl font-extrabold text-[#0C1830] dark:text-white">MG Finora</h1>
        <p className="text-xs text-[#E8C66D] font-bold uppercase tracking-wider">Master Your Money • Financial Clarity</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Release Version 1.0.0 (Production Stable)</p>
      </div>

      <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0C1830] dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16A085]" />
          <span>Privacy & Architecture Philosophy</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          MG Finora is built as a <strong>Local-First Fintech Application</strong>. Every financial transaction, ledger, budget, and personal financial goal is persisted exclusively inside your web browser’s local storage. None of your sensitive banking data or net worth information is sent to third-party tracking servers.
        </p>

        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <Lock className="w-4 h-4 text-[#E8C66D] shrink-0 mt-0.5" />
            <span>Zero tracker beacons, zero telemetry cookies, zero external ads.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#16A085] shrink-0 mt-0.5" />
            <span>Full offline support with complete JSON snapshot export/import and CSV reporting.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <HeartHandshake className="w-4 h-4 text-[#2980B9] shrink-0 mt-0.5" />
            <span>Designed for multi-currency handling (PKR, USD, GBP, EUR, SAR, AED, INR, CAD, AUD).</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="font-medium text-slate-700 dark:text-slate-200">
          Developed by M.M.H.J Tech, A Company by Mian Muhammad Hassan Jan
        </div>
        <div className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} MG Finora. All rights reserved. Built for clarity and wealth building.
        </div>
      </div>
    </div>
  );
};
