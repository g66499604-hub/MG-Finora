import React, { useState } from 'react';
import { Bill, Loan, Transaction } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { Calendar as CalendarIcon, Clock, Receipt, HandCoins, ArrowRight } from 'lucide-react';

interface CalendarProps {
  transactions: Transaction[];
  bills: Bill[];
  loans: Loan[];
  currency: string;
}

export const FinancialCalendar: React.FC<CalendarProps> = ({
  transactions,
  bills,
  loans,
  currency
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const year = new Date().getFullYear();

  // Combine events
  const events = [
    ...bills.map(b => ({
      id: b.id,
      title: b.name,
      amount: b.amount,
      type: 'BILL' as const,
      date: new Date(b.dueDate),
      isPaid: b.isPaid,
      currency: b.currency
    })),
    ...loans.filter(l => l.dueDate).map(l => ({
      id: l.id,
      title: `Loan Due: ${l.name}`,
      amount: l.principalAmount - l.repaidAmount,
      type: 'LOAN' as const,
      date: new Date(l.dueDate),
      isPaid: l.principalAmount - l.repaidAmount <= 0,
      currency: l.currency
    })),
    ...transactions.slice(0, 15).map(t => ({
      id: t.id,
      title: t.title,
      amount: t.amount,
      type: 'TRANSACTION' as const,
      date: new Date(t.transactionDate),
      isPaid: true,
      currency: t.currency
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Financial Calendar & Timeline</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled obligations, bill payment due dates and chronologic ledger</p>
      </div>

      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#172A47] dark:text-[#E8C66D]" />
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Upcoming Due Dates & History</h2>
          </div>
          <span className="text-xs text-slate-400">{events.length} timeline entries</span>
        </div>

        <div className="space-y-3">
          {events.map((ev, i) => (
            <div key={`${ev.id}_${i}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#172A47]/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  ev.type === 'BILL' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/60' :
                  ev.type === 'LOAN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950/60'
                }`}>
                  {ev.type === 'BILL' ? <Receipt className="w-4 h-4" /> : ev.type === 'LOAN' ? <HandCoins className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {ev.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {ev.type}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(ev.amount, ev.currency)}
                </div>
                <div className={`text-[10px] ${ev.isPaid ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}`}>
                  {ev.isPaid ? 'Settled' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
