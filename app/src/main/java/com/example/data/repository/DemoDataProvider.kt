package com.example.data.repository

import com.example.data.model.Account
import com.example.data.model.AccountType
import com.example.data.model.Bill
import com.example.data.model.BillStatus
import com.example.data.model.Budget
import com.example.data.model.BudgetPeriod
import com.example.data.model.Category
import com.example.data.model.GoalStatus
import com.example.data.model.Loan
import com.example.data.model.LoanDirection
import com.example.data.model.LoanStatus
import com.example.data.model.Recurrence
import com.example.data.model.SavingsGoal
import com.example.data.model.Transaction
import com.example.data.model.TransactionType
import java.util.UUID

object DemoDataProvider {

    fun getDefaultCategories(): List<Category> {
        val expenseCategories = listOf(
            Category("cat_food", "Food & Groceries", true, "restaurant", "#16A085"),
            Category("cat_health", "Health & Medical", true, "local_hospital", "#DC5A63"),
            Category("cat_transport", "Transportation", true, "directions_car", "#2980B9"),
            Category("cat_fuel", "Fuel", true, "local_gas_station", "#E67E22"),
            Category("cat_education", "Education", true, "school", "#8E44AD"),
            Category("cat_electricity", "Electricity", true, "bolt", "#F39C12"),
            Category("cat_gas", "Gas", true, "mode_heat", "#D35400"),
            Category("cat_water", "Water", true, "water_drop", "#1ABC9C"),
            Category("cat_internet", "Internet & Mobile", true, "wifi", "#3498DB"),
            Category("cat_rent", "Rent & Housing", true, "home", "#34495E"),
            Category("cat_shopping", "Shopping", true, "shopping_bag", "#E8C66D"),
            Category("cat_entertainment", "Entertainment", true, "sports_esports", "#9B59B6"),
            Category("cat_subscriptions", "Subscriptions", true, "subscriptions", "#C0392B"),
            Category("cat_bank_charges", "Bank Charges", true, "account_balance", "#7F8C8D"),
            Category("cat_other_exp", "Other Expense", true, "category", "#95A5A6")
        )

        val incomeCategories = listOf(
            Category("cat_salary", "Salary", false, "payments", "#16A085"),
            Category("cat_business", "Business Income", false, "storefront", "#27AE60"),
            Category("cat_freelance", "Freelance Income", false, "laptop_mac", "#2980B9"),
            Category("cat_allowance", "Allowance", false, "card_giftcard", "#8E44AD"),
            Category("cat_investments", "Interest & Profit", false, "trending_up", "#E8C66D"),
            Category("cat_rental", "Rental Income", false, "apartment", "#34495E"),
            Category("cat_refunds", "Refunds", false, "replay", "#1ABC9C"),
            Category("cat_other_inc", "Other Income", false, "attach_money", "#7F8C8D")
        )

        return expenseCategories + incomeCategories
    }

    fun getDefaultAccounts(): List<Account> {
        return listOf(
            Account(
                id = "acc_cash",
                name = "Cash in Hand",
                type = AccountType.CASH,
                currency = "PKR",
                openingBalance = 15000.0,
                currentBalance = 15000.0,
                colorHex = "#16A085"
            ),
            Account(
                id = "acc_bank",
                name = "Meezan Bank",
                type = AccountType.BANK_ACCOUNT,
                currency = "PKR",
                openingBalance = 120000.0,
                currentBalance = 120000.0,
                colorHex = "#172A47"
            ),
            Account(
                id = "acc_easypaisa",
                name = "Easypaisa Wallet",
                type = AccountType.EASYPAISA,
                currency = "PKR",
                openingBalance = 8500.0,
                currentBalance = 8500.0,
                colorHex = "#27AE60"
            ),
            Account(
                id = "acc_jazzcash",
                name = "JazzCash Wallet",
                type = AccountType.JAZZCASH,
                currency = "PKR",
                openingBalance = 5200.0,
                currentBalance = 5200.0,
                colorHex = "#E67E22"
            ),
            Account(
                id = "acc_credit_card",
                name = "Standard Chartered Visa",
                type = AccountType.CREDIT_CARD,
                currency = "PKR",
                openingBalance = 0.0,
                currentBalance = -18500.0,
                creditLimit = 150000.0,
                statementDay = 5,
                dueDay = 25,
                colorHex = "#C0392B"
            )
        )
    }

