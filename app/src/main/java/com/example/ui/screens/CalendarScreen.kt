package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Bill
import com.example.data.model.Loan
import com.example.data.model.Transaction
import com.example.domain.CurrencyConverter
import com.example.ui.components.TransactionRow
import com.example.ui.theme.FinancialNegative
import com.example.ui.theme.FinancialPositive
import com.example.ui.theme.FinancialWarning
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@Composable
fun CalendarScreen(
    transactions: List<Transaction>,
    bills: List<Bill>,
    loans: List<Loan>,
    defaultCurrency: String,
    onNavigateBack: () -> Unit
) {
    BackHandler { onNavigateBack() }

    val calendar = remember { Calendar.getInstance() }
    val daysInMonth = remember {
        val list = mutableListOf<Date>()
        val cal = Calendar.getInstance()
        cal.set(Calendar.DAY_OF_MONTH, 1)
        val maxDays = cal.getActualMaximum(Calendar.DAY_OF_MONTH)
        for (i in 1..maxDays) {
            cal.set(Calendar.DAY_OF_MONTH, i)
            list.add(cal.time)
        }
        list
    }

    var selectedDate by remember { mutableStateOf(Date()) }
    val daySdf = SimpleDateFormat("d", Locale.US)
    val dayNameSdf = SimpleDateFormat("EEE", Locale.US)
    val fullSdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)

    val selectedDateString = fullSdf.format(selectedDate)

    // Items for selected date
    val dayTransactions = transactions.filter {
        fullSdf.format(Date(it.transactionDate)) == selectedDateString
    }

    val dayBills = bills.filter {
        fullSdf.format(Date(it.dueDate)) == selectedDateString
    }

    val dayLoans = loans.filter {
        fullSdf.format(Date(it.dueDate)) == selectedDateString
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column {
            Text(
                text = "Financial Calendar",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "Upcoming bills, payments, and timeline events",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Horizontal Month Date Picker
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                val monthYearSdf = SimpleDateFormat("MMMM yyyy", Locale.US)
                Text(
                    text = monthYearSdf.format(selectedDate),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = RoyalNavy
                )

                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(daysInMonth) { date ->
                        val isSelected = fullSdf.format(date) == selectedDateString
                        val dateStr = fullSdf.format(date)
                        val hasBill = bills.any { fullSdf.format(Date(it.dueDate)) == dateStr && !it.isPaid }
                        val hasTx = transactions.any { fullSdf.format(Date(it.transactionDate)) == dateStr }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) RoyalNavy else MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier
                                .clickable { selectedDate = date }
                                .width(48.dp)
                                .height(64.dp)
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Text(
                                    text = dayNameSdf.format(date),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (isSelected) Color.White.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = daySdf.format(date),
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) MetallicGold else MaterialTheme.colorScheme.onSurface
                                )
                                if (hasBill) {
                                    Box(
                                        modifier = Modifier
                                            .size(5.dp)
                                            .background(FinancialNegative, CircleShape)
                                    )
                                } else if (hasTx) {
                                    Box(
                                        modifier = Modifier
                                            .size(5.dp)
                                            .background(FinancialPositive, CircleShape)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Events on this date
        val displayDateSdf = SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.US)
        Text(
            text = "Events for ${displayDateSdf.format(selectedDate)}",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )

        if (dayTransactions.isEmpty() && dayBills.isEmpty() && dayLoans.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No financial activity scheduled on this date.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Bills Due
                items(dayBills) { bill ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = FinancialWarning.copy(alpha = 0.15f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Bill Due: ${bill.name}", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
                                Text(bill.provider, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text(
                                CurrencyConverter.format(bill.amount, bill.currency),
                                fontWeight = FontWeight.Bold,
                                color = FinancialNegative
                            )
                        }
                    }
                }

                // Transactions
                items(dayTransactions) { tx ->
                    TransactionRow(
                        transaction = tx,
                        defaultCurrency = defaultCurrency
                    )
                }
            }
        }
    }
}
