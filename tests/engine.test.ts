import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CategoryRuleEngine } from '../src/utils/categoryEngine.ts';
import {
  convertCurrency,
  formatCurrency,
  calculateSummary,
  CURRENCY_SYMBOLS,
  EXCHANGE_RATES_TO_PKR
} from '../src/utils/financialEngine.ts';
import type { Account, Budget, Loan, SavingsGoal, Transaction } from '../src/types.ts';

describe('CategoryRuleEngine', () => {
  it('accurately detects spending categories from keyword rules', () => {
    assert.equal(CategoryRuleEngine.suggestCategory('Al-Fatah grocery run', true), 'Food & Groceries');
    assert.equal(CategoryRuleEngine.suggestCategory('LESCO power bill', true), 'Electricity');
    assert.equal(CategoryRuleEngine.suggestCategory('PSO Shell petrol refill', true), 'Fuel');
    assert.equal(CategoryRuleEngine.suggestCategory('StormFiber internet', true), 'Internet & Mobile');
    assert.equal(CategoryRuleEngine.suggestCategory('Monthly Tech Payroll Salary', false), 'Salary');
    assert.equal(CategoryRuleEngine.suggestCategory('Upwork Client Invoice', false), 'Freelance Income');
  });

  it('falls back to default categories when no keyword matches', () => {
    assert.equal(CategoryRuleEngine.suggestCategory('Unknown random expense', true), 'Other Expense');
    assert.equal(CategoryRuleEngine.suggestCategory('Unknown mystery source', false), 'Other Income');
    assert.equal(CategoryRuleEngine.suggestCategory('', true), 'Other Expense');
  });
});

describe('FinancialEngine', () => {
  it('accurately calculates income, expense, and net cash flow while ignoring ledger transfers', () => {
    const now = Date.now();
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'INCOME',
        title: 'Salary',
        amount: 100000,
        currency: 'PKR',
        accountId: 'acc_1',
        transactionDate: now
      },
      {
        id: '2',
        type: 'EXPENSE',
        title: 'Groceries',
        amount: 25000,
        currency: 'PKR',
        categoryId: 'cat_food',
        categoryName: 'Food & Groceries',
        accountId: 'acc_1',
        transactionDate: now
      },
      {
        id: '3',
        type: 'TRANSFER', // Transfers must NOT count in P&L
        title: 'Internal transfer',
        amount: 15000,
        currency: 'PKR',
        accountId: 'acc_1',
        destinationAccountId: 'acc_2',
        transactionDate: now
      }
    ];

    const accounts: Account[] = [
      {
        id: 'acc_1',
        name: 'Checking',
        type: 'BANK_ACCOUNT',
        currency: 'PKR',
        openingBalance: 50000,
        currentBalance: 110000,
        creditLimit: 0,
        statementDay: 1,
        dueDay: 10,
        notes: '',
        isArchived: false,
        colorHex: '#16A085'
      }
    ];

    const summary = calculateSummary(transactions, accounts, [], [], 'PKR');

    assert.equal(summary.totalIncome, 100000);
    assert.equal(summary.totalExpense, 25000);
    assert.equal(summary.netCashFlow, 75000);
    assert.equal(summary.totalBalance, 110000);
  });

  it('formats currency values correctly with proper symbols', () => {
    const formatted = formatCurrency(150000, 'PKR');
    assert.ok(formatted.includes('150,000'));
    assert.ok(formatted.startsWith('Rs'));

    const usdFormatted = formatCurrency(2500, 'USD', true);
    assert.equal(usdFormatted, '$ 2,500.00');
  });

  it('converts currencies accurately using defined exchange rates', () => {
    const usdToPkr = convertCurrency(100, 'USD', 'PKR');
    assert.equal(usdToPkr, 28000);

    const sameCurrency = convertCurrency(500, 'PKR', 'PKR');
    assert.equal(sameCurrency, 500);
  });
});
