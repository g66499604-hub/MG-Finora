package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.model.Budget
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import com.example.domain.CategoryRuleEngine
import com.example.domain.CurrencyConverter
import com.example.domain.FinancialEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context verifies MG Finora app name`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("MG Finora", appName)
  }

  @Test
  fun `category rule engine accurately detects spending categories`() {
    assertEquals("Food & Groceries", CategoryRuleEngine.suggestCategory("Al-Fatah grocery run", true))
    assertEquals("Electricity", CategoryRuleEngine.suggestCategory("LESCO power bill", true))
    assertEquals("Fuel", CategoryRuleEngine.suggestCategory("PSO Shell petrol refill", true))
    assertEquals("Internet & Mobile", CategoryRuleEngine.suggestCategory("StormFiber internet", true))
    assertEquals("Salary", CategoryRuleEngine.suggestCategory("Monthly Tech Payroll Salary", false))
    assertEquals("Freelance Income", CategoryRuleEngine.suggestCategory("Upwork Client Invoice", false))
  }

  @Test
  fun `financial engine accurately calculates income, expense, and budget utilization`() {
    val now = System.currentTimeMillis()
    val transactions = listOf(
      Transaction(
        id = "1",
        type = TransactionType.INCOME,
        title = "Salary",
        amount = 100000.0,
        currency = "PKR",
        accountId = "acc_1",
        transactionDate = now
      ),
      Transaction(
        id = "2",
        type = TransactionType.EXPENSE,
        title = "Groceries",
        amount = 25000.0,
        currency = "PKR",
        categoryId = "cat_food",
        accountId = "acc_1",
        transactionDate = now
      ),
      Transaction(
        id = "3",
        type = TransactionType.TRANSFER, // Transfers must NOT count in P&L
        title = "Internal transfer",
        amount = 15000.0,
        currency = "PKR",
        accountId = "acc_1",
        destinationAccountId = "acc_2",
        transactionDate = now
      )
    )

    val budget = Budget(
      id = "bgt_1",
      name = "Food Budget",
      categoryId = "cat_food",
      amount = 50000.0,
      currency = "PKR",
      startDate = now - 10000,
      endDate = now + 10000
    )

    val summary = FinancialEngine.calculatePeriodSummary(
      transactions = transactions,
      accounts = emptyList(),
      budgets = listOf(budget),
      savingsGoals = emptyList(),
      loans = emptyList(),
      targetCurrency = "PKR"
    )

    assertEquals(100000.0, summary.totalIncome, 0.01)
    assertEquals(25000.0, summary.totalExpense, 0.01)
    assertEquals(75000.0, summary.netCashFlow, 0.01)

    val health = FinancialEngine.evaluateBudgetHealth(budget, transactions, "PKR")
    assertEquals(25000.0, health.spentAmount, 0.01)
    assertEquals(25000.0, health.remainingAmount, 0.01)
    assertEquals(50.0, health.percentageUsed, 0.01)
  }

  @Test
  fun `currency converter formats and converts amounts correctly`() {
    val formatted = CurrencyConverter.format(150000.0, "PKR")
    assertTrue(formatted.contains("150,000"))

    val usdToPkr = CurrencyConverter.convert(100.0, "USD", "PKR")
    assertEquals(28000.0, usdToPkr, 0.1)
  }
}
