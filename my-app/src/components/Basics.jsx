import React, { useState, useEffect } from "react";
import "./Basics.css";

function Basics() {
  const [values, setValues] = useState({
    currentage: '',
    retirementage: '',
    wishtolive: '',
    inflation: '6%',
    capitalGainTax: '20%',
    incomeTax: '30%',
  });

  useEffect(() => {
    fetch("http://localhost:5000/get-data/basics")
      .then((response) => response.json())
      .then((data) => setValues(data))
      .catch((error) => console.error("Error fetching basics data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };

    // Update local state
    setValues(updatedValues);

    // Send updated data to backend
    fetch("http://localhost:5000/save-data/basics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedValues),
    }).catch((error) => console.error("Error saving basics data:", error));
  };

  return (
    <div className="basics-container">
      <div className="basics-grid">
        {Object.keys(values).map((key) => (
          <div key={key} className="basics-grid-item">
            <label className="basics-label">
              {key.replace(/([A-Z])/g, " $1")}:
            </label>
            <input
              type={key.includes("Tax") || key === "inflation" ? "text" : "number"}
              name={key}
              value={values[key]}
              onChange={handleChange}
              readOnly={key.includes("Tax") || key === "inflation"}
              className="basics-input-box"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Basics;
