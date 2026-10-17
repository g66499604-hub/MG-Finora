package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String,
    val type: TransactionType,
    val title: String,
    val description: String = "",
    val amount: Double,
    val currency: String = "PKR",
    val exchangeRate: Double = 1.0,
    val convertedAmount: Double = amount,
    val categoryId: String = "",
    val categoryName: String = "",
    val accountId: String,
    val destinationAccountId: String? = null, // Used for transfers
    val paymentMethod: String = "Cash",
    val transactionDate: Long = System.currentTimeMillis(),
    val transactionTime: String = "",
    val notes: String = "",
    val tags: String = "",
    val merchant: String = "",
    val linkedEntityId: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
