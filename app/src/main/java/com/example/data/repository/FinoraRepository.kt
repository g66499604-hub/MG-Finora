package com.example.data.repository

import com.example.data.local.AppDatabase
import com.example.data.model.Account
import com.example.data.model.Bill
import com.example.data.model.BillStatus
import com.example.data.model.Budget
import com.example.data.model.Category
import com.example.data.model.Loan
import com.example.data.model.LoanStatus
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import com.example.data.model.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class FinoraRepository(private val database: AppDatabase) {

    val userProfile: Flow<UserProfile?> = database.userProfileDao().getUserProfile()
    val accounts: Flow<List<Account>> = database.accountDao().getAllActiveAccounts()
    val allAccountsWithArchived: Flow<List<Account>> = database.accountDao().getAllAccounts()
    val categories: Flow<List<Category>> = database.categoryDao().getAllCategories()
    val transactions: Flow<List<Transaction>> = database.transactionDao().getAllTransactions()
    val budgets: Flow<List<Budget>> = database.budgetDao().getAllBudgets()
    val savingsGoals: Flow<List<SavingsGoal>> = database.savingsGoalDao().getAllSavingsGoals()
    val loans: Flow<List<Loan>> = database.loanDao().getAllLoans()
    val bills: Flow<List<Bill>> = database.billDao().getAllBills()

    suspend fun initializeDefaultDataIfNeeded() {
        val profile = database.userProfileDao().getUserProfileOnce()
        if (profile == null) {
            database.userProfileDao().insertOrUpdate(UserProfile())
        }

        val existingCategories = database.categoryDao().getAllCategories().firstOrNull()
        if (existingCategories.isNullOrEmpty()) {
            database.categoryDao().insertCategories(DemoDataProvider.getDefaultCategories())
        }

        val existingAccounts = database.accountDao().getAllAccounts().firstOrNull()
        if (existingAccounts.isNullOrEmpty()) {
            database.accountDao().insertAccounts(DemoDataProvider.getDefaultAccounts())
        }
    }

    suspend fun saveUserProfile(profile: UserProfile) {
        database.userProfileDao().insertOrUpdate(profile)
    }

    // --- Transactions ---
    suspend fun insertTransaction(transaction: Transaction) {
        database.transactionDao().insertTransaction(transaction)
        recalculateAccountBalance(transaction.accountId)
        if (transaction.destinationAccountId != null) {
            recalculateAccountBalance(transaction.destinationAccountId)
        }
    }

    suspend fun updateTransaction(transaction: Transaction) {
        database.transactionDao().updateTransaction(transaction)
        recalculateAccountBalance(transaction.accountId)
        if (transaction.destinationAccountId != null) {
            recalculateAccountBalance(transaction.destinationAccountId)
        }
    }

    suspend fun deleteTransaction(transaction: Transaction) {
        database.transactionDao().deleteTransaction(transaction)
        recalculateAccountBalance(transaction.accountId)
        if (transaction.destinationAccountId != null) {
            recalculateAccountBalance(transaction.destinationAccountId)
        }
    }

    private suspend fun recalculateAccountBalance(accountId: String) {
        val account = database.accountDao().getAccountById(accountId) ?: return
        val allTx = database.transactionDao().getAllTransactions().firstOrNull() ?: emptyList()
        var newBal = account.openingBalance
        for (tx in allTx) {
            if (tx.accountId == accountId) {
                when (tx.type) {
                    TransactionType.EXPENSE,
                    TransactionType.FEE,
                    TransactionType.CREDIT_CARD_PURCHASE,
                    TransactionType.TRANSFER,
                    TransactionType.SAVINGS_CONTRIBUTION,
                    TransactionType.LOAN_GIVEN,
                    TransactionType.DEBT_REPAYMENT,
                    TransactionType.CREDIT_CARD_PAYMENT -> {
                        newBal -= tx.amount
                    }
                    TransactionType.INCOME,
                    TransactionType.INTEREST,
                    TransactionType.REFUND,
                    TransactionType.SAVINGS_WITHDRAWAL,
                    TransactionType.LOAN_RECEIVED,
                    TransactionType.LOAN_REPAYMENT -> {
                        newBal += tx.amount
                    }
                }
            } else if (tx.destinationAccountId == accountId) {
                if (tx.type == TransactionType.TRANSFER) {
                    newBal += tx.amount
                }
            }
        }
        database.accountDao().updateAccount(account.copy(currentBalance = newBal, updatedAt = System.currentTimeMillis()))
    }

    // --- Accounts ---
    suspend fun insertAccount(account: Account) {
        database.accountDao().insertAccount(account)
    }

    suspend fun updateAccount(account: Account) {
        database.accountDao().updateAccount(account)
    }

    suspend fun deleteAccount(account: Account) {
        database.accountDao().deleteAccount(account)
    }

    // --- Categories ---
    suspend fun insertCategory(category: Category) {
        database.categoryDao().insertCategory(category)
    }

    suspend fun deleteCategory(category: Category) {
        database.categoryDao().deleteCategory(category)
    }

    // --- Budgets ---
    suspend fun insertBudget(budget: Budget) {
        database.budgetDao().insertBudget(budget)
    }

    suspend fun updateBudget(budget: Budget) {
        database.budgetDao().updateBudget(budget)
    }

    suspend fun deleteBudget(budget: Budget) {
        database.budgetDao().deleteBudget(budget)
    }

    // --- Savings Goals ---
    suspend fun insertSavingsGoal(goal: SavingsGoal) {
        database.savingsGoalDao().insertSavingsGoal(goal)
    }

    suspend fun updateSavingsGoal(goal: SavingsGoal) {
        database.savingsGoalDao().updateSavingsGoal(goal)
    }

    suspend fun deleteSavingsGoal(goal: SavingsGoal) {
        database.savingsGoalDao().deleteSavingsGoal(goal)
    }

    suspend fun contributeToSavingsGoal(goalId: String, amount: Double, sourceAccountId: String) {
        val goals = database.savingsGoalDao().getAllSavingsGoals().firstOrNull() ?: return
        val goal = goals.firstOrNull { it.id == goalId } ?: return
        val updatedAmount = goal.currentAmount + amount
        database.savingsGoalDao().updateSavingsGoal(
            goal.copy(
                currentAmount = updatedAmount,
                updatedAt = System.currentTimeMillis()
            )
        )
        // Record linked savings contribution transaction
        val tx = Transaction(
            id = UUID.randomUUID().toString(),
            type = TransactionType.SAVINGS_CONTRIBUTION,
            title = "Contribution: ${goal.name}",
            amount = amount,
            currency = goal.currency,
            accountId = sourceAccountId,
            linkedEntityId = goalId,
            notes = "Savings deposit for ${goal.name}"
        )
        insertTransaction(tx)
    }

    // --- Loans & Debts ---
    suspend fun insertLoan(loan: Loan) {
        database.loanDao().insertLoan(loan)
    }

    suspend fun updateLoan(loan: Loan) {
        database.loanDao().updateLoan(loan)
    }

    suspend fun deleteLoan(loan: Loan) {
        database.loanDao().deleteLoan(loan)
    }

    suspend fun recordLoanRepayment(loanId: String, amount: Double, accountId: String) {
        val loans = database.loanDao().getAllLoans().firstOrNull() ?: return
        val loan = loans.firstOrNull { it.id == loanId } ?: return
        val newRepaid = loan.repaidAmount + amount
        val newStatus = if (newRepaid >= loan.principalAmount) LoanStatus.PAID else LoanStatus.PARTIALLY_PAID
        database.loanDao().updateLoan(
            loan.copy(
                repaidAmount = newRepaid,
                status = newStatus,
                updatedAt = System.currentTimeMillis()
            )
        )
        // Create matching ledger transaction
        val tx = Transaction(
            id = UUID.randomUUID().toString(),
            type = TransactionType.LOAN_REPAYMENT,
            title = "Repayment for ${loan.name}",
            amount = amount,
            currency = loan.currency,
            accountId = accountId,
            linkedEntityId = loanId,
            notes = "Principal settlement towards ${loan.contactName}"
        )
        insertTransaction(tx)
    }

    // --- Bills ---
    suspend fun insertBill(bill: Bill) {
        database.billDao().insertBill(bill)
    }

    suspend fun updateBill(bill: Bill) {
        database.billDao().updateBill(bill)
    }

    suspend fun deleteBill(bill: Bill) {
        database.billDao().deleteBill(bill)
    }

    suspend fun markBillAsPaid(billId: String, payingAccountId: String) {
        val bills = database.billDao().getAllBills().firstOrNull() ?: return
        val bill = bills.firstOrNull { it.id == billId } ?: return

        val txId = UUID.randomUUID().toString()
        val tx = Transaction(
            id = txId,
            type = TransactionType.EXPENSE,
            title = "Paid: ${bill.name}",
            amount = bill.amount,
            currency = bill.currency,
            categoryId = bill.categoryId,
            categoryName = bill.categoryName,
            accountId = payingAccountId,
            linkedEntityId = billId,
            notes = "Bill payment for ${bill.provider}"
        )
        insertTransaction(tx)

        database.billDao().updateBill(
            bill.copy(
                isPaid = true,
                status = BillStatus.PAID,
                lastPaidDate = System.currentTimeMillis(),
                linkedTransactionId = txId
            )
        )
    }

    // --- Demo Data & Cleanup ---
    suspend fun loadSampleData() {
        val sample = DemoDataProvider.getSampleData()
        database.transactionDao().insertTransactions(sample.transactions)
        database.budgetDao().insertBudgets(sample.budgets)
        database.savingsGoalDao().insertSavingsGoals(sample.savingsGoals)
        database.loanDao().insertLoans(sample.loans)
        database.billDao().insertBills(sample.bills)
        // Refresh account balances
        val accounts = database.accountDao().getAllAccounts().firstOrNull() ?: emptyList()
        for (acc in accounts) {
            recalculateAccountBalance(acc.id)
        }
    }

    suspend fun clearAllData() {
        database.transactionDao().deleteAllTransactions()
        database.budgetDao().deleteAllBudgets()
        database.savingsGoalDao().deleteAllSavingsGoals()
        database.loanDao().deleteAllLoans()
        database.billDao().deleteAllBills()
        database.accountDao().deleteAllAccounts()
        database.categoryDao().deleteAllCategories()
        // Reset defaults
        initializeDefaultDataIfNeeded()
    }

    // --- CSV Export ---
    suspend fun exportTransactionsToCsv(): String {
        val txs = database.transactionDao().getAllTransactions().firstOrNull() ?: emptyList()
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US)
        val sb = StringBuilder()
        sb.append("ID,Type,Title,Amount,Currency,Category,Account,Date,PaymentMethod,Merchant,Notes\n")
        for (tx in txs) {
            val dateStr = sdf.format(Date(tx.transactionDate))
            sb.append("\"${tx.id}\",")
            sb.append("\"${tx.type.label}\",")
            sb.append("\"${tx.title.replace("\"", "\"\"")}\",")
            sb.append("${tx.amount},")
            sb.append("\"${tx.currency}\",")
            sb.append("\"${tx.categoryName}\",")
            sb.append("\"${tx.accountId}\",")
            sb.append("\"$dateStr\",")
            sb.append("\"${tx.paymentMethod}\",")
            sb.append("\"${tx.merchant}\",")
            sb.append("\"${tx.notes.replace("\"", "\"\"")}\"\n")
        }
        return sb.toString()
    }

    // --- JSON Backup ---
    suspend fun exportBackupJson(): String {
        val root = JSONObject()
        val profile = database.userProfileDao().getUserProfileOnce()
        val accs = database.accountDao().getAllAccounts().firstOrNull() ?: emptyList()
        val cats = database.categoryDao().getAllCategories().firstOrNull() ?: emptyList()
        val txs = database.transactionDao().getAllTransactions().firstOrNull() ?: emptyList()
        val bgts = database.budgetDao().getAllBudgets().firstOrNull() ?: emptyList()
        val goals = database.savingsGoalDao().getAllSavingsGoals().firstOrNull() ?: emptyList()
        val loans = database.loanDao().getAllLoans().firstOrNull() ?: emptyList()
        val bills = database.billDao().getAllBills().firstOrNull() ?: emptyList()

        root.put("app", "MG Finora")
        root.put("version", "1.0")
        root.put("exportTimestamp", System.currentTimeMillis())
        root.put("transactionsCount", txs.size)
        root.put("accountsCount", accs.size)
        return root.toString(2)
    }
}
