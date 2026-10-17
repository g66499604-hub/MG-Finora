import React, { useState } from 'react';
import { Bill } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { Receipt, Plus, CheckCircle, Clock, Trash2, Calendar } from 'lucide-react';

interface BillsProps {
  bills: Bill[];
  currency: string;
  onAddBill: (bill: Bill) => void;
  onTogglePaid: (billId: string) => void;
  onDeleteBill: (id: string) => void;
}

export const Bills: React.FC<BillsProps> = ({
  bills,
  currency,
  onAddBill,
  onTogglePaid,
  onDeleteBill
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<'ONCE' | 'MONTHLY' | 'YEARLY'>('MONTHLY');

  const unpaidTotal = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!name.trim() || isNaN(amt) || amt <= 0) return;

    const newBill: Bill = {
      id: `bill_${Date.now()}`,
      name: name.trim(),
      provider: provider.trim() || 'Utility Provider',
      categoryId: 'cat_electricity',
      categoryName: 'Utilities',
      amount: amt,
      currency,
      dueDate: dueDate ? new Date(dueDate).getTime() : Date.now() + 7 * 86400000,
      recurrence,
      isPaid: false
    };

    onAddBill(newBill);
    setName('');
    setProvider('');
    setAmount('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Bills & Obligations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage recurring utility bills, internet, and dues</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#172A47] hover:bg-[#0C1830] text-[#E8C66D] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 self-start shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* KPI banner */}
      <div className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Unpaid Dues</div>
            <div className="text-xl font-extrabold text-orange-600 mt-0.5">{formatCurrency(unpaidTotal, currency)}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400 text-right">
          <div>{bills.filter(b => !b.isPaid).length} unpaid</div>
          <div>{bills.filter(b => b.isPaid).length} settled</div>
        </div>
      </div>

      {/* Bills list */}
      {bills.length === 0 ? (
        <div className="bg-white dark:bg-[#111C30] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
          <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">No scheduled bills or utilities yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bills.map(bill => {
            const isDueSoon = !bill.isPaid && bill.dueDate - Date.now() < 3 * 86400000;
            return (
              <div key={bill.id} className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      bill.isPaid ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-orange-50 text-orange-600 dark:bg-orange-950/40'
                    }`}>
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0C1830] dark:text-white">{bill.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{bill.provider} • {bill.recurrence}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteBill(bill.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due {new Date(bill.dueDate).toLocaleDateString()}</span>
                    </div>
                    {isDueSoon && (
                      <span className="text-[10px] font-bold text-rose-500">Due within 3 days!</span>
                    )}
                  </div>
                  <div className="text-base font-extrabold text-[#0C1830] dark:text-white">
                    {formatCurrency(bill.amount, bill.currency)}
                  </div>
                </div>

                <button
                  onClick={() => onTogglePaid(bill.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    bill.isPaid
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-[#172A47] text-white hover:bg-[#0C1830]'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{bill.isPaid ? 'Settled (Click to Reopen)' : 'Mark as Paid'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-[#0C1830] dark:text-white mb-4">Add Recurring Bill</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bill Title</label>
                <input
                  type="text"
                  placeholder="e.g. LESCO Electricity Bill"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Provider</label>
                <input
                  type="text"
                  placeholder="e.g. LESCO Lahore"
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Frequency</label>
                <select
                  value={recurrence}
                  onChange={e => setRecurrence(e.target.value as any)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="ONCE">One-time</option>
                </select>
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
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
