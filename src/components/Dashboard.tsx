import React, { useState } from 'react';
import { Account, Bill, Budget, FinoraScreen, SavingsGoal, Transaction, UserProfile } from '../types';
import { FinancialSummary, calculateBudgetSpending, formatCurrency, EXCHANGE_RATES_METADATA } from '../utils/financialEngine';
import { useI18n } from '../i18n/I18nContext';
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
  Crown,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers
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
  onDismissOnboarding?: () => void;
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
  onDismissOnboarding
}) => {
  const { t, formatDate, formatCurrencyLocale } = useI18n();
  const [period, setPeriod] = useState<'month' | 'last_month' | 'year' | 'all'>('month');
  const [showRatesInfo, setShowRatesInfo] = useState(false);
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
    <div className="space-y-6 pb-20 sm:pb-8 animate-fadeIn">
      {/* Executive Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#0C1830] via-[#172A47] to-[#1E3A63] text-white p-6 rounded-3xl shadow-xl border border-[#E8C66D]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#E8C66D] font-extrabold bg-[#E8C66D]/15 px-2.5 py-0.5 rounded-full border border-[#E8C66D]/30">
              MG-Finora Enterprise OS
            </span>
            <button
              onClick={() => onNavigate('ADMIN')}
              className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full transition"
            >
              <Crown className="w-3 h-3 text-[#E8C66D]" />
              <span>Owner Panel</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            {profile.displayName || 'Mian Muhammad Hassan Jan'}
          </h1>
          <p className="text-xs text-slate-300">
            {formatDate(Date.now())} • Reporting in <strong className="text-[#E8C66D]">{currency}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={onQuickAdd}
            className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('action_quick_add')}</span>
          </button>
        </div>
      </div>

      {/* Onboarding Welcome Callout if fresh installation */}
      {!profile.isOnboardingCompleted && (
        <div className="p-5 rounded-2xl bg-[#0C1830] text-slate-100 border border-[#E8C66D]/40 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-gradient-gold text-[#0C1830] shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{t('msg_welcome_onboarding')}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">v1.0 Ready</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                  {t('msg_onboarding_sub')} Designed & developed by <strong>M.M.H.J Tech</strong> under the leadership of founder <strong>Mian Muhammad Hassan Jan</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('ACCOUNTS')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#172A47] hover:bg-[#1f375c] text-white transition"
              >
                Setup Accounts
              </button>
              {onDismissOnboarding && (
                <button
                  onClick={onDismissOnboarding}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-300 transition"
                >
                  Got It
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Period Selection & Multi-Currency Transparency Tooltip */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'month', label: t('label_this_month') },
            { id: 'last_month', label: t('label_last_30_days') },
            { id: 'year', label: t('label_this_year') },
            { id: 'all', label: t('label_all') },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                period === item.id
                  ? 'bg-[#0C1830] text-[#E8C66D] dark:bg-[#E8C66D] dark:text-[#0C1830] shadow-sm'
                  : 'bg-white dark:bg-[#111C30] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowRatesInfo(!showRatesInfo)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#E8C66D] flex items-center gap-1 transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Multi-Currency Rule: {currency} Consolidation</span>
        </button>
      </div>

      {/* Exchange Rate Transparency Card */}
      {showRatesInfo && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 animate-fadeIn">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#E8C66D]" />
            <span>Multi-Currency Transparent Ledger Conversion</span>
          </div>
          <p className="leading-relaxed">
            All accounts and transactions preserve their original currency natively (e.g. USD, EUR, PKR, GBP, SAR, AED, INR). Aggregate net worth, income, and cash flow figures are consolidated into your reporting currency (<strong>{currency}</strong>) using reference exchange rates updated as of {EXCHANGE_RATES_METADATA.lastUpdated}.
          </p>
        </div>
      )}

      {/* Primary Financial Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div
          onClick={() => onNavigate('ACCOUNTS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_total_balance')}</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0C1830] dark:text-white mt-2 truncate">
            {formatCurrencyLocale(summary.totalBalance, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{accounts.length} active accounts & wallets</div>
        </div>

        {/* Net Cash Flow */}
        <div
          onClick={() => onNavigate('REPORTS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_net_cash_flow')}</span>
            <div className={`p-2 rounded-xl ${summary.netCashFlow >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-2xl font-black mt-2 truncate ${summary.netCashFlow >= 0 ? 'text-[#16A085]' : 'text-[#DC5A63]'}`}>
            {summary.netCashFlow >= 0 ? '+' : ''}{formatCurrencyLocale(summary.netCashFlow, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{summary.netCashFlow >= 0 ? 'Operational Surplus' : 'Deficit Position'}</div>
        </div>

        {/* Total Income */}
        <div
          onClick={() => onNavigate('INCOME')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_total_income')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <ArrowDownCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#16A085] mt-2 truncate">
            {formatCurrencyLocale(summary.totalIncome, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Earnings & client revenue</div>
        </div>

        {/* Total Expenses */}
        <div
          onClick={() => onNavigate('EXPENSES')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_total_expenses')}</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#DC5A63] mt-2 truncate">
            {formatCurrencyLocale(summary.totalExpense, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Operating costs & card outflows</div>
        </div>

        {/* Savings Balance */}
        <div
          onClick={() => onNavigate('SAVINGS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_total_savings')}</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0C1830] dark:text-[#E8C66D] mt-2 truncate">
            {formatCurrencyLocale(summary.totalSavings, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{goals.length} wealth targets</div>
        </div>

        {/* Outstanding Debt & Loans */}
        <div
          onClick={() => onNavigate('LOANS')}
          className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-[#E8C66D]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('metric_credit_due')}</span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-orange-600 mt-2 truncate">
            {formatCurrencyLocale(summary.totalBorrowed + summary.totalCreditCardDue, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cards & borrowed obligations</div>
        </div>
      </div>

      {/* Budget Alerts Banner */}
      {budgetAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Budget Alert: {budgetAlerts[0].budget.name} has reached {budgetAlerts[0].pct.toFixed(0)}%
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300">
                Spent {formatCurrencyLocale(budgetAlerts[0].spent, currency)} of {formatCurrencyLocale(budgetAlerts[0].budget.amount, currency)} limit.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('BUDGETS')}
            className="text-xs font-bold text-[#0C1830] dark:text-[#E8C66D] hover:underline px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40"
          >
            Review
          </button>
        </div>
      )}

      {/* Inflow vs Outflow Visual Bar */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Cash Flow Ratio (Inflow vs Outflow)</h2>
          <span className="text-xs text-slate-400 font-medium">P&L Balance</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
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
            <span className="w-2 h-2 rounded-full bg-[#16A085]" /> Inflow: {formatCurrencyLocale(summary.totalIncome, currency)}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-600">
            <span className="w-2 h-2 rounded-full bg-[#DC5A63]" /> Outflow: {formatCurrencyLocale(summary.totalExpense, currency)}
          </span>
        </div>
      </div>

      {/* Top Expense Categories & Upcoming Obligations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Spending Categories */}
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E8C66D]" />
              <span>{t('label_spending_breakdown')}</span>
            </h2>
            <button onClick={() => onNavigate('EXPENSES')} className="text-xs text-[#0C1830] dark:text-[#E8C66D] font-bold hover:underline">
              {t('action_view_all')}
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
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrencyLocale(amt, currency)} ({pct.toFixed(0)}%)</span>
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
        <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Upcoming Obligations</span>
            </h2>
            <button onClick={() => onNavigate('BILLS')} className="text-xs text-[#0C1830] dark:text-[#E8C66D] font-bold hover:underline">
              Schedule
            </button>
          </div>
          {unpaidBills.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All obligations are currently settled!</p>
          ) : (
            <div className="space-y-2.5">
              {unpaidBills.map(b => (
                <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0C1830] border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.provider} • Due {formatDate(b.dueDate)}</div>
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-[#DC5A63]">
                    {formatCurrencyLocale(b.amount, b.currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">{t('label_recent_transactions')}</h2>
            <p className="text-[11px] text-slate-400">Latest recorded transactions</p>
          </div>
          <button
            onClick={() => onNavigate('TRANSACTIONS')}
            className="text-xs font-bold text-[#0C1830] dark:text-[#E8C66D] flex items-center gap-1 hover:underline"
          >
            <span>{t('action_view_all')} ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-400">{t('label_no_transactions')}</p>
            <button
              onClick={onQuickAdd}
              className="bg-[#0C1830] dark:bg-[#E8C66D] text-[#E8C66D] dark:text-[#0C1830] text-xs font-bold px-4 py-2 rounded-xl"
            >
              {t('action_add_transaction')}
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
                        <span>{formatDate(tx.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-bold text-xs ${isIncome ? 'text-[#16A085]' : isExpense ? 'text-[#DC5A63]' : 'text-slate-700 dark:text-slate-300'}`}>
                      {isIncome ? '+' : isExpense ? '-' : ''}{formatCurrencyLocale(tx.amount, tx.currency)}
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
