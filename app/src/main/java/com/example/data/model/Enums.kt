package com.example.data.model

enum class TransactionType(val label: String, val isExpenseLike: Boolean, val isIncomeLike: Boolean) {
    INCOME("Income", false, true),
    EXPENSE("Expense", true, false),
    TRANSFER("Transfer", false, false),
    SAVINGS_CONTRIBUTION("Savings Deposit", false, false),
    SAVINGS_WITHDRAWAL("Savings Withdrawal", false, false),
    LOAN_GIVEN("Loan Lent", false, false),
    LOAN_RECEIVED("Loan Borrowed", false, false),
    LOAN_REPAYMENT("Loan Repayment", false, false),
    DEBT_REPAYMENT("Debt Settlement", false, false),
    CREDIT_CARD_PURCHASE("Card Purchase", true, false),
    CREDIT_CARD_PAYMENT("Card Bill Payment", false, false),
    FEE("Bank/Card Fee", true, false),
    INTEREST("Interest Earned", false, true),
    REFUND("Refund Received", false, true)
}

enum class AccountType(val displayName: String) {
    CASH("Cash in Hand"),
    BANK_ACCOUNT("Bank Account"),
    MOBILE_WALLET("Mobile Wallet"),
    EASYPAISA("Easypaisa"),
    JAZZCASH("JazzCash"),
    SAVINGS_ACCOUNT("Savings Account"),
    CREDIT_CARD("Credit Card"),
    OTHER("Other Account")
}

enum class CurrencyCode(val symbol: String, val displayName: String, val defaultRateToPKR: Double) {
    PKR("Rs", "Pakistani Rupee", 1.0),
    USD("$", "US Dollar", 280.0),
    GBP("£", "British Pound", 360.0),
    EUR("€", "Euro", 305.0),
    SAR("﷼", "Saudi Riyal", 74.6),
    AED("د.إ", "UAE Dirham", 76.2),
    INR("₹", "Indian Rupee", 3.35),
    CAD("C$", "Canadian Dollar", 205.0),
    AUD("A$", "Australian Dollar", 182.0)
}

enum class BudgetPeriod {
    MONTHLY,
    WEEKLY,
    CUSTOM
}

enum class GoalStatus {
    ACTIVE,
    COMPLETED,
    PAUSED
}

enum class LoanDirection {
    LENT,      // Money I gave to someone (Asset / Receivable)
    BORROWED   // Money I took from someone (Liability / Payable)
}

enum class LoanStatus {
    PENDING,
    PARTIALLY_PAID,
    PAID,
    OVERDUE
}

enum class BillStatus {
    UPCOMING,
    DUE_SOON,
    PAID,
    OVERDUE
}

enum class Recurrence(val label: String) {
    ONCE("One Time"),
    WEEKLY("Weekly"),
    MONTHLY("Monthly"),
    YEARLY("Yearly")
}
