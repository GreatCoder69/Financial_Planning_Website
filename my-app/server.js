const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// In-memory storage for user data
const userData = {
    basics: {
        currentAge: 35, // Mock data for demonstration
        retirementAge: 60,
        wishToLive: 85,
        inflation: "6%",
        capitalGainTax: "20%",
        incomeTax: "30%",
    },
    income: {
        monthlyincome1: "",
        monthlyincome2: "",
        monthlyincome3: "",
        monthlyincome4: "",
        monthlyincome5: "",
        yearlyincome1: "",
        yearlyincome2: "",
        yearlyincome3: "",
        yearlyincome4: "",
        yearlyincome5: "",
        monthlyTotal: 0,
        yearlyTotal: 0,
        totalYearlyIncome: 0,
    },
    expenses: {
        total1: 0,
        total2: 0,
        yearlyExpense: 0,
        monthlyExcess: 0, // Mock data for demonstration
        yearlyExcess:  0,
    },
    investments: {
        largecap: 40,
        directstock: 30,
        smallcap: 30,
        safeAsset: 0,
        stockMarket: 0,
    },
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fetch data for a module
app.get("/get-data/:module", (req, res) => {
    const { module } = req.params;
    if (userData[module]) {
        res.json(userData[module]);
    } else {
        res.status(404).json({ error: `Module '${module}' not found` });
    }
});

// Save or update data for a module
app.post("/save-data/:module", (req, res) => {
    const { module } = req.params;
    if (userData[module]) {
        userData[module] = { ...userData[module], ...req.body };

        // Recalculate totals for specific modules
        if (module === "income") {
            calculateIncomeTotals();
        } else if (module === "expenses") {
            calculateExpenseDerivedValues();
        }

        res.json({ message: `Data for '${module}' saved successfully!`, data: userData[module] });
    } else {
        res.status(404).json({ error: `Module '${module}' not found` });
    }
});

// Update investment proportions and safe/stock market values
app.post("/get-data/investments", (req, res) => {
    const { safeAsset, stockMarket, investments } = req.body;

    // Validate and update investments
    if (investments) {
        userData.investments = { ...userData.investments, ...investments };
    }

    // Update safeAsset and stockMarket proportions
    if (safeAsset !== undefined && stockMarket !== undefined) {
        userData.investments.safeAsset = safeAsset;
        userData.investments.stockMarket = stockMarket;
    }

    res.json({
        message: "Investment proportions updated successfully!",
        investments: userData.investments,
    });
});

// Calculate income totals (monthlyTotal, yearlyTotal, totalyearlyincome)
function calculateIncomeTotals() {
    // Parse and sum monthly incomes
    const monthlyIncomes = [
        parseFloat(userData.income.monthlyincome1) || 0,
        parseFloat(userData.income.monthlyincome2) || 0,
        parseFloat(userData.income.monthlyincome3) || 0,
        parseFloat(userData.income.monthlyincome4) || 0,
        parseFloat(userData.income.monthlyincome5) || 0,
    ];
    userData.income.monthlyTotal = monthlyIncomes.reduce((sum, val) => sum + val, 0);

    // Parse and sum yearly incomes
    const yearlyIncomes = [
        parseFloat(userData.income.yearlyincome1) || 0,
        parseFloat(userData.income.yearlyincome2) || 0,
        parseFloat(userData.income.yearlyincome3) || 0,
        parseFloat(userData.income.yearlyincome4) || 0,
        parseFloat(userData.income.yearlyincome5) || 0,
    ];
    userData.income.totalyearlyincome = yearlyIncomes.reduce((sum, val) => sum + val, 0);

    // Yearly total = (monthly total * 12) + total yearly incomes
    userData.income.yearlyTotal = userData.income.monthlyTotal * 12 + userData.income.totalyearlyincome;
}


// Calculate expense-derived values (yearlyExpense, monthlyExcess, yearlyExcess)
function calculateExpenseDerivedValues() {
    const yearlyExpense = 12 * userData.expenses.total1 + userData.expenses.total2;
    const monthlyExcess = userData.income.monthlyTotal - userData.expenses.total1;
    const yearlyExcess = userData.income.yearlyTotal - yearlyExpense;

    userData.expenses.yearlyExpense = yearlyExpense;
    userData.expenses.monthlyExcess = monthlyExcess;
    userData.expenses.yearlyExcess = yearlyExcess;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
