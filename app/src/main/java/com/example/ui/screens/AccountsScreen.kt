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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.SyncAlt
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Account
import com.example.data.model.AccountType
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import com.example.domain.CurrencyConverter
import com.example.ui.components.AccountCard
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccountsScreen(
    accounts: List<Account>,
    defaultCurrency: String,
    onAddAccount: (Account) -> Unit,
    onDeleteAccount: (Account) -> Unit,
    onTransfer: (Transaction) -> Unit,
    onNavigateBack: () -> Unit
) {
    BackHandler { onNavigateBack() }
    var showAddAccountDialog by remember { mutableStateOf(false) }
    var showTransferDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header & Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Accounts & Wallets",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "${accounts.size} active ledgers",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { showTransferDialog = true },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.SyncAlt, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Transfer")
                }

                Button(
                    onClick = { showAddAccountDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = MetallicGold, contentColor = Color(0xFF0C1830)),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.testTag("add_account_btn")
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Add", fontWeight = FontWeight.Bold)
                }
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .testTag("accounts_list"),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(accounts, key = { it.id }) { acc ->
                AccountCard(
                    account = acc,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }

    // Add Account Dialog
    if (showAddAccountDialog) {
        var name by remember { mutableStateOf("") }
        var selectedType by remember { mutableStateOf(AccountType.BANK_ACCOUNT) }
        var openingBalText by remember { mutableStateOf("") }
        var limitText by remember { mutableStateOf("") }
        var error by remember { mutableStateOf<String?>(null) }

        AlertDialog(
            onDismissRequest = { showAddAccountDialog = false },
            title = { Text("Add Account / Wallet") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Account Name") },
                        placeholder = { Text("e.g. Meezan Bank, JazzCash, Cash") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    var typeExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = typeExpanded,
                        onExpandedChange = { typeExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = selectedType.displayName,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Account Type") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = typeExpanded) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = typeExpanded,
                            onDismissRequest = { typeExpanded = false }
                        ) {
                            AccountType.entries.forEach { t ->
                                DropdownMenuItem(
                                    text = { Text(t.displayName) },
                                    onClick = {
                                        selectedType = t
                                        typeExpanded = false
                                    }
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = openingBalText,
                        onValueChange = { openingBalText = it },
                        label = { Text("Opening Balance (${CurrencyConverter.getSymbol(defaultCurrency)})") },
                        placeholder = { Text("0") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    if (selectedType == AccountType.CREDIT_CARD) {
                        OutlinedTextField(
                            value = limitText,
                            onValueChange = { limitText = it },
                            label = { Text("Credit Limit") },
                            placeholder = { Text("100000") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }

                    if (error != null) {
                        Text(error!!, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val openBal = openingBalText.toDoubleOrNull() ?: 0.0
                        val limit = limitText.toDoubleOrNull() ?: 0.0
                        if (name.isBlank()) {
                            error = "Please enter an account name"
                            return@Button
                        }
                        onAddAccount(
                            Account(
                                id = UUID.randomUUID().toString(),
                                name = name.trim(),
                                type = selectedType,
                                currency = defaultCurrency,
                                openingBalance = openBal,
                                currentBalance = openBal,
                                creditLimit = limit
                            )
                        )
                        showAddAccountDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy)
                ) {
                    Text("Add Account")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddAccountDialog = false }) { Text("Cancel") }
            }
        )
    }

    // Transfer Funds Dialog
    if (showTransferDialog) {
        var sourceAcc by remember { mutableStateOf(accounts.firstOrNull()) }
        var destAcc by remember { mutableStateOf(accounts.getOrNull(1) ?: accounts.firstOrNull()) }
        var amountText by remember { mutableStateOf("") }
        var notes by remember { mutableStateOf("") }
        var error by remember { mutableStateOf<String?>(null) }

        AlertDialog(
            onDismissRequest = { showTransferDialog = false },
            title = { Text("Transfer Between Accounts") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    var srcExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(expanded = srcExpanded, onExpandedChange = { srcExpanded = it }) {
                        OutlinedTextField(
                            value = sourceAcc?.name ?: "From Account",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("From") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = srcExpanded) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(expanded = srcExpanded, onDismissRequest = { srcExpanded = false }) {
                            accounts.forEach { a ->
                                DropdownMenuItem(
                                    text = { Text("${a.name} (${CurrencyConverter.format(a.currentBalance, a.currency)})") },
                                    onClick = { sourceAcc = a; srcExpanded = false }
                                )
                            }
                        }
                    }

                    var dstExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(expanded = dstExpanded, onExpandedChange = { dstExpanded = it }) {
                        OutlinedTextField(
                            value = destAcc?.name ?: "To Account",
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("To") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dstExpanded) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(expanded = dstExpanded, onDismissRequest = { dstExpanded = false }) {
                            accounts.filter { it.id != sourceAcc?.id }.forEach { a ->
                                DropdownMenuItem(
                                    text = { Text("${a.name} (${CurrencyConverter.format(a.currentBalance, a.currency)})") },
                                    onClick = { destAcc = a; dstExpanded = false }
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        label = { Text("Transfer Amount") },
                        placeholder = { Text("10000") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Notes (Optional)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
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
                        if (amount == null || amount <= 0) {
                            error = "Enter a valid positive transfer amount"
                            return@Button
                        }
                        if (sourceAcc == null || destAcc == null || sourceAcc?.id == destAcc?.id) {
                            error = "Select two distinct accounts"
                            return@Button
                        }
                        val tx = Transaction(
                            id = UUID.randomUUID().toString(),
                            type = TransactionType.TRANSFER,
                            title = "Transfer to ${destAcc!!.name}",
                            amount = amount,
                            currency = sourceAcc!!.currency,
                            accountId = sourceAcc!!.id,
                            destinationAccountId = destAcc!!.id,
                            notes = notes.trim()
                        )
                        onTransfer(tx)
                        showTransferDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy)
                ) {
                    Text("Execute Transfer")
                }
            },
            dismissButton = {
                TextButton(onClick = { showTransferDialog = false }) { Text("Cancel") }
            }
        )
    }
}
