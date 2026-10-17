import React, { useState } from 'react';
import { Budget, Category, Transaction } from '../types';
import { calculateBudgetSpending, formatCurrency } from '../utils/financialEngine';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetsProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  currency: string;
  onAddBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export const Budgets: React.FC<BudgetsProps> = ({
  budgets,
  categories,
  transactions,
  currency,
  onAddBudget,
  onDeleteBudget
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!name.trim() || isNaN(num) || num <= 0) return;

    const cat = categories.find(c => c.id === categoryId);
    const newBudget: Budget = {
      id: `bgt_${Date.now()}`,
      name: name.trim(),
      categoryId: categoryId || null,
      categoryName: cat ? cat.name : 'Overall Monthly Budget',
      amount: num,
      currency,
      period: 'MONTHLY',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime()
    };
    onAddBudget(newBudget);
    setName('');
    setAmount('');
    setCategoryId('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Budgets & Limits</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Establish category spending caps with automated alerts</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-[#111C30] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-400">No active budgets. Create a monthly overall or category cap.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[#172A47] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Create First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map(b => {
            const spent = calculateBudgetSpending(b, transactions, currency);
            const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
            const remaining = Math.max(0, b.amount - spent);
            const isOver = spent > b.amount;

            const barColor = isOver
              ? 'bg-[#DC5A63]'
              : pct >= 90
              ? 'bg-orange-500'
              : pct >= 75
              ? 'bg-amber-500'
              : 'bg-[#16A085]';

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#0C1830] dark:text-white">{b.name}</h3>
                    <p className="text-[11px] text-slate-400">{b.categoryName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pct >= 75 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOver ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isOver ? 'Exceeded' : `${pct.toFixed(0)}% Used`}
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteBudget(b.id)}
                      className="text-slate-300 hover:text-rose-500 p-1"
                      title="Delete budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">
                      Spent: {formatCurrency(spent, currency)} ({pct.toFixed(0)}%)
                    </span>
                    <span className="text-slate-400">
                      Limit: {formatCurrency(b.amount, b.currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                  <span>{isOver ? 'Over budget by' : 'Remaining balance:'}</span>
                  <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isOver ? formatCurrency(spent - b.amount, currency) : formatCurrency(remaining, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">Create Budget Cap</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Budget Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monthly Grocery Limit"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Category (Optional for Overall)</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                >
                  <option value="">Overall Monthly Budget (All Expenses)</option>
                  {categories.filter(c => c.isExpense).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Budget Limit Amount</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="30000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
