package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "bills")
data class Bill(
    @PrimaryKey val id: String,
    val name: String,
    val provider: String,
    val categoryId: String = "",
    val categoryName: String = "Utility",
    val amount: Double,
    val currency: String = "PKR",
    val dueDate: Long = System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000,
    val recurrence: Recurrence = Recurrence.MONTHLY,
    val status: BillStatus = BillStatus.UPCOMING,
    val isPaid: Boolean = false,
    val lastPaidDate: Long? = null,
    val linkedTransactionId: String? = null,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)
