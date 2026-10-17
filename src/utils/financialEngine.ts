import type { Account, Budget, Loan, SavingsGoal, Transaction } from '../types';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rateToPkr: number;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', rateToPkr: 1.0, flag: '🇵🇰' },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToPkr: 280.0, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToPkr: 305.0, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToPkr: 360.0, flag: '🇬🇧' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rateToPkr: 74.6, flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToPkr: 76.2, flag: '🇦🇪' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToPkr: 3.35, flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToPkr: 205.0, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToPkr: 182.0, flag: '🇦🇺' }
];

export const EXCHANGE_RATES_METADATA = {
  source: 'Open Market Reference / Central Bank Consensus',
  baseCurrency: 'PKR',
  lastUpdated: '2026-10-15',
  notes: 'Used transparently when consolidating multi-currency portfolios into the user-selected default reporting currency.'
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PKR: 'Rs',
  USD: '$',
  GBP: '£',
  EUR: '€',
  SAR: '﷼',
  AED: 'د.إ',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$'
};

export const EXCHANGE_RATES_TO_PKR: Record<string, number> = {
  PKR: 1.0,
  USD: 280.0,
  GBP: 360.0,
  EUR: 305.0,
  SAR: 74.6,
  AED: 76.2,
  INR: 3.35,
  CAD: 205.0,
  AUD: 182.0
};

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from.toUpperCase() === to.toUpperCase()) return amount;
  const fromRate = EXCHANGE_RATES_TO_PKR[from.toUpperCase()] || 1.0;
  const toRate = EXCHANGE_RATES_TO_PKR[to.toUpperCase()] || 1.0;
  const amountInPkr = amount * fromRate;
  const result = toRate > 0 ? amountInPkr / toRate : amount;
  return Math.round((result + Number.EPSILON) * 10000) / 10000;
}

export function formatCurrency(amount: number, currency: string = 'PKR', showDecimals: boolean = false): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);
  return `${symbol} ${formattedNumber}`;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  totalBalance: number;
  totalSavings: number;
  totalLent: number;
  totalBorrowed: number;
  totalCreditCardDue: number;
  totalCreditLimit: number;
}

export function calculateSummary(
  transactions: Transaction[],
  accounts: Account[],
  savingsGoals: SavingsGoal[],
  loans: Loan[],
  targetCurrency: string = 'PKR'
): FinancialSummary {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    const converted = convertCurrency(tx.amount, tx.currency, targetCurrency);
    if (tx.type === 'INCOME' || tx.type === 'INTEREST' || tx.type === 'REFUND') {
      totalIncome += converted;
    } else if (tx.type === 'EXPENSE' || tx.type === 'FEE' || tx.type === 'CREDIT_CARD_PURCHASE') {
      totalExpense += converted;
    }
    // Transfers, savings deposits, loan movements, card payments are ledger movements, not P&L
  }

  let totalBalance = 0;
  let totalCreditCardDue = 0;
  let totalCreditLimit = 0;

  for (const acc of accounts) {
    const convertedBalance = convertCurrency(acc.currentBalance, acc.currency, targetCurrency);
    if (acc.type === 'CREDIT_CARD') {
      totalCreditLimit += convertCurrency(acc.creditLimit, acc.currency, targetCurrency);
      totalCreditCardDue += convertedBalance < 0 ? -convertedBalance : 0;
    } else {
      totalBalance += convertedBalance;
    }
  }

  let totalSavings = 0;
  for (const g of savingsGoals) {
    totalSavings += convertCurrency(g.currentAmount, g.currency, targetCurrency);
  }

  let totalLent = 0;
  let totalBorrowed = 0;
  for (const l of loans) {
    const outstanding = Math.max(0, l.principalAmount - l.repaidAmount);
    const converted = convertCurrency(outstanding, l.currency, targetCurrency);
    if (l.direction === 'LENT') {
      totalLent += converted;
    } else {
      totalBorrowed += converted;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netCashFlow: totalIncome - totalExpense,
    totalBalance,
    totalSavings,
    totalLent,
    totalBorrowed,
    totalCreditCardDue,
    totalCreditLimit
  };
}

export function calculateBudgetSpending(
  budget: Budget,
  transactions: Transaction[],
  targetCurrency: string = 'PKR'
): number {
  let spent = 0;
  for (const tx of transactions) {
    if (tx.transactionDate >= budget.startDate && tx.transactionDate <= budget.endDate) {
      const isEligible = tx.type === 'EXPENSE' || tx.type === 'FEE' || tx.type === 'CREDIT_CARD_PURCHASE';
      if (isEligible) {
        if (!budget.categoryId || budget.categoryId === tx.categoryId) {
          spent += convertCurrency(tx.amount, tx.currency, targetCurrency);
        }
      }
    }
  }
  return spent;
}
