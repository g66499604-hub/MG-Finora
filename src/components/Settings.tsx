import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CURRENCY_SYMBOLS, formatCurrency } from '../utils/financialEngine';
import { StorageService } from '../utils/storage';
import { Settings as SettingsIcon, Download, Upload, RefreshCw, Trash2, CheckCircle2, User, Globe } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onReloadData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  profile,
  onUpdateProfile,
  onReloadData
}) => {
  const [name, setName] = useState(profile.displayName || '');
  const [currency, setCurrency] = useState(profile.defaultCurrency || 'PKR');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      displayName: name.trim() || 'Finora Member',
      defaultCurrency: currency
    };
    onUpdateProfile(updated);
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
    <div className="space-y-6 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#0C1830] dark:text-white">Settings & Data Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure profile preferences, local database backups, and currency defaults</p>
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#0C1830] dark:text-white font-bold text-sm">
          <User className="w-4 h-4 text-[#172A47] dark:text-[#E8C66D]" />
          <span>User Profile Preferences</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {Object.keys(CURRENCY_SYMBOLS).map(c => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_SYMBOLS[c]})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#172A47] hover:bg-[#0C1830] text-[#E8C66D] font-bold text-xs rounded-xl transition-all shadow"
          >
            Save Preferences
          </button>
        </form>
      </div>

      {/* Data Operations */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0C1830] dark:text-white">Local-First Storage & Portability</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          MG Finora operates local-first on your browser storage (IndexedDB / localStorage). Your financial data remains 100% private to your device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left flex items-center gap-3 transition-colors bg-slate-50 dark:bg-slate-900"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Export JSON Backup</div>
              <div className="text-[10px] text-slate-400">Download snapshot of all ledgers</div>
            </div>
          </button>

          <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left flex items-center gap-3 transition-colors bg-slate-50 dark:bg-slate-900 cursor-pointer">
            <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-lg">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Restore JSON Backup</div>
              <div className="text-[10px] text-slate-400">Upload a saved backup file</div>
            </div>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={handleLoadSample}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#E8C66D] text-left flex items-center gap-3 transition-colors bg-slate-50 dark:bg-slate-900"
          >
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Load Demo Dataset</div>
              <div className="text-[10px] text-slate-400">Populate sample Pakistani fintech records</div>
            </div>
          </button>

          <button
            onClick={handleClearAll}
            className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left flex items-center gap-3 transition-colors"
          >
            <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-600">Reset Local Database</div>
              <div className="text-[10px] text-rose-400">Clear all records and start fresh</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
