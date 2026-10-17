export type TransactionType =
  | 'INCOME'
  | 'EXPENSE'
  | 'TRANSFER'
  | 'SAVINGS_CONTRIBUTION'
  | 'SAVINGS_WITHDRAWAL'
  | 'LOAN_GIVEN'
  | 'LOAN_RECEIVED'
  | 'LOAN_REPAYMENT'
  | 'DEBT_REPAYMENT'
  | 'CREDIT_CARD_PURCHASE'
  | 'CREDIT_CARD_PAYMENT'
  | 'FEE'
  | 'INTEREST'
  | 'REFUND';

export type AccountType =
  | 'CASH'
  | 'BANK_ACCOUNT'
  | 'MOBILE_WALLET'
  | 'EASYPAISA'
  | 'JAZZCASH'
  | 'SAVINGS_ACCOUNT'
  | 'CREDIT_CARD'
  | 'OTHER';

export interface UserProfile {
  id: string;
  displayName: string;
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
  locale: string;
  financialMonthStart: number;
  monthlyIncomeTarget: number;
  monthlyBudgetTarget: number;
  isOnboardingCompleted: boolean;
  createdAt: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  creditLimit: number;
  statementDay: number;
  dueDay: number;
  notes: string;
  isArchived: boolean;
  colorHex: string;
}

export interface Category {
  id: string;
  name: string;
  isExpense: boolean;
  iconName: string;
  colorHex: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  convertedAmount?: number;
  categoryId: string;
  categoryName: string;
  accountId: string;
  destinationAccountId?: string | null;
  paymentMethod: string;
  transactionDate: number;
  notes?: string;
  merchant?: string;
  linkedEntityId?: string | null;
  createdAt: number;
}

export interface Budget {
  id: string;
  name: string;
  categoryId?: string | null;
  categoryName: string;
  amount: number;
  currency: string;
  period: 'MONTHLY' | 'WEEKLY' | 'CUSTOM';
  startDate: number;
  endDate: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: number;
  description: string;
  colorHex: string;
}

export interface Loan {
  id: string;
  name: string;
  contactName: string;
  direction: 'LENT' | 'BORROWED';
  principalAmount: number;
  repaidAmount: number;
  currency: string;
  issueDate: number;
  dueDate: number;
  interestRate?: number;
  notes?: string;
}

export interface Bill {
  id: string;
  name: string;
  provider: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  currency: string;
  dueDate: number;
  recurrence: 'ONCE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  isPaid: boolean;
  lastPaidDate?: number | null;
  notes?: string;
}

export type FinoraScreen =
  | 'DASHBOARD'
  | 'TRANSACTIONS'
  | 'INCOME'
  | 'EXPENSES'
  | 'BUDGETS'
  | 'SAVINGS'
  | 'ACCOUNTS'
  | 'CREDIT_CARDS'
  | 'CREDIT_DEBIT_OVERVIEW'
  | 'LOANS'
  | 'BILLS'
  | 'CATEGORIES'
  | 'REPORTS'
  | 'CALENDAR'
  | 'ADMIN'
  | 'SETTINGS'
  | 'ABOUT';