    fun getSampleData(): SamplePack {
        val now = System.currentTimeMillis()
        val dayMillis = 24L * 60 * 60 * 1000

        val txs = listOf(
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.INCOME,
                title = "Monthly Salary Deposit",
                amount = 250000.0,
                currency = "PKR",
                categoryId = "cat_salary",
                categoryName = "Salary",
                accountId = "acc_bank",
                paymentMethod = "Direct Deposit",
                transactionDate = now - (2 * dayMillis),
                notes = "Received from Tech Corp"
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.INCOME,
                title = "Upwork Freelance Gig",
                amount = 600.0,
                currency = "USD",
                exchangeRate = 280.0,
                convertedAmount = 168000.0,
                categoryId = "cat_freelance",
                categoryName = "Freelance Income",
                accountId = "acc_bank",
                paymentMethod = "Bank Wire",
                transactionDate = now - (5 * dayMillis),
                notes = "Mobile App Design Milestone"
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.EXPENSE,
                title = "Al-Fatah Supermarket Groceries",
                amount = 18450.0,
                currency = "PKR",
                categoryId = "cat_food",
                categoryName = "Food & Groceries",
                accountId = "acc_cash",
                paymentMethod = "Cash",
                transactionDate = now - (1 * dayMillis),
                merchant = "Al-Fatah"
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.EXPENSE,
                title = "LESCO Electricity Bill",
                amount = 24300.0,
                currency = "PKR",
                categoryId = "cat_electricity",
                categoryName = "Electricity",
                accountId = "acc_easypaisa",
                paymentMethod = "Easypaisa",
                transactionDate = now - (3 * dayMillis)
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.EXPENSE,
                title = "PSO Shell Fuel Refill",
                amount = 6500.0,
                currency = "PKR",
                categoryId = "cat_fuel",
                categoryName = "Fuel",
                accountId = "acc_credit_card",
                paymentMethod = "Credit Card",
                transactionDate = now - (4 * dayMillis),
                merchant = "PSO Station"
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.EXPENSE,
                title = "StormFiber Internet Broadband",
                amount = 4500.0,
                currency = "PKR",
                categoryId = "cat_internet",
                categoryName = "Internet & Mobile",
                accountId = "acc_jazzcash",
                paymentMethod = "JazzCash",
                transactionDate = now - (6 * dayMillis)
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.EXPENSE,
                title = "Cheezious Pizza Dinner",
                amount = 3200.0,
                currency = "PKR",
                categoryId = "cat_food",
                categoryName = "Food & Groceries",
                accountId = "acc_credit_card",
                paymentMethod = "Credit Card",
                transactionDate = now - (12 * 60 * 60 * 1000)
            ),
            Transaction(
                id = UUID.randomUUID().toString(),
                type = TransactionType.SAVINGS_CONTRIBUTION,
                title = "Emergency Fund Deposit",
                amount = 25000.0,
                currency = "PKR",
                accountId = "acc_bank",
                paymentMethod = "Internal Transfer",
                transactionDate = now - (2 * dayMillis),
                notes = "Auto-save allocation"
            )
        )

        val budgets = listOf(
            Budget(
                id = "bgt_overall",
                name = "Monthly Overall Budget",
                amount = 120000.0,
                currency = "PKR",
                period = BudgetPeriod.MONTHLY,
                startDate = now - (15 * dayMillis),
                endDate = now + (15 * dayMillis)
            ),
            Budget(
                id = "bgt_food",
                name = "Groceries & Dining",
                categoryId = "cat_food",
                categoryName = "Food & Groceries",
                amount = 35000.0,
                currency = "PKR",
                period = BudgetPeriod.MONTHLY,
                startDate = now - (15 * dayMillis),
                endDate = now + (15 * dayMillis)
            ),
            Budget(
                id = "bgt_fuel",
                name = "Vehicle Fuel",
                categoryId = "cat_fuel",
                categoryName = "Fuel",
                amount = 20000.0,
                currency = "PKR",
                period = BudgetPeriod.MONTHLY,
                startDate = now - (15 * dayMillis),
                endDate = now + (15 * dayMillis)
            )
        )

