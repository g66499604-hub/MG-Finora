import React, { useState } from 'react';
import { Account, Category, Transaction, TransactionType } from '../types';
import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES } from '../utils/financialEngine';
import { CategoryRuleEngine } from '../utils/categoryEngine';
import { useI18n } from '../i18n/I18nContext';
import { X, Sparkles, Check, Calendar } from 'lucide-react';

interface AddTransactionModalProps {
  accounts: Account[];
  categories: Category[];
  defaultCurrency: string;
  onSave: (tx: Transaction) => void;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  accounts,
  categories,
  defaultCurrency,
  onSave,
  onClose
}) => {
  const { t } = useI18n();
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [destAccountId, setDestAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto category suggestion
  const suggestedCategory = title.length >= 3 ? CategoryRuleEngine.suggestCategory(title, type === 'EXPENSE') : null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (val.length >= 3 && type !== 'TRANSFER') {
      const suggested = CategoryRuleEngine.suggestCategory(val, type === 'EXPENSE');
      const matched = categories.find(c => c.name.toLowerCase() === suggested.toLowerCase());
      if (matched) {
        setCategoryId(matched.id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a transaction title or description.');
      return;
    }
    if (!accountId) {
      setError('Please select an account.');
      return;
    }
    if (type === 'TRANSFER' && (!destAccountId || destAccountId === accountId)) {
      setError('Please select a distinct destination account for transfer.');
      return;
    }

    const catObj = categories.find(c => c.id === categoryId);
    const parsedDate = dateStr ? new Date(dateStr).getTime() : Date.now();

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      title: title.trim(),
      amount: numAmount,
      currency,
      categoryId,
      categoryName: catObj ? catObj.name : (type === 'TRANSFER' ? 'Transfer' : 'General'),
      accountId,
      destinationAccountId: type === 'TRANSFER' ? destAccountId : null,
      paymentMethod,
      merchant: merchant.trim(),
      notes: notes.trim(),
      transactionDate: parsedDate,
      createdAt: Date.now()
    };

    onSave(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#0C1830] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-[#E8C66D]/30 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-[#0C1830] dark:text-white">{t('action_add_transaction')}</h3>
            <p className="text-xs text-slate-400">Record income, expenses, card purchases or transfers</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Type Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#111C30] rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800">
            {(['EXPENSE', 'INCOME', 'TRANSFER', 'CREDIT_CARD_PURCHASE'] as TransactionType[]).map((tType) => (
              <button
                type="button"
                key={tType}
                onClick={() => setType(tType)}
                className={`py-2 rounded-lg transition-all text-center truncate ${
                  type === tType
                    ? 'bg-[#0C1830] text-[#E8C66D] dark:bg-[#E8C66D] dark:text-[#0C1830] shadow'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {tType === 'CREDIT_CARD_PURCHASE' ? 'Card Purchase' : tType.charAt(0) + tType.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Amount, Currency & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_amount')}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">
                    {CURRENCY_SYMBOLS[currency] || currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E8C66D]"
                    required
                  />
                </div>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 px-2 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-800 dark:text-white"
                >
                  {SUPPORTED_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_date')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Title & Auto-Suggestion */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Al-Fatah Grocery, Fuel, Upwork Freelance"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E8C66D]"
              required
            />
            {suggestedCategory && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#172A47] dark:text-[#E8C66D] font-medium pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Auto-suggested Category: <strong>{suggestedCategory}</strong></span>
              </div>
            )}
          </div>

          {/* Category Picker (if not transfer) */}
          {type !== 'TRANSFER' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_category')}</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories
                  .filter(c => (type === 'INCOME' ? !c.isExpense : c.isExpense))
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
          )}

          {/* Account Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {type === 'TRANSFER' ? 'From Account' : t('label_account')}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
                required
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                ))}
              </select>
            </div>

            {type === 'TRANSFER' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_to_account')}</label>
                <select
                  value={destAccountId}
                  onChange={(e) => setDestAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
                  required
                >
                  {accounts.filter(a => a.id !== accountId).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Payment Method & Merchant */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_payment_method')}</label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Cash, Card, Transfer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_merchant')}</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('label_notes')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reference, receipt notes, tags..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C30] text-slate-900 dark:text-white"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-semibold">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0C1830] dark:bg-[#E8C66D] text-[#E8C66D] dark:text-[#0C1830] hover:opacity-90 flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              <span>{t('action_save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
