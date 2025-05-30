
import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Added for area fill
} from "chart.js";
import { Line } from 'react-chartjs-2';
import { FiFilter, FiDollarSign, FiTrendingUp, FiGitMerge, FiSave, FiUpload, FiDownload, FiEdit2, FiSend, FiClock } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsFilter as BsFilterIcon, BsCheckCircle, BsClock as BsClockIcon, BsXCircle } from 'react-icons/bs';
import { NavLink } from "react-router-dom"; // Assuming react-router-dom is available for NavLink styling
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Renamed to avoid conflict

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpenseForecastingDashboard = () => {
  const [currentMainTab, setCurrentMainTab] = useState("breakdown"); // For main content views like 'breakdown', 'trends', etc.
  const [activeActionTab, setActiveActionTab] = useState("create"); // For actions: 'create', 'import', 'compare'
  const [period, setPeriod] = useState("Next 3 Months");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const aiChatbotRef = useRef(null);

  const initialExpenseData = [
    {
      category: 'EMPLOYEE AND LABOR',
      items: [
        { name: 'Salaries', prevMonth: 120000, month1AI: 125000, month1Adj: 125000, month2AI: 128000, month2Adj: 127000, month3AI: 130000, month3Adj: 130000 },
        { name: 'Wages', prevMonth: 45000, month1AI: 46000, month1Adj: 46000, month2AI: 47000, month2Adj: 47000, month3AI: 48000, month3Adj: 48000 },
        { name: 'Benefits', prevMonth: 25000, month1AI: 26000, month1Adj: 25500, month2AI: 26500, month2Adj: 26000, month3AI: 27000, month3Adj: 27000 },
      ],
    },
    {
      category: 'PROFESSIONAL SERVICES',
      items: [
        { name: 'Outside Services', prevMonth: 12000, month1AI: 12500, month1Adj: 12500, month2AI: 13000, month2Adj: 13000, month3AI: 13500, month3Adj: 13500 },
        { name: 'Accounting', prevMonth: 8000, month1AI: 8200, month1Adj: 8200, month2AI: 8400, month2Adj: 8400, month3AI: 8600, month3Adj: 8600 },
      ],
    },
    {
      category: 'GENERAL ADMINISTRATION (G&A)',
      items: [
        { name: 'Rent and Mortgage', prevMonth: 25000, month1AI: 25000, month1Adj: 25000, month2AI: 25000, month2Adj: 25000, month3AI: 25000, month3Adj: 25000 },
        { name: 'Utilities', prevMonth: 5000, month1AI: 5200, month1Adj: 5200, month2AI: 5400, month2Adj: 5400, month3AI: 5600, month3Adj: 5600 },
      ],
    }
  ];
  const [expenses, setExpenses] = useState(initialExpenseData);
  const [versions, setVersions] = useState([]);

  const calculateCategoryTotals = (categoryItems) => {
    return categoryItems.reduce(
      (acc, item) => {
        acc.prevMonth += item.prevMonth;
        acc.month1AI += item.month1AI;
        acc.month1Adj += item.month1Adj;
        acc.month2AI += item.month2AI;
        acc.month2Adj += item.month2Adj;
        acc.month3AI += item.month3AI;
        acc.month3Adj += item.month3Adj;
        return acc;
      },
      { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 }
    );
  };

  const processedExpenses = expenses.map(cat => ({
    ...cat,
    total: calculateCategoryTotals(cat.items),
  }));

  const grandTotal = processedExpenses.reduce(
    (acc, category) => {
      acc.prevMonth += category.total.prevMonth;
      acc.month1AI += category.total.month1AI;
      acc.month1Adj += category.total.month1Adj;
      acc.month2AI += category.total.month2AI;
      acc.month2Adj += category.total.month2Adj;
      acc.month3AI += category.total.month3AI;
      acc.month3Adj += category.total.month3Adj;
      return acc;
    },
    { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 }
  );


  // Handle input changes for user adjustments
  const handleExpenseChange = (categoryIndex, itemIndex, field, value) => {
    setExpenses(prevExpenses => {
      const newExpenses = JSON.parse(JSON.stringify(prevExpenses)); // Deep copy
      newExpenses[categoryIndex].items[itemIndex][field] = parseFloat(value) || 0;
      return newExpenses;
    });
    setHasChanges(true);
  };
  
  // Save all changes
  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    setVersions(prev => [
      ...prev,
      { 
        period, // Assuming 'period' state is used for forecast period context
        timestamp, 
        data: JSON.parse(JSON.stringify(expenses)), // Save a deep copy of current expenses
        totals: JSON.parse(JSON.stringify(grandTotal)) // Save a deep copy of current totals
      },
    ]);
    setHasChanges(false);
    alert("Expense forecast saved!");
  };

  // Export data to Excel
  const handleExport = () => {
    const exportData = [];
    processedExpenses.forEach(category => {
      exportData.push({ 'Expense Item': `CATEGORY: ${category.category}`, /* ...other fields blank or as needed */ });
      category.items.forEach(item => {
        exportData.push({
          'Expense Item': item.name,
          'Previous Month': item.prevMonth,
          'Month 1 (AI)': item.month1AI,
          'Month 1 (Adjusted)': item.month1Adj,
          'Month 2 (AI)': item.month2AI,
          'Month 2 (Adjusted)': item.month2Adj,
          'Month 3 (AI)': item.month3AI,
          'Month 3 (Adjusted)': item.month3Adj,
        });
      });
      exportData.push({
        'Expense Item': `TOTAL ${category.category}`,
        'Previous Month': category.total.prevMonth,
        'Month 1 (AI)': category.total.month1AI,
        'Month 1 (Adjusted)': category.total.month1Adj,
        'Month 2 (AI)': category.total.month2AI,
        'Month 2 (Adjusted)': category.total.month2Adj,
        'Month 3 (AI)': category.total.month3AI,
        'Month 3 (Adjusted)': category.total.month3Adj,
      });
      exportData.push({}); // Blank row for spacing
    });
    exportData.push({
        'Expense Item': `GRAND TOTAL`,
        'Previous Month': grandTotal.prevMonth,
        'Month 1 (AI)': grandTotal.month1AI,
        'Month 1 (Adjusted)': grandTotal.month1Adj,
        'Month 2 (AI)': grandTotal.month2AI,
        'Month 2 (Adjusted)': grandTotal.month2Adj,
        'Month 3 (AI)': grandTotal.month3AI,
        'Month 3 (Adjusted)': grandTotal.month3Adj,
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Forecast");
    
    const fileName = `Expense_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Import data from Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    alert("Import functionality would be implemented here based on your Excel structure for expenses.");
    e.target.value = ''; // Reset file input
  };


  const chartData = {
    labels: ['Prev Month', 'Month 1', 'Month 2', 'Month 3'], // Simplified for direct comparison
    datasets: [
      {
        label: 'AI Suggested Total Expense',
        data: [grandTotal.prevMonth, grandTotal.month1AI, grandTotal.month2AI, grandTotal.month3AI], // Assuming prevMonth is a baseline
        borderColor: '#0369a1', // sky-700
        backgroundColor: 'rgba(3, 105, 161, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Adjusted Total Expense',
        data: [grandTotal.prevMonth, grandTotal.month1Adj, grandTotal.month2Adj, grandTotal.month3Adj],
        borderColor: '#0ea5e9', // sky-500
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          }
        },
        title: { display: true, text: "Total Expense ($)"}
      },
      x: {
        grid: { display: false },
        title: { display: true, text: "Month"}
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(null);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendAIQuery = (widgetId) => {
    console.log(`AI Query for ${widgetId}:`, aiInput);
    // Add logic to process AI query and potentially update UI or data
    setAiInput('');
    setShowAIDropdown(null); // Close dropdown after sending
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative ">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiDollarSign className="mr-2" />Expense Forecasting</h1>
            <p className="text-sky-100 text-xs">
              Manage and forecast operational and capital expenditures.
            </p>
          </div>
          <div className="flex items-center space-x-4">
              {/* <div className="flex space-x-1 rounded-lg">
                <NavLink to="#" onClick={() => setCurrentMainTab("breakdown")} className={`px-3 py-2 rounded-lg text-sm font-medium ${currentMainTab === "breakdown" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                  Expense Breakdown
                </NavLink>
                <NavLink to="#" onClick={() => setCurrentMainTab("trends")} className={`px-3 py-2 rounded-lg text-sm font-medium ${currentMainTab === "trends" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                  Trend Analysis
                </NavLink>
                <NavLink to="#" onClick={() => setCurrentMainTab("scenarios")} className={`px-3 py-2 rounded-lg text-sm font-medium ${currentMainTab === "scenarios" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                  Scenario Modeling
                </NavLink>
              </div> */}
            <div>
              <label className="text-sm text-sky-800 font-bold mr-2">Period:</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-2 border-2 bg-sky-100 text-sky-900 border-sky-800 outline-0 rounded-lg text-sm">
                <option>Next 3 Months</option><option>Next 6 Months</option><option>Fiscal Year 2025</option>
              </select>
            </div>
            <button
                            onClick={() => window.print()}
                            className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
                            <FiDownload className="text-sky-50" />
                            <span className="text-sky-50">Export</span>
                        </button>
          </div>
        </div>
      </div>

      {/* Secondary Action Tabs */}
      <div className="flex gap-5 border-b mt-5 py-3 border-gray-200 mb-6">
        <button className={`py-2 px-4 font-medium text-sm ${activeActionTab === 'create' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveActionTab('create')}>
          Create/Edit Forecast
        </button>
        <button className={`py-2 px-4 font-medium text-sm ${activeActionTab === 'import' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveActionTab('import')}>
          Import Forecast
        </button>
        <button className={`py-2 px-4 font-medium text-sm ${activeActionTab === 'compare' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveActionTab('compare')}>
          Compare Scenarios
        </button>
        <div className="relative ml-auto" ref={filtersRef}>
          <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm">
            <BsFilterIcon className="mr-1" /> Filters
          </button>
          {showFilters && (
             <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
                <div className="py-1">
                  <label className="block text-xs text-gray-700 mb-1">Department</label>
                  <select className="w-full p-1 border border-gray-300 rounded text-xs"><option>All</option><option>Engineering</option><option>Sales</option></select>
                </div>
                <div className="py-1">
                  <label className="block text-xs text-gray-700 mb-1">Expense Type</label>
                  <select className="w-full p-1 border border-gray-300 rounded text-xs"><option>All</option><option>OPEX</option><option>CAPEX</option></select>
                </div>
                <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">Apply Filters</button>
            </div>
          )}
        </div>
      </div>
      
      {activeActionTab === "create" && (
        <>
          {currentMainTab === "breakdown" && (
            <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total AI Forecast (Month 1)</h3>
                    <p className="text-xl font-semibold text-gray-800">${grandTotal.month1AI.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setShowAIDropdown('summaryAI')} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Ask AI about this forecast">
                    <BsStars className="text-blue-500" />
                  </button>
                </div>
                {showAIDropdown === 'summaryAI' && (
                  <div ref={aiChatbotRef} className="absolute right-0 top-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-3">
                    <p className="text-xs text-gray-600 mb-2">e.g., "What drives this AI forecast?"</p>
                    <div className="flex items-center">
                      <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" />
                      <button onClick={() => handleSendAIQuery('summaryAI')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Adjusted Forecast (Month 1)</h3>
                <p className="text-xl font-semibold text-gray-800">${grandTotal.month1Adj.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Variance (M1: Adj vs AI)</h3>
                <p className={`text-xl font-semibold ${(grandTotal.month1Adj - grandTotal.month1AI) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(grandTotal.month1Adj - grandTotal.month1AI).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  ({grandTotal.month1AI !== 0 ? ((grandTotal.month1Adj - grandTotal.month1AI) / grandTotal.month1AI * 100).toFixed(1) + '%' : 'N/A'})
                </p>
              </div>
            </div>

            {/* Expense Trend Chart & Summary Table */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-sky-900">Overall Expense Trend</h2>
                    <button onClick={() => setShowAIDropdown('chart')} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Insights on trends">
                        <BsStars className="text-blue-500" />
                    </button>
                </div>
                {showAIDropdown === 'chart' && (
                     <div ref={aiChatbotRef} className="absolute right-4 top-16 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-3"> {/* Adjust positioning as needed */}
                        <p className="text-xs text-gray-600 mb-2">e.g., "Explain the main drivers of change."</p>
                        <div className="flex items-center">
                          <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" />
                          <button onClick={() => handleSendAIQuery('chart')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-3 h-[300px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                    <div className="md:col-span-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-sky-50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-sky-700">Period</th>
                                    <th className="px-3 py-2 text-right font-semibold text-sky-700">AI Total</th>
                                    <th className="px-3 py-2 text-right font-semibold text-sky-700">Adjusted Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-sky-100">
                                {chartData.labels.map((label, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sky-800">{label}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sky-800 text-right">${chartData.datasets[0].data[index].toLocaleString()}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sky-800 text-right">${chartData.datasets[1].data[index].toLocaleString()}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Expense Forecast Table */}
            <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-sky-900">Expense Details by Category</h2>
                  <div className="flex space-x-2">
                     <button onClick={() => setShowAIDropdown('table')} className="p-2 rounded hover:bg-sky-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Get AI suggestions for specific items">
                        <BsStars className="text-blue-500" />
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-2"/>Export</button>
                    <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                      <FiUpload className="mr-2"/>Import
                      <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
                    </label>
                    <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-4 py-2 text-sm rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save All Changes</button>
                  </div>
                </div>
                 {showAIDropdown === 'table' && (
                     <div ref={aiChatbotRef} className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-md relative">
                         <p className="text-xs text-gray-600 mb-2">e.g., "Forecast utilities for next 3 months considering seasonality."</p>
                        <div className="flex items-center">
                          <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI for item-specific forecast..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" />
                          <button onClick={() => handleSendAIQuery('table')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto max-h-[calc(100vh-200px)] relative">
                  <table className="min-w-full divide-y divide-sky-100">
                    <thead className="bg-sky-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[200px]">Expense Item</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Prev. Month</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase" colSpan="2">Month 1</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase" colSpan="2">Month 2</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase" colSpan="2">Month 3</th>
                      </tr>
                      <tr className="bg-sky-50 sticky top-[48px] z-10">
                        <th className="sticky left-0 bg-sky-50 z-20"></th><th></th>
                        {['AI', 'Adjusted', 'AI', 'Adjusted', 'AI', 'Adjusted'].map((label, idx) => (
                           <th key={idx} className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-right">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {processedExpenses.map((category, catIndex) => (
                        <React.Fragment key={category.category}>
                          <tr className="bg-sky-100/70">
                            <td colSpan="8" className="px-4 py-2 text-sm font-bold text-sky-900 sticky left-0 bg-sky-100/70 z-[15]">{category.category}</td>
                          </tr>
                          {category.items.map((item, itemIndex) => (
                            <tr key={item.name} className={itemIndex % 2 === 0 ? "bg-white" : "bg-sky-50/50"}>
                              <td className={`px-4 py-2 text-sm text-sky-800 sticky left-0 z-[5] ${itemIndex % 2 === 0 ? "bg-white" : "bg-sky-50/50"}`}>{item.name}</td>
                              <td className="px-4 py-2 text-sm text-sky-800 text-right">${item.prevMonth.toLocaleString()}</td>
                              {[ 'month1', 'month2', 'month3' ].map(monthKey => (
                                <React.Fragment key={monthKey}>
                                  <td className="px-2 py-2 text-sm text-sky-800 text-right">${item[`${monthKey}AI`].toLocaleString()}</td>
                                  <td className="px-2 py-2 text-sm text-sky-800 text-right">
                                    <input
                                      type="number"
                                      value={item[`${monthKey}Adj`]}
                                      onChange={(e) => handleExpenseChange(catIndex, itemIndex, `${monthKey}Adj`, e.target.value)}
                                      className="w-24 p-1 border border-sky-300 rounded text-xs text-right focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                                    />
                                  </td>
                                </React.Fragment>
                              ))}
                            </tr>
                          ))}
                          <tr className="bg-sky-100 font-semibold">
                            <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[15]">TOTAL {category.category}</td>
                            <td className="px-4 py-3 text-sm text-sky-900 text-right">${category.total.prevMonth.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month1AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month1Adj.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month2AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month2Adj.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month3AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month3Adj.toLocaleString()}</td>
                          </tr>
                           <tr><td colSpan="8" className="h-4 bg-sky-50"></td></tr> {/* Spacer row */}
                        </React.Fragment>
                      ))}
                       <tr className="bg-sky-200 font-bold sticky bottom-0 z-[5]">
                          <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-200 z-[15]">GRAND TOTAL EXPENSES</td>
                          <td className="px-4 py-3 text-sm text-sky-900 text-right">${grandTotal.prevMonth.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month1AI.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month1Adj.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month2AI.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month2Adj.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month3AI.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 text-right">${grandTotal.month3Adj.toLocaleString()}</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </>
          )}
          {currentMainTab === "trends" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Expense Trend Analysis (Placeholder)</h2>
              <p className="text-sky-700">This section would display detailed trend charts for specific expense categories or overall trends over longer periods.</p>
              {/* Placeholder for more detailed trend charts */}
            </div>
          )}
          {currentMainTab === "scenarios" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Expense Scenario Modeling (Placeholder)</h2>
              <p className="text-sky-700">Model different expense scenarios (e.g., cost-cutting, expansion) and see their impact.</p>
              {/* Placeholder for scenario inputs and comparison views */}
            </div>
          )}
        </>
      )}

      {activeActionTab === "import" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Expense Forecast Data</h2>
          <p className="text-sky-700 mb-4">Use this section to import forecast data from external sources like Excel or CSV. Match the template for successful import.</p>
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center w-max">
            <FiUpload className="mr-2" /> Import Master Expense File
            <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
          </label>
          <p className="mt-4 text-xs text-sky-600">Note: Detailed import mapping and validation would be needed for a production system.</p>
        </div>
      )}

      {activeActionTab === "compare" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Compare Expense Forecast Scenarios</h2>
          <p className="text-sky-700 mb-2">This section allows comparing different saved forecast versions or manually created scenarios.</p>
          {versions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-sky-800 mb-2">Saved Forecast Versions:</h3>
              <ul className="list-disc pl-5 text-sky-700 space-y-1">
                {versions.map((version, index) => (
                  <li key={index} className="text-sm">
                    Forecast for {version.period}, saved on {new Date(version.timestamp).toLocaleString()} (Total M1 Adj: ${version.totals.month1Adj.toLocaleString()})
                    <button className="ml-3 px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600">Load for Comparison</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sky-600">No saved versions available. Make changes and use 'Save All Changes' to create a version.</p>
          )}
        </div>
      )}
      <ReactTooltip id="ai-tooltip" />
    </div>
  );
};

export default ExpenseForecastingDashboard;
