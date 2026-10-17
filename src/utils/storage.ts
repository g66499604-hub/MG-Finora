import { Account, Bill, Budget, Category, Loan, SavingsGoal, Transaction, UserProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'mg_finora_profile',
  ACCOUNTS: 'mg_finora_accounts',
  CATEGORIES: 'mg_finora_categories',
  TRANSACTIONS: 'mg_finora_transactions',
  BUDGETS: 'mg_finora_budgets',
  GOALS: 'mg_finora_goals',
  LOANS: 'mg_finora_loans',
  BILLS: 'mg_finora_bills',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Groceries', isExpense: true, iconName: 'Utensils', colorHex: '#16A085', isDefault: true },
  { id: 'cat_health', name: 'Health & Medical', isExpense: true, iconName: 'HeartPulse', colorHex: '#DC5A63', isDefault: true },
  { id: 'cat_transport', name: 'Transportation', isExpense: true, iconName: 'Car', colorHex: '#2980B9', isDefault: true },
  { id: 'cat_fuel', name: 'Fuel', isExpense: true, iconName: 'Fuel', colorHex: '#E67E22', isDefault: true },
  { id: 'cat_education', name: 'Education', isExpense: true, iconName: 'GraduationCap', colorHex: '#8E44AD', isDefault: true },
  { id: 'cat_electricity', name: 'Electricity', isExpense: true, iconName: 'Zap', colorHex: '#F39C12', isDefault: true },
  { id: 'cat_gas', name: 'Gas', isExpense: true, iconName: 'Flame', colorHex: '#D35400', isDefault: true },
  { id: 'cat_water', name: 'Water', isExpense: true, iconName: 'Droplet', colorHex: '#1ABC9C', isDefault: true },
  { id: 'cat_internet', name: 'Internet & Mobile', isExpense: true, iconName: 'Wifi', colorHex: '#3498DB', isDefault: true },
  { id: 'cat_rent', name: 'Rent & Housing', isExpense: true, iconName: 'Home', colorHex: '#34495E', isDefault: true },
  { id: 'cat_shopping', name: 'Shopping', isExpense: true, iconName: 'ShoppingBag', colorHex: '#E8C66D', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment', isExpense: true, iconName: 'Gamepad2', colorHex: '#9B59B6', isDefault: true },
  { id: 'cat_subscriptions', name: 'Subscriptions', isExpense: true, iconName: 'Repeat', colorHex: '#C0392B', isDefault: true },
  { id: 'cat_bank_charges', name: 'Bank Charges', isExpense: true, iconName: 'Landmark', colorHex: '#7F8C8D', isDefault: true },
  { id: 'cat_other_exp', name: 'Other Expense', isExpense: true, iconName: 'Layers', colorHex: '#95A5A6', isDefault: true },
  { id: 'cat_salary', name: 'Salary', isExpense: false, iconName: 'Briefcase', colorHex: '#16A085', isDefault: true },
  { id: 'cat_business', name: 'Business Income', isExpense: false, iconName: 'Store', colorHex: '#27AE60', isDefault: true },
  { id: 'cat_freelance', name: 'Freelance Income', isExpense: false, iconName: 'Laptop', colorHex: '#2980B9', isDefault: true },
  { id: 'cat_allowance', name: 'Allowance', isExpense: false, iconName: 'Gift', colorHex: '#8E44AD', isDefault: true },
  { id: 'cat_investments', name: 'Interest & Profit', isExpense: false, iconName: 'TrendingUp', colorHex: '#E8C66D', isDefault: true },
  { id: 'cat_rental', name: 'Rental Income', isExpense: false, iconName: 'Building', colorHex: '#34495E', isDefault: true },
  { id: 'cat_refunds', name: 'Refunds', isExpense: false, iconName: 'RotateCcw', colorHex: '#1ABC9C', isDefault: true },
  { id: 'cat_other_inc', name: 'Other Income', isExpense: false, iconName: 'Coins', colorHex: '#7F8C8D', isDefault: true }
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc_cash', name: 'Cash in Hand', type: 'CASH', currency: 'PKR', openingBalance: 15000, currentBalance: 15000, creditLimit: 0, statementDay: 1, dueDay: 15, notes: '', isArchived: false, colorHex: '#16A085' },
  { id: 'acc_bank', name: 'Meezan Bank', type: 'BANK_ACCOUNT', currency: 'PKR', openingBalance: 120000, currentBalance: 120000, creditLimit: 0, statementDay: 1, dueDay: 15, notes: '', isArchived: false, colorHex: '#172A47' },
  { id: 'acc_easypaisa', name: 'Easypaisa Wallet', type: 'EASYPAISA', currency: 'PKR', openingBalance: 8500, currentBalance: 8500, creditLimit: 0, statementDay: 1, dueDay: 15, notes: '', isArchived: false, colorHex: '#27AE60' },
  { id: 'acc_jazzcash', name: 'JazzCash Wallet', type: 'JAZZCASH', currency: 'PKR', openingBalance: 5200, currentBalance: 5200, creditLimit: 0, statementDay: 1, dueDay: 15, notes: '', isArchived: false, colorHex: '#E67E22' },
  { id: 'acc_card', name: 'Standard Chartered Visa', type: 'CREDIT_CARD', currency: 'PKR', openingBalance: 0, currentBalance: -18500, creditLimit: 150000, statementDay: 5, dueDay: 25, notes: '', isArchived: false, colorHex: '#C0392B' }
];

export const StorageService = {
  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      id: 'default_user',
      displayName: 'Finora Member',
      defaultCurrency: 'PKR',
      theme: 'system',
      locale: 'en-PK',
      financialMonthStart: 1,
      monthlyIncomeTarget: 0,
      monthlyBudgetTarget: 0,
      isOnboardingCompleted: false,
      createdAt: Date.now()
    };
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getAccounts(): Account[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    this.saveAccounts(DEFAULT_ACCOUNTS);
    return DEFAULT_ACCOUNTS;
  },

  saveAccounts(accounts: Account[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets(): Budget[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  },

  saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getGoals(): SavingsGoal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  },

  saveGoals(goals: SavingsGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getLoans(): Loan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  },

  saveLoans(loans: Loan[]): void {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  },

  getBills(): Bill[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  },

  saveBills(bills: Bill[]): void {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  },

  recalculateBalances(accounts: Account[], transactions: Transaction[]): Account[] {
    return accounts.map(acc => {
      let balance = acc.openingBalance;
      for (const tx of transactions) {
        if (tx.accountId === acc.id) {
          switch (tx.type) {
            case 'EXPENSE':
            case 'FEE':
            case 'CREDIT_CARD_PURCHASE':
            case 'TRANSFER':
            case 'SAVINGS_CONTRIBUTION':
            case 'LOAN_GIVEN':
            case 'DEBT_REPAYMENT':
            case 'CREDIT_CARD_PAYMENT':
              balance -= tx.amount;
              break;
            case 'INCOME':
            case 'INTEREST':
            case 'REFUND':
            case 'SAVINGS_WITHDRAWAL':
            case 'LOAN_RECEIVED':
            case 'LOAN_REPAYMENT':
              balance += tx.amount;
              break;
          }
        } else if (tx.destinationAccountId === acc.id) {
          if (tx.type === 'TRANSFER' || tx.type === 'CREDIT_CARD_PAYMENT') {
            balance += tx.amount;
          }
        }
      }
      return { ...acc, currentBalance: balance };
    });
  },

  loadSampleData(): { transactions: Transaction[]; budgets: Budget[]; goals: SavingsGoal[]; loans: Loan[]; bills: Bill[] } {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const sampleTransactions: Transaction[] = [
      {
        id: 'tx_1',
        type: 'INCOME',
        title: 'Monthly Salary Deposit',
        amount: 250000,
        currency: 'PKR',
        categoryId: 'cat_salary',
        categoryName: 'Salary',
        accountId: 'acc_bank',
        paymentMethod: 'Direct Deposit',
        transactionDate: now - 2 * day,
        createdAt: now - 2 * day,
        notes: 'Monthly corporate salary'
      },
      {
        id: 'tx_2',
        type: 'INCOME',
        title: 'Upwork Freelance Milestone',
        amount: 600,
        currency: 'USD',
        categoryId: 'cat_freelance',
        categoryName: 'Freelance Income',
        accountId: 'acc_bank',
        paymentMethod: 'Wire Transfer',
        transactionDate: now - 5 * day,
        createdAt: now - 5 * day,
        notes: 'Mobile app design phase'
      },
      {
        id: 'tx_3',
        type: 'EXPENSE',
        title: 'Al-Fatah Supermarket Groceries',
        amount: 18450,
        currency: 'PKR',
        categoryId: 'cat_food',
        categoryName: 'Food & Groceries',
        accountId: 'acc_cash',
        paymentMethod: 'Cash',
        merchant: 'Al-Fatah',
        transactionDate: now - 1 * day,
        createdAt: now - 1 * day
      },
      {
        id: 'tx_4',
        type: 'EXPENSE',
        title: 'LESCO Electricity Bill',
        amount: 24300,
        currency: 'PKR',
        categoryId: 'cat_electricity',
        categoryName: 'Electricity',
        accountId: 'acc_easypaisa',
        paymentMethod: 'Easypaisa',
        transactionDate: now - 3 * day,
        createdAt: now - 3 * day
      },
      {
        id: 'tx_5',
        type: 'EXPENSE',
        title: 'Shell Fuel Refill',
        amount: 6500,
        currency: 'PKR',
        categoryId: 'cat_fuel',
        categoryName: 'Fuel',
        accountId: 'acc_card',
        paymentMethod: 'Credit Card',
        merchant: 'Shell Station',
        transactionDate: now - 4 * day,
        createdAt: now - 4 * day
      },
      {
        id: 'tx_6',
        type: 'EXPENSE',
        title: 'StormFiber Broadband',
        amount: 4500,
        currency: 'PKR',
        categoryId: 'cat_internet',
        categoryName: 'Internet & Mobile',
        accountId: 'acc_jazzcash',
        paymentMethod: 'JazzCash',
        transactionDate: now - 6 * day,
        createdAt: now - 6 * day
      },
      {
        id: 'tx_7',
        type: 'EXPENSE',
        title: 'Cheezious Pizza Dinner',
        amount: 3200,
        currency: 'PKR',
        categoryId: 'cat_food',
        categoryName: 'Food & Groceries',
        accountId: 'acc_card',
        paymentMethod: 'Credit Card',
        merchant: 'Cheezious',
        transactionDate: now - 12 * 60 * 60 * 1000,
        createdAt: now - 12 * 60 * 60 * 1000
      }
    ];

    const sampleBudgets: Budget[] = [
      { id: 'bgt_1', name: 'Monthly Overall Budget', amount: 120000, currency: 'PKR', period: 'MONTHLY', startDate: now - 15 * day, endDate: now + 15 * day, categoryName: 'Overall Budget' },
      { id: 'bgt_2', name: 'Groceries & Dining', amount: 35000, currency: 'PKR', categoryId: 'cat_food', categoryName: 'Food & Groceries', period: 'MONTHLY', startDate: now - 15 * day, endDate: now + 15 * day },
      { id: 'bgt_3', name: 'Vehicle Fuel', amount: 20000, currency: 'PKR', categoryId: 'cat_fuel', categoryName: 'Fuel', period: 'MONTHLY', startDate: now - 15 * day, endDate: now + 15 * day }
    ];

    const sampleGoals: SavingsGoal[] = [
      { id: 'goal_1', name: '6-Month Emergency Fund', targetAmount: 500000, currentAmount: 185000, currency: 'PKR', targetDate: now + 180 * day, description: 'Shield against unexpected life events', colorHex: '#16A085' },
      { id: 'goal_2', name: 'iPhone 16 Pro Upgrade', targetAmount: 380000, currentAmount: 145000, currency: 'PKR', targetDate: now + 75 * day, description: 'Work and camera upgrade', colorHex: '#E8C66D' }
    ];

    const sampleLoans: Loan[] = [
      { id: 'loan_1', name: 'Laptop Loan to Ali', contactName: 'Ali Raza', direction: 'LENT', principalAmount: 50000, repaidAmount: 20000, currency: 'PKR', issueDate: now - 30 * day, dueDate: now + 20 * day, notes: 'Friend loan for uni laptop' },
      { id: 'loan_2', name: 'Honda CG125 Installment', contactName: 'Atlas Honda', direction: 'BORROWED', principalAmount: 120000, repaidAmount: 60000, currency: 'PKR', issueDate: now - 60 * day, dueDate: now + 60 * day, notes: 'Monthly vehicle installment' }
    ];

    const sampleBills: Bill[] = [
      { id: 'bill_1', name: 'LESCO Electricity', provider: 'LESCO Lahore', categoryId: 'cat_electricity', categoryName: 'Electricity', amount: 26500, currency: 'PKR', dueDate: now + 5 * day, recurrence: 'MONTHLY', isPaid: false },
      { id: 'bill_2', name: 'SNGPL Sui Gas', provider: 'SNGPL', categoryId: 'cat_gas', categoryName: 'Gas', amount: 3200, currency: 'PKR', dueDate: now + 12 * day, recurrence: 'MONTHLY', isPaid: false },
      { id: 'bill_3', name: 'StormFiber 50Mbps', provider: 'Cybernet', categoryId: 'cat_internet', categoryName: 'Internet & Mobile', amount: 4500, currency: 'PKR', dueDate: now + 8 * day, recurrence: 'MONTHLY', isPaid: false }
    ];

    this.saveTransactions(sampleTransactions);
    this.saveBudgets(sampleBudgets);
    this.saveGoals(sampleGoals);
    this.saveLoans(sampleLoans);
    this.saveBills(sampleBills);

    const rebalanced = this.recalculateBalances(this.getAccounts(), sampleTransactions);
    this.saveAccounts(rebalanced);

    return {
      transactions: sampleTransactions,
      budgets: sampleBudgets,
      goals: sampleGoals,
      loans: sampleLoans,
      bills: sampleBills
    };
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.LOANS);
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    this.saveAccounts(DEFAULT_ACCOUNTS);
    this.saveCategories(DEFAULT_CATEGORIES);
  },

  exportCsv(transactions: Transaction[]): string {
    const headers = ['ID', 'Type', 'Title', 'Amount', 'Currency', 'Category', 'Account', 'Date', 'PaymentMethod', 'Merchant', 'Notes'];
    const rows = transactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.type}"`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.currency}"`,
      `"${(tx.categoryName || '').replace(/"/g, '""')}"`,
      `"${tx.accountId}"`,
      `"${new Date(tx.transactionDate).toISOString().slice(0, 10)}"`,
      `"${tx.paymentMethod || ''}"`,
      `"${(tx.merchant || '').replace(/"/g, '""')}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  exportBackupJson(): string {
    const backup = {
      app: 'MG Finora',
      version: '1.0.0',
      timestamp: Date.now(),
      profile: this.getProfile(),
      accounts: this.getAccounts(),
      categories: this.getCategories(),
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      goals: this.getGoals(),
      loans: this.getLoans(),
      bills: this.getBills()
    };
    return JSON.stringify(backup, null, 2);
  }
};
