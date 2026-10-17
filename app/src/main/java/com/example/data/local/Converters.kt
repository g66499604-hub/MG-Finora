package com.example.data.local

import androidx.room.TypeConverter
import com.example.data.model.AccountType
import com.example.data.model.BillStatus
import com.example.data.model.BudgetPeriod
import com.example.data.model.GoalStatus
import com.example.data.model.LoanDirection
import com.example.data.model.LoanStatus
import com.example.data.model.Recurrence
import com.example.data.model.TransactionType

class Converters {
    @TypeConverter
    fun fromTransactionType(value: TransactionType?): String? = value?.name

    @TypeConverter
    fun toTransactionType(value: String?): TransactionType? =
        value?.let { runCatching { TransactionType.valueOf(it) }.getOrDefault(TransactionType.EXPENSE) }

    @TypeConverter
    fun fromAccountType(value: AccountType?): String? = value?.name

    @TypeConverter
    fun toAccountType(value: String?): AccountType? =
        value?.let { runCatching { AccountType.valueOf(it) }.getOrDefault(AccountType.CASH) }

    @TypeConverter
    fun fromBudgetPeriod(value: BudgetPeriod?): String? = value?.name

    @TypeConverter
    fun toBudgetPeriod(value: String?): BudgetPeriod? =
        value?.let { runCatching { BudgetPeriod.valueOf(it) }.getOrDefault(BudgetPeriod.MONTHLY) }

    @TypeConverter
    fun fromGoalStatus(value: GoalStatus?): String? = value?.name

    @TypeConverter
    fun toGoalStatus(value: String?): GoalStatus? =
        value?.let { runCatching { GoalStatus.valueOf(it) }.getOrDefault(GoalStatus.ACTIVE) }

    @TypeConverter
    fun fromLoanDirection(value: LoanDirection?): String? = value?.name

    @TypeConverter
    fun toLoanDirection(value: String?): LoanDirection? =
        value?.let { runCatching { LoanDirection.valueOf(it) }.getOrDefault(LoanDirection.BORROWED) }

    @TypeConverter
    fun fromLoanStatus(value: LoanStatus?): String? = value?.name

    @TypeConverter
    fun toLoanStatus(value: String?): LoanStatus? =
        value?.let { runCatching { LoanStatus.valueOf(it) }.getOrDefault(LoanStatus.PENDING) }

    @TypeConverter
    fun fromBillStatus(value: BillStatus?): String? = value?.name

    @TypeConverter
    fun toBillStatus(value: String?): BillStatus? =
        value?.let { runCatching { BillStatus.valueOf(it) }.getOrDefault(BillStatus.UPCOMING) }

    @TypeConverter
    fun fromRecurrence(value: Recurrence?): String? = value?.name

    @TypeConverter
    fun toRecurrence(value: String?): Recurrence? =
        value?.let { runCatching { Recurrence.valueOf(it) }.getOrDefault(Recurrence.MONTHLY) }
}
