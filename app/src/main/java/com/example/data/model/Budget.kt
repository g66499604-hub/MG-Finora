package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "budgets")
data class Budget(
    @PrimaryKey val id: String,
    val name: String,
    val categoryId: String? = null, // null = Overall budget
    val categoryName: String = "Overall Budget",
    val amount: Double,
    val currency: String = "PKR",
    val period: BudgetPeriod = BudgetPeriod.MONTHLY,
    val startDate: Long = System.currentTimeMillis(),
    val endDate: Long = System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000,
    val carryForwardEnabled: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
