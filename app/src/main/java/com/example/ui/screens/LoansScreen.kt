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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CallReceived
import androidx.compose.material.icons.filled.CallMade
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Account
import com.example.data.model.Loan
import com.example.data.model.LoanDirection
import com.example.data.model.LoanStatus
import com.example.domain.CurrencyConverter
import com.example.ui.theme.FinancialNegative
import com.example.ui.theme.FinancialPositive
import com.example.ui.theme.FinancialWarning
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoansScreen(
    loans: List<Loan>,
    accounts: List<Account>,
    defaultCurrency: String,
    onAddLoan: (Loan) -> Unit,
    onRecordRepayment: (loanId: String, amount: Double, accountId: String) -> Unit,
    onDeleteLoan: (Loan) -> Unit,
    onNavigateBack: () -> Unit
) {
    BackHandler { onNavigateBack() }
    var showAddDialog by remember { mutableStateOf(false) }
    var repayingLoan by remember { mutableStateOf<Loan?>(null) }
    var directionFilter by remember { mutableStateOf<LoanDirection?>(null) } // null = all

    val filteredLoans = if (directionFilter == null) loans else loans.filter { it.direction == directionFilter }

    val totalLentOutstanding = loans.filter { it.direction == LoanDirection.LENT }
        .sumOf { CurrencyConverter.convert(it.principalAmount - it.repaidAmount, it.currency, defaultCurrency) }

    val totalBorrowedOutstanding = loans.filter { it.direction == LoanDirection.BORROWED }
        .sumOf { CurrencyConverter.convert(it.principalAmount - it.repaidAmount, it.currency, defaultCurrency) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Loans & Debts",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Money lent to others and borrowed liabilities",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Button(
                onClick = { showAddDialog = true },
                colors = ButtonDefaults.buttonColors(containerColor = MetallicGold, contentColor = Color(0xFF0C1830)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.testTag("add_loan_btn")
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("New Debt", fontWeight = FontWeight.Bold)
            }
        }

        // Summary KPI Cards (Lent vs Borrowed)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Money Lent (Receivable)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = CurrencyConverter.format(totalLentOutstanding, defaultCurrency),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FinancialPositive
                    )
                }
            }
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Money Borrowed (Payable)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = CurrencyConverter.format(totalBorrowedOutstanding, defaultCurrency),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FinancialNegative
                    )
                }
            }
        }

        // Direction Filters
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = directionFilter == null,
                onClick = { directionFilter = null },
                label = { Text("All Records") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = RoyalNavy, selectedLabelColor = Color.White)
            )
            FilterChip(
                selected = directionFilter == LoanDirection.LENT,
                onClick = { directionFilter = LoanDirection.LENT },
                label = { Text("Lent (Asset)") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = RoyalNavy, selectedLabelColor = Color.White)
            )
            FilterChip(
                selected = directionFilter == LoanDirection.BORROWED,
                onClick = { directionFilter = LoanDirection.BORROWED },
                label = { Text("Borrowed (Owed)") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = RoyalNavy, selectedLabelColor = Color.White)
            )
        }

        if (filteredLoans.isEmpty()) {
            Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                Text("No loan or debt records", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxWidth().weight(1f).testTag("loans_list"),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredLoans, key = { it.id }) { loan ->
                    val isLent = loan.direction == LoanDirection.LENT
                    val outstanding = (loan.principalAmount - loan.repaidAmount).coerceAtLeast(0.0)
                    val progress = if (loan.principalAmount > 0) (loan.repaidAmount / loan.principalAmount).toFloat().coerceIn(0f, 1f) else 0f
                    val sdf = SimpleDateFormat("MMM dd, yyyy", Locale.US)
                    val dueString = sdf.format(Date(loan.dueDate))

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier.size(36.dp).background(if (isLent) FinancialPositive.copy(alpha = 0.15f) else FinancialNegative.copy(alpha = 0.15f), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = if (isLent) Icons.Default.CallMade else Icons.Default.CallReceived,
                                            contentDescription = null,
                                            tint = if (isLent) FinancialPositive else FinancialNegative,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(loan.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                        Text("${if (isLent) "To" else "From"}: ${loan.contactName}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }

                                IconButton(onClick = { onDeleteLoan(loan) }, modifier = Modifier.size(32.dp)) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f), modifier = Modifier.size(18.dp))
                                }
                            }

                            LinearProgressIndicator(
                                progress = { progress },
                                modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                                color = if (isLent) FinancialPositive else RoyalNavy,
                                trackColor = MaterialTheme.colorScheme.surfaceVariant
                            )

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Outstanding: ${CurrencyConverter.format(outstanding, loan.currency)}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold, color = if (isLent) FinancialPositive else FinancialNegative)
                                Text("Due: $dueString", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }

                            if (outstanding > 0) {
                                OutlinedButton(
                                    onClick = { repayingLoan = loan },
                                    modifier = Modifier.fillMaxWidth().height(36.dp),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("Record Repayment")
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Add Loan Dialog
    if (showAddDialog) {
        var name by remember { mutableStateOf("") }
        var contact by remember { mutableStateOf("") }
        var direction by remember { mutableStateOf(LoanDirection.BORROWED) }
        var amountText by remember { mutableStateOf("") }
        var notes by remember { mutableStateOf("") }
        var error by remember { mutableStateOf<String?>(null) }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("New Loan / Debt") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = direction == LoanDirection.BORROWED,
                            onClick = { direction = LoanDirection.BORROWED },
                            label = { Text("Borrowed (Owed)") }
                        )
                        FilterChip(
                            selected = direction == LoanDirection.LENT,
                            onClick = { direction = LoanDirection.LENT },
                            label = { Text("Lent (Receivable)") }
                        )
                    }

                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Title") },
                        placeholder = { Text("e.g. University Laptop Loan, Bike Financing") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = contact,
                        onValueChange = { contact = it },
                        label = { Text("Contact Person / Entity") },
                        placeholder = { Text("e.g. Ali Raza, Bank, Dealership") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("Principal Amount") },
                        placeholder = { Text("50000") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Notes (Optional)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    if (error != null) {
                        Text(error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = amountText.toDoubleOrNull()
                        if (name.isBlank() || contact.isBlank()) {
                            error = "Please fill in title and contact person"
                            return@Button
                        }
                        if (amount == null || amount <= 0) {
                            error = "Enter a valid positive principal amount"
                            return@Button
                        }

                        onAddLoan(
                            Loan(
                                id = UUID.randomUUID().toString(),
                                name = name.trim(),
                                contactName = contact.trim(),
                                direction = direction,
                                principalAmount = amount,
                                currency = defaultCurrency,
                                notes = notes.trim()
                            )
                        )
                        showAddDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy)
                ) {
                    Text("Save Record")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) { Text("Cancel") }
            }
        )
    }

    // Record Repayment Dialog
    if (repayingLoan != null) {
        var repayAmountText by remember { mutableStateOf("") }
        var selectedAccount by remember { mutableStateOf(accounts.firstOrNull()) }
        var error by remember { mutableStateOf<String?>(null) }

        AlertDialog(
            onDismissRequest = { repayingLoan = null },
            title = { Text("Repayment for ${repayingLoan?.name}") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = repayAmountText,
                        onValueChange = { repayAmountText = it },
                        label = { Text("Settlement Amount") },
                        placeholder = { Text("10000") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    var accExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(expanded = accExpanded, onExpandedChange = { accExpanded = it }) {
                        OutlinedTextField(
                            value = selectedAccount?.name ?: "Select Account",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text(if (repayingLoan?.direction == LoanDirection.LENT) "Deposit Repayment To" else "Pay Repayment From") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = accExpanded) },
                            modifier = Modifier.fillMaxWidth().menuAnchor()
                        )
                        ExposedDropdownMenu(expanded = accExpanded, onDismissRequest = { accExpanded = false }) {
                            accounts.forEach { acc ->
                                DropdownMenuItem(
                                    text = { Text("${acc.name} (${CurrencyConverter.format(acc.currentBalance, acc.currency)})") },
                                    onClick = { selectedAccount = acc; accExpanded = false }
                                )
                            }
                        }
                    }

                    if (error != null) {
                        Text(error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amount = repayAmountText.toDoubleOrNull()
                        if (amount == null || amount <= 0) {
                            error = "Enter a valid amount"
                            return@Button
                        }
                        if (selectedAccount == null) {
                            error = "Select an account"
                            return@Button
                        }
                        onRecordRepayment(repayingLoan!!.id, amount, selectedAccount!!.id)
                        repayingLoan = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy)
                ) {
                    Text("Record Settlement")
                }
            },
            dismissButton = {
                TextButton(onClick = { repayingLoan = null }) { Text("Cancel") }
            }
        )
    }
}
