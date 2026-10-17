import React, { useState } from 'react';
import { Category, Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/financialEngine';
import { StorageService } from '../utils/storage';
import { Search, Download, Trash2, Plus, Filter, Tag } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  onAddTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  categories,
  currency,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = transactions.filter(t => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.merchant && t.merchant.toLowerCase().includes(search.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase())) ||
      (t.categoryName && t.categoryName.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      selectedType === 'ALL' ||
      (selectedType === 'INCOME' && (t.type === 'INCOME' || t.type === 'INTEREST' || t.type === 'REFUND')) ||
      (selectedType === 'EXPENSE' && (t.type === 'EXPENSE' || t.type === 'FEE' || t.type === 'CREDIT_CARD_PURCHASE')) ||
      (selectedType === 'TRANSFER' && t.type === 'TRANSFER');

    const matchesCategory =
      selectedCat === 'ALL' || t.categoryId === selectedCat || t.categoryName === selectedCat;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleExportCsv = () => {
    const csvData = StorageService.exportCsv(filtered);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mg_finora_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Transaction Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter, and audit journal entries</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C30] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onAddTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, merchant, notes..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172A47]/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#172A47]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          {['ALL', 'EXPENSE', 'INCOME', 'TRANSFER'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                selectedType === type
                  ? 'bg-[#172A47] text-white dark:bg-[#E8C66D] dark:text-[#0C1830]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Record Counter */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>Showing {filtered.length} of {transactions.length} records</span>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-[#111C30] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p>No transactions match your search or filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(tx => {
              const isIncome = tx.type === 'INCOME' || tx.type === 'INTEREST' || tx.type === 'REFUND';
              const isExpense = tx.type === 'EXPENSE' || tx.type === 'FEE' || tx.type === 'CREDIT_CARD_PURCHASE';

              return (
                <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isIncome ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' :
                      isExpense ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {isIncome ? '+' : isExpense ? '-' : '⇄'}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{tx.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {tx.categoryName || 'General'}
                        </span>
                        <span>•</span>
                        <span>{new Date(tx.transactionDate).toLocaleDateString()}</span>
                        {tx.merchant && (
                          <>
                            <span>•</span>
                            <span className="truncate">{tx.merchant}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className={`font-bold text-xs ${isIncome ? 'text-[#16A085]' : isExpense ? 'text-[#DC5A63]' : 'text-slate-700 dark:text-slate-300'}`}>
                        {isIncome ? '+' : isExpense ? '-' : ''}{formatCurrency(tx.amount, tx.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">{tx.paymentMethod}</div>
                    </div>

                    <button
                      onClick={() => setDeleteConfirmId(tx.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in">
            <h3 className="font-bold text-sm text-[#0C1830] dark:text-white">Delete Transaction?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this record? Account balances will automatically recalculate.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTransaction(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
