
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { BsStars, BsThreeDotsVertical, BsFilter } from 'react-icons/bs';
import { FiSend, FiSave, FiDownload, FiInfo } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx'; // For Excel export

// Ensure ChartJS and its components are registered
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const CAPEX_SCENARIOS = {
  BASELINE: "Baseline Investment Plan",
  ACCELERATED: "Accelerated Investment",
  DELAYED: "Delayed Spending",
};

// Helper to initialize scenario data for each item
const initializeItemScenarios = (itemData, scenarios) => {
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
    ...scenarioDetails,
  };
};

const initialRawCapexData = [ // Original flat structure for easier definition
  { category: 'PROPERTY', items: [
      { name: 'Land Acquisition', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 250000, month3Adj: 250000 },
      { name: 'Building Construction', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 150000, month2Adj: 150000, month3AI: 200000, month3Adj: 200000 },
      { name: 'Building Improvements', prevMonth: 50000, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
  ]},
  { category: 'EQUIPMENT', items: [
      { name: 'Manufacturing Equipment', prevMonth: 120000, month1AI: 80000, month1Adj: 80000, month2AI: 60000, month2Adj: 60000, month3AI: 40000, month3Adj: 40000 },
      { name: 'Office Equipment', prevMonth: 25000, month1AI: 10000, month1Adj: 10000, month2AI: 5000, month2Adj: 5000, month3AI: 5000, month3Adj: 5000 },
      { name: 'IT Infrastructure', prevMonth: 75000, month1AI: 30000, month1Adj: 30000, month2AI: 20000, month2Adj: 20000, month3AI: 15000, month3Adj: 15000 },
  ]},
  { category: 'VEHICLES', items: [
    { name: 'Company Cars', prevMonth: 0, month1AI: 40000, month1Adj: 40000, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
    { name: 'Delivery Vehicles', prevMonth: 0, month1AI: 60000, month1Adj: 60000, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
  ]},
  { category: 'SOFTWARE & R&D', items: [ // Added R&D here
    { name: 'ERP System Upgrade', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 120000, month2Adj: 120000, month3AI: 0, month3Adj: 0 },
    { name: 'New Product R&D Phase 1', prevMonth: 15000, month1AI: 20000, month1Adj: 25000, month2AI: 30000, month2Adj: 30000, month3AI: 35000, month3Adj: 35000 },
  ]}
];

// Transform initialRawCapexData to include scenario structures
const transformInitialDataForScenarios = (rawData, scenarios) => {
  return rawData.map(category => ({
    ...category,
    items: category.items.map(item => initializeItemScenarios(item, scenarios)),
  }));
};


const CAPEXForecastScreen = () => {
  const [activeTab, setActiveTab] = useState('create'); // create, compare
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [capexData, setCapexData] = useState(() => transformInitialDataForScenarios(initialRawCapexData, CAPEX_SCENARIOS));
  const [activeCapexScenario, setActiveCapexScenario] = useState(CAPEX_SCENARIOS.BASELINE);
  const [capexScenarioAssumptions, setCapexScenarioAssumptions] = useState({
    [CAPEX_SCENARIOS.BASELINE]: "Standard capital expenditure plan based on current projects and replacement cycles. Assumes stable economic conditions.",
    [CAPEX_SCENARIOS.ACCELERATED]: "Aggressive investment in new technologies and facility expansion to capture market share. Higher upfront costs, potential for faster growth.",
    [CAPEX_SCENARIOS.DELAYED]: "Conservative approach, deferring non-essential CAPEX to preserve cash flow due to market uncertainty. Potential impact on long-term competitiveness.",
  });

  const calculateTotalsForScenario = (data, scenarioKey) => {
    if (!scenarioKey || !data || data.length === 0) {
      return { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };
    }

    let totals = { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };

    data.forEach(category => {
      category.items.forEach(item => {
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
      });
    });
    return totals;
  };
  
  const grandTotal = useMemo(() => calculateTotalsForScenario(capexData, activeCapexScenario), [capexData, activeCapexScenario]);

  const capexCategoriesWithTotals = useMemo(() => {
    return capexData.map(category => {
      let categoryTotal = { prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 };
      category.items.forEach(item => {
        categoryTotal.prevMonth += Number(item.prevMonth) || 0;
        const scenarioItemData = item[activeCapexScenario];
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
  }, [capexData, activeCapexScenario]);


  const chartData = useMemo(() => ({
    labels: ['Prev Month', 'Month 1', 'Month 2', 'Month 3'],
    datasets: [
      {
        label: `AI Suggested (${activeCapexScenario.substring(0,15)}...)`, // Shorten name for legend
        data: [grandTotal.prevMonth, grandTotal.month1AI, grandTotal.month2AI, grandTotal.month3AI],
        borderColor: '#0369a1',
        backgroundColor: 'rgba(3, 105, 161, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: `User Adjusted (${activeCapexScenario.substring(0,15)}...)`, // Shorten name for legend
        data: [grandTotal.prevMonth, grandTotal.month1Adj, grandTotal.month2Adj, grandTotal.month3Adj],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  }), [grandTotal, activeCapexScenario]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
        legend: { position: 'top' }, 
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label.replace(/\.\.\.\)/,')')}: $${ctx.raw.toLocaleString()}` }} // Show full name in tooltip
    },
    scales: { y: { beginAtZero: true, ticks: { callback: val => `$${val.toLocaleString()}` }}}
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

  const handleAdjustedInputChange = (categoryIndex, itemIndex, month, valueType, value) => {
    const numericValue = value === '' ? '' : (parseFloat(value) || 0);
    setCapexData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      if (!newData[categoryIndex].items[itemIndex][activeCapexScenario]) {
        newData[categoryIndex].items[itemIndex][activeCapexScenario] = {
          month1: { ai: 0, user: 0 }, month2: { ai: 0, user: 0 }, month3: { ai: 0, user: 0 }
        };
      }
      newData[categoryIndex].items[itemIndex][activeCapexScenario][month][valueType] = numericValue;
      return newData;
    });
    if (!hasChanges) setHasChanges(true);
  };

  const handleSaveAllChanges = () => {
    console.log("Saving all CAPEX scenario data:", capexData, capexScenarioAssumptions);
    setHasChanges(false);
    alert("CAPEX Forecast scenarios saved successfully!");
  };

  const handleExportTable = () => {
    const dataToExport = [];
    dataToExport.push([`CAPEX Forecast Details for Scenario: ${activeCapexScenario}`]);
    dataToExport.push([`Assumptions: ${capexScenarioAssumptions[activeCapexScenario] || 'N/A'}`]);
    dataToExport.push([]); 

    capexCategoriesWithTotals.forEach(category => {
      dataToExport.push({ 'CAPEX Item': category.category });
      category.items.forEach(item => {
        const scenarioItemData = item[activeCapexScenario] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} };
        dataToExport.push({
          'CAPEX Item': `  ${item.name}`,
          'Previous Month': item.prevMonth,
          'Month 1 AI Suggested': scenarioItemData.month1.ai,
          'Month 1 Adjusted': scenarioItemData.month1.user,
          'Month 2 AI Suggested': scenarioItemData.month2.ai,
          'Month 2 Adjusted': scenarioItemData.month2.user,
          'Month 3 AI Suggested': scenarioItemData.month3.ai,
          'Month 3 Adjusted': scenarioItemData.month3.user,
        });
      });
      dataToExport.push({
        'CAPEX Item': `TOTAL ${category.category}`,
        'Previous Month': category.total.prevMonth,
        'Month 1 AI Suggested': category.total.month1AI,
        'Month 1 Adjusted': category.total.month1Adj,
        'Month 2 AI Suggested': category.total.month2AI,
        'Month 2 Adjusted': category.total.month2Adj,
        'Month 3 AI Suggested': category.total.month3AI,
        'Month 3 Adjusted': category.total.month3Adj,
      });
      dataToExport.push({});
    });
    dataToExport.push({});
    dataToExport.push({
      'CAPEX Item': 'GRAND TOTAL CAPEX',
      'Previous Month': grandTotal.prevMonth,
      'Month 1 AI Suggested': grandTotal.month1AI,
      'Month 1 Adjusted': grandTotal.month1Adj,
      'Month 2 AI Suggested': grandTotal.month2AI,
      'Month 2 Adjusted': grandTotal.month2Adj,
      'Month 3 AI Suggested': grandTotal.month3AI,
      'Month 3 Adjusted': grandTotal.month3Adj,
    });

    const worksheet = XLSX.utils.json_to_sheet([]); // Start with an empty sheet
    // Manually add rows to preserve formatting and have multi-line titles
    XLSX.utils.sheet_add_aoa(worksheet, [dataToExport[0]], { origin: "A1" }); // Title
    XLSX.utils.sheet_add_aoa(worksheet, [dataToExport[1]], { origin: "A2" }); // Assumptions
    // Then add the rest of the data, skipping the manually added title and assumptions
    XLSX.utils.sheet_add_json(worksheet, dataToExport.slice(3), {origin: "A4", skipHeader: false});


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CAPEX Forecast");
    XLSX.writeFile(workbook, `CAPEX_Forecast_${activeCapexScenario.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  const firstHeaderRowHeight = "2.5rem";

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white">CAPEX Forecast (Capital Expenditure Planning & Asset Investments)</h1>
              <p className="text-sky-100 text-xs">Plan, model, and analyze capital investments across various scenarios.</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200"
              >
                <FiDownload className="text-sky-50" />
                <span className="text-sky-50">Print Page</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 mb-6 mt-5 pb-3 ">
          {['create', 'compare'].map(tabId => (
            <button
              key={tabId}
              className={`py-2 px-4 font-medium text-sm ${activeTab === tabId ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-t-lg' : 'text-sky-900 hover:text-sky-500 hover:bg-sky-100 rounded-t-lg'}`}
              onClick={() => setActiveTab(tabId)}
            >
              {tabId === 'create' ? 'Create/Edit Forecast' : 'Compare Scenarios'}
            </button>
          ))}
           <div className="ml-4"> {/* Scenario Dropdown container */}
              <label htmlFor="capexScenarioSelectTab" className="text-sm font-medium text-sky-800 mr-2">Active Scenario:</label>
              <select
                id="capexScenarioSelectTab"
                value={activeCapexScenario}
                onChange={(e) => { 
                    if (hasChanges) {
                        if (window.confirm("You have unsaved changes. Are you sure you want to switch scenarios without saving?")) {
                            setActiveCapexScenario(e.target.value); 
                            setHasChanges(false); 
                        } else {
                           // Reset dropdown to current active scenario if user cancels
                           e.target.value = activeCapexScenario; 
                        }
                    } else {
                        setActiveCapexScenario(e.target.value);
                    }
                }}
                className="p-1.5 border border-sky-300 bg-white text-sky-900 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
              >
                {Object.values(CAPEX_SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          <div className="relative ml-auto" ref={filtersRef}> {/* Filters button aligned to the far right */}
            <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm">
              <BsFilter className="mr-1" /> Filters
            </button>
            {/* Filters Dropdown Here */}
          </div>
        </div>

        {activeTab === 'create' && (
          <>
            <div className='flex flex-col md:flex-row justify-between gap-4 mb-6'>
                <div className="grid w-full md:w-[30%] grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">AI Suggested (M1 - <span className="text-xs">{activeCapexScenario}</span>)</h3>
                        <p className="text-xl font-semibold text-gray-800">${grandTotal.month1AI.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">User Adjusted (M1 - <span className="text-xs">{activeCapexScenario}</span>)</h3>
                        <p className="text-xl font-semibold text-gray-800">${grandTotal.month1Adj.toLocaleString()}</p>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Adjusted (Q1 - <span className="text-xs">{activeCapexScenario}</span>)</h3>
                        <p className="text-xl font-semibold text-gray-800">
                            ${(grandTotal.month1Adj + grandTotal.month2Adj + grandTotal.month3Adj).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white w-full md:w-[calc(70%-1rem)] p-4 rounded-lg shadow-sm border border-gray-200 relative">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">CAPEX Trend ({activeCapexScenario})</h2>
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-900">CAPEX Forecast Details ({activeCapexScenario})</h2>
                <div className="flex items-center space-x-3">
                  <button onClick={handleExportTable} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <FiDownload className="mr-2" /> Export Scenario
                  </button>
                  <button onClick={handleSaveAllChanges} disabled={!hasChanges} className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                    <FiSave className="mr-2" /> Save All Changes & Scenarios
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-200px)] relative">
                <table className="min-w-full divide-y divide-sky-100">
                  <thead className="bg-sky-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider sticky left-0 bg-sky-50 z-20 min-w-[200px]">CAPEX Item</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[150px]">Previous Month</th>
                      <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[240px]">Month 1</th>
                      <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[240px]">Month 2</th>
                      <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[240px]">Month 3</th>
                    </tr>
                    <tr className={`bg-sky-50 sticky z-10`} style={{ top: firstHeaderRowHeight }}>
                      <th className="sticky left-0 bg-sky-50 z-20 min-w-[200px]"></th>
                      <th className="bg-sky-50 min-w-[150px]"></th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">AI Suggested</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">Your Adjustment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">AI Suggested</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">Your Adjustment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">AI Suggested</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider bg-sky-100 min-w-[120px]">Your Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-100">
                    {capexCategoriesWithTotals.map((category, categoryIndex) => (
                      <React.Fragment key={category.category}>
                        <tr className="bg-sky-100 font-semibold">
                          <td colSpan="8" className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[5] min-w-[200px]">{category.category}</td>
                        </tr>
                        {category.items.map((item, itemIndex) => {
                          const rowBgClass = itemIndex % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                          const stickyCellBgClass = itemIndex % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                          const scenarioItemData = item[activeCapexScenario] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} };
                          return (
                          <tr key={item.name} className={`${rowBgClass} hover:bg-sky-100/50`}>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-sky-800 pl-6 sticky left-0 z-[4] min-w-[200px] ${stickyCellBgClass}`}>{item.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 min-w-[150px]">${Number(item.prevMonth).toLocaleString()}</td>
                            
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 bg-sky-50 min-w-[120px]">${Number(scenarioItemData.month1.ai).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 font-medium bg-sky-50 min-w-[120px]">
                              <input type="number" value={scenarioItemData.month1.user} onChange={(e) => handleAdjustedInputChange(categoryIndex, itemIndex, 'month1', 'user', e.target.value)} className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 bg-sky-50 min-w-[120px]">${Number(scenarioItemData.month2.ai).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 font-medium bg-sky-50 min-w-[120px]">
                              <input type="number" value={scenarioItemData.month2.user} onChange={(e) => handleAdjustedInputChange(categoryIndex, itemIndex, 'month2', 'user', e.target.value)} className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 bg-sky-50 min-w-[120px]">${Number(scenarioItemData.month3.ai).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-800 font-medium bg-sky-50 min-w-[120px]">
                              <input type="number" value={scenarioItemData.month3.user} onChange={(e) => handleAdjustedInputChange(categoryIndex, itemIndex, 'month3', 'user', e.target.value)} className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/>
                            </td>
                          </tr>
                        )})}
                        <tr className="bg-sky-200 font-semibold">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 sticky left-0 bg-sky-200 z-[5] min-w-[200px]">TOTAL {category.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[150px]">${category.total.prevMonth.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month1AI.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month1Adj.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month2AI.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month2Adj.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month3AI.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${category.total.month3Adj.toLocaleString()}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                    <tr className="bg-sky-100 font-bold sticky bottom-0 z-10">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 sticky left-0 bg-sky-100 z-[11] min-w-[200px]">GRAND TOTAL CAPEX</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[150px]">${grandTotal.prevMonth.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month1AI.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month1Adj.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month2AI.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month2Adj.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month3AI.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-sky-900 min-w-[120px]">${grandTotal.month3Adj.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-6 mt-6 p-4 bg-sky-50/70 rounded-lg shadow-sm border border-sky-200">
                <label htmlFor="capexScenarioAssumptionsText" className="block text-md font-semibold text-sky-800 mb-2">
                  Scenario Assumptions & Qualitative Analysis for: <span className="font-bold">{activeCapexScenario}</span>
                </label>
                <p className="text-xs text-sky-700 mb-2">
                    Detail key assumptions, investment drivers, expected ROI/Payback, depreciation impacts, and other notes specific to this scenario.
                </p>
                <textarea
                  id="capexScenarioAssumptionsText"
                  value={capexScenarioAssumptions[activeCapexScenario] || ''}
                  onChange={(e) => {
                    setCapexScenarioAssumptions(prev => ({...prev, [activeCapexScenario]: e.target.value}));
                    setHasChanges(true);
                  }}
                  rows="4"
                  className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  placeholder={`e.g., Delaying Building Construction by 2 quarters to improve cash flow. Expected impact on depreciation... Estimated ROI on new IT Infra is 25% over 3 years...`}
                />
              </div>
          </>
        )}
        {activeTab === 'compare' && (
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Compare CAPEX Scenarios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Metric</th>
                    {Object.values(CAPEX_SCENARIOS).map(scenarioName => (
                      <th key={scenarioName} className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">{scenarioName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {['Total Adjusted M1', 'Total Adjusted Q1 (M1-M3)', 'Assumptions / Key Notes'].map(metric => (
                    <tr key={metric} className={metric.includes('Assumptions') ? 'align-top' : ''}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{metric}</td>
                      {Object.values(CAPEX_SCENARIOS).map(scenarioName => {
                        const scenarioTotals = calculateTotalsForScenario(capexData, scenarioName);
                        let value;
                        let className = "text-sm text-sky-700";
                        if (metric === 'Total Adjusted M1') {
                          value = `$${scenarioTotals.month1Adj.toLocaleString()}`;
                          className = "text-sm font-semibold text-sky-800";
                        } else if (metric === 'Total Adjusted Q1 (M1-M3)') {
                           const q1Total = scenarioTotals.month1Adj + scenarioTotals.month2Adj + scenarioTotals.month3Adj;
                           value = `$${q1Total.toLocaleString()}`;
                           className = "text-sm font-semibold text-sky-800";
                        } else if (metric.includes('Assumptions')) {
                            value = capexScenarioAssumptions[scenarioName] || 'N/A';
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
          </div>
        )}
      </div>
      <Tooltip id="ai-tooltip" />
    </div>
  );
};

export default CAPEXForecastScreen;