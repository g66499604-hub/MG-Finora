package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "loans")
data class Loan(
    @PrimaryKey val id: String,
    val name: String,
    val contactName: String,
    val direction: LoanDirection, // LENT (Receivable) or BORROWED (Payable)
    val principalAmount: Double,
    val repaidAmount: Double = 0.0,
    val currency: String = "PKR",
    val issueDate: Long = System.currentTimeMillis(),
    val dueDate: Long = System.currentTimeMillis() + 60L * 24 * 60 * 60 * 1000,
    val interestRate: Double = 0.0,
    val status: LoanStatus = LoanStatus.PENDING,
    val linkedAccountId: String? = null,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
