package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Savings
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.DeepNavy
import com.example.ui.theme.MetallicGold
import com.example.ui.theme.RoyalNavy
import com.example.ui.viewmodel.FinoraScreen

data class NavItem(
    val screen: FinoraScreen,
    val icon: ImageVector,
    val label: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FinoraBottomBar(
    currentScreen: FinoraScreen,
    onNavigate: (FinoraScreen) -> Unit
) {
    var showMenuSheet by remember { mutableStateOf(false) }

    val bottomItems = listOf(
        NavItem(FinoraScreen.DASHBOARD, Icons.Default.Dashboard, "Home"),
        NavItem(FinoraScreen.TRANSACTIONS, Icons.Default.Receipt, "Activity"),
        NavItem(FinoraScreen.BUDGETS, Icons.Default.TrendingUp, "Budgets"),
        NavItem(FinoraScreen.REPORTS, Icons.Default.PieChart, "Reports")
    )

    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        modifier = Modifier.navigationBarsPadding()
    ) {
        NavigationBar(
            containerColor = MaterialTheme.colorScheme.surface,
            tonalElevation = 0.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            bottomItems.forEach { item ->
                val selected = currentScreen == item.screen
                NavigationBarItem(
                    selected = selected,
                    onClick = { onNavigate(item.screen) },
                    icon = {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            modifier = Modifier.size(24.dp)
                        )
                    },
                    label = {
                        Text(
                            text = item.label,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = DeepNavy,
                        selectedTextColor = MaterialTheme.colorScheme.primary,
                        indicatorColor = MetallicGold,
                        unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                    ),
                    modifier = Modifier.testTag("nav_${item.label.lowercase()}")
                )
            }

            // More Menu Item to open all 17 pages
            NavigationBarItem(
                selected = showMenuSheet,
                onClick = { showMenuSheet = true },
                icon = {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "More Modules",
                        modifier = Modifier.size(24.dp)
                    )
                },
                label = {
                    Text(
                        text = "More",
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = DeepNavy,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MetallicGold,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                ),
                modifier = Modifier.testTag("nav_more")
            )
        }
    }

    if (showMenuSheet) {
        ModalBottomSheet(
            onDismissRequest = { showMenuSheet = false },
            sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
            containerColor = MaterialTheme.colorScheme.surface
        ) {
            AllModulesSheet(
                onSelectScreen = { screen ->
                    showMenuSheet = false
                    onNavigate(screen)
                }
            )
        }
    }
}

@Composable
fun AllModulesSheet(onSelectScreen: (FinoraScreen) -> Unit) {
    val modules = listOf(
        Triple(FinoraScreen.DASHBOARD, Icons.Default.Dashboard, "Dashboard"),
        Triple(FinoraScreen.TRANSACTIONS, Icons.Default.Receipt, "Transactions"),
        Triple(FinoraScreen.ADD_TRANSACTION, Icons.Default.Add, "Add Transaction"),
        Triple(FinoraScreen.INCOME, Icons.Default.ArrowDownward, "Income Hub"),
        Triple(FinoraScreen.EXPENSES, Icons.Default.ArrowUpward, "Expenses"),
        Triple(FinoraScreen.BUDGETS, Icons.Default.TrendingUp, "Budgets"),
        Triple(FinoraScreen.SAVINGS, Icons.Default.Savings, "Savings Goals"),
        Triple(FinoraScreen.ACCOUNTS, Icons.Default.AccountBalance, "Accounts & Wallets"),
        Triple(FinoraScreen.CREDIT_CARDS, Icons.Default.CreditCard, "Credit Cards"),
        Triple(FinoraScreen.CREDIT_DEBIT_OVERVIEW, Icons.Default.Paid, "Credit & Debit"),
        Triple(FinoraScreen.LOANS, Icons.Default.Paid, "Loans & Debts"),
        Triple(FinoraScreen.BILLS, Icons.Default.Receipt, "Bills & Utilities"),
        Triple(FinoraScreen.CATEGORIES, Icons.Default.PieChart, "Categories"),
        Triple(FinoraScreen.REPORTS, Icons.Default.PieChart, "Analytics & Charts"),
        Triple(FinoraScreen.CALENDAR, Icons.Default.CalendarMonth, "Financial Calendar"),
        Triple(FinoraScreen.SETTINGS, Icons.Default.Settings, "Settings & Backup"),
        Triple(FinoraScreen.ABOUT, Icons.Default.Info, "About Finora")
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp)
            .navigationBarsPadding()
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Finora Suite",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MetallicGold.copy(alpha = 0.2f)
            ) {
                Text(
                    text = "17 Modules",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = MetallicGold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(modules) { (screen, icon, title) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectScreen(screen) }
                        .testTag("menu_${screen.name.lowercase()}"),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 14.dp, horizontal = 6.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .background(RoyalNavy.copy(alpha = 0.12f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = icon,
                                contentDescription = title,
                                tint = RoyalNavy,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = title,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurface,
                            maxLines = 1
                        )
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(20.dp))
    }
}
