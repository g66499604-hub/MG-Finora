package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Account
import com.example.data.model.Budget
import com.example.data.model.Loan
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.domain.CurrencyConverter
import com.example.domain.FinancialEngine
import com.example.domain.FinancialSummary
import com.example.ui.components.ChartSlice
import com.example.ui.components.FinoraComparisonBar
import com.example.ui.components.FinoraDonutChart
import com.example.ui.theme.FinancialInfo
import com.example.ui.theme.FinancialNegative
import com.example.ui.theme.FinancialPositive
import com.example.ui.theme.FinancialPurple
import com.example.ui.theme.FinancialWarning
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy

@Composable
fun ReportsScreen(
    summary: FinancialSummary,
    transactions: List<Transaction>,
    accounts: List<Account>,
    budgets: List<Budget>,
    goals: List<SavingsGoal>,
    loans: List<Loan>,
    defaultCurrency: String,
    onNavigateBack: () -> Unit
) {
    BackHandler { onNavigateBack() }

    val expenseTransactions = transactions.filter { it.type.isExpenseLike }
    val categoryTotals = expenseTransactions
        .groupBy { it.categoryName.ifBlank { "Uncategorized" } }
        .mapValues { (_, txList) -> txList.sumOf { CurrencyConverter.convert(it.amount, it.currency, defaultCurrency) } }
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

    val slices = categoryTotals.mapIndexed { index, pair ->
        ChartSlice(label = pair.first, value = pair.second, color = palette[index % palette.size])
    }

    // Payment Method Distribution
    val paymentMethodTotals = transactions
        .groupBy { it.paymentMethod.ifBlank { "Other" } }
        .mapValues { (_, txList) -> txList.size }
        .toList()
        .sortedByDescending { it.second }

    // Net Worth Calculation
    val totalAssets = summary.totalBalance + summary.totalSavings + summary.totalLent
    val totalLiabilities = summary.totalBorrowed + summary.totalCreditCardDue
    val netWorth = totalAssets - totalLiabilities

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column {
            Text(
                text = "Reports & Analytics",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Financial health metrics, asset distribution and trends",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Net Worth Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = RoyalNavy),
            elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "ESTIMATED NET WORTH",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MetallicGold,
                    letterSpacing = 1.sp
                )
                Text(
                    text = CurrencyConverter.format(netWorth, defaultCurrency),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Total Assets", style = MaterialTheme.typography.labelSmall, color = Color.White.copy(alpha = 0.7f))
                        Text(
                            CurrencyConverter.format(totalAssets, defaultCurrency),
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = FinancialPositive
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Total Liabilities", style = MaterialTheme.typography.labelSmall, color = Color.White.copy(alpha = 0.7f))
                        Text(
                            CurrencyConverter.format(totalLiabilities, defaultCurrency),
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = FinancialNegative
                        )
                    }
                }
            }
        }

        // Cash Flow Ratio
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
                Text(
                    text = "Inflow vs Outflow Ratio",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                FinoraComparisonBar(
                    income = summary.totalIncome,
                    expense = summary.totalExpense,
                    currency = defaultCurrency
                )
            }
        }

        // Expense Category Donut Breakdown
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
                Text(
                    text = "Category Distribution",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                FinoraDonutChart(
                    slices = slices,
                    centerTitle = "Total Outflows",
                    centerValue = CurrencyConverter.format(summary.totalExpense, defaultCurrency)
                )
            }
        }

        // Payment Method Usage Distribution
        if (paymentMethodTotals.isNotEmpty()) {
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
                    Text(
                        text = "Payment Method Share",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    val totalTx = paymentMethodTotals.sumOf { it.second }
                    paymentMethodTotals.take(4).forEach { (method, count) ->
                        val pct = if (totalTx > 0) (count.toFloat() / totalTx * 100).toInt() else 0
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(method, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text("$count transactions ($pct%)", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}
