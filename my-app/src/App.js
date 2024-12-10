import React, { useState } from 'react';
import './App.css';
import Basics from './components/Basics';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Investments from './components/Investments';
import FinancialPlanning from './components/FinancialPlanning';

function App() {
  const [activePage, setActivePage] = useState('Basics'); // Tracks the current active page

  // Function to render the active component
  const renderPage = () => {
    switch (activePage) {
      case 'Basics':
        return <Basics />;
      case 'Income':
        return <Income />;
      case 'Expenses':
        return <Expenses />;
      case 'Investments':
        return <Investments />;
      case 'FinancialPlanning':
        return <FinancialPlanning />;
      default:
        return <Basics />;
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <button onClick={() => setActivePage('Basics')}>Basics</button>
        <button onClick={() => setActivePage('Income')}>Income</button>
        <button onClick={() => setActivePage('Expenses')}>Expenses</button>
        <button onClick={() => setActivePage('Investments')}>Investments</button>
        <button onClick={() => setActivePage('FinancialPlanning')}>Financial Planning</button>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