        val goals = listOf(
            SavingsGoal(
                id = "goal_emergency",
                name = "6-Month Emergency Fund",
                targetAmount = 500000.0,
                currentAmount = 185000.0,
                currency = "PKR",
                targetDate = now + (180 * dayMillis),
                description = "Shield for unexpected events",
                colorHex = "#16A085"
            ),
            SavingsGoal(
                id = "goal_gadget",
                name = "New iPhone 16 Pro",
                targetAmount = 380000.0,
                currentAmount = 145000.0,
                currency = "PKR",
                targetDate = now + (75 * dayMillis),
                description = "Work and photography upgrade",
                colorHex = "#E8C66D"
            ),
            SavingsGoal(
                id = "goal_travel",
                name = "Umrah Pilgrimage",
                targetAmount = 450000.0,
                currentAmount = 90000.0,
                currency = "PKR",
                targetDate = now + (120 * dayMillis),
                description = "Family Umrah trip",
                colorHex = "#2980B9"
            )
        )

        val loans = listOf(
            Loan(
                id = "loan_ali",
                name = "Laptop Loan to Ali",
                contactName = "Ali Raza",
                direction = LoanDirection.LENT,
                principalAmount = 50000.0,
                repaidAmount = 20000.0,
                currency = "PKR",
                issueDate = now - (30 * dayMillis),
                dueDate = now + (20 * dayMillis),
                status = LoanStatus.PARTIALLY_PAID,
                notes = "Friendly loan for university laptop"
            ),
            Loan(
                id = "loan_bike",
                name = "Honda CG125 Installment",
                contactName = "Atlas Honda Dealership",
                direction = LoanDirection.BORROWED,
                principalAmount = 120000.0,
                repaidAmount = 60000.0,
                currency = "PKR",
                issueDate = now - (60 * dayMillis),
                dueDate = now + (60 * dayMillis),
                status = LoanStatus.PARTIALLY_PAID,
                notes = "Monthly bike financing"
            )
        )

        val bills = listOf(
            Bill(
                id = "bill_lesco",
                name = "LESCO Electricity",
                provider = "LESCO Lahore",
                categoryId = "cat_electricity",
                categoryName = "Electricity",
                amount = 26500.0,
                currency = "PKR",
                dueDate = now + (5 * dayMillis),
                recurrence = Recurrence.MONTHLY,
                status = BillStatus.DUE_SOON
            ),
            Bill(
                id = "bill_sngpl",
                name = "SNGPL Sui Gas",
                provider = "SNGPL",
                categoryId = "cat_gas",
                categoryName = "Gas",
                amount = 3200.0,
                currency = "PKR",
                dueDate = now + (12 * dayMillis),
                recurrence = Recurrence.MONTHLY,
                status = BillStatus.UPCOMING
            ),
            Bill(
                id = "bill_stormfiber",
                name = "StormFiber 50Mbps Fiber",
                provider = "Cybernet",
                categoryId = "cat_internet",
                categoryName = "Internet & Mobile",
                amount = 4500.0,
                currency = "PKR",
                dueDate = now + (8 * dayMillis),
                recurrence = Recurrence.MONTHLY,
                status = BillStatus.UPCOMING
            )
        )

        return SamplePack(txs, budgets, goals, loans, bills)
    }

    data class SamplePack(
        val transactions: List<Transaction>,
        val budgets: List<Budget>,
        val savingsGoals: List<SavingsGoal>,
        val loans: List<Loan>,
        val bills: List<Bill>
    )
}
