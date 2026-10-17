import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { ArrowDownCircle, ArrowUpCircle, Plus } from 'lucide-react';

interface IncomeExpensesProps {
  transactions: Transaction[];
  currency: string;
  defaultTab?: 'income' | 'expense';
  onAddTransaction: () => void;
}

export const IncomeExpenses: React.FC<IncomeExpensesProps> = ({
  transactions,
  currency,
  defaultTab = 'expense',
  onAddTransaction
}) => {
  const [tab, setTab] = useState<'income' | 'expense'>(defaultTab);

  const isIncome = tab === 'income';
  const filtered = transactions.filter(t =>
    isIncome
      ? t.type === 'INCOME' || t.type === 'INTEREST' || t.type === 'REFUND'
      : t.type === 'EXPENSE' || t.type === 'FEE' || t.type === 'CREDIT_CARD_PURCHASE'
  );

  const total = filtered.reduce((acc, t) => acc + t.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  filtered.forEach(t => {
    const cat = t.categoryName || 'General';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });
  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Tab Header */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold max-w-sm">
        <button
          onClick={() => setTab('income')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'income' ? 'bg-white dark:bg-[#111C30] text-[#16A085] shadow' : 'text-slate-500'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Income Streams</span>
        </button>
        <button
          onClick={() => setTab('expense')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'expense' ? 'bg-white dark:bg-[#111C30] text-[#DC5A63] shadow' : 'text-slate-500'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Expense Outflows</span>
        </button>
      </div>

      {/* KPI Total Card */}
      <div className={`p-6 rounded-2xl border shadow-sm flex items-center justify-between ${
        isIncome
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50'
          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50'
      }`}>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isIncome ? 'Total Recorded Inflows' : 'Total Recorded Outflows'}
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${isIncome ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
            {formatCurrency(total, currency)}
          </div>
        </div>

        <button
          onClick={onAddTransaction}
          className="bg-[#0C1830] text-white dark:bg-[#E8C66D] dark:text-[#0C1830] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add {isIncome ? 'Income' : 'Expense'}</span>
        </button>
      </div>

      {/* Category Distribution Breakdown */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#0C1830] dark:text-white">Category Distribution Rankings</h3>
        {sortedCats.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No records found for this view.</p>
        ) : (
          <div className="space-y-3">
            {sortedCats.map(([cat, amt]) => {
              const pct = total > 0 ? (amt / total) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(amt, currency)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isIncome ? 'bg-[#16A085]' : 'bg-[#DC5A63]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-[#111C30] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-[#0C1830] dark:text-white">
          Itemized Ledger History ({filtered.length})
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{t.title}</div>
                <div className="text-[10px] text-slate-400">{t.categoryName} • {new Date(t.transactionDate).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${isIncome ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                </div>
                <div className="text-[10px] text-slate-400">{t.paymentMethod}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
