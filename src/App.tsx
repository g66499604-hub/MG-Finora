import React, { useState, useEffect } from 'react';
import { Account, Bill, Budget, Category, FinoraScreen, Loan, SavingsGoal, Transaction, UserProfile } from './types';
import { StorageService } from './utils/storage';
import { calculateSummary } from './utils/financialEngine';
import { isSupabaseConfigured, supabase, OWNER_EMAIL, OWNER_NAME } from './utils/supabaseClient';
import { AuditLogger } from './utils/auditLogger';
import { I18nProvider, useI18n } from './i18n/I18nContext';

// Components
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { IncomeExpenses } from './components/IncomeExpenses';
import { Budgets } from './components/Budgets';
import { SavingsGoals } from './components/SavingsGoals';
import { Accounts } from './components/Accounts';
import { CreditCards } from './components/CreditCards';
import { Loans } from './components/Loans';
import { Bills } from './components/Bills';
import { Categories } from './components/Categories';
import { Reports } from './components/Reports';
import { FinancialCalendar } from './components/FinancialCalendar';
import { CreditDebitOverview } from './components/CreditDebitOverview';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AuthModal } from './components/AuthModal';

const AppInner: React.FC = () => {
  const { t } = useI18n();
  const [currentScreen, setCurrentScreen] = useState<FinoraScreen>('DASHBOARD');
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [accounts, setAccounts] = useState<Account[]>(() => StorageService.getAccounts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [budgets, setBudgets] = useState<Budget[]>(() => StorageService.getBudgets());
  const [goals, setGoals] = useState<SavingsGoal[]>(() => StorageService.getGoals());
  const [loans, setLoans] = useState<Loan[]>(() => StorageService.getLoans());
  const [bills, setBills] = useState<Bill[]>(() => StorageService.getBills());

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authenticated user state
  const [user, setUser] = useState<{
    email: string;
    displayName: string;
    role: 'owner' | 'admin' | 'member';
  } | null>(() => {
    try {
      const saved = localStorage.getItem('mg_finora_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      email: OWNER_EMAIL,
      displayName: OWNER_NAME,
      role: 'owner'
    };
  });

  // Check Supabase session on boot if configured
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          const userEmail = u.email || '';
          const isOwner = userEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();
          const sessionUser = {
            email: userEmail,
            displayName: u.user_metadata?.full_name || userEmail.split('@')[0],
            role: (isOwner ? 'owner' : 'member') as 'owner' | 'admin' | 'member'
          };
          setUser(sessionUser);
          localStorage.setItem('mg_finora_user_session', JSON.stringify(sessionUser));
        }
      });
    }
  }, []);

  // Initialize sample data on very first launch if empty
  useEffect(() => {
    if (transactions.length === 0 && !localStorage.getItem('mg_finora_has_run')) {
      const sample = StorageService.loadSampleData();
      setTransactions(sample.transactions);
      setBudgets(sample.budgets);
      setGoals(sample.goals);
      setLoans(sample.loans);
      setBills(sample.bills);
      setAccounts(StorageService.getAccounts());
      localStorage.setItem('mg_finora_has_run', 'true');
      AuditLogger.log('SYSTEM_INIT', 'Data', 'Default fintech portfolio & demo ledgers seeded');
    }
  }, []);

  const refreshAllData = () => {
    setProfile(StorageService.getProfile());
    setAccounts(StorageService.getAccounts());
    setCategories(StorageService.getCategories());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setGoals(StorageService.getGoals());
    setLoans(StorageService.getLoans());
    setBills(StorageService.getBills());
    AuditLogger.log('DATA_REFRESH', 'State', 'All memory states reloaded from storage vault');
  };

  const currency = profile.defaultCurrency || 'PKR';
  const summary = calculateSummary(transactions, accounts, goals, loans, currency);

  // Handlers
  const handleAddTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);

    const rebalanced = StorageService.recalculateBalances(accounts, updated);
    setAccounts(rebalanced);
    StorageService.saveAccounts(rebalanced);

    AuditLogger.log('TRANSACTION_CREATED', 'Transaction', `${tx.type}: ${tx.title} (${tx.amount} ${tx.currency})`, tx.id, user?.email);
  };

  const handleDeleteTransaction = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;

    const targetTx = transactions.find(t => t.id === id);
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    StorageService.saveTransactions(updated);

    const rebalanced = StorageService.recalculateBalances(accounts, updated);
    setAccounts(rebalanced);
    StorageService.saveAccounts(rebalanced);

    AuditLogger.log('TRANSACTION_DELETED', 'Transaction', `Deleted transaction: ${targetTx?.title || id}`, id, user?.email);
  };

  const handleAddAccount = (acc: Account) => {
    const updated = [...accounts, acc];
    setAccounts(updated);
    StorageService.saveAccounts(updated);
    AuditLogger.log('ACCOUNT_CREATED', 'Account', `Created account: ${acc.name} (${acc.currency})`, acc.id, user?.email);
  };

  const handleDeleteAccount = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    StorageService.saveAccounts(updated);
    AuditLogger.log('ACCOUNT_DELETED', 'Account', `Deleted account ${id}`, id, user?.email);
  };

  const handleAddBudget = (b: Budget) => {
    const updated = [...budgets, b];
    setBudgets(updated);
    StorageService.saveBudgets(updated);
    AuditLogger.log('BUDGET_CREATED', 'Budget', `Created budget: ${b.name} (${b.amount} ${b.currency})`, b.id);
  };

  const handleDeleteBudget = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    StorageService.saveBudgets(updated);
  };

  const handleAddGoal = (g: SavingsGoal) => {
    const updated = [...goals, g];
    setGoals(updated);
    StorageService.saveGoals(updated);
    AuditLogger.log('GOAL_CREATED', 'SavingsGoal', `Created goal: ${g.name} (${g.targetAmount} ${g.currency})`, g.id);
  };

  const handleContributeGoal = (goalId: string, amount: number, accountId: string) => {
    const targetGoal = goals.find(g => g.id === goalId);
    if (!targetGoal) return;

    // Create transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'SAVINGS_CONTRIBUTION',
      title: `Contribution to ${targetGoal.name}`,
      amount,
      currency: targetGoal.currency,
      categoryId: '',
      categoryName: 'Savings Contribution',
      accountId,
      paymentMethod: 'Account Transfer',
      transactionDate: Date.now(),
      createdAt: Date.now()
    };
    handleAddTransaction(tx);

    const updatedGoals = goals.map(g => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g));
    setGoals(updatedGoals);
    StorageService.saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    StorageService.saveGoals(updated);
  };

  const handleAddLoan = (l: Loan) => {
    const updated = [...loans, l];
    setLoans(updated);
    StorageService.saveLoans(updated);
  };

  const handleRepayLoan = (loanId: string, amount: number) => {
    const updated = loans.map(l => (l.id === loanId ? { ...l, repaidAmount: l.repaidAmount + amount } : l));
    setLoans(updated);
    StorageService.saveLoans(updated);
  };

  const handleDeleteLoan = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = loans.filter(l => l.id !== id);
    setLoans(updated);
    StorageService.saveLoans(updated);
  };

  const handleAddBill = (b: Bill) => {
    const updated = [...bills, b];
    setBills(updated);
    StorageService.saveBills(updated);
  };

  const handleToggleBillPaid = (billId: string) => {
    const updated = bills.map(b => (b.id === billId ? { ...b, isPaid: !b.isPaid, lastPaidDate: !b.isPaid ? Date.now() : null } : b));
    setBills(updated);
    StorageService.saveBills(updated);
  };

  const handleDeleteBill = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = bills.filter(b => b.id !== id);
    setBills(updated);
    StorageService.saveBills(updated);
  };

  const handleAddCategory = (c: Category) => {
    const updated = [...categories, c];
    setCategories(updated);
    StorageService.saveCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    if (!window.confirm(t('modal_confirm_delete_msg'))) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    StorageService.saveCategories(updated);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
    AuditLogger.log('PROFILE_UPDATED', 'User', `Profile updated: ${newProfile.displayName}`, newProfile.id);
  };

  const handleDismissOnboarding = () => {
    const updated = { ...profile, isOnboardingCompleted: true };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('mg_finora_user_session');
    AuditLogger.log('AUTH_SIGNOUT', 'User', 'User session terminated');
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mg_finora_vault_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    AuditLogger.log('BACKUP_EXPORT', 'System', 'Master JSON vault backup generated and exported');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1220] text-[#182338] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onQuickAdd={() => setShowAddModal(true)}
        currency={currency}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {currentScreen === 'DASHBOARD' && (
          <Dashboard
            summary={summary}
            profile={profile}
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            goals={goals}
            bills={bills}
            onNavigate={setCurrentScreen}
            onQuickAdd={() => setShowAddModal(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onDismissOnboarding={handleDismissOnboarding}
          />
        )}

        {currentScreen === 'TRANSACTIONS' && (
          <Transactions
            transactions={transactions}
            categories={categories}
            currency={currency}
            onAddTransaction={() => setShowAddModal(true)}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentScreen === 'INCOME' && (
          <IncomeExpenses
            transactions={transactions}
            currency={currency}
            defaultTab="income"
            onAddTransaction={() => setShowAddModal(true)}
          />
        )}

        {currentScreen === 'EXPENSES' && (
          <IncomeExpenses
            transactions={transactions}
            currency={currency}
            defaultTab="expense"
            onAddTransaction={() => setShowAddModal(true)}
          />
        )}

        {currentScreen === 'BUDGETS' && (
          <Budgets
            budgets={budgets}
            categories={categories}
            transactions={transactions}
            currency={currency}
            onAddBudget={handleAddBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        )}

        {currentScreen === 'SAVINGS' && (
          <SavingsGoals
            goals={goals}
            accounts={accounts}
            currency={currency}
            onAddGoal={handleAddGoal}
            onContribute={handleContributeGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {currentScreen === 'ACCOUNTS' && (
          <Accounts
            accounts={accounts}
            currency={currency}
            onAddAccount={handleAddAccount}
            onDeleteAccount={handleDeleteAccount}
            onTransfer={handleAddTransaction}
          />
        )}

        {currentScreen === 'CREDIT_CARDS' && (
          <CreditCards
            accounts={accounts}
            currency={currency}
            onPayBill={handleAddTransaction}
          />
        )}

        {currentScreen === 'CREDIT_DEBIT_OVERVIEW' && (
          <CreditDebitOverview
            summary={summary}
            accounts={accounts}
            currency={currency}
          />
        )}

        {currentScreen === 'LOANS' && (
          <Loans
            loans={loans}
            currency={currency}
            onAddLoan={handleAddLoan}
            onRepayLoan={handleRepayLoan}
            onDeleteLoan={handleDeleteLoan}
          />
        )}

        {currentScreen === 'BILLS' && (
          <Bills
            bills={bills}
            currency={currency}
            onAddBill={handleAddBill}
            onTogglePaid={handleToggleBillPaid}
            onDeleteBill={handleDeleteBill}
          />
        )}

        {currentScreen === 'CATEGORIES' && (
          <Categories
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {currentScreen === 'REPORTS' && (
          <Reports
            summary={summary}
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            goals={goals}
            loans={loans}
            currency={currency}
          />
        )}

        {currentScreen === 'CALENDAR' && (
          <FinancialCalendar
            transactions={transactions}
            bills={bills}
            loans={loans}
            currency={currency}
          />
        )}

        {currentScreen === 'ADMIN' && (
          <AdminDashboard
            summary={summary}
            transactions={transactions}
            accounts={accounts}
            budgets={budgets}
            goals={goals}
            loans={loans}
            categories={categories}
            profile={profile}
            currency={currency}
            onRefreshData={refreshAllData}
            onResetData={() => {
              if (window.confirm('Reset all demo data and restore defaults?')) {
                StorageService.clearAll();
                StorageService.loadSampleData();
                refreshAllData();
              }
            }}
            onExportBackup={handleExportBackup}
          />
        )}

        {currentScreen === 'SETTINGS' && (
          <Settings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onReloadData={refreshAllData}
            onNavigateToAdmin={() => setCurrentScreen('ADMIN')}
          />
        )}

        {currentScreen === 'ABOUT' && <About />}
      </main>

      <Footer onNavigate={setCurrentScreen} />

      {showAddModal && (
        <AddTransactionModal
          accounts={accounts}
          categories={categories}
          defaultCurrency={currency}
          onSave={(tx) => {
            handleAddTransaction(tx);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(sessionUser) => {
            setUser(sessionUser);
            localStorage.setItem('mg_finora_user_session', JSON.stringify(sessionUser));
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
};
