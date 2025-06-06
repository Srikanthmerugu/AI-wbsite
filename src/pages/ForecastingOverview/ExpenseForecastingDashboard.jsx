
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Filler,
} from "chart.js";
import { Line } from 'react-chartjs-2';
import { FiFilter, FiDollarSign, FiSave, FiUpload, FiDownload, FiSend, FiPrinter } from "react-icons/fi";
import { BsStars, BsFilter as BsFilterIcon } from 'react-icons/bs';
import { Tooltip as ReactTooltip } from 'react-tooltip';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const EXPENSE_SCENARIOS = {
  BASELINE: "Baseline Expense Plan",
  COST_REDUCTION: "Cost Reduction Initiative",
  GROWTH_INVESTMENT: "Growth Investment Spending",
};

const DEPARTMENTS = ["N/A", "Marketing", "Operations", "HR", "IT", "R&D", "Finance", "Sales"];
const EXPENSE_TYPES = ["N/A", "Fixed", "Variable"];

// Helper to initialize scenario data for each item, now including type and department
const initializeExpenseItemScenarios = (itemData, scenarios) => {
  const scenarioDetails = {};
  Object.values(scenarios).forEach(scenarioName => {
    scenarioDetails[scenarioName] = {
      month1: { ai: itemData.month1AI || 0, user: itemData.month1Adj || 0 },
      month2: { ai: itemData.month2AI || 0, user: itemData.month2Adj || 0 },
      month3: { ai: itemData.month3AI || 0, user: itemData.month3Adj || 0 },
    };
  });
  return {
    name: itemData.name,
    prevMonth: itemData.prevMonth || 0,
    department: itemData.department || DEPARTMENTS[0], // Default to N/A
    type: itemData.type || EXPENSE_TYPES[0], // Default to N/A
    ...scenarioDetails,
  };
};

const initialRawExpenseData = [
  { category: 'EMPLOYEE AND LABOR', items: [
      { name: 'Salaries', department: "HR", type: "Fixed", prevMonth: 120000, month1AI: 125000, month1Adj: 125000, month2AI: 128000, month2Adj: 127000, month3AI: 130000, month3Adj: 130000 },
      { name: 'Wages', department: "Operations", type: "Variable", prevMonth: 45000, month1AI: 46000, month1Adj: 46000, month2AI: 47000, month2Adj: 47000, month3AI: 48000, month3Adj: 48000 },
      { name: 'Benefits', department: "HR", type: "Fixed", prevMonth: 25000, month1AI: 26000, month1Adj: 25500, month2AI: 26500, month2Adj: 26000, month3AI: 27000, month3Adj: 27000 },
  ]},
  { category: 'PROFESSIONAL SERVICES', items: [
      { name: 'Outside Services', department: "IT", type: "Variable", prevMonth: 12000, month1AI: 12500, month1Adj: 12500, month2AI: 13000, month2Adj: 13000, month3AI: 13500, month3Adj: 13500 },
      { name: 'Accounting', department: "Finance", type: "Fixed", prevMonth: 8000, month1AI: 8200, month1Adj: 8200, month2AI: 8400, month2Adj: 8400, month3AI: 8600, month3Adj: 8600 },
  ]},
  { category: 'GENERAL ADMINISTRATION (G&A)', items: [
      { name: 'Rent and Mortgage', department: "Operations", type: "Fixed", prevMonth: 25000, month1AI: 25000, month1Adj: 25000, month2AI: 25000, month2Adj: 25000, month3AI: 25000, month3Adj: 25000 },
      { name: 'Utilities', department: "Operations", type: "Variable", prevMonth: 5000, month1AI: 5200, month1Adj: 5200, month2AI: 5400, month2Adj: 5400, month3AI: 5600, month3Adj: 5600 },
  ]}
];

const transformInitialDataForScenarios = (rawData, scenarios) => {
  return rawData.map(category => ({
    ...category,
    items: category.items.map(item => initializeExpenseItemScenarios(item, scenarios)),
  }));
};

