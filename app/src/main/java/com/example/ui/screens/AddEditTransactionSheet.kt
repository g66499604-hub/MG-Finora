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
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
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
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Account
import com.example.data.model.Category
import com.example.data.model.CurrencyCode
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import com.example.domain.CategoryRuleEngine
import com.example.domain.CurrencyConverter
import com.example.ui.theme.FinancialPositive
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditTransactionSheet(
    accounts: List<Account>,
    categories: List<Category>,
    defaultCurrency: String,
    onSaveTransaction: (Transaction) -> Unit,
    onDismiss: () -> Unit,
    initialTransaction: Transaction? = null
) {
    BackHandler { onDismiss() }

    var selectedType by remember { mutableStateOf(initialTransaction?.type ?: TransactionType.EXPENSE) }
    var title by remember { mutableStateOf(initialTransaction?.title ?: "") }
    var amountText by remember { mutableStateOf(initialTransaction?.amount?.toString() ?: "") }
    var selectedCurrency by remember { mutableStateOf(initialTransaction?.currency ?: defaultCurrency) }
    var selectedAccount by remember { mutableStateOf(accounts.firstOrNull { it.id == initialTransaction?.accountId } ?: accounts.firstOrNull()) }
    var selectedDestAccount by remember { mutableStateOf(accounts.firstOrNull { it.id == initialTransaction?.destinationAccountId }) }
    var selectedCategory by remember {
        mutableStateOf(categories.firstOrNull { it.id == initialTransaction?.categoryId } ?: categories.firstOrNull { it.isExpense == selectedType.isExpenseLike })
    }
    var paymentMethod by remember { mutableStateOf(initialTransaction?.paymentMethod ?: "Cash") }
    var merchant by remember { mutableStateOf(initialTransaction?.merchant ?: "") }
    var notes by remember { mutableStateOf(initialTransaction?.notes ?: "") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Automatic Category Suggestion Hint
    val suggestedCategoryName = remember(title, selectedType) {
        if (title.length >= 3) {
            CategoryRuleEngine.suggestCategory(title, isExpense = selectedType.isExpenseLike)
        } else null
    }

    val primaryTypes = listOf(
        TransactionType.EXPENSE,
        TransactionType.INCOME,
        TransactionType.TRANSFER,
        TransactionType.CREDIT_CARD_PURCHASE,
        TransactionType.SAVINGS_CONTRIBUTION
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .navigationBarsPadding()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (initialTransaction == null) "New Transaction" else "Edit Transaction",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            IconButton(onClick = onDismiss) {
                Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
            }
        }

        // Type Selector Chips
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(primaryTypes) { type ->
                val isSelected = selectedType == type
                FilterChip(
                    selected = isSelected,
                    onClick = {
                        selectedType = type
                        // Adjust category to match type
                        selectedCategory = categories.firstOrNull { it.isExpense == type.isExpenseLike }
                    },
                    label = { Text(type.label) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = RoyalNavy,
                        selectedLabelColor = Color.White
                    ),
                    modifier = Modifier.testTag("type_chip_${type.name.lowercase()}")
                )
            }
        }

        // Amount & Currency Row
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Amount (${CurrencyConverter.getSymbol(selectedCurrency)})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedTextField(
                        value = amountText,
                        onValueChange = { amountText = it },
                        placeholder = { Text("0.00") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        textStyle = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("transaction_amount_input"),
                        singleLine = true
                    )

                    // Currency Picker Chip Row
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(CurrencyCode.entries.take(4)) { curr ->
                            val isSel = selectedCurrency == curr.name
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (isSel) MetallicGold else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier.clickable { selectedCurrency = curr.name }
                            ) {
                                Text(
                                    text = curr.name,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSel) Color(0xFF0C1830) else MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 8.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Title / Description
        OutlinedTextField(
            value = title,
            onValueChange = {
                title = it
                // Auto-apply suggested category if matched
                if (suggestedCategoryName != null) {
                    val match = categories.firstOrNull { c -> c.name.equals(suggestedCategoryName, ignoreCase = true) }
                    if (match != null) {
                        selectedCategory = match
                    }
                }
            },
            label = { Text("Title / Description") },
            placeholder = { Text("e.g. Al-Fatah Grocery, Freelance Pay, Fuel") },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("transaction_title_input"),
            singleLine = true
        )

        // Auto Category Suggestion Pill
        if (suggestedCategoryName != null && selectedCategory?.name != suggestedCategoryName) {
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MetallicGold.copy(alpha = 0.2f),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        val match = categories.firstOrNull { it.name.equals(suggestedCategoryName, ignoreCase = true) }
                        if (match != null) selectedCategory = match
                    }
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = RoyalNavy, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Suggested Category: $suggestedCategoryName (Tap to apply)",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = RoyalNavy
                    )
                }
            }
        }

        // Category Picker (unless transfer)
        if (selectedType != TransactionType.TRANSFER) {
            var categoryExpanded by remember { mutableStateOf(false) }
            val relevantCats = categories.filter { it.isExpense == selectedType.isExpenseLike }

            ExposedDropdownMenuBox(
                expanded = categoryExpanded,
                onExpandedChange = { categoryExpanded = it }
            ) {
                OutlinedTextField(
                    value = selectedCategory?.name ?: "Select Category",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Category") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                        .testTag("category_dropdown")
                )
                ExposedDropdownMenu(
                    expanded = categoryExpanded,
                    onDismissRequest = { categoryExpanded = false }
                ) {
                    relevantCats.forEach { cat ->
                        DropdownMenuItem(
                            text = { Text(cat.name) },
                            onClick = {
                                selectedCategory = cat
                                categoryExpanded = false
                            }
                        )
                    }
                }
            }
        }

        // Account Pickers
        var sourceAccountExpanded by remember { mutableStateOf(false) }
        ExposedDropdownMenuBox(
            expanded = sourceAccountExpanded,
            onExpandedChange = { sourceAccountExpanded = it }
        ) {
            OutlinedTextField(
                value = selectedAccount?.name ?: "Select Account",
                onValueChange = {},
                readOnly = true,
                label = { Text(if (selectedType == TransactionType.TRANSFER) "From Account" else "Account / Wallet") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = sourceAccountExpanded) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor()
                    .testTag("account_dropdown")
            )
            ExposedDropdownMenu(
                expanded = sourceAccountExpanded,
                onDismissRequest = { sourceAccountExpanded = false }
            ) {
                accounts.forEach { acc ->
                    DropdownMenuItem(
                        text = { Text("${acc.name} (${CurrencyConverter.format(acc.currentBalance, acc.currency)})") },
                        onClick = {
                            selectedAccount = acc
                            sourceAccountExpanded = false
                        }
                    )
                }
            }
        }

        // Destination Account (for transfers)
        if (selectedType == TransactionType.TRANSFER) {
            var destAccountExpanded by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(
                expanded = destAccountExpanded,
                onExpandedChange = { destAccountExpanded = it }
            ) {
                OutlinedTextField(
                    value = selectedDestAccount?.name ?: "Select Destination Account",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("To Account") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = destAccountExpanded) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = destAccountExpanded,
                    onDismissRequest = { destAccountExpanded = false }
                ) {
                    accounts.filter { it.id != selectedAccount?.id }.forEach { acc ->
                        DropdownMenuItem(
                            text = { Text("${acc.name} (${CurrencyConverter.format(acc.currentBalance, acc.currency)})") },
                            onClick = {
                                selectedDestAccount = acc
                                destAccountExpanded = false
                            }
                        )
                    }
                }
            }
        }

        // Payment Method & Merchant
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            OutlinedTextField(
                value = paymentMethod,
                onValueChange = { paymentMethod = it },
                label = { Text("Payment Method") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
            OutlinedTextField(
                value = merchant,
                onValueChange = { merchant = it },
                label = { Text("Merchant / Contact") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
        }

        // Optional Notes
        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it },
            label = { Text("Notes & Tags (Optional)") },
            modifier = Modifier.fillMaxWidth()
        )

        if (errorMessage != null) {
            Text(
                text = errorMessage!!,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.testTag("transaction_error_message")
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Save Button
        Button(
            onClick = {
                val amount = amountText.toDoubleOrNull()
                if (amount == null || amount <= 0.0) {
                    errorMessage = "Please enter a valid amount greater than 0"
                    return@Button
                }
                if (title.isBlank()) {
                    errorMessage = "Please enter a title or description"
                    return@Button
                }
                if (selectedAccount == null) {
                    errorMessage = "Please select an account"
                    return@Button
                }
                if (selectedType == TransactionType.TRANSFER && selectedDestAccount == null) {
                    errorMessage = "Please select a destination account for transfer"
                    return@Button
                }

                val tx = Transaction(
                    id = initialTransaction?.id ?: UUID.randomUUID().toString(),
                    type = selectedType,
                    title = title.trim(),
                    amount = amount,
                    currency = selectedCurrency,
                    categoryId = selectedCategory?.id ?: "",
                    categoryName = selectedCategory?.name ?: "",
                    accountId = selectedAccount!!.id,
                    destinationAccountId = if (selectedType == TransactionType.TRANSFER) selectedDestAccount?.id else null,
                    paymentMethod = paymentMethod.trim(),
                    merchant = merchant.trim(),
                    notes = notes.trim(),
                    transactionDate = initialTransaction?.transactionDate ?: System.currentTimeMillis()
                )
                onSaveTransaction(tx)
                onDismiss()
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .testTag("save_transaction_button"),
            colors = ButtonDefaults.buttonColors(containerColor = RoyalNavy),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(imageVector = Icons.Default.Check, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Save Transaction", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}
