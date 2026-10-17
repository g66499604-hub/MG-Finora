package com.example.domain

import com.example.data.model.Account
import com.example.data.model.AccountType
import com.example.data.model.Budget
import com.example.data.model.Loan
import com.example.data.model.LoanDirection
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.data.model.TransactionType

data class FinancialSummary(
    val totalIncome: Double,
    val totalExpense: Double,
    val netCashFlow: Double,
    val totalBalance: Double,
    val totalSavings: Double,
    val totalLent: Double,
    val totalBorrowed: Double,
    val totalCreditCardDue: Double,
    val totalCreditLimit: Double,
    val monthlyBudgetLimit: Double,
    val monthlyBudgetSpent: Double
)

data class BudgetHealth(
    val budget: Budget,
    val spentAmount: Double,
    val remainingAmount: Double,
    val percentageUsed: Double,
    val isOverBudget: Boolean,
    val thresholdWarning: String? // "50%", "75%", "90%", "Exceeded"
)

object FinancialEngine {

    fun calculatePeriodSummary(
        transactions: List<Transaction>,
        accounts: List<Account>,
        budgets: List<Budget>,
        savingsGoals: List<SavingsGoal>,
        loans: List<Loan>,
        targetCurrency: String = "PKR"
    ): FinancialSummary {
        var totalIncome = 0.0
        var totalExpense = 0.0

        for (tx in transactions) {
            val converted = CurrencyConverter.convert(tx.amount, tx.currency, targetCurrency)
            when (tx.type) {
                TransactionType.INCOME, TransactionType.INTEREST, TransactionType.REFUND -> {
                    totalIncome += converted
                }
                TransactionType.EXPENSE, TransactionType.FEE, TransactionType.CREDIT_CARD_PURCHASE -> {
                    totalExpense += converted
                }
                // Transfers, Savings deposits, Loan principal movements, Card payments are excluded from Income/Expense
                TransactionType.TRANSFER,
                TransactionType.SAVINGS_CONTRIBUTION,
                TransactionType.SAVINGS_WITHDRAWAL,
                TransactionType.LOAN_GIVEN,
                TransactionType.LOAN_RECEIVED,
                TransactionType.LOAN_REPAYMENT,
                TransactionType.DEBT_REPAYMENT,
                TransactionType.CREDIT_CARD_PAYMENT -> {
                    // Do not count in P&L
                }
            }
        }

        // Available balance across cash, bank, mobile wallets (excluding credit cards)
        var totalBalance = 0.0
        var creditCardDue = 0.0
        var creditLimit = 0.0

        for (acc in accounts) {
            val convertedBalance = CurrencyConverter.convert(acc.currentBalance, acc.currency, targetCurrency)
            if (acc.type == AccountType.CREDIT_CARD) {
                // If negative or positive, track outstanding debt
                val convertedLimit = CurrencyConverter.convert(acc.creditLimit, acc.currency, targetCurrency)
                creditLimit += convertedLimit
                // In credit cards, positive current balance represents amount owed if ledgered as debt
                creditCardDue += if (convertedBalance < 0) -convertedBalance else 0.0
            } else {
                totalBalance += convertedBalance
            }
        }

        // Savings total
        var totalSavings = 0.0
        for (goal in savingsGoals) {
            totalSavings += CurrencyConverter.convert(goal.currentAmount, goal.currency, targetCurrency)
        }

        // Loans: Lent (Asset) vs Borrowed (Liability)
        var totalLent = 0.0
        var totalBorrowed = 0.0
        for (loan in loans) {
            val outstanding = (loan.principalAmount - loan.repaidAmount).coerceAtLeast(0.0)
            val converted = CurrencyConverter.convert(outstanding, loan.currency, targetCurrency)
            if (loan.direction == LoanDirection.LENT) {
                totalLent += converted
            } else {
                totalBorrowed += converted
            }
        }

        // Budgets
        var budgetLimit = 0.0
        var budgetSpent = 0.0
        for (budget in budgets) {
            val convertedLim = CurrencyConverter.convert(budget.amount, budget.currency, targetCurrency)
            budgetLimit += convertedLim
            val spent = calculateBudgetSpending(budget, transactions, targetCurrency)
            budgetSpent += spent
        }

        val netCashFlow = totalIncome - totalExpense

        return FinancialSummary(
            totalIncome = totalIncome,
            totalExpense = totalExpense,
            netCashFlow = netCashFlow,
            totalBalance = totalBalance,
            totalSavings = totalSavings,
            totalLent = totalLent,
            totalBorrowed = totalBorrowed,
            totalCreditCardDue = creditCardDue,
            totalCreditLimit = creditLimit,
            monthlyBudgetLimit = budgetLimit,
            monthlyBudgetSpent = budgetSpent
        )
    }

