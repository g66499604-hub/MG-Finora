import React, { useState } from 'react';
import { Account, SavingsGoal } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { Plus, PiggyBank, Trash2, ArrowUpRight } from 'lucide-react';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  accounts: Account[];
  currency: string;
  onAddGoal: (goal: SavingsGoal) => void;
  onContribute: (goalId: string, amount: number, accountId: string) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  accounts,
  currency,
  onAddGoal,
  onContribute,
  onDeleteGoal
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [desc, setDesc] = useState('');

  // Contribution states
  const [contribAmount, setContribAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!name.trim() || isNaN(target) || target <= 0) return;

    onAddGoal({
      id: `goal_${Date.now()}`,
      name: name.trim(),
      targetAmount: target,
      currentAmount: 0,
      currency,
      targetDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
      description: desc.trim(),
      colorHex: '#E8C66D'
    });
    setName('');
    setTargetAmount('');
    setDesc('');
    setShowAdd(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contribAmount);
    if (!contributeGoal || isNaN(amt) || amt <= 0 || !sourceAccountId) return;
    onContribute(contributeGoal.id, amt, sourceAccountId);
    setContribAmount('');
    setContributeGoal(null);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Savings Goals</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Emergency fund, milestone targets & dedicated stashes</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-[#111C30] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-400">No savings milestones configured yet.</p>
          <button onClick={() => setShowAdd(true)} className="bg-[#172A47] text-white text-xs font-bold px-4 py-2 rounded-xl">
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(g => {
            const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
            const isComplete = g.currentAmount >= g.targetAmount;

            return (
              <div
                key={g.id}
                className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0C1830] dark:text-white">{g.name}</h3>
                      {g.description && <p className="text-[11px] text-slate-400">{g.description}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-[#16A085]' : 'bg-[#E8C66D]'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-200">
                      Saved: {formatCurrency(g.currentAmount, g.currency)} ({pct.toFixed(0)}%)
                    </span>
                    <span className="text-slate-400">
                      Target: {formatCurrency(g.targetAmount, g.currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">
                    Remaining: {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount), g.currency)}
                  </span>
                  <button
                    onClick={() => {
                      setContributeGoal(g);
                      setContribAmount('');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#172A47] dark:text-[#E8C66D] hover:underline"
                  >
                    <span>Deposit Funds</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">New Savings Goal</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Goal Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Emergency Fund, Laptop, Travel"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Amount</label>
                <input
                  type="number"
                  step="any"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description (Optional)</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short note on goal purpose"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
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
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Contribution Modal */}
      {contributeGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">Deposit to {contributeGoal.name}</h3>
            <form onSubmit={handleDeposit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Contribution Amount</label>
                <input
                  type="number"
                  step="any"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Deduct From Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.currentBalance, acc.currency)})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContributeGoal(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow">
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
