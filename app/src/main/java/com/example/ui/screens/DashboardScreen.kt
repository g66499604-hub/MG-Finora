package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.Savings
import androidx.compose.material.icons.filled.SyncAlt
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Account
import com.example.data.model.Bill
import com.example.data.model.Budget
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.data.model.UserProfile
import com.example.domain.CurrencyConverter
import com.example.domain.FinancialEngine
import com.example.domain.FinancialSummary
import com.example.ui.components.ChartSlice
import com.example.ui.components.FinoraComparisonBar
import com.example.ui.components.FinoraDonutChart
import com.example.ui.components.MetricCard
import com.example.ui.components.TransactionRow
import com.example.ui.theme.FinancialInfo
import com.example.ui.theme.FinancialNegative
import com.example.ui.theme.FinancialPositive
import com.example.ui.theme.FinancialPurple
import com.example.ui.theme.FinancialWarning
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import com.example.ui.viewmodel.FinoraScreen
import com.example.ui.viewmodel.PeriodFilter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun DashboardScreen(
    summary: FinancialSummary,
    profile: UserProfile?,
    transactions: List<Transaction>,
    accounts: List<Account>,
    budgets: List<Budget>,
    goals: List<SavingsGoal>,
    bills: List<Bill>,
    periodFilter: PeriodFilter,
    onPeriodChange: (PeriodFilter) -> Unit,
    onNavigate: (FinoraScreen) -> Unit,
    onDeleteTransaction: (Transaction) -> Unit,
    onQuickAdd: () -> Unit
) {
    val currency = profile?.defaultCurrency ?: "PKR"
    val sdf = SimpleDateFormat("EEEE, MMM dd", Locale.US)
    val todayDate = remember { sdf.format(Date()) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .testTag("dashboard_screen"),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header & Date
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Hello, ${profile?.displayName ?: "Finora Member"}",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = todayDate,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Button(
                    onClick = onQuickAdd,
                    colors = ButtonDefaults.buttonColors(containerColor = MetallicGold, contentColor = Color(0xFF0C1830)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.testTag("dashboard_quick_add_btn")
                ) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Add", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Period Filters
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(PeriodFilter.entries) { filter ->
                    val isSelected = filter == periodFilter
                    FilterChip(
                        selected = isSelected,
                        onClick = { onPeriodChange(filter) },
                        label = { Text(filter.label) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = RoyalNavy,
                            selectedLabelColor = Color.White
                        ),
                        modifier = Modifier.testTag("filter_${filter.name.lowercase()}")
                    )
                }
            }
        }

        // KPI Summary Cards
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = "Available Balance",
                        amount = summary.totalBalance,
                        currency = currency,
                        icon = Icons.Default.AccountBalance,
                        iconTint = RoyalNavy,
                        subtitle = "${accounts.size} active accounts",
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.ACCOUNTS) }
                    )
                    MetricCard(
                        title = "Net Cash Flow",
                        amount = summary.netCashFlow,
                        currency = currency,
                        icon = Icons.Default.TrendingUp,
                        iconTint = if (summary.netCashFlow >= 0) FinancialPositive else FinancialNegative,
                        subtitle = if (summary.netCashFlow >= 0) "Surplus" else "Deficit",
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.REPORTS) }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = "Total Income",
                        amount = summary.totalIncome,
                        currency = currency,
                        icon = Icons.Default.ArrowDownward,
                        iconTint = FinancialPositive,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.INCOME) }
                    )
                    MetricCard(
                        title = "Total Expenses",
                        amount = summary.totalExpense,
                        currency = currency,
                        icon = Icons.Default.ArrowUpward,
                        iconTint = FinancialNegative,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.EXPENSES) }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(
                        title = "Savings Stash",
                        amount = summary.totalSavings,
                        currency = currency,
                        icon = Icons.Default.Savings,
                        iconTint = MetallicGold,
                        subtitle = "${goals.size} active goals",
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.SAVINGS) }
                    )
                    MetricCard(
                        title = "Outstanding Debt",
                        amount = summary.totalBorrowed + summary.totalCreditCardDue,
                        currency = currency,
                        icon = Icons.Default.CreditCard,
                        iconTint = FinancialWarning,
                        subtitle = "Payables & Cards",
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate(FinoraScreen.LOANS) }
                    )
                }
            }
        }

        // Budget Warnings (if any budget exceeds 75%)
        val overBudgets = budgets.map { FinancialEngine.evaluateBudgetHealth(it, transactions, currency) }
            .filter { it.percentageUsed >= 75.0 }

        if (overBudgets.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = FinancialWarning.copy(alpha = 0.15f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Alert",
                            tint = FinancialWarning,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Budget Alerts (${overBudgets.size})",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "${overBudgets.first().budget.name} is at ${overBudgets.first().percentageUsed.toInt()}% of limit",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = "View",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = RoyalNavy,
                            modifier = Modifier.clickable { onNavigate(FinoraScreen.BUDGETS) }
                        )
                    }
                }
            }
        }

        // Cash Flow Comparison Bar
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Cash Flow Ratio",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "In vs Out",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    FinoraComparisonBar(
                        income = summary.totalIncome,
                        expense = summary.totalExpense,
                        currency = currency
                    )
                }
            }
        }

        // Spending By Category (Donut Chart)
        val expenseTransactions = transactions.filter { it.type.isExpenseLike }
        val categoryTotals = expenseTransactions
            .groupBy { it.categoryName.ifBlank { "Uncategorized" } }
            .mapValues { (_, txList) -> txList.sumOf { CurrencyConverter.convert(it.amount, it.currency, currency) } }
            .toList()
            .sortedByDescending { it.second }

        val palette = listOf(
            FinancialPositive,
            FinancialWarning,
            FinancialNegative,
            FinancialInfo,
            FinancialPurple,
            MetallicGold,
            RoyalNavy
        )

        val chartSlices = categoryTotals.mapIndexed { index, pair ->
            ChartSlice(
                label = pair.first,
                value = pair.second,
                color = palette[index % palette.size]
            )
        }

        if (chartSlices.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Top Expense Categories",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Breakdown",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        FinoraDonutChart(
                            slices = chartSlices,
                            centerTitle = "Total Spent",
                            centerValue = CurrencyConverter.format(summary.totalExpense, currency)
                        )
                    }
                }
            }
        }

        // Upcoming Bills Due
        val unpaidBills = bills.filter { !it.isPaid }.take(3)
        if (unpaidBills.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Upcoming Bills",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "View All",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = RoyalNavy,
                                modifier = Modifier.clickable { onNavigate(FinoraScreen.BILLS) }
                            )
                        }

                        for (bill in unpaidBills) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = bill.name,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = bill.provider,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Text(
                                    text = CurrencyConverter.format(bill.amount, bill.currency),
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = FinancialNegative
                                )
                            }
                        }
                    }
                }
            }
        }

        // Recent Transactions Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Transactions",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "See All (${transactions.size})",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = RoyalNavy,
                    modifier = Modifier
                        .clickable { onNavigate(FinoraScreen.TRANSACTIONS) }
                        .testTag("dashboard_see_all_tx")
                )
            }
        }

        if (transactions.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "No transactions recorded yet",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Start organizing your finances by adding your first transaction or loading demo data in Settings.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Button(
                            onClick = onQuickAdd,
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Add First Transaction")
                        }
                    }
                }
            }
        } else {
            val recentList = transactions.take(5)
            items(recentList) { tx ->
                TransactionRow(
                    transaction = tx,
                    defaultCurrency = currency,
                    onDelete = { onDeleteTransaction(tx) }
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
