import { Account, Budget, Loan, SavingsGoal, Transaction } from '../types';

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
  return toRate > 0 ? amountInPkr / toRate : amount;
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
