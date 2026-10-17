package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "savings_goals")
data class SavingsGoal(
    @PrimaryKey val id: String,
    val name: String,
    val targetAmount: Double,
    val currentAmount: Double = 0.0,
    val currency: String = "PKR",
    val targetDate: Long = System.currentTimeMillis() + 90L * 24 * 60 * 60 * 1000,
    val linkedAccountId: String? = null,
    val status: GoalStatus = GoalStatus.ACTIVE,
    val description: String = "",
    val colorHex: String = "#E8C66D",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
