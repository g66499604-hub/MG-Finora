import React, { useState } from 'react';
import { Loan } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { HandCoins, Plus, CheckCircle2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface LoansProps {
  loans: Loan[];
  currency: string;
  onAddLoan: (loan: Loan) => void;
  onRepayLoan: (loanId: string, amount: number) => void;
  onDeleteLoan: (id: string) => void;
}

export const Loans: React.FC<LoansProps> = ({
  loans,
  currency,
  onAddLoan,
  onRepayLoan,
  onDeleteLoan
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'LENT' | 'BORROWED'>('ALL');
  const [repayId, setRepayId] = useState<string | null>(null);
  const [repayAmount, setRepayAmount] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [direction, setDirection] = useState<'LENT' | 'BORROWED'>('LENT');
  const [principal, setPrincipal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const totalLent = loans.filter(l => l.direction === 'LENT').reduce((sum, l) => sum + (l.principalAmount - l.repaidAmount), 0);
  const totalBorrowed = loans.filter(l => l.direction === 'BORROWED').reduce((sum, l) => sum + (l.principalAmount - l.repaidAmount), 0);

  const filtered = loans.filter(l => filter === 'ALL' || l.direction === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(principal);
    if (!name.trim() || isNaN(p) || p <= 0) return;

    const newLoan: Loan = {
      id: `loan_${Date.now()}`,
      name: name.trim(),
      contactName: contactName.trim() || 'General',
      direction,
      principalAmount: p,
      repaidAmount: 0,
      currency,
      issueDate: Date.now(),
      dueDate: dueDate ? new Date(dueDate).getTime() : Date.now() + 30 * 86400000,
      notes: notes.trim()
    };

    onAddLoan(newLoan);
    setName('');
    setContactName('');
    setPrincipal('');
    setNotes('');
    setShowAdd(false);
  };

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(repayAmount);
    if (!repayId || isNaN(amt) || amt <= 0) return;
    onRepayLoan(repayId, amt);
    setRepayId(null);
    setRepayAmount('');
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Loans & Debts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track money lent to friends and borrowed liabilities</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#172A47] hover:bg-[#0C1830] text-[#E8C66D] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 self-start shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Record Loan / Debt</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Money Lent (Receivable)</div>
            <div className="text-xl font-extrabold text-[#16A085] mt-1">{formatCurrency(totalLent, currency)}</div>
            <div className="text-[11px] text-slate-400">Assets owed back to you</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Money Borrowed (Payable)</div>
            <div className="text-xl font-extrabold text-orange-600 mt-1">{formatCurrency(totalBorrowed, currency)}</div>
            <div className="text-[11px] text-slate-400">Liabilities you owe others</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'LENT', 'BORROWED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === f
                ? 'bg-[#172A47] text-white dark:bg-[#E8C66D] dark:text-[#0C1830]'
                : 'bg-white dark:bg-[#111C30] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {f === 'ALL' ? 'All Loans' : f === 'LENT' ? 'Money Lent' : 'Money Borrowed'}
          </button>
        ))}
      </div>

      {/* Loans List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#111C30] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
          <HandCoins className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">No loan or debt records registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(loan => {
            const remaining = loan.principalAmount - loan.repaidAmount;
            const pct = loan.principalAmount > 0 ? (loan.repaidAmount / loan.principalAmount) * 100 : 0;
            const isSettled = remaining <= 0;

            return (
              <div key={loan.id} className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 ${
                      loan.direction === 'LENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400'
                    }`}>
                      {loan.direction === 'LENT' ? 'Lent (Receivable)' : 'Borrowed (Payable)'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0C1830] dark:text-white">{loan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Contact: {loan.contactName}</p>
                  </div>
                  <button
                    onClick={() => onDeleteLoan(loan.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Repaid: {formatCurrency(loan.repaidAmount, loan.currency)}</span>
                    <span className="font-bold text-[#0C1830] dark:text-white">Principal: {formatCurrency(loan.principalAmount, loan.currency)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#16A085] h-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{pct.toFixed(0)}% Settled</span>
                    <span className={remaining > 0 ? 'font-bold text-rose-500' : 'font-bold text-emerald-500'}>
                      {remaining > 0 ? `Remaining: ${formatCurrency(remaining, loan.currency)}` : 'Fully Settled'}
                    </span>
                  </div>
                </div>

                {loan.dueDate && (
                  <div className="text-[11px] text-slate-400">
                    Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                  </div>
                )}

                {!isSettled && (
                  <button
                    onClick={() => {
                      setRepayId(loan.id);
                      setRepayAmount(remaining.toString());
                    }}
                    className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-[#172A47]/40 dark:hover:bg-[#172A47] text-xs font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Record Repayment</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-[#0C1830] dark:text-white mb-4">Record New Loan / Debt</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setDirection('LENT')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      direction === 'LENT' ? 'bg-[#172A47] text-white border-[#172A47]' : 'bg-white dark:bg-slate-900 border-slate-200'
                    }`}
                  >
                    Money Lent (I gave)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('BORROWED')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      direction === 'BORROWED' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white dark:bg-slate-900 border-slate-200'
                    }`}
                  >
                    Money Borrowed (I owe)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Laptop loan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Person / Entity</label>
                <input
                  type="text"
                  placeholder="e.g. Ali Raza"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Principal Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={principal}
                  onChange={e => setPrincipal(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#172A47] text-white rounded-lg hover:bg-[#0C1830]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repay Modal */}
      {repayId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-[#0C1830] dark:text-white mb-2">Record Repayment</h3>
            <form onSubmit={handleRepay} className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Repayment Amount ({currency})</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={e => setRepayAmount(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRepayId(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#16A085] text-white rounded-lg"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