    fun calculateBudgetSpending(
        budget: Budget,
        transactions: List<Transaction>,
        targetCurrency: String = "PKR"
    ): Double {
        var spent = 0.0
        for (tx in transactions) {
            // Only count eligible expenses within budget timeframe
            if (tx.transactionDate in budget.startDate..budget.endDate) {
                val isEligibleExpense = tx.type == TransactionType.EXPENSE ||
                        tx.type == TransactionType.FEE ||
                        tx.type == TransactionType.CREDIT_CARD_PURCHASE

                if (isEligibleExpense) {
                    // If budget is overall (categoryId == null), or matches this category
                    if (budget.categoryId == null || budget.categoryId.isBlank() || budget.categoryId == tx.categoryId) {
                        spent += CurrencyConverter.convert(tx.amount, tx.currency, targetCurrency)
                    }
                }
            }
        }
        return spent
    }

    fun evaluateBudgetHealth(
        budget: Budget,
        transactions: List<Transaction>,
        targetCurrency: String = "PKR"
    ): BudgetHealth {
        val spent = calculateBudgetSpending(budget, transactions, targetCurrency)
        val limit = CurrencyConverter.convert(budget.amount, budget.currency, targetCurrency)
        val remaining = (limit - spent).coerceAtLeast(0.0)
        val pct = if (limit > 0) (spent / limit) * 100.0 else 0.0
        val isOver = spent > limit

        val warning = when {
            pct >= 100.0 -> "100% Exceeded!"
            pct >= 90.0 -> "90% Approaching Limit"
            pct >= 75.0 -> "75% Caution"
            pct >= 50.0 -> "50% Halfway"
            else -> null
        }

        return BudgetHealth(
            budget = budget,
            spentAmount = spent,
            remainingAmount = remaining,
            percentageUsed = pct,
            isOverBudget = isOver,
            thresholdWarning = warning
        )
    }

    fun calculateAccountBalanceFromTransactions(
        account: Account,
        transactions: List<Transaction>
    ): Double {
        var balance = account.openingBalance
        for (tx in transactions) {
            if (tx.accountId == account.id) {
                // Outflows from this account
                when (tx.type) {
                    TransactionType.EXPENSE,
                    TransactionType.FEE,
                    TransactionType.CREDIT_CARD_PURCHASE,
                    TransactionType.TRANSFER,
                    TransactionType.SAVINGS_CONTRIBUTION,
                    TransactionType.LOAN_GIVEN,
                    TransactionType.DEBT_REPAYMENT,
                    TransactionType.CREDIT_CARD_PAYMENT -> {
                        balance -= tx.amount
                    }
                    TransactionType.INCOME,
                    TransactionType.INTEREST,
                    TransactionType.REFUND,
                    TransactionType.SAVINGS_WITHDRAWAL,
                    TransactionType.LOAN_RECEIVED,
                    TransactionType.LOAN_REPAYMENT -> {
                        balance += tx.amount
                    }
                }
            } else if (tx.destinationAccountId == account.id) {
                // Incoming transfer to this account
                if (tx.type == TransactionType.TRANSFER) {
                    balance += tx.amount
                }
            }
        }
        return balance
    }
}
