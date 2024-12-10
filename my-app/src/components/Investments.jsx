import React, { useState, useEffect } from "react";
import "./Investments.css";

function App() {
    const [monthlyExcess, setMonthlyExcess] = useState(0);
    const [age, setAge] = useState(0);
    const [investments, setInvestments] = useState({
        largecap: 40,
        directstock: 30,
        smallcap: 30,
    });

    useEffect(() => {
        // Fetch monthlyExcess from backend
        fetch("http://localhost:5000/get-data/expenses")
            .then((response) => response.json())
            .then((data) => {
                setMonthlyExcess(data.monthlyExcess || 0);
            })
            .catch((error) => console.error("Error fetching data:", error));

        // Fetch current age from backend
        fetch("http://localhost:5000/get-data/basics")
            .then((response) => response.json())
            .then((data) => {
                const currentAge = data.currentAge || 0;
                setAge(currentAge);

                // Update investments based on age
                let updatedInvestments;
                if (currentAge >= 20 && currentAge <= 30) {
                    updatedInvestments = { largecap: 40, directstock: 30, smallcap: 30 };
                } else if (currentAge >= 31 && currentAge <= 40) {
                    updatedInvestments = { largecap: 50, directstock: 30, smallcap: 20 };
                } else if (currentAge >= 41 && currentAge <= 100) {
                    updatedInvestments = { largecap: 60, directstock: 30, smallcap: 10 };
                } else {
                    updatedInvestments = { largecap: 40, directstock: 30, smallcap: 30 };
                }
                setInvestments(updatedInvestments);

                // Calculate safeAsset and stockMarket
                const safeAsset = currentAge;
                const stockMarket = 100 - currentAge;

                // Push updated investments and proportions to the backend
                fetch("http://localhost:5000/get-data/investments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        investments: updatedInvestments,
                        safeAsset,
                        stockMarket,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Investment data saved successfully:", data);
                    })
                    .catch((error) => console.error("Error saving data:", error));
            })
            .catch((error) => console.error("Error fetching current age:", error));
    }, []);
    const safeAsset = age; // Proportion of safe assets is equal to age
    const stockMarket = 100 - age;
    const y = (safeAsset/100) * monthlyExcess;

    return (
        <div className="app">
            {/* Container 1 */}
            <div className="container">
                <h2>Container 1</h2>
                <div className="grid grid-3x2">
                    <div>Total Investments per Month</div>
                    <div>{monthlyExcess.toFixed(2)}</div>
                    <div>Safe Asset (Fixed Return) Proportion</div>
                    <div>{safeAsset}%</div>
                    <div>Stock Market Asset Proportion</div>
                    <div>{stockMarket}%</div>
                </div>
            </div>

            {/* Container 2 */}
            <div className="container">
                <h2>Container 2</h2>
                <div className="grid grid-6x3">
                    <div>Safe Asset Investment</div>
                    <div></div>
                    <div>IRR</div>
                    <div>VPF/EPF/PPF</div>
                    <div></div>
                    <div>7%</div>
                    <div>Recurring Deposit/Fixed Deposit</div>
                    <div></div>
                    <div>7%</div>
                    <div>Government Bills</div>
                    <div></div>
                    <div>7%</div>
                    <div>Gold</div>
                    <div></div>
                    <div>7%</div>
                    <div>Corporate Bonds</div>
                    <div></div>
                    <div>7%</div>
                </div>
            </div>

            {/* Container 3 */}
            <div className="container">
                <h2>Container 3</h2>
                <div className="grid grid-5x4">
                    <div>Stock Market Investment</div>
                    <div>{y.toFixed(2)}</div>
                    <div>IRR</div>
                    <div></div>
                    <div>Largecap Mutual Fund</div>
                    <div>{(y * (investments.largecap / 100)).toFixed(2)}</div>
                    <div>12%</div>
                    <div>{investments.largecap}%</div>
                    <div>Direct Stocks</div>
                    <div>{(y * (investments.directstock / 100)).toFixed(2)}</div>
                    <div>10%</div>
                    <div>{investments.directstock}%</div>
                    <div>Smallcap Mutual Fund</div>
                    <div>{(y * (investments.smallcap / 100)).toFixed(2)}</div>
                    <div>18%</div>
                    <div>{investments.smallcap}%</div>
                </div>
            </div>
        </div>
    );
}

export default App;
