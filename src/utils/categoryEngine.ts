export const CategoryRuleEngine = {
  ruleMap: [
    {
      keywords: ["grocery", "groceries", "supermarket", "mart", "alfatah", "carrefour", "fruit", "vegetable", "meat", "milk", "bread", "food", "dining", "restaurant", "cafe", "mcdonald", "kfc", "subway", "foodpanda", "cheezious", "pizza", "burger", "coffee", "tea", "bakery"],
      category: "Food & Groceries"
    },
    {
      keywords: ["hospital", "doctor", "clinic", "pharmacy", "medicine", "shifa", "chughtai", "agha khan", "dental", "dentist", "optician", "laboratory", "prescription"],
      category: "Health & Medical"
    },
    {
      keywords: ["petrol", "fuel", "diesel", "cng", "shell", "pso", "total", "attock", "gas station"],
      category: "Fuel"
    },
    {
      keywords: ["uber", "careem", "indrive", "taxi", "cab", "bus", "metro", "speedo", "rickshaw", "parking", "toll", "daewoo", "airblue", "pia", "flight"],
      category: "Transportation"
    },
    {
      keywords: ["lesco", "k-electric", "kelectric", "iesco", "fesco", "gepco", "mepco", "pesco", "electricity", "power bill", "electric"],
      category: "Electricity"
    },
    {
      keywords: ["sngpl", "ssgc", "gas bill", "suigas", "cylinder"],
      category: "Gas"
    },
    {
      keywords: ["wasa", "water bill", "mineral water", "aquafina", "nestle"],
      category: "Water"
    },
    {
      keywords: ["internet", "wifi", "nayatel", "stormfiber", "ptcl", "jazz", "telenor", "zong", "ufone", "broadband", "fiber", "mobile load", "postpaid", "prepaid"],
      category: "Internet & Mobile"
    },
    {
      keywords: ["rent", "apartment", "house rent", "maintenance", "society fee", "dha", "bahria"],
      category: "Rent & Housing"
    },
    {
      keywords: ["school", "college", "university", "tuition", "academy", "books", "udemy", "coursera", "lums", "nust", "fast", "giki", "fee"],
      category: "Education"
    },
    {
      keywords: ["shopping", "clothes", "shoes", "outfit", "khaadi", "sapphire", "junaid jamshed", "daraz", "amazon", "electronics", "perfume"],
      category: "Shopping"
    },
    {
      keywords: ["netflix", "spotify", "youtube", "prime", "apple", "icloud", "google one", "subscription", "gym", "membership"],
      category: "Subscriptions"
    },
    {
      keywords: ["cinema", "movie", "cinepax", "cue", "bowling", "gaming", "steam", "playstation"],
      category: "Entertainment"
    },
    {
      keywords: ["salary", "payroll", "stipend", "wages"],
      category: "Salary"
    },
    {
      keywords: ["freelance", "upwork", "fiverr", "client", "gig", "contract"],
      category: "Freelance Income"
    },
    {
      keywords: ["business", "sales", "revenue", "profit", "invoice"],
      category: "Business Income"
    },
    {
      keywords: ["dividend", "profit rate", "saving interest", "interest"],
      category: "Interest & Profit"
    },
    {
      keywords: ["refund", "chargeback", "reimbursement"],
      category: "Refunds"
    }
  ],

  suggestCategory(query: string, isExpense: boolean = true): string {
    if (!query || !query.trim()) return isExpense ? "Other Expense" : "Other Income";
    const clean = query.toLowerCase().trim();
    for (const rule of this.ruleMap) {
      if (rule.keywords.some(k => clean.includes(k))) {
        return rule.category;
      }
    }
    return isExpense ? "Other Expense" : "Other Income";
  }
};
