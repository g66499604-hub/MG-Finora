import React, { useState } from 'react';
import {
  ShieldCheck,
  Database,
  Crown,
  Key,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  Trash2,
  Activity,
  Globe,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Terminal,
  Lock
} from 'lucide-react';
import { Account, Budget, Category, Loan, SavingsGoal, Transaction, UserProfile } from '../types';
import { OWNER_NAME, OWNER_EMAIL, COMPANY_NAME, isSupabaseConfigured } from '../utils/supabaseClient';
import { AuditLogger, AuditLogEntry } from '../utils/auditLogger';
import { formatCurrency } from '../utils/financialEngine';
import { useI18n } from '../i18n/I18nContext';

interface AdminDashboardProps {
  summary: any;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: SavingsGoal[];
  loans: Loan[];
  categories: Category[];
  profile: UserProfile;
  currency: string;
  onRefreshData: () => void;
  onResetData: () => void;
  onExportBackup: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  summary,
  transactions,
  accounts,
  budgets,
  goals,
  loans,
  categories,
  profile,
  currency,
  onRefreshData,
  onResetData,
  onExportBackup
}) => {
  const { t, formatDate } = useI18n();
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => AuditLogger.getLogs());
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'supabase' | 'categories'>('overview');
  const [copied, setCopied] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  const handleClearLogs = () => {
    if (window.confirm('Clear all audit logs from this device?')) {
      AuditLogger.clearLogs();
      setLogs(AuditLogger.getLogs());
    }
  };

  const copySqlPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C1830] via-[#111F38] to-[#172A47] border border-[#E8C66D]/30 p-6 md:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#E8C66D]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8C66D]/20 text-[#E8C66D] border border-[#E8C66D]/40">
              <Crown className="w-3.5 h-3.5" />
              <span>Executive Owner & Architecture Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>MG-Finora Enterprise Command</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Proprietary financial operating architecture engineered for <strong className="text-[#E8C66D]">{OWNER_NAME}</strong>, founder of <strong className="text-white">{COMPANY_NAME}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-slate-700 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-medium">Platform Founder</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#E8C66D]" />
                {OWNER_NAME}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-slate-700 backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-medium">Corporate Entity</div>
              <div className="text-sm font-bold text-[#E8C66D]">{COMPANY_NAME}</div>
            </div>
          </div>
        </div>

        {/* Tab navigation within Admin Panel */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-700/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#E8C66D] text-[#0C1830] shadow-md shadow-[#E8C66D]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>System Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-[#E8C66D] text-[#0C1830] shadow-md shadow-[#E8C66D]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Cloud Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-[#E8C66D] text-[#0C1830] shadow-md shadow-[#E8C66D]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Audit Trail ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#E8C66D] text-[#0C1830] shadow-md shadow-[#E8C66D]/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Default Categories ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Ledger Entries</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{transactions.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Verified balanced</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Active Accounts & Cards</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{accounts.length}</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Multi-currency ready</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Net Worth</div>
              <div className="text-2xl font-black text-[#E8C66D] mt-1">{formatCurrency(summary.totalBalance, currency)}</div>
              <div className="text-[11px] text-slate-400 mt-1">Consolidated in {currency}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400">Security Architecture</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">RLS Active</div>
              <div className="text-[11px] text-slate-400 mt-1">Row Level Zero-Trust</div>
            </div>
          </div>

          {/* DevOps & Repository Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#E8C66D]" />
              <span>Deployment & Production Infrastructure</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1323] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200">GitHub Repository & Branch</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono">
                  g66499604-hub/MG-Finora (branch: main)
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Automated CI/CD Workflow via GitHub Actions (.github/workflows/deploy.yml)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1323] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Live Production Target</div>
                <div className="text-blue-600 dark:text-[#E8C66D] font-mono break-all">
                  https://g66499604-hub.github.io/MG-Finora/
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                  SPA 404 fallback enabled & .nojekyll configured
                </div>
              </div>
            </div>

            {/* Quick Actions for Owner */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
              <button
                onClick={onExportBackup}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#172A47] hover:bg-[#1e365b] text-[#E8C66D] border border-[#E8C66D]/30 flex items-center gap-2 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Master JSON Vault Backup</span>
              </button>

              <button
                onClick={onRefreshData}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Synchronize Memory</span>
              </button>

              <button
                onClick={onResetData}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 flex items-center gap-2 transition ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge & Re-seed Default System</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPABASE CLOUD ENGINE */}
      {activeTab === 'supabase' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#E8C66D]" />
                <span>Supabase PostgreSQL Cloud Backend Architecture</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero-Trust Row Level Security (RLS) PostgreSQL database schema for multi-device sync
              </p>
            </div>

            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              hasSupabase
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
            }`}>
              {hasSupabase ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{hasSupabase ? 'Cloud Connected' : 'Local Vault Fallback'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1323] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#E8C66D]" />
                <span>Production Schema Location:</span>
              </span>
              <button
                onClick={copySqlPath}
                className="text-xs font-medium text-[#E8C66D] hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Path!' : 'Copy Path'}</span>
              </button>
            </div>
            <code className="block p-3 rounded-lg bg-black text-[#E8C66D] text-xs font-mono">
              supabase/schema.sql
            </code>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To deploy on Supabase: Open your Supabase Dashboard &gt; SQL Editor &gt; paste the contents of <code>supabase/schema.sql</code> and click Run. All 11 tables, RLS policies, automatic user provisioning triggers, and index structures will be provisioned instantly.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Schema Entities & RLS Specifications:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'profiles', rls: 'User UID / Owner', desc: 'Display name, default currency, targets' },
                { name: 'user_roles', rls: 'Owner & Admin only', desc: 'Role assignments (owner, admin, member)' },
                { name: 'accounts', rls: 'User UID isolated', desc: 'Bank, cash, easypaisa, cards' },
                { name: 'transactions', rls: 'User UID isolated', desc: 'Income, expense, transfer ledgers' },
                { name: 'categories', rls: 'Global defaults + User', desc: 'Icon, color, expense flag' },
                { name: 'budgets', rls: 'User UID isolated', desc: 'Monthly targets, category limits' },
                { name: 'savings_goals', rls: 'User UID isolated', desc: 'Target amounts, dates, balances' },
                { name: 'loans', rls: 'User UID isolated', desc: 'Lent, borrowed, interest, repayment' },
                { name: 'bills', rls: 'User UID isolated', desc: 'Providers, recurring dues, paid flags' },
                { name: 'audit_logs', rls: 'User UID + Admin view', desc: 'Security actions, IPs, timestamps' },
                { name: 'app_settings', rls: 'Public read / Admin write', desc: 'Version, app identity, currencies' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0C1830] border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-[10px] text-[#E8C66D] font-mono">{item.rls}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#E8C66D]" />
                <span>Executive Security Audit Trail & Access Logs</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immutable event stream tracking authentication, transactions, and system modifications
              </p>
            </div>
            <button
              onClick={handleClearLogs}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Clear Local Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#0B1323] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3 rounded-r-xl">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#172A47] text-[#E8C66D] border border-[#E8C66D]/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{log.entityType}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DEFAULT CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E8C66D]" />
            <span>Master System Categories ({categories.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1323] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.colorHex }} />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{c.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  c.isExpense ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {c.isExpense ? 'Expense' : 'Income'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
