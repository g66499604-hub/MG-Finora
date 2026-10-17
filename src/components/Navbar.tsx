import React, { useState, useRef, useEffect } from 'react';
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
  Scale,
  Crown,
  Globe,
  User,
  LogOut,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/types';

interface NavbarProps {
  currentScreen: FinoraScreen;
  onNavigate: (screen: FinoraScreen) => void;
  onQuickAdd: () => void;
  currency: string;
  user?: { email?: string; displayName?: string; role?: 'owner' | 'admin' | 'member' } | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onQuickAdd,
  currency,
  user,
  onOpenAuth,
  onSignOut
}) => {
  const { t, language, setLanguage, languageInfo } = useI18n();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const topNavLinks: { screen: FinoraScreen; label: string }[] = [
    { screen: 'DASHBOARD', label: t('nav_dashboard') },
    { screen: 'TRANSACTIONS', label: t('nav_transactions') },
    { screen: 'BUDGETS', label: t('nav_budgets') },
    { screen: 'REPORTS', label: t('nav_reports') },
    { screen: 'ADMIN', label: t('nav_admin') }
  ];

  const bottomItems: { screen: FinoraScreen; label: string; icon: React.ReactNode }[] = [
    { screen: 'DASHBOARD', label: t('nav_dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { screen: 'TRANSACTIONS', label: t('nav_transactions'), icon: <Receipt className="w-5 h-5" /> },
    { screen: 'BUDGETS', label: t('nav_budgets'), icon: <TrendingUp className="w-5 h-5" /> },
    { screen: 'REPORTS', label: t('nav_reports'), icon: <PieChart className="w-5 h-5" /> },
  ];

  const allModules: { screen: FinoraScreen; label: string; icon: React.ReactNode; desc: string }[] = [
    { screen: 'DASHBOARD', label: t('nav_dashboard'), icon: <LayoutDashboard className="w-5 h-5 text-amber-500" />, desc: 'KPI cards & charts' },
    { screen: 'TRANSACTIONS', label: t('nav_transactions'), icon: <Receipt className="w-5 h-5 text-emerald-500" />, desc: 'Ledger, search & filters' },
    { screen: 'INCOME', label: t('nav_income'), icon: <ArrowDownCircle className="w-5 h-5 text-emerald-600" />, desc: 'Inflow tracking' },
    { screen: 'EXPENSES', label: t('nav_expenses'), icon: <ArrowUpCircle className="w-5 h-5 text-rose-500" />, desc: 'Outflow analysis' },
    { screen: 'BUDGETS', label: t('nav_budgets'), icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, desc: 'Category threshold limits' },
    { screen: 'SAVINGS', label: t('nav_savings'), icon: <PiggyBank className="w-5 h-5 text-amber-500" />, desc: 'Emergency fund targets' },
    { screen: 'ACCOUNTS', label: t('nav_accounts'), icon: <Wallet className="w-5 h-5 text-blue-500" />, desc: 'Cash, banks & wallets' },
    { screen: 'CREDIT_CARDS', label: t('nav_credit_cards'), icon: <CreditCard className="w-5 h-5 text-purple-500" />, desc: 'Limits & card dues' },
    { screen: 'CREDIT_DEBIT_OVERVIEW', label: t('nav_credit_debit'), icon: <Scale className="w-5 h-5 text-cyan-500" />, desc: 'Liquidity vs debt' },
    { screen: 'LOANS', label: t('nav_loans'), icon: <HandCoins className="w-5 h-5 text-amber-600" />, desc: 'Lent vs borrowed' },
    { screen: 'BILLS', label: t('nav_bills'), icon: <Receipt className="w-5 h-5 text-orange-500" />, desc: 'Recurring utility bills' },
    { screen: 'CATEGORIES', label: t('nav_categories'), icon: <Layers className="w-5 h-5 text-teal-500" />, desc: 'Category rules' },
    { screen: 'REPORTS', label: t('nav_reports'), icon: <PieChart className="w-5 h-5 text-sky-500" />, desc: 'Net worth & distributions' },
    { screen: 'CALENDAR', label: t('nav_calendar'), icon: <Calendar className="w-5 h-5 text-rose-400" />, desc: 'Timeline & due dates' },
    { screen: 'ADMIN', label: t('nav_admin'), icon: <Crown className="w-5 h-5 text-[#E8C66D]" />, desc: 'Executive & Supabase' },
    { screen: 'SETTINGS', label: t('nav_settings'), icon: <Settings className="w-5 h-5 text-slate-500" />, desc: 'Currencies & JSON export' },
    { screen: 'ABOUT', label: t('nav_about'), icon: <Info className="w-5 h-5 text-blue-600" />, desc: 'Fintech compliance notice' },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0C1830] text-white shadow-md border-b border-[#172A47]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer rtl:space-x-reverse" onClick={() => onNavigate('DASHBOARD')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#172A47] to-[#0C1830] border border-[#E8C66D]/50 flex items-center justify-center font-extrabold text-[#E8C66D] text-lg shadow-inner">
              MG
            </div>
            <div>
              <div className="font-bold text-base tracking-wide flex items-center gap-1.5">
                <span>MG Finora</span>
                <span className="text-[10px] uppercase font-extrabold bg-[#E8C66D]/20 text-[#E8C66D] px-1.5 py-0.5 rounded border border-[#E8C66D]/30">
                  {currency}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 tracking-tight flex items-center gap-1">
                <span>Enterprise Suite</span>
                <span className="text-[#E8C66D]">•</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">M.M.H.J Tech</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {topNavLinks.map(link => {
              const active = currentScreen === link.screen;
              const isOwnerLink = link.screen === 'ADMIN';
              return (
                <button
                  key={link.screen}
                  onClick={() => onNavigate(link.screen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? isOwnerLink
                        ? 'bg-[#E8C66D] text-[#0C1830] shadow-sm'
                        : 'bg-[#172A47] text-white'
                      : isOwnerLink
                      ? 'text-[#E8C66D] hover:bg-[#172A47]/60'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isOwnerLink && <Crown className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Quick Add, Language, User/Auth, Settings, Drawer Menu */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Quick Add Button */}
            <button
              onClick={onQuickAdd}
              className="bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">{t('action_quick_add')}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1.5 rounded-lg bg-[#111C30] hover:bg-[#172A47] text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                title="Change Language"
                aria-label="Change Language"
              >
                <span>{languageInfo.flag}</span>
                <span className="font-semibold uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-[#0C1830] border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Select Language ({SUPPORTED_LANGUAGES.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left rtl:text-right flex items-center justify-between hover:bg-white/10 transition ${
                          language === lang.code ? 'text-[#E8C66D] font-bold bg-[#172A47]/60' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile Button */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1.5 rounded-lg bg-[#111C30] hover:bg-[#172A47] border border-[#E8C66D]/40 text-[#E8C66D] flex items-center gap-1.5 text-xs transition"
                  title="User Account"
                >
                  <Shield className="w-4 h-4 text-[#E8C66D]" />
                  <span className="hidden md:inline max-w-[100px] truncate">{user.displayName || user.email}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-2.5 py-1.5 rounded-lg bg-[#111C30] hover:bg-[#172A47] border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('action_sign_in')}</span>
                </button>
              )}

              {showUserMenu && user && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-52 bg-[#0C1830] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="font-bold text-white truncate">{user.displayName || 'Finora Member'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8C66D]/20 text-[#E8C66D] uppercase">
                      {user.role}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('ADMIN');
                      setShowUserMenu(false);
                    }}
                    className="w-full mt-1 px-3 py-2 text-left rtl:text-right rounded-lg hover:bg-white/10 text-slate-200 flex items-center gap-2"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#E8C66D]" />
                    <span>{t('nav_admin')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('SETTINGS');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left rtl:text-right rounded-lg hover:bg-white/10 text-slate-200 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('nav_settings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full mt-1 pt-1 border-t border-slate-800 px-3 py-2 text-left rtl:text-right rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('action_sign_out')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button
              onClick={() => onNavigate('SETTINGS')}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#172A47] rounded-lg transition-colors hidden sm:block"
              title={t('nav_settings')}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Modules Drawer Toggle */}
            <button
              onClick={() => setShowDrawer(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#172A47] rounded-lg transition-colors"
              title="All Modules"
              aria-label="All Modules"
            >
              <Menu className="w-5 h-5" />
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
                <span className="text-[10px] truncate max-w-[58px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowDrawer(true)}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-[#172A47] dark:hover:text-[#E8C66D]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      {/* All Modules Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111C30] rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-[#0C1830] dark:text-white flex items-center gap-2">
                  <span>MG Finora Suite</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8C66D]/20 text-[#E8C66D] font-mono">17 Modules</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personal finance, banking, debt & analytics</p>
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
                  className={`flex items-start gap-3 p-3 text-left rtl:text-right rounded-xl hover:bg-slate-50 dark:hover:bg-[#172A47]/50 border transition-all ${
                    currentScreen === mod.screen
                      ? 'border-[#E8C66D] bg-[#E8C66D]/10'
                      : 'border-slate-100 dark:border-slate-800/80 hover:border-[#E8C66D]/40'
                  }`}
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
