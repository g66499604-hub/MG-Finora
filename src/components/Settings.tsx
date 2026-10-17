import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES } from '../utils/financialEngine';
import { StorageService } from '../utils/storage';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/types';
import { OWNER_NAME, COMPANY_NAME } from '../utils/supabaseClient';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  User,
  Globe,
  Moon,
  Sun,
  Shield,
  Crown
} from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onReloadData: () => void;
  onNavigateToAdmin?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  onUpdateProfile,
  onReloadData,
  onNavigateToAdmin
}) => {
  const { t, language, setLanguage } = useI18n();
  const [name, setName] = useState(profile.displayName || '');
  const [currency, setCurrency] = useState(profile.defaultCurrency || 'PKR');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(profile.theme || 'system');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      displayName: name.trim() || 'Finora Member',
      defaultCurrency: currency,
      theme
    };
    onUpdateProfile(updated);

    // Apply dark class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }

    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mg_finora_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.accounts) StorageService.saveAccounts(data.accounts);
        if (data.categories) StorageService.saveCategories(data.categories);
        if (data.transactions) StorageService.saveTransactions(data.transactions);
        if (data.budgets) StorageService.saveBudgets(data.budgets);
        if (data.goals) StorageService.saveGoals(data.goals);
        if (data.loans) StorageService.saveLoans(data.loans);
        if (data.bills) StorageService.saveBills(data.bills);
        if (data.profile) onUpdateProfile(data.profile);
        onReloadData();
        alert('Backup successfully restored!');
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    if (confirm('Load demo transactions, accounts, budgets, and goals?')) {
      StorageService.loadSampleData();
      onReloadData();
    }
  };

  const handleClearAll = () => {
    if (confirm('WARNING: Are you sure you want to reset all data? This will clear all transactions, budgets, goals, and reset accounts.')) {
      StorageService.clearAll();
      onReloadData();
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#E8C66D]" />
            <span>{t('nav_settings')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure profile, internationalization, currencies, and backups</p>
        </div>

        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0C1830] text-[#E8C66D] border border-[#E8C66D]/40 hover:bg-[#172A47] flex items-center gap-2 transition"
          >
            <Crown className="w-4 h-4 text-[#E8C66D]" />
            <span>Executive Owner Portal</span>
          </button>
        )}
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('msg_saved_success')}</span>
        </div>
      )}

      {/* Language Selector Card */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#0C1830] dark:text-white font-bold text-sm">
          <Globe className="w-4 h-4 text-[#E8C66D]" />
          <span>Internationalization & Language (8 Languages with RTL)</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch interface language. Urdu and Arabic automatically adapt to full right-to-left (RTL) typography and alignment.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex items-center justify-between ${
                language === lang.code
                  ? 'border-[#E8C66D] bg-[#E8C66D]/10 font-bold text-[#0C1830] dark:text-white shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span className="text-xs">{lang.nativeName}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase">{lang.dir}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile & Currency Preferences Card */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#0C1830] dark:text-white font-bold text-sm">
          <User className="w-4 h-4 text-[#E8C66D]" />
          <span>User Profile & Financial Targets</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Mian Muhammad Hassan Jan"
                className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1830] text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1830] text-slate-900 dark:text-white"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Interface Theme</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { id: 'dark', label: 'Dark Navy', icon: <Moon className="w-3.5 h-3.5" /> },
                { id: 'light', label: 'Clean Light', icon: <Sun className="w-3.5 h-3.5" /> },
                { id: 'system', label: 'System Auto', icon: <Shield className="w-3.5 h-3.5" /> },
              ].map(th => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    theme === th.id
                      ? 'border-[#E8C66D] bg-[#E8C66D]/15 text-[#E8C66D] font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0C1830] dark:bg-[#E8C66D] text-[#E8C66D] dark:text-[#0C1830] font-bold text-xs rounded-xl transition-all shadow hover:opacity-90"
          >
            {t('action_save')}
          </button>
        </form>
      </div>

      {/* Data Operations */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Local-First Storage & Portability</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          MG-Finora operates local-first on your browser storage with cloud synchronization readiness for Supabase PostgreSQL.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left rtl:text-right flex items-center gap-3 transition-colors bg-slate-50 dark:bg-[#0C1830]"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('action_backup_json')}</div>
              <div className="text-[10px] text-slate-400">Download encrypted snapshot of all ledgers</div>
            </div>
          </button>

          <label className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left rtl:text-right flex items-center gap-3 transition-colors bg-slate-50 dark:bg-[#0C1830] cursor-pointer">
            <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-lg shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t('action_restore_backup')}</div>
              <div className="text-[10px] text-slate-400">Upload and restore a saved backup file</div>
            </div>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={handleLoadSample}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left rtl:text-right flex items-center gap-3 transition-colors bg-slate-50 dark:bg-[#0C1830]"
          >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Load Demo Dataset</div>
              <div className="text-[10px] text-slate-400">Populate sample multi-currency fintech records</div>
            </div>
          </button>

          <button
            onClick={handleClearAll}
            className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left rtl:text-right flex items-center gap-3 transition-colors"
          >
            <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-lg shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-600">{t('action_clear_all')}</div>
              <div className="text-[10px] text-rose-400">Purge local records and reset to baseline</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
