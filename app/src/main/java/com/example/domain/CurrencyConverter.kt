package com.example.domain

import com.example.data.model.CurrencyCode
import java.text.NumberFormat
import java.util.Locale

object CurrencyConverter {
    val supportedCurrencies = CurrencyCode.entries

    private val ratesToPKR = mutableMapOf(
        "PKR" to 1.0,
        "USD" to 280.0,
        "GBP" to 360.0,
        "EUR" to 305.0,
        "SAR" to 74.6,
        "AED" to 76.2,
        "INR" to 3.35,
        "CAD" to 205.0,
        "AUD" to 182.0
    )

    fun getSymbol(currency: String): String {
        return supportedCurrencies.firstOrNull { it.name.equals(currency, ignoreCase = true) }?.symbol ?: currency
    }

    fun convert(amount: Double, fromCurrency: String, toCurrency: String): Double {
        if (fromCurrency.equals(toCurrency, ignoreCase = true)) return amount
        val fromRate = ratesToPKR[fromCurrency.uppercase()] ?: 1.0
        val toRate = ratesToPKR[toCurrency.uppercase()] ?: 1.0
        val amountInPKR = amount * fromRate
        return if (toRate > 0) amountInPKR / toRate else amount
    }

    fun format(amount: Double, currency: String = "PKR", showDecimals: Boolean = false): String {
        val symbol = getSymbol(currency)
        val format = NumberFormat.getNumberInstance(Locale.US)
        if (showDecimals) {
            format.minimumFractionDigits = 2
            format.maximumFractionDigits = 2
        } else {
            format.minimumFractionDigits = 0
            format.maximumFractionDigits = 0
        }
        return "$symbol ${format.format(amount)}"
    }
}
