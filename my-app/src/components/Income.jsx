import React, { useState, useEffect } from "react";
import "./Income.css";

function Income() {
    const [values, setValues] = useState({
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
    });

    const [totals, setTotals] = useState({
        monthlyTotal: 0,
        yearlyTotal: 0,
        totalYearlyIncome: 0,
    });

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/get-data/income");
                const data = await response.json();
                setValues(data);
            } catch (error) {
                console.error("Error fetching income data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValues = { ...values, [name]: value };

        // Update local state
        setValues(updatedValues);

        // Recalculate totals
        const newMonthlyTotal = calculateTotal("monthlyincome", 5, updatedValues);
        const newYearlyTotal = calculateTotal("yearlyincome", 5, updatedValues);
        const newTotalYearlyIncome = 12 * newMonthlyTotal + newYearlyTotal;

        setTotals({
            monthlyTotal: newMonthlyTotal,
            yearlyTotal: newYearlyTotal,
            totalYearlyIncome: newTotalYearlyIncome,
        });

        // Push only the necessary data to the backend
        const payload = {
            monthlyTotal: newMonthlyTotal,
            yearlyTotal: newYearlyTotal,
            totalYearlyIncome: newTotalYearlyIncome,
        };

        saveData(payload);
    };

    const saveData = async (data) => {
        try {
            await fetch("http://localhost:5000/save-data/income", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error("Error saving income data:", error);
        }
    };

    const calculateTotal = (prefix, length, data) => {
        return Array.from({ length: length }, (_, i) =>
            Number(data[`${prefix}${i + 1}`] || 0)
        ).reduce((acc, cur) => acc + cur, 0);
    };

    return (
        <div className="income-main-container">
            <div className="income-section">
                {["monthly", "yearly"].map((period) => (
                    <div className="income-group" key={period}>
                        <h2 className="income-heading">{`${period.charAt(0).toUpperCase() + period.slice(1)} Income`}</h2>
                        <div className="income-grid">
                            {Array.from({ length: 5 }, (_, i) => (
                                <React.Fragment key={`${period}income${i + 1}`}>
                                    <label className="income-label">{`Income ${i + 1}:`}</label>
                                    <input
                                        type="number"
                                        name={`${period}income${i + 1}`}
                                        value={values[`${period}income${i + 1}`]}
                                        onChange={handleChange}
                                        className="income-input-box"
                                    />
                                </React.Fragment>
                            ))}
                            <label className="income-label">Total:</label>
                            <span className="income-input-box income-total-box">
                                {period === "monthly"
                                    ? totals.monthlyTotal
                                    : totals.yearlyTotal}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="income-total-yearly-container">
                    <label className="income-label">Total Yearly Income:</label>
                    <span className="income-input-box income-total-box">
                        {totals.totalYearlyIncome}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Income;
