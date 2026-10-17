import React from 'react';
import { FinancialSummary, formatCurrency } from '../utils/financialEngine';
import { Account, Budget, Loan, SavingsGoal, Transaction } from '../types';
import { PieChart, TrendingUp, DollarSign, Wallet, ShieldCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface ReportsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: SavingsGoal[];
  loans: Loan[];
  currency: string;
}

export const Reports: React.FC<ReportsProps> = ({
  summary,
  transactions,
  accounts,
  goals,
  currency
}) => {
  const netWorth = summary.totalBalance + summary.totalSavings + summary.totalLent - (summary.totalBorrowed + summary.totalCreditCardDue);
  const savingsRate = summary.totalIncome > 0 ? Math.max(0, ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100) : 0;

  // Breakdown by account type
  const accountTypeTotals: Record<string, number> = {};
  accounts.forEach(a => {
    accountTypeTotals[a.type] = (accountTypeTotals[a.type] || 0) + a.currentBalance;
  });

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Financial Analytics & Net Worth</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Holistic balance sheet, cash velocity & savings metrics</p>
      </div>

      {/* Net Worth Hero Card */}
      <div className="bg-gradient-to-br from-[#0C1830] via-[#172A47] to-[#122238] p-6 rounded-2xl text-white shadow-xl border border-[#E8C66D]/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#E8C66D] font-bold">Consolidated Net Worth</div>
            <div className="text-3xl font-extrabold mt-1 text-white">
              {formatCurrency(netWorth, currency)}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-[#E8C66D]">
            <PieChart className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400">Total Liquid Assets</span>
            <div className="font-bold text-emerald-400 mt-0.5">{formatCurrency(summary.totalBalance, currency)}</div>
          </div>
          <div>
            <span className="text-slate-400">Savings Target Capital</span>
            <div className="font-bold text-amber-400 mt-0.5">{formatCurrency(summary.totalSavings, currency)}</div>
          </div>
          <div>
            <span className="text-slate-400">Loans Receivable</span>
            <div className="font-bold text-blue-400 mt-0.5">{formatCurrency(summary.totalLent, currency)}</div>
          </div>
          <div>
            <span className="text-slate-400">Total Liabilities</span>
            <div className="font-bold text-rose-400 mt-0.5">{formatCurrency(summary.totalBorrowed + summary.totalCreditCardDue, currency)}</div>
          </div>
        </div>
      </div>

      {/* Ratios Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Savings Rate</div>
          <div className="text-2xl font-extrabold text-[#16A085]">{savingsRate.toFixed(1)}%</div>
          <p className="text-[11px] text-slate-400">Proportion of earnings retained after expenses</p>
        </div>

        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Operating Surplus</div>
          <div className={`text-2xl font-extrabold ${summary.netCashFlow >= 0 ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
            {summary.netCashFlow >= 0 ? '+' : ''}{formatCurrency(summary.netCashFlow, currency)}
          </div>
          <p className="text-[11px] text-slate-400">Gross inflows minus expenditures</p>
        </div>

        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Ledger Count</div>
          <div className="text-2xl font-extrabold text-[#0C1830] dark:text-white">{accounts.length} Accounts</div>
          <p className="text-[11px] text-slate-400">Cash, banks, mobile wallets & cards</p>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Account Balances Overview</h2>
        <div className="space-y-3">
          {accounts.map(acc => {
            return (
              <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#172A47]/30 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: acc.colorHex || '#172A47' }}>
                    {acc.type === 'CASH' ? '💵' : acc.type === 'CREDIT_CARD' ? '💳' : '🏦'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</div>
                    <div className="text-[10px] text-slate-400">{acc.type}</div>
                  </div>
                </div>
                <div className={`text-xs font-bold ${acc.currentBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>
                  {formatCurrency(acc.currentBalance, acc.currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
