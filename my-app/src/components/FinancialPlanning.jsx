import React, { useState, useEffect } from "react";
import "./FinancialPlanning.css";

function FinancialPlanning() {
    const [gridData, setGridData] = useState(
        Array.from({ length: 14 }, () => Array(6).fill(""))
    );
    const [largecap, setLargecap] = useState(0);
    const [directstock, setDirectstock] = useState(0);
    const [smallcap, setSmallcap] = useState(0);

    const [currentSavingsAmt, setCurrentSavingsAmt] = useState(0);
    const [postRetAmt, setPostRetAmt] = useState(0);
    const [currentAge, setCurrentAge] = useState(0);
    const [retirementAge, setRetirementAge] = useState(0);
    const [wishToLiveTill, setWishToLiveTill] = useState(0);
    const [monthlyExcess, setMonthlyExcess] = useState(0);
    const [inflation, setInflation] = useState(0.06); // Default 6%
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Fetch investments data
        fetch("http://localhost:5000/get-data/investments")
            .then((response) => response.json())
            .then((data) => {
                setLargecap(data.largecap || 0);
                setDirectstock(data.directstock || 0);
                setSmallcap(data.smallcap || 0);
            })
            .catch((error) => console.error("Error fetching investments data:", error));

        // Fetch basic and expenses data
        fetch("http://localhost:5000/get-data/basics")
            .then((res) => res.json())
            .then((data) => {
                setCurrentAge(data.currentAge || 0);
                setRetirementAge(data.retirementAge || 0);
                setWishToLiveTill(data.wishToLive || 0);
            });

        fetch("http://localhost:5000/get-data/expenses")
            .then((res) => res.json())
            .then((data) => {
                setMonthlyExcess(data.monthlyExcess || 0);
            });
    }, []);

    const calculateRow7Col5 = () => {
        return (
            (30 * 35 +
                20 * 0.65 * largecap +
                20 * 0.65 * directstock +
                20 * 0.65 * smallcap) /
            100
        ).toFixed(3);
    };

    const calculateRow7Col6 = () => {
        return (
            (7 * 35 +
                12 * 0.65 * largecap +
                15 * 0.65 * directstock +
                18 * 0.65 * smallcap) /
            100
        ).toFixed(3);
    };

    const handleInputChange = (row, col, value) => {
        const newData = [...gridData];
        newData[row][col] = value;
        setGridData(newData);

        if (row === 0 && col === 1) setCurrentSavingsAmt(Number(value) || 0);
        if (row === 6 && col === 1) setPostRetAmt(Number(value) || 0);
    };

    const calculateTableData = () => {
        let data = [];
        let savings = parseFloat(currentSavingsAmt); // Starting savings
    
        for (let age = currentAge; age <= 100; age++) {
            let isRetired = age >= retirementAge;
            let plannedExpenses = 0;
            let additionalSavings = 0; // Default additional savings
            let additionalExpenses = 0; // Default additional expenses
            let status = "Earning";
            let esavings = savings; // Ending savings for this age row
            let warning = "";
            let retirementYear = age === retirementAge ? 1 : 0;
    
            // Handle retirement expenses if the person is retired
            if (isRetired && age <= wishToLiveTill) {
                if (retirementYear === 1) {
                    plannedExpenses =
                        postRetAmt *
                        Math.pow(1 + inflation, retirementAge - currentAge) *
                        12; // Adjust for inflation after retirement
                } else {
                    const prevExpenses = data[data.length - 1]?.plannedExpenses || 0;
                    plannedExpenses = prevExpenses * (1 + inflation); // Increase expenses with inflation year-over-year
                }
            }
    
            // If the age exceeds the wish-to-live-until age, stop adding data
            if (age > wishToLiveTill) {
                plannedExpenses = "";
                additionalSavings = "";
                additionalExpenses = "";
                savings = "";
                status = "Dead";
                warning = "";
                data.push({
                    age,
                    savings,
                    plannedExpenses,
                    additionalSavings,
                    additionalExpenses,
                    endingSavings: "",
                    status,
                    warning,
                    retirementYear: "",
                });
                break;
            }
    
            // Set the status if the person is retired
            if (age >= retirementAge) status = "Retired";
    
            // Calculate the growth rate and ending savings based on whether they are earning or retired
            const growthRate = parseFloat(calculateRow7Col6()) / 100; // Convert to a numeric value (growth rate)
    
            if (age <= retirementAge) {
                // If still earning, calculate ending savings based on growth rate and monthly excess savings
                esavings =
                    savings * (1 + growthRate) + monthlyExcess * 12 - plannedExpenses - additionalExpenses + additionalSavings;
            } else {
                // If retired, apply a fixed growth rate (e.g., 9.5%)
                esavings =
                    savings * (1 + 0.095) - plannedExpenses - additionalExpenses + additionalSavings;
            }
    
            // Check for a warning if savings are running low
            if (esavings < 0) {
                warning = "Savings running low!";
            }
    
            // Add the calculated row to the data array
            data.push({
                age,
                savings: savings.toFixed(0), // Display savings as an integer
                plannedExpenses: plannedExpenses.toFixed(0), // Display planned expenses as an integer
                additionalSavings: additionalSavings.toFixed(0), // Display additional savings as an integer
                additionalExpenses: additionalExpenses.toFixed(0), // Display additional expenses as an integer
                endingSavings: esavings.toFixed(0), // Display ending savings as an integer
                status,
                warning,
                retirementYear,
            });
    
            // Update savings for the next iteration with the ending savings of the current row
            savings = esavings; 
        }
    
        // Set the table data for rendering
        setTableData(data);
    }
    
    
    

    useEffect(() => {
        calculateTableData();
    }, [currentSavingsAmt, postRetAmt, currentAge, wishToLiveTill, monthlyExcess, inflation]);

    return (
        <div>
            <div className="grid-container">
            {/* Row 1 */}
            <div className="grid-row">
                <div className="grid-cell">Current Savings Amount</div>
                <div className="grid-cell">
                    <input
                        type="text"
                        value={gridData[0][1]}
                        onChange={(e) => handleInputChange(0, 1, e.target.value)}
                    />
                </div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            {/* Row 2 */}
            <div className="grid-row">
                <div className="grid-cell">Current Savings - Investment Approach</div>
                <div className="grid-cell">Returns</div>
                <div className="grid-cell">Tax</div>
                <div className="grid-cell">Share</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Fixed Returns</div>
                <div className="grid-cell">7%</div>
                <div className="grid-cell">30%</div>
                <div className="grid-cell">35%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Large Cap Mutual Funds</div>
                <div className="grid-cell">12%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">{(0.65*largecap).toFixed(0)}%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Direct Stocks</div>
                <div className="grid-cell">15%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">{(0.65*directstock).toFixed(0)}%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Smallcap Mutual Funds</div>
                <div className="grid-cell">18%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">{(0.65*smallcap).toFixed(0)}%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell">100%</div>
                <div className="grid-cell"><span>{calculateRow7Col5()}%</span></div>
                <div className="grid-cell"><span>{calculateRow7Col6()}%</span></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Step-up in Savings Every Year</div>
                <div className="grid-cell">5%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Post Retirement Monthly Amount (Today's Rate)</div>
                <div className="grid-cell">5%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Post Retirement</div>
                <div className="grid-cell">
                    <input
                        type="text"
                        value={gridData[6][1]}
                        onChange={(e) => handleInputChange(6, 1, e.target.value)}
                    />
                </div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Retirement Savings - Investment Approach</div>
                <div className="grid-cell">Returns</div>
                <div className="grid-cell">Tax</div>
                <div className="grid-cell">Share</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Fixed Returns</div>
                <div className="grid-cell">7%</div>
                <div className="grid-cell">30%</div>
                <div className="grid-cell">50%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Large Cap Mutual Funds</div>
                <div className="grid-cell">12%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">50%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Direct Stocks</div>
                <div className="grid-cell">15%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">0%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Smallcap Mutual Funds</div>
                <div className="grid-cell">18%</div>
                <div className="grid-cell">20%</div>
                <div className="grid-cell">0%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell"></div>
            </div>

            <div className="grid-row">
                <div className="grid-cell">Inflation</div>
                <div className="grid-cell">6%</div>
                <div className="grid-cell"></div>
                <div className="grid-cell">100%</div>
                <div className="grid-cell">25.0%</div>
                <div className="grid-cell">9.500%</div>
            </div>
            <h2>Financial Planning Table</h2>
            <div className="grid-container-full">
    <div>Age</div>
    <div>Starting Savings</div>
    <div>Planned Expenses (Post-Tax)</div>
    <div>Additional Savings</div>
    <div>Additional Expenses</div>
    <div>Ending Savings</div>
    <div>Status</div>
    <div>Warning</div>
    <div>Retirement Year</div>
    {tableData.map((row, index) => (
        <React.Fragment key={index}>
            <div>{row.age}</div>
            <div>{row.savings}</div>
            <div>{row.plannedExpenses}</div>
            <div>
                <input
                    type="number"
                    value={row.additionalSavings}
                    onChange={(e) => {
                        const updatedTable = [...tableData];
                        const additionalSavings = Number(e.target.value) || 0;
                        updatedTable[index].additionalSavings = additionalSavings;

                        // Recalculate Ending Savings
                        updatedTable[index].endingSavings = (
                            parseFloat(row.savings) +
                            additionalSavings -
                            parseFloat(row.plannedExpenses || 0) -
                            parseFloat(row.additionalExpenses || 0) +
                            parseFloat(monthlyExcess * 12)
                        ).toFixed(0);

                        setTableData(updatedTable);
                    }}
                />
            </div>
            <div>
                <input
                    type="number"
                    value={row.additionalExpenses}
                    onChange={(e) => {
                        const updatedTable = [...tableData];
                        const additionalExpenses = Number(e.target.value) || 0;
                        updatedTable[index].additionalExpenses = additionalExpenses;

                        // Recalculate Ending Savings
                        updatedTable[index].endingSavings = (
                            parseFloat(row.savings) +
                            parseFloat(row.additionalSavings || 0) -
                            parseFloat(row.plannedExpenses || 0) -
                            additionalExpenses +
                            parseFloat(monthlyExcess * 12)
                        ).toFixed(0);

                        setTableData(updatedTable);
                    }}
                />
            </div>
            <div>{row.endingSavings}</div>
            <div>{row.status}</div>
            <div>{row.warning}</div>
            <div>{row.retirementYear}</div>
        </React.Fragment>
    ))}
</div>

        </div>
        </div>
    );
}

export default FinancialPlanning;
