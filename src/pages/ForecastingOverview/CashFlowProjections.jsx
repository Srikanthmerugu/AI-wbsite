
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'react-apexcharts';
import * as XLSX from 'xlsx';
import { FiDownload, FiInfo, FiTrendingUp, FiEdit2, FiDollarSign, FiBarChart2, FiPrinter, FiSave, FiUpload, FiSend } from "react-icons/fi";
import { BsStars, BsFilter as BsFilterIcon } from 'react-icons/bs';
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Renamed to avoid conflict

// Helper for currency formatting
const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const CASH_FLOW_SCENARIOS = {
  BASELINE: "Baseline Liquidity",
  OPTIMISTIC: "Optimistic Cash Inflow",
  PESSIMISTIC: "Conservative Cash Flow",
};

const initialCashFlowDataByScenario = {
  [CASH_FLOW_SCENARIOS.BASELINE]: {
    '30d': { ai: { min: 11000, expected: 12000, max: 13000 }, user: 12000 },
    '60d': { ai: { min: 23000, expected: 25000, max: 27000 }, user: 25000 },
    '90d': { ai: { min: 38000, expected: 40000, max: 42000 }, user: 40000 }
  },
  [CASH_FLOW_SCENARIOS.OPTIMISTIC]: {
    '30d': { ai: { min: 14000, expected: 15000, max: 17000 }, user: 15000 },
    '60d': { ai: { min: 28000, expected: 30000, max: 33000 }, user: 30000 },
    '90d': { ai: { min: 48000, expected: 50000, max: 55000 }, user: 50000 }
  },
  [CASH_FLOW_SCENARIOS.PESSIMISTIC]: {
    '30d': { ai: { min: 7000, expected: 8000, max: 9000 }, user: 8000 },
    '60d': { ai: { min: 15000, expected: 18000, max: 20000 }, user: 18000 },
    '90d': { ai: { min: 28000, expected: 30000, max: 33000 }, user: 30000 }
  }
};


