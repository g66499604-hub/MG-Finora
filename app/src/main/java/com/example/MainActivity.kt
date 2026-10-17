package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.Budget
import com.example.data.model.UserProfile
import com.example.ui.components.FinoraBottomBar
import com.example.ui.components.FinoraTopAppBar
import com.example.ui.screens.AboutScreen
import com.example.ui.screens.AccountsScreen
import com.example.ui.screens.AddEditTransactionSheet
import com.example.ui.screens.BillsScreen
import com.example.ui.screens.BudgetsScreen
import com.example.ui.screens.CalendarScreen
import com.example.ui.screens.CategoriesScreen
import com.example.ui.screens.CreditCardsScreen
import com.example.ui.screens.CreditDebitScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.IncomeExpenseScreen
import com.example.ui.screens.LoansScreen
import com.example.ui.screens.OnboardingScreen
import com.example.ui.screens.ReportsScreen
import com.example.ui.screens.SavingsScreen
import com.example.ui.screens.SettingsScreen
import com.example.ui.screens.TransactionsScreen
import com.example.ui.theme.FinoraTheme
import com.example.ui.viewmodel.FinoraScreen
import com.example.ui.viewmodel.FinoraViewModel
import java.util.UUID

class MainActivity : ComponentActivity() {

    private val viewModel: FinoraViewModel by viewModels()

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val userProfile by viewModel.userProfile.collectAsStateWithLifecycle()
            val accounts by viewModel.accounts.collectAsStateWithLifecycle()
            val categories by viewModel.categories.collectAsStateWithLifecycle()
            val transactions by viewModel.transactions.collectAsStateWithLifecycle()
            val filteredTransactions by viewModel.filteredTransactions.collectAsStateWithLifecycle()
            val budgets by viewModel.budgets.collectAsStateWithLifecycle()
            val savingsGoals by viewModel.savingsGoals.collectAsStateWithLifecycle()
            val loans by viewModel.loans.collectAsStateWithLifecycle()
            val bills by viewModel.bills.collectAsStateWithLifecycle()
            val summary by viewModel.summary.collectAsStateWithLifecycle()
            val currentScreen by viewModel.currentScreen.collectAsStateWithLifecycle()
            val periodFilter by viewModel.periodFilter.collectAsStateWithLifecycle()
            val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
            val selectedTypeFilter by viewModel.selectedTypeFilter.collectAsStateWithLifecycle()

            var showQuickAddSheet by remember { mutableStateOf(false) }

