import React, { useState } from 'react';
import { FinoraScreen } from '../types';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Menu,
  Plus,
  Settings,
  X,
  CreditCard,
  Wallet,
  PiggyBank,
  HandCoins,
  Calendar,
  Info,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale
} from 'lucide-react';

interface NavbarProps {
  currentScreen: FinoraScreen;
  onNavigate: (screen: FinoraScreen) => void;
  onQuickAdd: () => void;
  currency: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onQuickAdd,
  currency
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const bottomItems: { screen: FinoraScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'DASHBOARD', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { screen: 'TRANSACTIONS', label: 'Activity', icon: <Receipt className="w-5 h-5" /> },
    { screen: 'BUDGETS', label: 'Budgets', icon: <TrendingUp className="w-5 h-5" /> },
    { screen: 'REPORTS', label: 'Reports', icon: <PieChart className="w-5 h-5" /> },
  ];

  const allModules: { screen: FinoraScreen; label: string; icon: React.ReactNode; desc: string }[] = [
    { screen: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 text-amber-500" />, desc: 'KPI cards & charts' },
    { screen: 'TRANSACTIONS', label: 'Transactions', icon: <Receipt className="w-5 h-5 text-emerald-500" />, desc: 'Ledger, search & filters' },
    { screen: 'INCOME', label: 'Income Hub', icon: <ArrowDownCircle className="w-5 h-5 text-emerald-600" />, desc: 'Inflow tracking' },
    { screen: 'EXPENSES', label: 'Expenses', icon: <ArrowUpCircle className="w-5 h-5 text-rose-500" />, desc: 'Outflow analysis' },
    { screen: 'BUDGETS', label: 'Budgets & Limits', icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, desc: 'Category threshold limits' },
    { screen: 'SAVINGS', label: 'Savings Goals', icon: <PiggyBank className="w-5 h-5 text-amber-500" />, desc: 'Emergency fund targets' },
    { screen: 'ACCOUNTS', label: 'Accounts & Wallets', icon: <Wallet className="w-5 h-5 text-blue-500" />, desc: 'Cash, banks & wallets' },
    { screen: 'CREDIT_CARDS', label: 'Credit Cards', icon: <CreditCard className="w-5 h-5 text-purple-500" />, desc: 'Limits & card dues' },
    { screen: 'CREDIT_DEBIT_OVERVIEW', label: 'Credit & Debit', icon: <Scale className="w-5 h-5 text-cyan-500" />, desc: 'Liquidity vs debt' },
    { screen: 'LOANS', label: 'Loans & Debts', icon: <HandCoins className="w-5 h-5 text-amber-600" />, desc: 'Lent vs borrowed' },
    { screen: 'BILLS', label: 'Bills & Utilities', icon: <Receipt className="w-5 h-5 text-orange-500" />, desc: 'Recurring utility bills' },
    { screen: 'CATEGORIES', label: 'Categories', icon: <Layers className="w-5 h-5 text-teal-500" />, desc: 'Category rules' },
    { screen: 'REPORTS', label: 'Analytics', icon: <PieChart className="w-5 h-5 text-sky-500" />, desc: 'Net worth & distributions' },
    { screen: 'CALENDAR', label: 'Financial Calendar', icon: <Calendar className="w-5 h-5 text-rose-400" />, desc: 'Timeline & due dates' },
    { screen: 'SETTINGS', label: 'Settings & Backup', icon: <Settings className="w-5 h-5 text-slate-500" />, desc: 'Currencies & JSON export' },
    { screen: 'ABOUT', label: 'About Finora', icon: <Info className="w-5 h-5 text-blue-600" />, desc: 'Fintech compliance notice' },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0C1830] text-white shadow-md border-b border-[#172A47]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('DASHBOARD')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#172A47] to-[#0C1830] border border-[#E8C66D]/40 flex items-center justify-center font-extrabold text-[#E8C66D] text-lg shadow-inner">
              MG
            </div>
            <div>
              <div className="font-bold text-base tracking-wide flex items-center gap-1.5">
                MG Finora
                <span className="text-[10px] uppercase font-extrabold bg-[#E8C66D]/20 text-[#E8C66D] px-1.5 py-0.5 rounded border border-[#E8C66D]/30">
                  {currency}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 tracking-tight">Master Your Money</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onQuickAdd}
              className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>

            <button
              onClick={() => onNavigate('SETTINGS')}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#172A47] rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Bar for Mobile / Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#111C30] border-t border-slate-200 dark:border-slate-800 shadow-lg sm:hidden">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {bottomItems.map((item) => {
            const active = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  active ? 'text-[#172A47] dark:text-[#E8C66D] font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowDrawer(true)}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-[#172A47] dark:hover:text-[#E8C66D]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px]">More</span>
          </button>
        </div>
      </nav>

      {/* All Modules Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-[#0C1830] dark:text-white">MG Finora Suite</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">All 17 financial modules & management tools</p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              {allModules.map((mod) => (
                <button
                  key={mod.screen}
                  onClick={() => {
                    onNavigate(mod.screen);
                    setShowDrawer(false);
                  }}
                  className="flex items-start gap-3 p-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-[#172A47]/50 border border-slate-100 dark:border-slate-800/80 transition-all hover:border-[#E8C66D]/40"
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#172A47] shrink-0">
                    {mod.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-xs text-[#0C1830] dark:text-white truncate">{mod.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{mod.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
