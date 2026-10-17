package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey val id: String,
    val name: String,
    val isExpense: Boolean, // true = expense, false = income
    val iconName: String = "category",
    val colorHex: String = "#16A085",
    val isDefault: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)