            FinoraTheme(themePreference = userProfile?.theme ?: "system") {
                // First-time onboarding check
                if (userProfile != null && !userProfile!!.isOnboardingCompleted) {
                    OnboardingScreen(
                        onCompleteOnboarding = { name, currency, income, budget, loadDemo ->
                            val updatedProfile = userProfile!!.copy(
                                displayName = name,
                                defaultCurrency = currency,
                                monthlyIncomeTarget = income,
                                monthlyBudgetTarget = budget,
                                isOnboardingCompleted = true
                            )
                            viewModel.updateProfile(updatedProfile)

                            if (budget > 0) {
                                viewModel.addBudget(
                                    Budget(
                                        id = UUID.randomUUID().toString(),
                                        name = "Monthly Overall Budget",
                                        amount = budget,
                                        currency = currency
                                    )
                                )
                            }

                            if (loadDemo) {
                                viewModel.loadDemoData()
                            }
                        }
                    )
                } else {
                    val defaultCurrency = userProfile?.defaultCurrency ?: "PKR"

                    Scaffold(
                        modifier = Modifier.fillMaxSize(),
                        topBar = {
                            FinoraTopAppBar(
                                currentScreen = currentScreen,
                                currency = defaultCurrency,
                                onNavigateBack = if (currentScreen != FinoraScreen.DASHBOARD) {
                                    { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                } else null,
                                onQuickAdd = { showQuickAddSheet = true },
                                onOpenSettings = { viewModel.navigateTo(FinoraScreen.SETTINGS) }
                            )
                        },
                        bottomBar = {
                            FinoraBottomBar(
                                currentScreen = currentScreen,
                                onNavigate = { viewModel.navigateTo(it) }
                            )
                        }
                    ) { innerPadding ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                        ) {
                            when (currentScreen) {
                                FinoraScreen.DASHBOARD -> DashboardScreen(
                                    summary = summary,
                                    profile = userProfile,
                                    transactions = transactions,
                                    accounts = accounts,
                                    budgets = budgets,
                                    goals = savingsGoals,
                                    bills = bills,
                                    periodFilter = periodFilter,
                                    onPeriodChange = { viewModel.setPeriodFilter(it) },
                                    onNavigate = { viewModel.navigateTo(it) },
                                    onDeleteTransaction = { viewModel.deleteTransaction(it) },
                                    onQuickAdd = { showQuickAddSheet = true }
                                )

                                FinoraScreen.TRANSACTIONS -> TransactionsScreen(
                                    transactions = filteredTransactions,
                                    categories = categories,
                                    defaultCurrency = defaultCurrency,
                                    periodFilter = periodFilter,
                                    searchQuery = searchQuery,
                                    selectedType = selectedTypeFilter,
                                    onSearchChange = { viewModel.setSearchQuery(it) },
                                    onPeriodChange = { viewModel.setPeriodFilter(it) },
                                    onTypeFilterChange = { viewModel.setTypeFilter(it) },
                                    onAddTransaction = { showQuickAddSheet = true },
                                    onDeleteTransaction = { viewModel.deleteTransaction(it) },
                                    onExportCsv = { viewModel.exportCsv() },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.ADD_TRANSACTION -> AddEditTransactionSheet(
                                    accounts = accounts,
                                    categories = categories,
                                    defaultCurrency = defaultCurrency,
                                    onSaveTransaction = {
                                        viewModel.addTransaction(it)
                                        viewModel.navigateTo(FinoraScreen.TRANSACTIONS)
                                    },
                                    onDismiss = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.INCOME -> IncomeExpenseScreen(
                                    transactions = transactions,
                                    defaultCurrency = defaultCurrency,
                                    initialTabIsExpense = false,
                                    onAddTransaction = { showQuickAddSheet = true },
                                    onDeleteTransaction = { viewModel.deleteTransaction(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.EXPENSES -> IncomeExpenseScreen(
                                    transactions = transactions,
                                    defaultCurrency = defaultCurrency,
                                    initialTabIsExpense = true,
                                    onAddTransaction = { showQuickAddSheet = true },
                                    onDeleteTransaction = { viewModel.deleteTransaction(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.BUDGETS -> BudgetsScreen(
                                    budgets = budgets,
                                    transactions = transactions,
                                    categories = categories,
                                    defaultCurrency = defaultCurrency,
                                    onAddBudget = { viewModel.addBudget(it) },
                                    onDeleteBudget = { viewModel.deleteBudget(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.SAVINGS -> SavingsScreen(
                                    goals = savingsGoals,
                                    accounts = accounts,
                                    defaultCurrency = defaultCurrency,
                                    onAddGoal = { goal -> viewModel.addSavingsGoal(goal) },
                                    onContribute = { goalId: String, amount: Double, accId: String ->
                                        viewModel.contributeToGoal(goalId, amount, accId)
                                    },
                                    onDeleteGoal = { goal -> viewModel.deleteSavingsGoal(goal) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.ACCOUNTS -> AccountsScreen(
                                    accounts = accounts,
                                    defaultCurrency = defaultCurrency,
                                    onAddAccount = { viewModel.addAccount(it) },
                                    onDeleteAccount = { viewModel.deleteAccount(it) },
                                    onTransfer = { viewModel.addTransaction(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.CREDIT_CARDS -> CreditCardsScreen(
                                    accounts = accounts,
                                    defaultCurrency = defaultCurrency,
                                    onMakePayment = { viewModel.addTransaction(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.CREDIT_DEBIT_OVERVIEW -> CreditDebitScreen(
                                    accounts = accounts,
                                    summary = summary,
                                    defaultCurrency = defaultCurrency,
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.LOANS -> LoansScreen(
                                    loans = loans,
                                    accounts = accounts,
                                    defaultCurrency = defaultCurrency,
                                    onAddLoan = { viewModel.addLoan(it) },
                                    onRecordRepayment = { loanId, amount, accId ->
                                        viewModel.recordLoanRepayment(loanId, amount, accId)
                                    },
                                    onDeleteLoan = { viewModel.deleteLoan(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.BILLS -> BillsScreen(
                                    bills = bills,
                                    accounts = accounts,
                                    categories = categories,
                                    defaultCurrency = defaultCurrency,
                                    onAddBill = { viewModel.addBill(it) },
                                    onPayBill = { billId, payingAccId ->
                                        viewModel.markBillAsPaid(billId, payingAccId)
                                    },
                                    onDeleteBill = { viewModel.deleteBill(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.CATEGORIES -> CategoriesScreen(
                                    categories = categories,
                                    onAddCategory = { viewModel.addCategory(it) },
                                    onDeleteCategory = { viewModel.deleteCategory(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.REPORTS -> ReportsScreen(
                                    summary = summary,
                                    transactions = transactions,
                                    accounts = accounts,
                                    budgets = budgets,
                                    goals = savingsGoals,
                                    loans = loans,
                                    defaultCurrency = defaultCurrency,
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.CALENDAR -> CalendarScreen(
                                    transactions = transactions,
                                    bills = bills,
                                    loans = loans,
                                    defaultCurrency = defaultCurrency,
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.SETTINGS -> SettingsScreen(
                                    profile = userProfile,
                                    onUpdateProfile = { viewModel.updateProfile(it) },
                                    onLoadDemoData = { viewModel.loadDemoData() },
                                    onClearAllData = { viewModel.clearAllData() },
                                    onExportCsv = { viewModel.exportCsv() },
                                    onExportJson = { viewModel.exportJson() },
                                    onNavigate = { viewModel.navigateTo(it) },
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )

                                FinoraScreen.ABOUT -> AboutScreen(
                                    onNavigateBack = { viewModel.navigateTo(FinoraScreen.DASHBOARD) }
                                )
                            }
                        }
                    }

                    // Quick Add Modal Bottom Sheet
                    if (showQuickAddSheet) {
                        ModalBottomSheet(
                            onDismissRequest = { showQuickAddSheet = false },
                            sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
                        ) {
                            AddEditTransactionSheet(
                                accounts = accounts,
                                categories = categories,
                                defaultCurrency = defaultCurrency,
                                onSaveTransaction = {
                                    viewModel.addTransaction(it)
                                    showQuickAddSheet = false
                                },
                                onDismiss = { showQuickAddSheet = false }
                            )
                        }
                    }
                }
            }
        }
    }
}