const CashFlowProjections = () => {
  const [activeActionTab, setActiveActionTab] = useState("create");
  const [activeScenario, setActiveScenario] = useState(CASH_FLOW_SCENARIOS.BASELINE);
  const [cashFlowData, setCashFlowData] = useState(JSON.parse(JSON.stringify(initialCashFlowDataByScenario)));
  const [scenarioAssumptions, setScenarioAssumptions] = useState({
    [CASH_FLOW_SCENARIOS.BASELINE]: "Assumes standard collection (30 days) and payment (45 days) cycles. Stable operational cash flow.",
    [CASH_FLOW_SCENARIOS.OPTIMISTIC]: "Accelerated receivables (e.g., 20 days) and extended payables (e.g., 60 days). Potential for early payments from key clients.",
    [CASH_FLOW_SCENARIOS.PESSIMISTIC]: "Delayed receivables (e.g., 45 days) and early payables (e.g., 30 days). Considers potential for payment defaults.",
  });

  const [paymentTerms, setPaymentTerms] = useState({ receivables: 30, payables: 45 });
  const [hasChanges, setHasChanges] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null); // For potential future filters

  // Reset user adjustments when scenario changes, to reflect the new scenario's AI baseline
  // This is important if AI values are truly distinct per scenario.
  useEffect(() => {
    // If you want to reset USER values when scenario changes:
    // setCashFlowData(prev => ({
    //   ...prev,
    //   [activeScenario]: JSON.parse(JSON.stringify(initialCashFlowDataByScenario[activeScenario]))
    // }));
    // For now, user values persist across scenario changes unless explicitly reset by another logic.
  }, [activeScenario]);


  const currentScenarioData = cashFlowData[activeScenario] || initialCashFlowDataByScenario[CASH_FLOW_SCENARIOS.BASELINE]; // Fallback

  const bankBalanceDataSeries = useMemo(() => {
    // This is a simplified mapping. A real system would have more complex logic or API calls.
    const baseSeries = {
        min: [25000, 22000, 28000, 35000],
        projected: [25000, 32000, 45000, 60000],
        max: [25000, 38000, 55000, 75000],
    };
    if (activeScenario === CASH_FLOW_SCENARIOS.OPTIMISTIC) {
        return [
            { name: 'Min Balance (AI)', data: baseSeries.min.map(v => v * 1.2) },
            { name: 'Projected Balance (AI)', data: baseSeries.projected.map(v => v * 1.3) },
            { name: 'Max Balance (AI)', data: baseSeries.max.map(v => v * 1.4) },
        ];
    }
    if (activeScenario === CASH_FLOW_SCENARIOS.PESSIMISTIC) {
        return [
            { name: 'Min Balance (AI)', data: baseSeries.min.map(v => v * 0.8) },
            { name: 'Projected Balance (AI)', data: baseSeries.projected.map(v => v * 0.7) },
            { name: 'Max Balance (AI)', data: baseSeries.max.map(v => v * 0.6) },
        ];
    }
    return [ // Baseline
        { name: 'Min Balance (AI)', data: baseSeries.min },
        { name: 'Projected Balance (AI)', data: baseSeries.projected },
        { name: 'Max Balance (AI)', data: baseSeries.max },
    ];
  }, [activeScenario]);

  const bankBalanceChartOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: false } },
    colors: ['#FBBF24', '#3B82F6', '#10B981'], // Amber, Blue, Green (Min, Projected, Max)
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: ['Current', '30 Days', '60 Days', '90 Days'], labels: { style: { colors: '#6B7280' }}},
    yaxis: { labels: { formatter: (val) => formatCurrency(val) } },
    tooltip: { y: { formatter: (val) => formatCurrency(val) } },
    legend: { position: 'top' }
  };

  const debtSchedule = [
    { name: 'Term Loan A', balance: 125000, nextPayment: '2025-04-15', amount: 4500, rate: '5.25%' },
    { name: 'Line of Credit', balance: 75000, nextPayment: '2025-03-30', amount: 1800, rate: '7.10%' },
    { name: 'Equipment Financing', balance: 62000, nextPayment: '2025-04-05', amount: 3200, rate: '6.50%' }
  ];

  const handleTermChange = (type, days) => {
    setPaymentTerms(prev => ({ ...prev, [type]: parseInt(days) }));
    // Here, you might trigger an AI recalculation based on new terms
    // For demo: console.log or a slight optimistic/pessimistic tweak to AI values
    setHasChanges(true); // Simulating that changing terms is a change to be saved
    // alert(`Payment terms for ${type} updated. AI Projections would ideally re-evaluate.`);
  };

  const handleUserAdjustmentChange = (period, value) => {
    const numericValue = parseFloat(value); // Keep as number, or specific logic if '' means 0
    setCashFlowData(prev => ({
      ...prev,
      [activeScenario]: {
        ...prev[activeScenario],
        [period]: {
          ...prev[activeScenario][period],
          user: isNaN(numericValue) ? '' : numericValue // Allow empty string to clear, else store number
        }
      }
    }));
    if (!hasChanges) setHasChanges(true);
  };

  const aiVsUserProjectionChartOptions = { /* ... same as before ... */
    chart: { type: 'bar', toolbar: { show: false }, height: 350 },
    colors: ['#3B82F6', '#10B981'], 
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val) => formatCurrency(val), offsetY: -20, style: { fontSize: '10px', colors: ["#304758"] }},
    xaxis: { categories: ['30 Days', '60 Days', '90 Days'], labels: { style: { colors: '#6B7280', fontSize: '12px' } }},
    yaxis: { labels: { formatter: (val) => formatCurrency(val) }, title: { text: 'Cash Flow Amount', style: { color: '#6B7280', fontSize: '11px' }}},
    tooltip: { y: { formatter: (val) => formatCurrency(val) } },
    legend: { position: 'top', fontSize: '12px' }
  };

  const aiVsUserProjectionChartSeries = useMemo(() => [
    { name: 'AI Expected', data: [
        currentScenarioData['30d'].ai.expected, currentScenarioData['60d'].ai.expected, currentScenarioData['90d'].ai.expected
      ] 
    },
    { name: 'User Adjusted', data: [
        currentScenarioData['30d'].user, currentScenarioData['60d'].user, currentScenarioData['90d'].user
      ] 
    }
  ], [currentScenarioData]);

  const handleSaveAll = () => {
    console.log("Saving cash flow scenarios:", cashFlowData, scenarioAssumptions, paymentTerms);
    // Potentially save to versions or backend
    setHasChanges(false);
    alert("Cash flow scenarios and assumptions saved!");
  };

  const handleExport = () => {
    const dataToExport = [];
    dataToExport.push([`Cash Flow Projections - Scenario: ${activeScenario}`]);
    dataToExport.push([`Assumptions: ${scenarioAssumptions[activeScenario] || 'N/A'}`]);
    dataToExport.push([`Payment Terms: A/R ${paymentTerms.receivables} days, A/P ${paymentTerms.payables} days`]);
    dataToExport.push([]); // Spacer

    dataToExport.push(['Period', 'AI Min', 'AI Expected', 'AI Max', 'Your Adjusted Expected']);
    ['30d', '60d', '90d'].forEach(period => {
        const data = currentScenarioData[period];
        dataToExport.push([
            period.replace('d', ' Days'),
            data.ai.min, data.ai.expected, data.ai.max, data.user
        ]);
    });
    dataToExport.push([]); // Spacer
    dataToExport.push(['Debt Schedule']);
    dataToExport.push(['Loan', 'Balance', 'Next Payment', 'Amount', 'Rate', '90d Impact']);
    debtSchedule.forEach(debt => {
        dataToExport.push([debt.name, debt.balance, debt.nextPayment, debt.amount, debt.rate, debt.amount * 3]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cash Flow Projection");
    XLSX.writeFile(workbook, `CashFlow_${activeScenario.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImport = () => alert("Import functionality placeholder for Cash Flow.");

  useEffect(() => { /* Click outside handler for AI dropdown */
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSendAIQuery = (widgetId) => { /* Placeholder */ console.log(`AI Query for ${widgetId}: ${aiInput}`); setAiInput(''); setShowAIDropdown(null); };

  const firstHeaderRowHeight = "2.5rem";


  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiTrendingUp className="mr-2" />Cash Flow Projections</h1>
            <p className="text-sky-100 text-xs">AI-driven liquidity predictions, scenario modeling, and user adjustments.</p>
          </div>
          <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50">
            <FiPrinter /> Export
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-gray-200 mb-6 pb-3">
        {['create', 'import', 'compare'].map(tabId => (
          <button key={tabId} className={`py-2 px-4 font-medium text-sm ${activeActionTab === tabId ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-t-lg' : 'text-sky-900 hover:text-sky-500 hover:bg-sky-100 rounded-t-lg'}`} onClick={() => setActiveActionTab(tabId)}>
            {tabId === 'create' ? 'Create/Edit' : tabId === 'import' ? 'Import Data' : 'Compare Scenarios'}
          </button>
        ))}
        <div className="ml-4">
            <label htmlFor="cashflowScenarioSelectTab" className="text-sm font-medium text-sky-800 mr-2">Active Scenario:</label>
            <select id="cashflowScenarioSelectTab" value={activeScenario}
              onChange={(e) => {
                if (hasChanges && !window.confirm("Unsaved changes. Switch scenario anyway?")) {
                    e.target.value = activeScenario; return;
                }
                setActiveScenario(e.target.value); setHasChanges(false);
              }}
              className="p-1.5 border border-sky-300 bg-white text-sky-900 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
            >
                {Object.values(CASH_FLOW_SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
        </div>
        {/* Placeholder for future filters button */}
        {/* <div className="relative ml-auto" ref={filtersRef}> ... </div> */}
      </div>
      
      {activeActionTab === "create" && (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-sky-800 mb-3">Payment Terms Simulation</h3>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Avg. Receivables Collection (Days)</label>
                        <input type="range" min="0" max="90" step="5" value={paymentTerms.receivables} onChange={(e) => handleTermChange('receivables', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                        <div className="text-sm font-medium text-blue-600 mt-1">{paymentTerms.receivables} days</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Avg. Payables Payment (Days)</label>
                        <input type="range" min="0" max="90" step="5" value={paymentTerms.payables} onChange={(e) => handleTermChange('payables', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"/>
                        <div className="text-sm font-medium text-amber-600 mt-1">{paymentTerms.payables} days</div>
                    </div>
                    <p className="text-xs text-gray-500 italic"><FiInfo className="inline mr-1 mb-0.5"/>Adjusting terms simulates impact on cash flow timing.</p>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-lg font-semibold text-sky-800">Bank Balance Forecast (AI)</h2>
                        <button onClick={() => setShowAIDropdown(showAIDropdown === 'bankBalance' ? null : 'bankBalance')} className="p-1 rounded hover:bg-sky-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Ask AI about balance drivers">
                            <BsStars className="text-blue-500" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Scenario: <span className="font-semibold">{activeScenario}</span></p>
                    {showAIDropdown === 'bankBalance' && ( <div ref={aiChatbotRef} className="absolute right-6 top-16 mt-2 w-64 bg-white rounded-md shadow-lg z-30 border border-gray-200 p-3"><p className="text-xs text-gray-600 mb-2">e.g., "Why the dip in 60d balance?"</p><div className="flex items-center"><input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1.5 border border-gray-300 rounded-l text-xs" /><button onClick={() => handleSendAIQuery('bankBalance')} className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"><FiSend size={14}/></button></div></div>)}
                    <div className="h-[260px]"> {/* Adjusted height */}
                        <Chart options={bankBalanceChartOptions} series={bankBalanceDataSeries} type="area" height="100%" />
                    </div>
                </div>
            </div>
            
            

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">30/60/90 Day Cash Flow: AI vs. User Adjusted</h2>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <button onClick={handleExport} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-1.5"/>Export Scenario</button>
                        <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-3 py-1.5 text-xs rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-1.5"/>Save All</button>
                    </div>
                </div>
                
                <div className="overflow-x-auto mb-6 max-h-[300px] relative"> {/* Added max-h and relative */}
                    <table className="min-w-full divide-y divide-sky-100">
                        <thead className="bg-sky-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-sky-900 uppercase tracking-wider sticky left-0 bg-sky-50 z-20 min-w-[100px]">Period</th>
                            <th className="px-3 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[120px]">AI Min</th>
                            <th className="px-3 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[120px]">AI Expected</th>
                            <th className="px-3 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider min-w-[120px]">AI Max</th>
                            <th className="px-3 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wider min-w-[180px]">Your Adjusted Expected</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-sky-100">
                        {['30d', '60d', '90d'].map((periodKey, rowIndex) => {
                            const data = currentScenarioData[periodKey];
                            const periodLabel = periodKey.replace('d', ' Days');
                            const rowBgClass = rowIndex % 2 === 0 ? "bg-white" : "bg-sky-50/50";
                            return (
                            <tr key={periodKey} className={`${rowBgClass} hover:bg-sky-100/40`}>
                                <td className={`px-3 py-3 whitespace-nowrap text-sm font-medium text-sky-900 sticky left-0 z-[5] ${rowBgClass}`}>{periodLabel}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(data.ai.min)}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">{formatCurrency(data.ai.expected)}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(data.ai.max)}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-right">
                                <input type="number" value={data.user} onChange={(e) => handleUserAdjustmentChange(periodKey, e.target.value)}
                                    className="w-32 p-1.5 border border-sky-300 rounded-md text-sm text-right focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/>
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-1 flex items-center"><FiBarChart2 className="mr-2 text-sky-600"/>Adjusted vs. AI Expected Chart</h3>
                    <div className="h-[280px]"> {/* Adjusted height */}
                      <Chart options={aiVsUserProjectionChartOptions} series={aiVsUserProjectionChartSeries} type="bar" height="100%" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Debt & Loan Repayment Analysis</h2>
                <div className="overflow-x-auto max-h-[250px]"> {/* Added max-h for scroll on smaller screens */}
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 min-w-[150px]">Loan</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Balance</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Next Pmt Date</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Pmt Amount</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Rate</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">90d Impact</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {debtSchedule.map((debt, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50/50'}>
                            <td className={`px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 z-[5] ${index % 2 === 0 ? 'bg-white' : 'bg-sky-50/50'}`}>{debt.name}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(debt.balance)}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{debt.nextPayment}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(debt.amount)}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{debt.rate}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-right">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${debt.amount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {debt.amount > 0 ? '-' : ''}{formatCurrency(debt.amount * 3)}
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <p className="text-xs text-gray-500 mt-3 italic"><FiDollarSign className="inline mr-1 mb-0.5"/> Estimated cash outflow from debt over 90 days.</p>
            </div>
            <div className="mb-6 mt-6 p-4 bg-sky-100/70 rounded-lg shadow-sm border border-sky-200">
                <label htmlFor="cashflowScenarioAssumptionsText" className="block text-md font-semibold text-sky-800 mb-2">
                  Scenario Assumptions for: <span className="font-bold">{activeScenario}</span>
                </label>
                <textarea id="cashflowScenarioAssumptionsText" value={scenarioAssumptions[activeScenario] || ''}
                  onChange={(e) => { setScenarioAssumptions(prev => ({...prev, [activeScenario]: e.target.value})); setHasChanges(true); }}
                  rows="3" className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder={`Detail key assumptions for ${activeScenario}: customer payment behaviors, major expected inflows/outflows, credit line usage...`}
                />
            </div>
        </>
      )}
      {activeActionTab === "import" && ( /* Placeholder Import Tab */
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Cash Flow Data for <span className="font-bold">{activeScenario}</span></h2>
          <p className="text-sky-700 mb-4">Upload an Excel file. Data will be imported into the currently selected scenario. Ensure columns match the expected format.</p>
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center w-max">
            <FiUpload className="mr-2" /> Choose File to Import
            <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
          </label>
        </div>
      )}
      {activeActionTab === "compare" && ( /* Placeholder Compare Tab */
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-6">Compare Cash Flow Scenarios</h2>
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Metric</th>
                    {Object.values(CASH_FLOW_SCENARIOS).map(scenarioName => (
                      <th key={scenarioName} className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">{scenarioName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {['90-Day Adjusted Cash Flow', 'Key Assumptions'].map(metric => (
                    <tr key={metric} className={metric.includes('Assumptions') ? 'align-top' : ''}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{metric}</td>
                      {Object.values(CASH_FLOW_SCENARIOS).map(scenarioName => {
                        const scenarioData = cashFlowData[scenarioName] || initialCashFlowDataByScenario[CASH_FLOW_SCENARIOS.BASELINE];
                        let value;
                        let className = "text-sm text-sky-700";
                        if (metric === '90-Day Adjusted Cash Flow') {
                          value = formatCurrency(scenarioData['90d'].user);
                          className = "text-sm font-semibold text-sky-800";
                        } else if (metric.includes('Assumptions')) {
                            value = scenarioAssumptions[scenarioName] || 'N/A';
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
      <ReactTooltip id="ai-tooltip" />
    </div>
  );
};

export default CashFlowProjections;