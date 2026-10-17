import React, { useState } from 'react';
import { Account, AccountType, Transaction } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { Plus, Wallet, ArrowRightLeft, Trash2 } from 'lucide-react';

interface AccountsProps {
  accounts: Account[];
  currency: string;
  onAddAccount: (acc: Account) => void;
  onDeleteAccount: (id: string) => void;
  onTransfer: (tx: Transaction) => void;
}

export const Accounts: React.FC<AccountsProps> = ({
  accounts,
  currency,
  onAddAccount,
  onDeleteAccount,
  onTransfer
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('BANK_ACCOUNT');
  const [openingBalance, setOpeningBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  // Transfer states
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const openBal = parseFloat(openingBalance) || 0;
    const limit = parseFloat(creditLimit) || 0;

    onAddAccount({
      id: `acc_${Date.now()}`,
      name: name.trim(),
      type,
      currency,
      openingBalance: openBal,
      currentBalance: openBal,
      creditLimit: limit,
      statementDay: 1,
      dueDay: 15,
      notes: '',
      isArchived: false,
      colorHex: type === 'CREDIT_CARD' ? '#C0392B' : '#172A47'
    });

    setName('');
    setOpeningBalance('');
    setCreditLimit('');
    setShowAdd(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0 || !fromId || !toId || fromId === toId) return;

    const fromAcc = accounts.find(a => a.id === fromId);
    const toAcc = accounts.find(a => a.id === toId);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'TRANSFER',
      title: `Transfer to ${toAcc?.name || 'Account'}`,
      amount: amt,
      currency: fromAcc?.currency || currency,
      categoryId: '',
      categoryName: 'Transfer',
      accountId: fromId,
      destinationAccountId: toId,
      paymentMethod: 'Internal Transfer',
      notes: transferNotes.trim(),
      transactionDate: Date.now(),
      createdAt: Date.now()
    };

    onTransfer(tx);
    setTransferAmount('');
    setTransferNotes('');
    setShowTransfer(false);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Accounts & Wallets</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Cash in hand, bank accounts, and mobile wallets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C30] hover:bg-slate-50 text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const isCard = acc.type === 'CREDIT_CARD';
          return (
            <div
              key={acc.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0C1830] to-[#172A47] text-white shadow-md border border-[#E8C66D]/20 space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#E8C66D]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{acc.name}</h3>
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider">{acc.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteAccount(acc.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                  title="Delete account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="text-[11px] text-slate-300">
                  {isCard ? 'Card Balance (Negative = Owed)' : 'Current Balance'}
                </div>
                <div className={`text-xl sm:text-2xl font-extrabold mt-0.5 ${isCard && acc.currentBalance < 0 ? 'text-rose-400' : 'text-white'}`}>
                  {formatCurrency(acc.currentBalance, acc.currency)}
                </div>
                {isCard && acc.creditLimit > 0 && (
                  <div className="text-[11px] text-[#E8C66D] mt-1">
                    Credit Limit: {formatCurrency(acc.creditLimit, acc.currency)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">Add Account / Wallet</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Account Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meezan Bank, JazzCash, Cash"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Account Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                >
                  <option value="BANK_ACCOUNT">Bank Account</option>
                  <option value="CASH">Cash in Hand</option>
                  <option value="EASYPAISA">Easypaisa</option>
                  <option value="JAZZCASH">JazzCash</option>
                  <option value="MOBILE_WALLET">Mobile Wallet</option>
                  <option value="SAVINGS_ACCOUNT">Savings Account</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="OTHER">Other Account</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Opening Balance</label>
                <input
                  type="number"
                  step="any"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                />
              </div>

              {type === 'CREDIT_CARD' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Credit Limit</label>
                  <input
                    type="number"
                    step="any"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow">
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-[#0C1830] dark:text-white">Transfer Between Accounts</h3>
            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">From Account</label>
                <select
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.currentBalance, acc.currency)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">To Account</label>
                <select
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                >
                  {accounts.filter(a => a.id !== fromId).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.currentBalance, acc.currency)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Transfer Amount</label>
                <input
                  type="number"
                  step="any"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="10000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Notes (Optional)</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Reason for transfer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTransfer(false)} className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0C1830] text-[#E8C66D] shadow">
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
