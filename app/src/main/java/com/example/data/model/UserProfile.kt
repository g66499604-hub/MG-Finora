package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey val id: String = "default_user",
    val displayName: String = "Finora Member",
    val defaultCurrency: String = "PKR",
    val theme: String = "system", // "light", "dark", "system"
    val locale: String = "en-PK",
    val financialMonthStart: Int = 1, // 1 to 28
    val monthlyIncomeTarget: Double = 0.0,
    val monthlyBudgetTarget: Double = 0.0,
    val isOnboardingCompleted: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
