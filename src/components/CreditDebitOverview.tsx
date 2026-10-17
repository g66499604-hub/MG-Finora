import React from 'react';
import { Account } from '../types';
import { FinancialSummary, formatCurrency } from '../utils/financialEngine';
import { Scale, CreditCard, Wallet, ShieldAlert, CheckCircle } from 'lucide-react';

interface CreditDebitOverviewProps {
  summary: FinancialSummary;
  accounts: Account[];
  currency: string;
}

export const CreditDebitOverview: React.FC<CreditDebitOverviewProps> = ({
  summary,
  accounts,
  currency
}) => {
  const liquidAssets = summary.totalBalance;
  const totalDebts = summary.totalBorrowed + summary.totalCreditCardDue;
  const netLiquidity = liquidAssets - totalDebts;

  const creditCards = accounts.filter(a => a.type === 'CREDIT_CARD');
  const totalCardLimit = creditCards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalCardUsed = creditCards.reduce((sum, c) => sum + Math.abs(Math.min(0, c.currentBalance)), 0);
  const cardUtilization = totalCardLimit > 0 ? (totalCardUsed / totalCardLimit) * 100 : 0;

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Credit & Debit Position</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Total liquidity versus short and long-term debt liabilities</p>
      </div>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Liquid Cash</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#16A085] mt-2">{formatCurrency(liquidAssets, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Available in bank accounts & wallets</p>
        </div>

        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Obligations & Debt</span>
            <CreditCard className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#DC5A63] mt-2">{formatCurrency(totalDebts, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cards and outstanding debts</p>
        </div>

        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Net Liquid Position</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className={`text-2xl font-extrabold mt-2 ${netLiquidity >= 0 ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
            {netLiquidity >= 0 ? '+' : ''}{formatCurrency(netLiquidity, currency)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{netLiquidity >= 0 ? 'Comfortable liquidity surplus' : 'Liabilities exceed liquid assets'}</p>
        </div>
      </div>

      {/* Credit Card Utilization Meter */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Credit Card Utilization Index</h2>
            <p className="text-xs text-slate-400">Target below 30% for optimal credit score health</p>
          </div>
          <div className={`text-base font-extrabold ${cardUtilization > 50 ? 'text-rose-600' : cardUtilization > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {cardUtilization.toFixed(1)}%
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${cardUtilization > 50 ? 'bg-rose-500' : cardUtilization > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(cardUtilization, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500">
          <span>Total Balance Due: {formatCurrency(totalCardUsed, currency)}</span>
          <span>Approved Limit: {formatCurrency(totalCardLimit, currency)}</span>
        </div>
      </div>
    </div>
  );
};
