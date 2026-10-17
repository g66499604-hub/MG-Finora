package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.Account
import com.example.data.model.AccountType
import com.example.data.model.Bill
import com.example.data.model.Budget
import com.example.data.model.Category
import com.example.data.model.Loan
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import com.example.data.model.UserProfile
import com.example.data.repository.FinoraRepository
import com.example.domain.FinancialEngine
import com.example.domain.FinancialSummary
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.Calendar

enum class FinoraScreen(val title: String) {
    DASHBOARD("Dashboard"),
    TRANSACTIONS("Transactions"),
    ADD_TRANSACTION("Add Transaction"),
    INCOME("Income"),
    EXPENSES("Expenses"),
    BUDGETS("Budgets"),
    SAVINGS("Savings Goals"),
    ACCOUNTS("Accounts & Wallets"),
    CREDIT_CARDS("Credit Cards"),
    CREDIT_DEBIT_OVERVIEW("Credit & Debit"),
    LOANS("Loans & Debts"),
    BILLS("Bills & Payments"),
    CATEGORIES("Categories"),
    REPORTS("Reports & Analytics"),
    CALENDAR("Financial Calendar"),
    SETTINGS("Settings"),
    ABOUT("About & Disclaimer")
}

enum class PeriodFilter(val label: String) {
    ALL("All Time"),
    THIS_MONTH("This Month"),
    LAST_MONTH("Last Month"),
    THIS_YEAR("This Year")
}

class FinoraViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = FinoraRepository(AppDatabase.getDatabase(application))

    private val _currentScreen = MutableStateFlow(FinoraScreen.DASHBOARD)
    val currentScreen: StateFlow<FinoraScreen> = _currentScreen.asStateFlow()

    private val _periodFilter = MutableStateFlow(PeriodFilter.THIS_MONTH)
    val periodFilter: StateFlow<PeriodFilter> = _periodFilter.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedTypeFilter = MutableStateFlow<TransactionType?>(null)
    val selectedTypeFilter: StateFlow<TransactionType?> = _selectedTypeFilter.asStateFlow()

    private val _selectedCategoryFilter = MutableStateFlow<String?>(null)
    val selectedCategoryFilter: StateFlow<String?> = _selectedCategoryFilter.asStateFlow()

    // Database flows
    val userProfile: StateFlow<UserProfile?> = repository.userProfile
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val accounts: StateFlow<List<Account>> = repository.accounts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val categories: StateFlow<List<Category>> = repository.categories
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<Transaction>> = repository.transactions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val budgets: StateFlow<List<Budget>> = repository.budgets
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val savingsGoals: StateFlow<List<SavingsGoal>> = repository.savingsGoals
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val loans: StateFlow<List<Loan>> = repository.loans
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bills: StateFlow<List<Bill>> = repository.bills
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Filtered transactions based on period, search, category, and type
    val filteredTransactions: StateFlow<List<Transaction>> = combine(
        transactions,
        _periodFilter,
        _searchQuery,
        _selectedTypeFilter,
        _selectedCategoryFilter
    ) { txList, period, query, typeFilter, catFilter ->
        val range = getPeriodRange(period)
        txList.filter { tx ->
            val inPeriod = tx.transactionDate in range.first..range.second
            val matchesQuery = query.isBlank() ||
                    tx.title.contains(query, ignoreCase = true) ||
                    tx.merchant.contains(query, ignoreCase = true) ||
                    tx.notes.contains(query, ignoreCase = true) ||
                    tx.categoryName.contains(query, ignoreCase = true)
            val matchesType = typeFilter == null || tx.type == typeFilter
            val matchesCat = catFilter == null || tx.categoryId == catFilter || tx.categoryName.equals(catFilter, ignoreCase = true)

            inPeriod && matchesQuery && matchesType && matchesCat
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    data class SummaryData(
        val transactions: List<Transaction>,
        val accounts: List<Account>,
        val budgets: List<Budget>,
        val savingsGoals: List<SavingsGoal>,
        val loans: List<Loan>
    )

    private val summaryDataFlow = combine(
        filteredTransactions,
        accounts,
        budgets,
        savingsGoals,
        loans
    ) { txList, accList, bgtList, goalList, loanList ->
        SummaryData(txList, accList, bgtList, goalList, loanList)
    }

    val summary: StateFlow<FinancialSummary> = combine(
        summaryDataFlow,
        userProfile
    ) { data, profile ->
        val currency = profile?.defaultCurrency ?: "PKR"
        FinancialEngine.calculatePeriodSummary(
            transactions = data.transactions,
            accounts = data.accounts,
            budgets = data.budgets,
            savingsGoals = data.savingsGoals,
            loans = data.loans,
            targetCurrency = currency
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        FinancialSummary(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    )

    init {
        viewModelScope.launch {
            repository.initializeDefaultDataIfNeeded()
        }
    }

    fun navigateTo(screen: FinoraScreen) {
        _currentScreen.value = screen
    }

    fun setPeriodFilter(filter: PeriodFilter) {
        _periodFilter.value = filter
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setTypeFilter(type: TransactionType?) {
        _selectedTypeFilter.value = type
    }

    fun setCategoryFilter(categoryId: String?) {
        _selectedCategoryFilter.value = categoryId
    }

    // CRUD wrappers
    fun addTransaction(tx: Transaction) {
        viewModelScope.launch { repository.insertTransaction(tx) }
    }

    fun updateTransaction(tx: Transaction) {
        viewModelScope.launch { repository.updateTransaction(tx) }
    }

    fun deleteTransaction(tx: Transaction) {
        viewModelScope.launch { repository.deleteTransaction(tx) }
    }

    fun addAccount(account: Account) {
        viewModelScope.launch { repository.insertAccount(account) }
    }

    fun updateAccount(account: Account) {
        viewModelScope.launch { repository.updateAccount(account) }
    }

    fun deleteAccount(account: Account) {
        viewModelScope.launch { repository.deleteAccount(account) }
    }

    fun addBudget(budget: Budget) {
        viewModelScope.launch { repository.insertBudget(budget) }
    }

    fun deleteBudget(budget: Budget) {
        viewModelScope.launch { repository.deleteBudget(budget) }
    }

    fun addSavingsGoal(goal: SavingsGoal) {
        viewModelScope.launch { repository.insertSavingsGoal(goal) }
    }

    fun contributeToGoal(goalId: String, amount: Double, sourceAccountId: String) {
        viewModelScope.launch { repository.contributeToSavingsGoal(goalId, amount, sourceAccountId) }
    }

    fun deleteSavingsGoal(goal: SavingsGoal) {
        viewModelScope.launch { repository.deleteSavingsGoal(goal) }
    }

    fun addLoan(loan: Loan) {
        viewModelScope.launch { repository.insertLoan(loan) }
    }

    fun recordLoanRepayment(loanId: String, amount: Double, accountId: String) {
        viewModelScope.launch { repository.recordLoanRepayment(loanId, amount, accountId) }
    }

    fun deleteLoan(loan: Loan) {
        viewModelScope.launch { repository.deleteLoan(loan) }
    }

    fun addBill(bill: Bill) {
        viewModelScope.launch { repository.insertBill(bill) }
    }

    fun markBillAsPaid(billId: String, payingAccountId: String) {
        viewModelScope.launch { repository.markBillAsPaid(billId, payingAccountId) }
    }

    fun deleteBill(bill: Bill) {
        viewModelScope.launch { repository.deleteBill(bill) }
    }

    fun addCategory(category: Category) {
        viewModelScope.launch { repository.insertCategory(category) }
    }

    fun deleteCategory(category: Category) {
        viewModelScope.launch { repository.deleteCategory(category) }
    }

    fun updateProfile(profile: UserProfile) {
        viewModelScope.launch { repository.saveUserProfile(profile) }
    }

    fun loadDemoData() {
        viewModelScope.launch { repository.loadSampleData() }
    }

    fun clearAllData() {
        viewModelScope.launch { repository.clearAllData() }
    }

    suspend fun exportCsv(): String {
        return repository.exportTransactionsToCsv()
    }

    suspend fun exportJson(): String {
        return repository.exportBackupJson()
    }

    private fun getPeriodRange(filter: PeriodFilter): Pair<Long, Long> {
        val calendar = Calendar.getInstance()
        return when (filter) {
            PeriodFilter.ALL -> Pair(0L, Long.MAX_VALUE)
            PeriodFilter.THIS_MONTH -> {
                calendar.set(Calendar.DAY_OF_MONTH, 1)
                calendar.set(Calendar.HOUR_OF_DAY, 0)
                calendar.set(Calendar.MINUTE, 0)
                calendar.set(Calendar.SECOND, 0)
                val start = calendar.timeInMillis
                calendar.add(Calendar.MONTH, 1)
                val end = calendar.timeInMillis - 1
                Pair(start, end)
            }
            PeriodFilter.LAST_MONTH -> {
                calendar.set(Calendar.DAY_OF_MONTH, 1)
                calendar.add(Calendar.MONTH, -1)
                calendar.set(Calendar.HOUR_OF_DAY, 0)
                calendar.set(Calendar.MINUTE, 0)
                calendar.set(Calendar.SECOND, 0)
                val start = calendar.timeInMillis
                calendar.add(Calendar.MONTH, 1)
                val end = calendar.timeInMillis - 1
                Pair(start, end)
            }
            PeriodFilter.THIS_YEAR -> {
                calendar.set(Calendar.DAY_OF_YEAR, 1)
                calendar.set(Calendar.HOUR_OF_DAY, 0)
                calendar.set(Calendar.MINUTE, 0)
                calendar.set(Calendar.SECOND, 0)
                val start = calendar.timeInMillis
                calendar.add(Calendar.YEAR, 1)
                val end = calendar.timeInMillis - 1
                Pair(start, end)
            }
        }
    }
}
