import React, { useState } from 'react';
import { Account, Transaction } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { CreditCard as CardIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface CreditCardsProps {
  accounts: Account[];
  currency: string;
  onPayBill: (tx: Transaction) => void;
}

export const CreditCards: React.FC<CreditCardsProps> = ({ accounts, currency, onPayBill }) => {
  const creditCards = accounts.filter(a => a.type === 'CREDIT_CARD');
  const fundingAccounts = accounts.filter(a => a.type !== 'CREDIT_CARD');

  const [payingCard, setPayingCard] = useState<Account | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [fundingAccountId, setFundingAccountId] = useState(fundingAccounts[0]?.id || '');

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!payingCard || isNaN(amt) || amt <= 0 || !fundingAccountId) return;

    const fromAcc = accounts.find(a => a.id === fundingAccountId);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'CREDIT_CARD_PAYMENT',
      title: `Payment to ${payingCard.name}`,
      amount: amt,
      currency: payingCard.currency,
      categoryId: '',
      categoryName: 'Card Payment',
      accountId: fundingAccountId,
      destinationAccountId: payingCard.id,
      paymentMethod: fromAcc?.name || 'Bank Account',
      notes: 'Card statement settlement',
      transactionDate: Date.now(),
      createdAt: Date.now()
    };

    onPayBill(tx);
    setPayAmount('');
    setPayingCard(null);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Credit Cards</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track credit line limits, statement cycles, and settle outstanding dues</p>
      </div>

      {creditCards.length === 0 ? (
        <div className="bg-white dark:bg-[#111C30] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">No credit cards added. You can add one from Accounts & Wallets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creditCards.map(card => {
            const owed = card.currentBalance < 0 ? -card.currentBalance : 0;
            const available = Math.max(0, card.creditLimit - owed);
            const utilization = card.creditLimit > 0 ? (owed / card.creditLimit) * 100 : 0;

            return (
              <div
                key={card.id}
                className="bg-white dark:bg-[#111C30] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0C1830] dark:text-white">{card.name}</h3>
                      <p className="text-[11px] text-slate-400">Due: {card.dueDay}th of month</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    utilization > 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {utilization.toFixed(0)}% Utilized
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400">Outstanding Due</span>
                    <div className={`text-lg font-extrabold ${owed > 0 ? 'text-[#DC5A63]' : 'text-[#16A085]'}`}>
                      {formatCurrency(owed, card.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400">Available Credit</span>
                    <div className="text-lg font-extrabold text-[#0C1830] dark:text-white">
                      {formatCurrency(available, card.currency)}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${utilization > 50 ? 'bg-amber-500' : 'bg-[#172A47] dark:bg-[#E8C66D]'}`}
                    style={{ width: `${Math.min(100, utilization)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Limit: {formatCurrency(card.creditLimit, card.currency)}</span>
                  <button
                    onClick={() => {
                      setPayingCard(card);
                      setPayAmount(owed > 0 ? owed.toString() : '');
                    }}
                    className="bg-[#172A47] text-white dark:bg-[#E8C66D] dark:text-[#0C1830] px-3.5 py-1.5 rounded-lg font-bold text-xs shadow hover:opacity-95"
                  >
                    Pay Card Bill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pay Modal */}
      {payingCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">Settle {payingCard.name}</h3>
            <form onSubmit={handlePaySubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Payment Amount</label>
                <input
                  type="number"
                  step="any"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Deduct From Account</label>
                <select
                  value={fundingAccountId}
                  onChange={(e) => setFundingAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                >
                  {fundingAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.currentBalance, acc.currency)})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPayingCard(null)} className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
