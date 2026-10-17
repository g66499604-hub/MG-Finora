import React, { useState } from 'react';
import { Account, Bill, Budget, FinoraScreen, SavingsGoal, Transaction, UserProfile } from '../types';
import { FinancialSummary, calculateBudgetSpending, formatCurrency } from '../utils/financialEngine';
import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  CreditCard,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlusCircle,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  summary: FinancialSummary;
  profile: UserProfile;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: SavingsGoal[];
  bills: Bill[];
  onNavigate: (screen: FinoraScreen) => void;
  onQuickAdd: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  profile,
  transactions,
  accounts,
  budgets,
  goals,
  bills,
  onNavigate,
  onQuickAdd,
  onDeleteTransaction,
}) => {
  const [period, setPeriod] = useState<'month' | 'last_month' | 'year' | 'all'>('month');
  const currency = profile.defaultCurrency || 'PKR';

  // Budget warnings (>= 75%)
  const budgetAlerts = budgets.map(b => {
    const spent = calculateBudgetSpending(b, transactions, currency);
    const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
    return { budget: b, spent, pct };
  }).filter(b => b.pct >= 75);

  const unpaidBills = bills.filter(b => !b.isPaid).slice(0, 3);
  const recentTransactions = [...transactions].sort((a, b) => b.transactionDate - a.transactionDate).slice(0, 5);

  // Category Breakdown for expenses
  const expenseTxs = transactions.filter(t => t.type === 'EXPENSE' || t.type === 'CREDIT_CARD_PURCHASE' || t.type === 'FEE');
  const categoryTotals: Record<string, number> = {};
  expenseTxs.forEach(t => {
    const cat = t.categoryName || 'Other Expense';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0C1830] via-[#172A47] to-[#1E3A63] text-white p-6 rounded-2xl shadow-lg border border-[#E8C66D]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#E8C66D] font-bold">Fintech Executive Overview</div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">Hello, {profile.displayName || 'Finora Member'}</h1>
          <p className="text-xs text-slate-300 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onQuickAdd}
            className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'month', label: 'This Month' },
          { id: 'last_month', label: 'Last Month' },
          { id: 'year', label: 'This Year' },
          { id: 'all', label: 'All Time' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setPeriod(item.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              period === item.id
                ? 'bg-[#172A47] text-white dark:bg-[#E8C66D] dark:text-[#0C1830]'
                : 'bg-white dark:bg-[#111C30] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div
          onClick={() => onNavigate('ACCOUNTS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Balance</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#0C1830] dark:text-white mt-2 truncate">
            {formatCurrency(summary.totalBalance, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{accounts.length} active ledgers</div>
        </div>

        {/* Net Cash Flow */}
        <div
          onClick={() => onNavigate('REPORTS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Cash Flow</span>
            <div className={`p-2 rounded-lg ${summary.netCashFlow >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-extrabold mt-2 truncate ${summary.netCashFlow >= 0 ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
            {summary.netCashFlow >= 0 ? '+' : ''}{formatCurrency(summary.netCashFlow, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{summary.netCashFlow >= 0 ? 'Surplus' : 'Deficit'} position</div>
        </div>

        {/* Total Income */}
        <div
          onClick={() => onNavigate('INCOME')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Income</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <ArrowDownCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#16A085] mt-2 truncate">
            {formatCurrency(summary.totalIncome, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total revenue & inflows</div>
        </div>

        {/* Total Expenses */}
        <div
          onClick={() => onNavigate('EXPENSES')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Expenses</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#DC5A63] mt-2 truncate">
            {formatCurrency(summary.totalExpense, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Expenditures & card spending</div>
        </div>

        {/* Savings Balance */}
        <div
          onClick={() => onNavigate('SAVINGS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Savings Stash</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-[#0C1830] dark:text-white mt-2 truncate">
            {formatCurrency(summary.totalSavings, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{goals.length} target milestones</div>
        </div>

        {/* Outstanding Debt */}
        <div
          onClick={() => onNavigate('LOANS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-[#172A47] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outstanding Debt</span>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-orange-600 mt-2 truncate">
            {formatCurrency(summary.totalBorrowed + summary.totalCreditCardDue, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cards & borrowed loans</div>
        </div>
      </div>

      {/* Budget Alerts Banner */}
      {budgetAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Budget Alert: {budgetAlerts[0].budget.name} has reached {budgetAlerts[0].pct.toFixed(0)}%
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300">
                Spent {formatCurrency(budgetAlerts[0].spent, currency)} of {formatCurrency(budgetAlerts[0].budget.amount, currency)} limit.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('BUDGETS')}
            className="text-xs font-bold text-[#172A47] dark:text-[#E8C66D] hover:underline"
          >
            Review
          </button>
        </div>
      )}

      {/* Inflow vs Outflow Visual Bar */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Cash Flow Ratio (Inflow vs Outflow)</h2>
          <span className="text-xs text-slate-400 font-medium">P&L Balance</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
          {summary.totalIncome + summary.totalExpense > 0 ? (
            <>
              <div
                className="bg-[#16A085] h-full transition-all duration-500"
                style={{ width: `${(summary.totalIncome / (summary.totalIncome + summary.totalExpense)) * 100}%` }}
                title="Income"
              />
              <div
                className="bg-[#DC5A63] h-full transition-all duration-500"
                style={{ width: `${(summary.totalExpense / (summary.totalIncome + summary.totalExpense)) * 100}%` }}
                title="Expenses"
              />
            </>
          ) : (
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-full" />
          )}
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-[#16A085]" /> Inflow: {formatCurrency(summary.totalIncome, currency)}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600">
            <span className="w-2 h-2 rounded-full bg-[#DC5A63]" /> Outflow: {formatCurrency(summary.totalExpense, currency)}
          </span>
        </div>
      </div>

      {/* Top Expense Categories & Upcoming Bills Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Spending Categories */}
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Top Expense Categories</h2>
            <button onClick={() => onNavigate('EXPENSES')} className="text-xs text-[#172A47] dark:text-[#E8C66D] font-bold hover:underline">
              View All
            </button>
          </div>
          {sortedCategories.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No expense records in this period.</p>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([cat, amt]) => {
                const pct = summary.totalExpense > 0 ? (amt / summary.totalExpense) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{cat}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(amt, currency)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#172A47] dark:bg-[#E8C66D] h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Bills */}
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Upcoming Obligations</h2>
            <button onClick={() => onNavigate('BILLS')} className="text-xs text-[#172A47] dark:text-[#E8C66D] font-bold hover:underline">
              Schedule
            </button>
          </div>
          {unpaidBills.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All bills are currently settled!</p>
          ) : (
            <div className="space-y-2.5">
              {unpaidBills.map(b => (
                <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#172A47]/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.provider} • Due {new Date(b.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-[#DC5A63]">
                    {formatCurrency(b.amount, b.currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Recent Activity</h2>
            <p className="text-[11px] text-slate-400">Latest recorded transactions</p>
          </div>
          <button
            onClick={() => onNavigate('TRANSACTIONS')}
            className="text-xs font-bold text-[#172A47] dark:text-[#E8C66D] flex items-center gap-1 hover:underline"
          >
            <span>View All ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400">No transactions recorded yet.</p>
            <button
              onClick={onQuickAdd}
              className="bg-[#172A47] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Add First Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map(tx => {
              const isIncome = tx.type === 'INCOME' || tx.type === 'INTEREST' || tx.type === 'REFUND';
              const isExpense = tx.type === 'EXPENSE' || tx.type === 'FEE' || tx.type === 'CREDIT_CARD_PURCHASE';
              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
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
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{tx.categoryName || 'General'}</span>
                        <span>•</span>
                        <span>{new Date(tx.transactionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-bold text-xs ${isIncome ? 'text-[#16A085]' : isExpense ? 'text-[#DC5A63]' : 'text-slate-700 dark:text-slate-300'}`}>
                      {isIncome ? '+' : isExpense ? '-' : ''}{formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.paymentMethod}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
