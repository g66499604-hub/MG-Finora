import React from 'react';
import { FinoraScreen } from '../types';

interface FooterProps {
  onNavigate?: (screen: FinoraScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-[#172A47] bg-white dark:bg-[#0C1830] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24 sm:pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#172A47] to-[#0C1830] border border-[#E8C66D]/40 flex items-center justify-center font-extrabold text-[#E8C66D] text-sm shadow-inner">
                MG
              </div>
              <span className="font-bold text-base tracking-wide text-[#0C1830] dark:text-white">
                MG Finora
              </span>
              <span className="text-[10px] font-bold text-[#E8C66D] bg-[#E8C66D]/10 px-2 py-0.5 rounded-full border border-[#E8C66D]/20">
                Fintech
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Master Your Money • Smart Budgeting • Financial Clarity. Local-first personal finance platform.
            </p>
          </div>

          {/* Quick Links */}
          {onNavigate && (
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => onNavigate('DASHBOARD')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('TRANSACTIONS')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                Transactions
              </button>
              <button
                onClick={() => onNavigate('BUDGETS')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                Budgets
              </button>
              <button
                onClick={() => onNavigate('REPORTS')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                Reports
              </button>
              <button
                onClick={() => onNavigate('ABOUT')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                About
              </button>
              <button
                onClick={() => onNavigate('SETTINGS')}
                className="hover:text-[#E8C66D] transition-colors"
              >
                Settings
              </button>
            </div>
          )}
        </div>

        {/* Divider & Branding Text */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div className="font-medium text-slate-700 dark:text-slate-200">
            Developed by M.M.H.J Tech, A Company by Mian Muhammad Hassan Jan
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>© {new Date().getFullYear()} MG Finora. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
