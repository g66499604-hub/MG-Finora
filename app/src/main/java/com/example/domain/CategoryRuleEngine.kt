package com.example.domain

object CategoryRuleEngine {
    private val ruleMap = listOf(
        // Food & Groceries
        listOf("grocery", "groceries", "supermarket", "mart", "alfatah", "carrefour", "fruit", "vegetable", "meat", "milk", "bread", "food", "dining", "restaurant", "cafe", "mcdonald", "kfc", "subway", "foodpanda", "cheezious", "pizza", "burger", "coffee", "tea", "bakery") to "Food & Groceries",
        // Health & Medical
        listOf("hospital", "doctor", "clinic", "pharmacy", "medicine", "shifa", "chughtai", "agha khan", "dental", "dentist", "optician", "laboratory", "prescription") to "Health & Medical",
        // Fuel
        listOf("petrol", "fuel", "diesel", "cng", "shell", "pso", "total", "attock", "gas station") to "Fuel",
        // Transportation
        listOf("uber", "careem", "indrive", "taxi", "cab", "bus", "metro", "speedo", "rickshaw", "parking", "toll", "daewoo", "airblue", "pia", "flight") to "Transportation",
        // Electricity
        listOf("lesco", "k-electric", "kelectric", "iesco", "fesco", "gepco", "mepco", "pesco", "electricity", "power bill", "electric") to "Electricity",
        // Gas
        listOf("sngpl", "ssgc", "gas bill", "suigas", "cylinder") to "Gas",
        // Water
        listOf("wasa", "water bill", "mineral water", "aquafina", "nestle") to "Water",
        // Internet & Mobile
        listOf("internet", "wifi", "nayatel", "stormfiber", "ptcl", "jazz", "telenor", "zong", "ufone", "broadband", "fiber", "mobile load", "postpaid", "prepaid") to "Internet & Mobile",
        // Rent & Housing
        listOf("rent", "apartment", "house rent", "maintenance", "society fee", "dha", "bahria") to "Rent & Housing",
        // Education
        listOf("school", "college", "university", "tuition", "academy", "books", "udemy", "coursera", "lums", "nust", "fast", "giki", "fee") to "Education",
        // Shopping
        listOf("shopping", "clothes", "shoes", "outfit", "khaadi", "sapphire", "junaid jamshed", "daraz", "amazon", "electronics", "perfume") to "Shopping",
        // Subscriptions
        listOf("netflix", "spotify", "youtube", "prime", "apple", "icloud", "google one", "subscription", "gym", "membership") to "Subscriptions",
        // Entertainment
        listOf("cinema", "movie", "cinepax", "cue", "bowling", "gaming", "steam", "playstation") to "Entertainment",
        // Income keywords
        listOf("salary", "payroll", "stipend", "wages") to "Salary",
        listOf("freelance", "upwork", "fiverr", "client", "gig", "contract") to "Freelance Income",
        listOf("business", "sales", "revenue", "profit", "invoice") to "Business Income",
        listOf("dividend", "profit rate", "saving interest", "interest") to "Interest Received",
        listOf("refund", "chargeback", "reimbursement") to "Refunds"
    )

    fun suggestCategory(query: String, isExpense: Boolean = true): String {
        if (query.isBlank()) return if (isExpense) "Other Expense" else "Other Income"
        val clean = query.lowercase().trim()
        for ((keywords, categoryName) in ruleMap) {
            if (keywords.any { clean.contains(it) }) {
                return categoryName
            }
        }
        return if (isExpense) "Other Expense" else "Other Income"
    }
}
