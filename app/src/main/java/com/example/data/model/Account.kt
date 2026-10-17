package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "accounts")
data class Account(
    @PrimaryKey val id: String,
    val name: String,
    val type: AccountType,
    val currency: String = "PKR",
    val openingBalance: Double = 0.0,
    val currentBalance: Double = 0.0,
    val creditLimit: Double = 0.0, // Used if type == CREDIT_CARD
    val statementDay: Int = 1,
    val dueDay: Int = 15,
    val notes: String = "",
    val isArchived: Boolean = false,
    val colorHex: String = "#172A47",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
