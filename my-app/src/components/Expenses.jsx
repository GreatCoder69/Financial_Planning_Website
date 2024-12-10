import React, { useState, useEffect } from "react";
import "./Expenses.css";

function App() {
    const [state, setState] = useState({
        container1: Array(10).fill(0),
        container2: Array(5).fill(0),
        totals: { total1: 0, total2: 0 },
        req: {
            monthlyTotal: 0,
            yearlyTotal: 0,
            totalYearlyIncome: 0,
        },
    });

    // Fetch data for monthlyTotal and yearlyTotal
    useEffect(() => {
        fetch("http://localhost:5000/get-data/income")
            .then((response) => response.json())
            .then((data) => {
                setState((prev) => ({
                    ...prev,
                    req: {
                        monthlyTotal: data.monthlyTotal,
                        yearlyTotal: data.yearlyTotal,
                        totalYearlyIncome: data.totalYearlyIncome,
                    },
                }));
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Push data to backend when totals or req updates
    useEffect(() => {
        const { total1, total2 } = state.totals;
        const { monthlyTotal, yearlyTotal, totalYearlyIncome } = state.req;
    
        // Prevent pushing data until req has valid values
        if (monthlyTotal > 0 && yearlyTotal > 0 && totalYearlyIncome > 0) {
            const yearlyExpense = 12 * total1 + total2;
            const monthlyExcess = monthlyTotal - total1;
            const yearlyExcess = totalYearlyIncome - yearlyExpense;
    
            const dataToPush = {
                total1,
                total2,
                yearlyExpense,
                monthlyExcess,
                yearlyExcess,
            };
    
            fetch("http://localhost:5000/save-data/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToPush),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Data saved successfully:", data);
                })
                .catch((error) => console.error("Error saving data:", error));
        }
    }, [state.totals, state.req]); // Dependencies ensure this runs after updates    
    const handleContainer1Change = (index, value) => {
        const updatedContainer1 = [...state.container1];
        updatedContainer1[index] = Number(value);

        const total1 = updatedContainer1.reduce((sum, num) => sum + num, 0);

        setState((prev) => ({
            ...prev,
            container1: updatedContainer1,
            totals: { ...prev.totals, total1 },
        }));
    };

    const handleContainer2Change = (index, value) => {
        const updatedContainer2 = [...state.container2];
        updatedContainer2[index] = Number(value);

        const total2 = updatedContainer2.reduce((sum, num) => sum + num, 0);

        setState((prev) => ({
            ...prev,
            container2: updatedContainer2,
            totals: { ...prev.totals, total2 },
        }));
    };

    const yearlyExpense = 12 * state.totals.total1 + state.totals.total2;
    let temp1=parseFloat(state.req.monthlyTotal);
    const monthlyExcess = temp1-parseFloat(state.totals.total1);
    let temp2=state.req.totalYearlyIncome;
    const yearlyExcess = temp2-yearlyExpense;

    return (
        <div className="app">
            {/* Container 1 */}
            <div className="container container-1">
                <h2>Container 1</h2>
                <div className="grid">
                    <div>Monthly Expenses</div>
                    <div></div>
                    <div>Category</div>
                </div>
                <div className="grid">
                    <div>Rent</div>
                    <input
                            type="number"
                            value={state.container1[0]}
                            onChange={(e) => handleContainer1Change(0, e.target.value)}
                    />
                    <div>Needs</div>
                </div>
                <div className="grid">
                    <div>Loan EMI 1</div>
                    <input
                            type="number"
                            value={state.container1[1]}
                            onChange={(e) => handleContainer1Change(1, e.target.value)}
                    />
                    <div>Needs</div>
                </div>
                <div className="grid">
                    <div>Loan EMI 2</div>
                    <input
                            type="number"
                            value={state.container1[2]}
                            onChange={(e) => handleContainer1Change(2, e.target.value)}
                    />
                    <div>Needs</div>
                </div>
                <div className="grid">
                    <div>Loan EMI 3</div>
                    <input
                            type="number"
                            value={state.container1[3]}
                            onChange={(e) => handleContainer1Change(3, e.target.value)}
                    />
                    <div></div>
                </div>
                <div className="grid">
                    <div>Living Expenses 1</div>
                    <input
                            type="number"
                            value={state.container1[4]}
                            onChange={(e) => handleContainer1Change(4, e.target.value)}
                    />
                    <div>Needs</div>
                </div>
                <div className="grid">
                    <div>Living Expenses 2</div>
                    <input
                            type="number"
                            value={state.container1[5]}
                            onChange={(e) => handleContainer1Change(5, e.target.value)}
                    />
                    <div>Needs</div>
                </div>
                <div className="grid">
                    <div>Living Expenses 3</div>
                    <input
                            type="number"
                            value={state.container1[6]}
                            onChange={(e) => handleContainer1Change(6, e.target.value)}
                    />
                    <div></div>
                </div>
                <div className="grid">
                    <div>Desire Expenses 1</div>
                    <input
                            type="number"
                            value={state.container1[7]}
                            onChange={(e) => handleContainer1Change(7, e.target.value)}
                    />
                    <div>Business</div>
                </div>
                <div className="grid">
                    <div>Desire Expenses 2</div>
                    <input
                            type="number"
                            value={state.container1[8]}
                            onChange={(e) => handleContainer1Change(8, e.target.value)}
                    />
                    <div></div>
                </div>
                <div className="grid">
                    <div>Desire Expenses 3</div>
                    <input
                            type="number"
                            value={state.container1[9]}
                            onChange={(e) => handleContainer1Change(9, e.target.value)}
                    />
                    <div></div>
                </div>
                <div className="grid">
                    <div>Total:</div>
                    <div>{state.totals.total1}</div>
                    <div></div>
                </div>
            </div>

            {/* Container 2 */}
            <div className="container container-2">
                <h2>Yearly Expenses</h2>
                {state.container2.map((value, index) => (
                    <div className="grid" key={`container2-row-${index}`}>
                        <label>Expense {index + 1}</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => handleContainer2Change(index, e.target.value)}
                        />
                    </div>
                ))}
                <div className="grid">
                    <label>Total:</label>
                    <span>{state.totals.total2}</span>
                </div>
            </div>

            {/* Summary */}
            <div className="container container-3">
    <h2>Summary</h2>
    <div className="grid">
        <label>Total Yearly Expense:</label>
        <span>{yearlyExpense}</span>
    </div>
    <div className="grid">
        <label>Monthly Excess:</label>
        <span>{monthlyExcess}</span>
        <span>{state.req.monthlyTotal ? (monthlyExcess / state.req.monthlyTotal).toFixed(2) : "N/A"}</span>
        <span>{state.req.monthlyTotal && monthlyExcess / state.req.monthlyTotal < 0.2 ? "This is too Low" : "This is Good"}</span>
    </div>
    <div className="grid">
        <label>Yearly Excess:</label>
        <span>{yearlyExcess}</span>
        <span>{state.req.totalYearlyIncome ? (yearlyExcess / state.req.totalYearlyIncome).toFixed(2) : "N/A"}</span>
        <span>{state.req.totalYearlyIncome && yearlyExcess / state.req.totalYearlyIncome < 0.2 ? "This is too Low" : "This is Good"}</span>
    </div>
</div>

        </div>
    );
}

export default App;