const ExpenseForecastingDashboard = () => {
  const [activeActionTab, setActiveActionTab] = useState("create");
  const [period, setPeriod] = useState("Next 3 Months");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const aiChatbotRef = useRef(null);
  
  const [expenses, setExpenses] = useState(() => transformInitialDataForScenarios(initialRawExpenseData, EXPENSE_SCENARIOS));
  const [activeExpenseScenario, setActiveExpenseScenario] = useState(EXPENSE_SCENARIOS.BASELINE);
  const [expenseScenarioAssumptions, setExpenseScenarioAssumptions] = useState({
    [EXPENSE_SCENARIOS.BASELINE]: "Standard operational expense plan. Includes known contractual obligations and historical spending patterns. Minor cost escalations factored in.",
    [EXPENSE_SCENARIOS.COST_REDUCTION]: "Aggressive cost-cutting measures across departments. Target 10% reduction in variable G&A. Potential impact on service levels.",
    [EXPENSE_SCENARIOS.GROWTH_INVESTMENT]: "Increased spending in Marketing and R&D to support new product launch and market expansion. Higher upfront operational costs.",
  });
  const [versions, setVersions] = useState([]);
  
  // Filters State
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterExpenseType, setFilterExpenseType] = useState("All");

  const calculateTotalsForScenario = (data, scenarioKey, currentDepartmentFilter, currentTypeFilter) => {
    if (!scenarioKey || !data || data.length === 0) {
      return { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };
    }
    let totals = { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };
    data.forEach(category => {
      category.items.forEach(item => {
        const departmentMatch = currentDepartmentFilter === "All" || item.department === currentDepartmentFilter;
        const typeMatch = currentTypeFilter === "All" || item.type === currentTypeFilter;
        if (departmentMatch && typeMatch) {
            totals.prevMonth += Number(item.prevMonth) || 0;
            const scenarioItemData = item[scenarioKey];
            if (scenarioItemData) {
              totals.month1AI += Number(scenarioItemData.month1?.ai) || 0;
              totals.month1Adj += Number(scenarioItemData.month1?.user) || 0;
              totals.month2AI += Number(scenarioItemData.month2?.ai) || 0;
              totals.month2Adj += Number(scenarioItemData.month2?.user) || 0;
              totals.month3AI += Number(scenarioItemData.month3?.ai) || 0;
              totals.month3Adj += Number(scenarioItemData.month3?.user) || 0;
            }
        }
      });
    });
    return totals;
  };

  const filteredExpenses = useMemo(() => {
    return expenses.map(category => ({
        ...category,
        items: category.items.filter(item => 
            (filterDepartment === "All" || item.department === filterDepartment) &&
            (filterExpenseType === "All" || item.type === filterExpenseType)
        )
    })).filter(category => category.items.length > 0); // Remove categories with no matching items
  }, [expenses, filterDepartment, filterExpenseType]);
  
  const grandTotal = useMemo(() => calculateTotalsForScenario(expenses, activeExpenseScenario, filterDepartment, filterExpenseType), [expenses, activeExpenseScenario, filterDepartment, filterExpenseType]);

  const processedExpensesWithTotals = useMemo(() => {
    return filteredExpenses.map(category => {
      let categoryTotal = { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };
      category.items.forEach(item => {
        categoryTotal.prevMonth += Number(item.prevMonth) || 0;
        const scenarioItemData = item[activeExpenseScenario];
        if (scenarioItemData) {
          categoryTotal.month1AI += Number(scenarioItemData.month1?.ai) || 0;
          categoryTotal.month1Adj += Number(scenarioItemData.month1?.user) || 0;
          categoryTotal.month2AI += Number(scenarioItemData.month2?.ai) || 0;
          categoryTotal.month2Adj += Number(scenarioItemData.month2?.user) || 0;
          categoryTotal.month3AI += Number(scenarioItemData.month3?.ai) || 0;
          categoryTotal.month3Adj += Number(scenarioItemData.month3?.user) || 0;
        }
      });
      return { ...category, total: categoryTotal };
    });
  }, [filteredExpenses, activeExpenseScenario]);

  const chartData = useMemo(() => ({
    labels: ['Prev Month', 'Month 1', 'Month 2', 'Month 3'],
    datasets: [
      {
        label: `AI Suggested (${activeExpenseScenario.substring(0,10)}...)`,
        data: [grandTotal.prevMonth, grandTotal.month1AI, grandTotal.month2AI, grandTotal.month3AI],
        borderColor: '#0369a1', backgroundColor: 'rgba(3, 105, 161, 0.1)', tension: 0.3, fill: true,
      },
      {
        label: `Adjusted (${activeExpenseScenario.substring(0,10)}...)`,
        data: [grandTotal.prevMonth, grandTotal.month1Adj, grandTotal.month2Adj, grandTotal.month3Adj],
        borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', tension: 0.3, fill: true,
      }
    ]
  }), [grandTotal, activeExpenseScenario]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
        legend: { position: 'top' }, 
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label.replace(/\.\.\.\)/,')')}: $${ctx.raw.toLocaleString()}` }}
    },
    scales: {
      y: { beginAtZero: false, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { callback: val => `$${val.toLocaleString()}`}, title: { display: true, text: "Total Expense ($)"}},
      x: { grid: { display: false }, title: { display: true, text: "Month"}}
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) setShowAIDropdown(null);
      if (filtersRef.current && !filtersRef.current.contains(event.target)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendAIQuery = (widgetId) => {
    console.log(`AI Query for ${widgetId}:`, aiInput); setAiInput(''); setShowAIDropdown(null);
  };

  const handleExpenseChange = (categoryName, itemName, month, valueType, value) => {
    const numericValue = value === '' ? '' : (parseFloat(value) || 0);
    setExpenses(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const categoryIndex = newData.findIndex(cat => cat.category === categoryName);
      if (categoryIndex === -1) return prevData;
      const itemIndex = newData[categoryIndex].items.findIndex(item => item.name === itemName);
      if (itemIndex === -1) return prevData;

      if (!newData[categoryIndex].items[itemIndex][activeExpenseScenario]) {
        newData[categoryIndex].items[itemIndex][activeExpenseScenario] = {
          month1: { ai: 0, user: 0 }, month2: { ai: 0, user: 0 }, month3: { ai: 0, user: 0 }
        };
      }
      newData[categoryIndex].items[itemIndex][activeExpenseScenario][month][valueType] = numericValue;
      return newData;
    });
    if (!hasChanges) setHasChanges(true);
  };
  
  const handleItemDetailChange = (categoryName, itemName, field, value) => {
    setExpenses(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const categoryIndex = newData.findIndex(cat => cat.category === categoryName);
        if (categoryIndex === -1) return prevData;
        const itemIndex = newData[categoryIndex].items.findIndex(item => item.name === itemName);
        if (itemIndex === -1) return prevData;
        newData[categoryIndex].items[itemIndex][field] = value;
        return newData;
    });
    if(!hasChanges) setHasChanges(true);
  };

  const handleSaveAll = () => {
    console.log("Saving all expense scenario data:", expenses, expenseScenarioAssumptions);
    setVersions(prev => [
      ...prev, { 
        period, timestamp: new Date().toISOString(), 
        data: JSON.parse(JSON.stringify(expenses)), 
        assumptions: JSON.parse(JSON.stringify(expenseScenarioAssumptions)),
        // Store totals for each scenario in the version for comparison tab
        totalsByScenario: Object.fromEntries(
          Object.values(EXPENSE_SCENARIOS).map(scen => [scen, calculateTotalsForScenario(expenses, scen, "All", "All")])
        )
      },
    ]);
    setHasChanges(false);
    alert("Expense forecast scenarios saved!");
  };

  const handleExport = () => {
    const exportDataRows = [];
    exportDataRows.push([`Expense Forecast for Scenario: ${activeExpenseScenario}`]);
    exportDataRows.push([`Assumptions: ${expenseScenarioAssumptions[activeExpenseScenario] || 'N/A'}`]);
    if(filterDepartment !== "All" || filterExpenseType !== "All") {
        exportDataRows.push([`Filters Applied: Department - ${filterDepartment}, Type - ${filterExpenseType}`]);
    }
    exportDataRows.push([]);

    const dataForSheet = [];
    processedExpensesWithTotals.forEach(category => {
      dataForSheet.push({ 'Expense Item': category.category, 'Department': '', 'Type': '' /* ...other fields blank */ });
      category.items.forEach(item => {
        const scenarioItemData = item[activeExpenseScenario] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} };
        dataForSheet.push({
          'Expense Item': `  ${item.name}`,
          'Department': item.department,
          'Type': item.type,
          'Previous Month': item.prevMonth,
          'Month 1 AI': scenarioItemData.month1.ai,
          'Month 1 Adj.': scenarioItemData.month1.user,
          'Month 2 AI': scenarioItemData.month2.ai,
          'Month 2 Adj.': scenarioItemData.month2.user,
          'Month 3 AI': scenarioItemData.month3.ai,
          'Month 3 Adj.': scenarioItemData.month3.user,
        });
      });
      dataForSheet.push({
        'Expense Item': `TOTAL ${category.category}`, 'Department': '', 'Type': '',
        'Previous Month': category.total.prevMonth,
        'Month 1 AI': category.total.month1AI, 'Month 1 Adj.': category.total.month1Adj,
        'Month 2 AI': category.total.month2AI, 'Month 2 Adj.': category.total.month2Adj,
        'Month 3 AI': category.total.month3AI, 'Month 3 Adj.': category.total.month3Adj,
      });
      dataForSheet.push({});
    });
    dataForSheet.push({});
    dataForSheet.push({
      'Expense Item': 'GRAND TOTAL (Filtered)', 'Department': '', 'Type': '',
      'Previous Month': grandTotal.prevMonth,
      'Month 1 AI': grandTotal.month1AI, 'Month 1 Adj.': grandTotal.month1Adj,
      'Month 2 AI': grandTotal.month2AI, 'Month 2 Adj.': grandTotal.month2Adj,
      'Month 3 AI': grandTotal.month3AI, 'Month 3 Adj.': grandTotal.month3Adj,
    });

    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [exportDataRows[0]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(worksheet, [exportDataRows[1]], { origin: "A2" });
    if (exportDataRows.length > 3 && exportDataRows[2].length > 0) { // If filters applied row exists
        XLSX.utils.sheet_add_aoa(worksheet, [exportDataRows[2]], { origin: "A3" });
        XLSX.utils.sheet_add_json(worksheet, dataForSheet, {origin: "A5", skipHeader: false});
    } else {
        XLSX.utils.sheet_add_json(worksheet, dataForSheet, {origin: "A4", skipHeader: false});
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Forecast");
    const fileName = `Expense_Forecast_${activeExpenseScenario.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleImport = async (e) => { /* Basic placeholder */
    alert("Import functionality needs specific Excel structure mapping."); e.target.value = '';
  };
  
  const firstHeaderRowHeight = "2.5rem"; // For sticky headers: py-3 + text-xs line-height approximation

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiDollarSign className="mr-2" />Expense Forecasting</h1>
            <p className="text-sky-100 text-xs">Predictive cost planning for fixed & variable expenses.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-white font-medium mr-2">Period:</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-1.5 border bg-sky-50 text-sky-900 border-sky-200 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                <option>Next 3 Months</option><option>Next 6 Months</option><option>Fiscal Year 2025</option>
              </select>
            </div>
            <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50">
                <FiPrinter /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b mt-5 py-3 border-gray-200 mb-6">
        {['create', 'import', 'compare'].map(tabId => (
          <button key={tabId} className={`py-2 px-4 font-medium text-sm ${activeActionTab === tabId ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-t-lg' : 'text-sky-900 hover:text-sky-500 hover:bg-sky-100 rounded-t-lg'}`} onClick={() => setActiveActionTab(tabId)}>
            {tabId === 'create' ? 'Create/Edit' : tabId === 'import' ? 'Import Data' : 'Compare Scenarios'}
          </button>
        ))}
        <div className="ml-4">
            <label htmlFor="expenseScenarioSelectTab" className="text-sm font-medium text-sky-800 mr-2">Active Scenario:</label>
            <select id="expenseScenarioSelectTab" value={activeExpenseScenario} 
              onChange={(e) => {
                if (hasChanges && !window.confirm("Unsaved changes. Switch scenario anyway?")) {
                    e.target.value = activeExpenseScenario; return;
                }
                setActiveExpenseScenario(e.target.value); setHasChanges(false);
              }}
              className="p-1.5 border border-sky-300 bg-white text-sky-900 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
            >
                {Object.values(EXPENSE_SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
        </div>
        <div className="relative ml-auto" ref={filtersRef}>
          <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm">
            <BsFilterIcon className="mr-1" /> Filters
          </button>
          {showFilters && (
             <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-3 space-y-2"> {/* Increased z-index */}
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Department</label>
                  <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full p-1 border border-gray-300 rounded text-xs">
                      <option value="All">All Departments</option>
                      {DEPARTMENTS.filter(d => d !== "N/A").map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Expense Type</label>
                  <select value={filterExpenseType} onChange={(e) => setFilterExpenseType(e.target.value)} className="w-full p-1 border border-gray-300 rounded text-xs">
                      <option value="All">All Types</option>
                      {EXPENSE_TYPES.filter(t => t !== "N/A").map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                {/* <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">Apply Filters</button> */}
            </div>
          )}
        </div>
      </div>
      
      {activeActionTab === "create" && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="md:col-span-2 grid grid-cols-1 gap-4">
                    <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Total AI Forecast (M1)</h3>
                            <p className="text-xl font-semibold text-gray-800">${grandTotal.month1AI.toLocaleString()}</p>
                        </div>
                        <button onClick={() => setShowAIDropdown(showAIDropdown === 'summaryAI' ? null : 'summaryAI')} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Ask AI about this forecast">
                            <BsStars className="text-blue-500" />
                        </button>
                        </div>
                        {showAIDropdown === 'summaryAI' && ( /* AI Chat Popup */ <div ref={aiChatbotRef} className="absolute right-0 top-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-30 border border-gray-200 p-3"><p className="text-xs text-gray-600 mb-2">e.g., "Drivers for AI M1?"</p><div className="flex items-center"><input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" /><button onClick={() => handleSendAIQuery('summaryAI')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button></div></div>)}
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Adjusted (M1)</h3>
                        <p className="text-xl font-semibold text-gray-800">${grandTotal.month1Adj.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Adjusted (Q1)</h3>
                         <p className="text-xl font-semibold text-gray-800">${(grandTotal.month1Adj + grandTotal.month2Adj + grandTotal.month3Adj).toLocaleString()}</p>
                    </div>
                </div>
                <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-base font-semibold text-sky-900">Overall Expense Trend ({activeExpenseScenario})</h2>
                        <button onClick={() => setShowAIDropdown(showAIDropdown === 'chart' ? null : 'chart')} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Insights on trends">
                            <BsStars className="text-blue-500" />
                        </button>
                    </div>
                    {showAIDropdown === 'chart' && ( /* AI Chat Popup */ <div ref={aiChatbotRef} className="absolute right-4 top-12 mt-2 w-64 bg-white rounded-md shadow-lg z-30 border border-gray-200 p-3"><p className="text-xs text-gray-600 mb-2">e.g., "Main drivers of change?"</p><div className="flex items-center"><input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" /><button onClick={() => handleSendAIQuery('chart')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button></div></div>)}
                    <div className="h-[230px]"> {/* Adjusted height for better fit */}
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
            
            
            
            <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-sky-900">Expense Details ({activeExpenseScenario})</h2>
                  <div className="flex space-x-2 items-center">
                     <div className="relative">
                        <button onClick={() => setShowAIDropdown(showAIDropdown === 'table' ? null : 'table')} className="p-2 rounded hover:bg-sky-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Get AI suggestions for items">
                            <BsStars className="text-blue-500" />
                        </button>
                        {showAIDropdown === 'table' && ( /* AI Chat Popup */ <div ref={aiChatbotRef} className="absolute right-0 top-full mt-1 w-72 bg-white rounded-md shadow-lg z-30 border border-gray-200 p-3"><p className="text-xs text-gray-600 mb-2">e.g., "Forecast Rent for Operations considering new lease."</p><div className="flex items-center"><input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI for item forecast..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" /><button onClick={() => handleSendAIQuery('table')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button></div></div>)}
                     </div>
                    <button onClick={handleExport} className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-1.5"/>Export</button>
                    <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-3 py-2 text-sm rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-1.5"/>Save All</button>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[calc(100vh-350px)] relative"> {/* Adjusted max-h */}
                  <table className="min-w-full divide-y divide-sky-100">
                    <thead className="bg-sky-50 sticky top-0 z-20"> {/* Increased z-index for thead */}
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-30 min-w-[220px]">Expense Item</th> {/* Increased z-index */}
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[130px]">Department</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[100px]">Type</th>
                        <th className="px-3 py-3 text-right text-xs font-semibold text-sky-700 uppercase min-w-[110px]">Prev. Month</th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[200px]" colSpan="2">Month 1</th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[200px]" colSpan="2">Month 2</th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[200px]" colSpan="2">Month 3</th>
                      </tr>
                      <tr className="bg-sky-50 sticky z-20" style={{top: firstHeaderRowHeight}}> {/* Increased z-index, ensure this height is correct */}
                        <th className="sticky left-0 bg-sky-50 z-30 min-w-[220px]"></th>{/* For sticky col span */}
                        <th className="bg-sky-50 min-w-[130px]"></th>
                        <th className="bg-sky-50 min-w-[100px]"></th>
                        <th className="bg-sky-50 min-w-[110px]"></th>
                        {['AI', 'Adjusted', 'AI', 'Adjusted', 'AI', 'Adjusted'].map((label, idx) => (
                           <th key={idx} className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-right min-w-[100px]">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {processedExpensesWithTotals.map((category, catIndex) => (
                        <React.Fragment key={category.category}>
                          <tr className="bg-sky-100/70">
                            <td colSpan="10" className="px-3 py-2 text-sm font-bold text-sky-900 sticky left-0 bg-sky-100/70 z-10">{category.category}</td> {/* Adjusted z-index */}
                          </tr>
                          {category.items.map((item, itemIndex) => {
                            const scenarioItemData = item[activeExpenseScenario] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} };
                            const rowBgClass = itemIndex % 2 === 0 ? "bg-white" : "bg-sky-50/50";
                            return (
                            <tr key={item.name} className={`${rowBgClass} hover:bg-sky-100/40`}>
                              <td className={`px-3 py-2 text-sm text-sky-800 sticky left-0 z-[5] ${rowBgClass}`}>{item.name}</td>
                              <td className="px-3 py-2 text-sm text-sky-800">
                                <select value={item.department} onChange={(e) => handleItemDetailChange(category.category, item.name, 'department', e.target.value)} className="w-full p-1 border-transparent hover:border-sky-300 rounded text-xs bg-transparent focus:bg-white focus:border-sky-400">
                                    {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                              </td>
                              <td className="px-3 py-2 text-sm text-sky-800">
                                <select value={item.type} onChange={(e) => handleItemDetailChange(category.category, item.name, 'type', e.target.value)} className="w-full p-1 border-transparent hover:border-sky-300 rounded text-xs bg-transparent focus:bg-white focus:border-sky-400">
                                    {EXPENSE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                              </td>
                              <td className="px-3 py-2 text-sm text-sky-800 text-right">${Number(item.prevMonth).toLocaleString()}</td>
                              {[ 'month1', 'month2', 'month3' ].map(monthKey => (
                                <React.Fragment key={monthKey}>
                                  <td className="px-2 py-2 text-sm text-sky-800 text-right">${Number(scenarioItemData[monthKey].ai).toLocaleString()}</td>
                                  <td className="px-2 py-2 text-sm text-sky-800 text-right">
                                    <input type="number" value={scenarioItemData[monthKey].user}
                                      onChange={(e) => handleExpenseChange(category.category, item.name, monthKey, 'user', e.target.value)}
                                      className="w-20 p-1 border border-sky-300 rounded text-xs text-right focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/>
                                  </td>
                                </React.Fragment>
                              ))}
                            </tr>
                          )})}
                          <tr className="bg-sky-100 font-semibold">
                            <td className="px-3 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-10">TOTAL {category.category}</td> {/* Adjusted z-index */}
                            <td colSpan="2" className="px-3 py-3 text-sm text-sky-900"></td> {/* Placeholder for Dept/Type in total row */}
                            <td className="px-3 py-3 text-sm text-sky-900 text-right">${category.total.prevMonth.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month1AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month1Adj.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month2AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month2Adj.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month3AI.toLocaleString()}</td>
                            <td className="px-2 py-3 text-sm text-sky-900 text-right bg-sky-200/80">${category.total.month3Adj.toLocaleString()}</td>
                          </tr>
                           <tr><td colSpan="10" className="h-3 bg-sky-50"></td></tr>
                        </React.Fragment>
                      ))}
                       <tr className="bg-sky-200 font-bold sticky bottom-0 z-10"> {/* Ensure bottom sticky total also has high z-index if needed */}
                          <td className="px-3 py-3 text-sm text-sky-900 sticky left-0 bg-sky-200 z-10">GRAND TOTAL (Filtered)</td>
                          <td colSpan="2" className="px-3 py-3 text-sm text-sky-900"></td>
                          <td className="px-3 py-3 text-sm text-sky-900 text-right">${grandTotal.prevMonth.toLocaleString()}</td>
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
            <div className="mb-6 mt-6 p-4 bg-sky-100/70 rounded-lg shadow-sm border border-sky-200">
                <label htmlFor="expenseScenarioAssumptionsText" className="block text-md font-semibold text-sky-800 mb-2">
                  Scenario Assumptions for: <span className="font-bold">{activeExpenseScenario}</span>
                </label>
                <p className="text-xs text-sky-700 mb-2">
                    Detail key assumptions, cost drivers, expected escalations, and profitability impacts for this scenario.
                </p>
                <textarea
                  id="expenseScenarioAssumptionsText" value={expenseScenarioAssumptions[activeExpenseScenario] || ''}
                  onChange={(e) => { setExpenseScenarioAssumptions(prev => ({...prev, [activeExpenseScenario]: e.target.value})); setHasChanges(true); }}
                  rows="3" className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder={`e.g., Inflation at 3% applied to variable costs. New vendor for utilities reducing costs by 5% from M2...`}
                />
            </div>
        </>
      )}

      {activeActionTab === "import" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Expense Forecast Data for <span className="font-bold">{activeExpenseScenario}</span></h2>
          <p className="text-sky-700 mb-4">Upload an Excel file. Data will be imported into the currently selected scenario. Ensure columns match: 'Category', 'Expense Item', 'Department', 'Type', 'Previous Month', 'Month 1 AI', 'Month 1 Adjusted', etc.</p>
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center w-max">
            <FiUpload className="mr-2" /> Choose File to Import
            <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
          </label>
        </div>
      )}

      {activeActionTab === "compare" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-6">Compare Expense Forecast Scenarios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Metric</th>
                    {Object.values(EXPENSE_SCENARIOS).map(scenarioName => (
                      <th key={scenarioName} className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">{scenarioName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {['Total Adjusted M1', 'Total Adjusted Q1 (M1-M3)', 'Key Assumptions & Notes'].map(metric => (
                    <tr key={metric} className={metric.includes('Assumptions') ? 'align-top' : ''}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{metric}</td>
                      {Object.values(EXPENSE_SCENARIOS).map(scenarioName => {
                        // Find the version that matches this scenario, or use current data if no version saved yet
                        // For simplicity, this example will use a helper or directly calculate from `expenses` state
                        const scenarioTotals = versions.find(v => v.assumptions && v.assumptions[scenarioName])?.totalsByScenario?.[scenarioName] || calculateTotalsForScenario(expenses, scenarioName, "All", "All");
                        
                        let value;
                        let className = "text-sm text-sky-700";
                        if (metric === 'Total Adjusted M1') {
                          value = `$${(scenarioTotals.month1Adj || 0).toLocaleString()}`;
                          className = "text-sm font-semibold text-sky-800";
                        } else if (metric === 'Total Adjusted Q1 (M1-M3)') {
                           const q1Total = (scenarioTotals.month1Adj || 0) + (scenarioTotals.month2Adj || 0) + (scenarioTotals.month3Adj || 0);
                           value = `$${q1Total.toLocaleString()}`;
                           className = "text-sm font-semibold text-sky-800";
                        } else if (metric.includes('Assumptions')) {
                            value = expenseScenarioAssumptions[scenarioName] || 'N/A';
                            className = "text-xs text-gray-600 whitespace-pre-wrap break-words max-w-xs";
                        }
                        return (
                          <td key={`${metric}-${scenarioName}`} className={`px-5 py-4 ${className}`}>
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-sky-800 mb-2">Saved Forecast Versions:</h3>
            {versions.length > 0 ? (
              <ul className="list-disc pl-5 text-sky-700 space-y-1">
                {versions.map((version, index) => (
                  <li key={index} className="text-sm">
                    Forecast for {version.period}, saved on {new Date(version.timestamp).toLocaleString()}
                    <button className="ml-3 px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600">Load This Version</button> {/* Add restore logic */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sky-600">No saved versions. Edit and "Save All" to create versions for comparison.</p>
            )}
          </div>
        </div>
      )}
      <ReactTooltip id="ai-tooltip" />
    </div>
  );
};

export default ExpenseForecastingDashboard;