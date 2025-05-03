import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  FiDownload,
  FiPrinter,
  FiSend,
  FiChevronRight,
  FiChevronLeft,
  FiFilter
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { CSVLink } from 'react-csv';

// Embedded Sample Data (same as your original file)
const sampleData = {
  pnl: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Actual',
        data: [12000, 19000, 15000, 18000, 22000, 24000],
        backgroundColor: 'rgba(0, 120, 201, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Budget',
        data: [15000, 15000, 17000, 20000, 21000, 23000],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Forecast',
        data: [13000, 17000, 16000, 19000, 23000, 25000],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
    tableData: [
      { month: 'Jan', Actual: 12000, Budget: 15000, Forecast: 13000 },
      { month: 'Feb', Actual: 19000, Budget: 15000, Forecast: 17000 },
      { month: 'Mar', Actual: 15000, Budget: 17000, Forecast: 16000 },
      { month: 'Apr', Actual: 18000, Budget: 20000, Forecast: 19000 },
      { month: 'May', Actual: 22000, Budget: 21000, Forecast: 23000 },
      { month: 'Jun', Actual: 24000, Budget: 23000, Forecast: 25000 },
    ],
    metrics: {
      totalActual: 100000,
      totalBudget: 101000,
      variance: -1000,
    },
  },
  balanceSheet: {
    labels: ['Cash', 'A/R', 'Inventory', 'Assets', 'A/P', 'Liabilities', 'Equity'],
    datasets: [
      {
        label: 'Current',
        data: [45000, 32000, 28000, 185000, 22000, 85000, 100000],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Previous',
        data: [38000, 28000, 31000, 172000, 18000, 78000, 94000],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
    tableData: [
      { account: 'Cash', current: 45000, previous: 38000, },
      { account: 'Accounts Receivable', current: 32000, previous: 28000,  },
      { account: 'Inventory', current: 28000, previous: 31000,  },
      { account: 'Total Assets', current: 185000, previous: 172000,  },
      { account: 'Accounts Payable', current: 22000, previous: 18000,  },
      { account: 'Total Liabilities', current: 85000, previous: 78000,  },
      { account: 'Retained Earnings', current: 100000, previous: 94000,  },
    ],
    metrics: {
      totalAssets: 185000,
      totalLiabilities: 85000,
      netEquity: 100000,
    },
  },
  cashFlow: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Operational',
        data: [5000, 6000, 7000, 8000, 9000, 10000],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Investing',
        data: [-2000, -1500, -1000, -500, 0, -200],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Financing',
        data: [3000, 2500, 2000, 1500, 1000, 800],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
    tableData: [
      { month: 'Jan', Operational: 5000, Investing: -2000, Financing: 3000 },
      { month: 'Feb', Operational: 6000, Investing: -1500, Financing: 2500 },
      { month: 'Mar', Operational: 7000, Investing: -1000, Financing: 2000 },
      { month: 'Apr', Operational: 8000, Investing: -500, Financing: 1500 },
      { month: 'May', Operational: 9000, Investing: 0, Financing: 1000 },
      { month: 'Jun', Operational: 10000, Investing: -200, Financing: 800 },
    ],
    metrics: {
      netCashFlow: 42000,
      operationalTotal: 41000,
    },
  },
  arAging: {
    labels: ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days'],
    datasets: [
      {
        data: [45000, 12000, 8000, 5000, 3000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
      },
    ],
    tableData: [
      { category: 'Current', amount: 45000 },
      { category: '1-30 days', amount: 12000 },
      { category: '31-60 days', amount: 8000 },
      { category: '61-90 days', amount: 5000 },
      { category: '90+ days', amount: 3000 },
    ],
    metrics: {
      totalReceivables: 73000,
      overdue: 28000,
    },
  },
  apAging: {
    labels: ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days'],
    datasets: [
      {
        data: [35000, 10000, 6000, 4000, 2000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
      },
    ],
    tableData: [
      { category: 'Current', amount: 35000 },
      { category: '1-30 days', amount: 10000 },
      { category: '31-60 days', amount: 6000 },
      { category: '61-90 days', amount: 4000 },
      { category: '90+ days', amount: 2000 },
    ],
    metrics: {
      totalPayables: 57000,
      overdue: 22000,
    },
  },
  budgetVsActuals: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Actual',
        data: [12000, 19000, 15000, 18000, 22000, 24000],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Budget',
        data: [15000, 15000, 17000, 20000, 21000, 23000],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
    tableData: [
      { month: 'Jan', Actual: 12000, Budget: 15000 },
      { month: 'Feb', Actual: 19000, Budget: 15000 },
      { month: 'Mar', Actual: 15000, Budget: 17000 },
      { month: 'Apr', Actual: 18000, Budget: 20000 },
      { month: 'May', Actual: 22000, Budget: 21000 },
      { month: 'Jun', Actual: 24000, Budget: 23000 },
    ],
    metrics: {
      totalActual: 100000,
      totalBudget: 101000,
      variance: -1000,
    },
  },
  financialRatios: {
    labels: ['Current Ratio', 'Debt-to-Equity', 'ROE', 'Gross Margin'],
    datasets: [
      {
        label: 'Value',
        data: [2.5, 0.8, 18, 35],
      },
      {
        label: 'Benchmark',
        data: [1.5, 1.0, 15, 30],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
    tableData: [
      { ratio: 'Current Ratio', value: 2.5, benchmark: 1.5,  },
      { ratio: 'Debt-to-Equity', value: 0.8, benchmark: 1.0,  },
      { ratio: 'ROE', value: 18, benchmark: 15,  },
      { ratio: 'Gross Margin', value: 35, benchmark: 30,  },
    ],
    metrics: {
      averageRatio: 2.5,
    },
  },
  departmental: {
    labels: ['Sales', 'Marketing', 'Operations', 'R&D', 'HR'],
    datasets: [
      {
        label: 'Cost',
        data: [50000, 30000, 40000, 25000, 20000],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Profit',
        data: [20000, 15000, 18000, 12000, 10000],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
    tableData: [
      { department: 'Sales', cost: 50000, profit: 20000 },
      { department: 'Marketing', cost: 30000, profit: 15000 },
      { department: 'Operations', cost: 40000, profit: 18000 },
      { department: 'R&D', cost: 25000, profit: 12000 },
      { department: 'HR', cost: 20000, profit: 10000 },
    ],
    metrics: {
      totalCost: 165000,
      totalProfit: 75000,
    },
  },
  custom1: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [50000, 55000, 60000, 65000],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: [30000, 32000, 34000, 36000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: true,
      },
    ],
    tableData: [
      { quarter: 'Q1', Revenue: 50000, Expenses: 30000 },
      { quarter: 'Q2', Revenue: 55000, Expenses: 32000 },
      { quarter: 'Q3', Revenue: 60000, Expenses: 34000 },
      { quarter: 'Q4', Revenue: 65000, Expenses: 36000 },
    ],
    metrics: {
      totalRevenue: 230000,
      totalExpenses: 132000,
    },
  },
  custom2: {
    labels: ['Region A', 'Region B', 'Region C'],
    datasets: [
      {
        data: [40000, 35000, 30000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
      },
    ],
    tableData: [
      { region: 'Region A', amount: 40000 },
      { region: 'Region B', amount: 35000 },
      { region: 'Region C', amount: 30000 },
    ],
    metrics: {
      totalSales: 105000,
    },
  },
};

const reports = [
  { id: 'pnl', title: 'Profit & Loss Statement', desc: 'Actual vs. Budget vs. Forecast' },
  { id: 'balanceSheet', title: 'Balance Sheet', desc: 'Assets, Liabilities, and Equity Summary' },
  { id: 'cashFlow', title: 'Cash Flow Statement', desc: 'Operational, Investing, and Financing Cash Flow' },
  { id: 'arAging', title: 'AR Aging Reports', desc: 'Overdue Receivables Breakdown' },
  { id: 'apAging', title: 'AP Aging Reports', desc: 'Overdue Payments Breakdown' },
  { id: 'budgetVsActuals', title: 'Budget vs. Actuals', desc: 'Variance Analysis & Cost Overruns' },
  { id: 'financialRatios', title: 'Financial Ratio Analysis', desc: 'Liquidity, Profitability, and Efficiency Ratios' },
  { id: 'departmental', title: 'Departmental Performance Reports', desc: 'Cost Centers, P&L by Business Unit' },
  { id: 'custom1', title: 'Custom Revenue Report', desc: 'Revenue vs. Expenses by Quarter' },
  { id: 'custom2', title: 'Regional Sales Report', desc: 'Sales by Region' },
];

const FinancialReports = () => {
  const [selectedReport, setSelectedReport] = useState('pnl');
  const [aiInputs, setAiInputs] = useState({});
  const [aiHistory, setAiHistory] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    period: 'Current Month',
    entity: 'All Entities',
    hierarchy: 'Group Level'
  });

  const data = sampleData[selectedReport];
  const currentReport = reports.find(r => r.id === selectedReport);

  const handleSendAIQuery = () => {
    const input = aiInputs[selectedReport] || '';
    if (input.trim()) {
      const response = `AI Insight for ${selectedReport}: ${input} (mock insight)`;
      setAiHistory((prev) => ({ ...prev, [selectedReport]: [...(prev[selectedReport] || []), { query: input, response }] }));
      setAiInputs((prev) => ({ ...prev, [selectedReport]: '' }));
      setShowAIDropdown(null);
    }
  };

  const handleDrillDown = (rowData) => {
    setDrillDownData({
      title: ` ${Object.values(rowData)[0]}`,
      data: Object.entries(rowData).map(([key, value]) => ({
        field: key,
        value: typeof value === 'number' ? `$${value.toLocaleString()}` : value
      }))
    });
  };

  const renderTable = () => {
    if (!data || !data.tableData) return <p>No data available</p>;
    
    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100 h-56">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-sky-100 text-sky-900">
              {Object.keys(data.tableData[0]).map((key) => (
                <th key={key} className="px-2 py-1 text-left capitalize">{key}</th>
              ))}
              <th className="px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, index) => (
              <tr key={index} className="border-b border-sky-200 hover:bg-sky-50">
                {Object.entries(row).map(([key, value], i) => (
                  <td key={i} className="px-2 py-1 text-black">
                    {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                  </td>
                ))}
                <td className="px-2 py-1">
                  <button 
                    onClick={() => handleDrillDown(row)}
                    className="text-sky-600 hover:text-sky-800 text-xs flex items-center"
                  >
                    View in detail <FiChevronRight className="ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDrillDownView = () => {
    return (
      <div className="bg-white/50 rounded-lg border border-sky-100 p-4 h-96">
        <div className="flex justify-end items-center mb-4">
          <button 
            onClick={() => setDrillDownData(null)}
            className="flex items-center text-sky-600 hover:text-sky-800 text-xs"
          >
            <FiChevronLeft className="mr-1" /> Back to Report
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-sky-100 text-sky-800">
              <th className="px-2 py-1 text-left">Field</th>
              <th className="px-2 py-1 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {drillDownData.data.map((item, index) => (
              <tr key={index} className="border-b border-sky-200">
                <td className="px-2 py-1 text-black capitalize">{item.field}</td>
                <td className="px-2 py-1 text-black">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const aiChatbotRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        aiChatbotRef.current &&
        !aiChatbotRef.current.contains(event.target)
      ) {
        setShowAIDropdown(null);
      }
    };
  
    if (showAIDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAIDropdown]);
  

  // Render AI Dropdown for the current report
  const renderAIDropdown = () => {
    if (showAIDropdown !== selectedReport) return null;
    
    return (
      <div
        ref={aiChatbotRef}
      >
        {aiHistory[selectedReport]?.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-sky-700">
            {aiHistory[selectedReport].map((entry, index) => (
              <div key={index}>
                <strong>Q:</strong> {entry.query}
                <br />
                <strong>A:</strong> {entry.response}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <h1 className="text-lg font-bold text-white">Financial Reports</h1>
        <p className="text-sky-100 text-xs">Discover actionable financial insights</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-1/4 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-sky-800 text-md font-semibold mb-4">Reports</h2>
          <ul className="space-y-2">
            {reports.map((r) => (
              <li
                key={r.id}
                onClick={() => {
                  setSelectedReport(r.id);
                  setDrillDownData(null);
                }}
                className={`px-3 py-2 rounded-md text-sm cursor-pointer transition ${
                  selectedReport === r.id ? 'bg-sky-100 text-sky-800 font-semibold' : 'text-sky-700 hover:bg-sky-50'
                }`}
              >
                {r.title}
              </li>
            ))}
          </ul>
        </aside>

        <main className="w-3/4 bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-sky-900">
              {drillDownData ? drillDownData.title : currentReport?.title}
            </h2>
            <p className="text-sky-600 text-sm mb-2">
              {drillDownData ? 'Detailed view of selected item' : currentReport?.desc}
            </p>
          </div>

          {!drillDownData && (
            <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <div className="flex items-center bg-sky-100 rounded-lg px-3 py-1">
                  <FiFilter className="mr-2 text-sky-600" />
                  <select 
                    value={filters.period}
                    onChange={(e) => handleFilterChange('period', e.target.value)}
                    className="bg-transparent text-sky-800 text-xs border-none focus:ring-0"
                  >
                    <option>Current Month</option>
                    <option>Last Month</option>
                    <option>Quarter to Date</option>
                    <option>Year to Date</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
            
              {/* Moved Buttons */}
              <div className="flex gap-2">
                <CSVLink
                  data={data.tableData || []}
                  filename={`${selectedReport}.csv`}
                  className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200"
                >
                  <FiDownload className="mr-1" /> CSV
                </CSVLink>
                <button
                  onClick={() => window.print()}
                  className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200"
                >
                  <FiPrinter className="mr-1" /> Print
                </button>
                <div className="relative">
  <button
    onClick={() => setShowAIDropdown(selectedReport)}
    className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs"
  >
    <BsStars className="mr-1" /> Ask AI
  </button>

  {showAIDropdown === selectedReport && currentReport && (
    <motion.div
      ref={aiChatbotRef}
      className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <h1 className="text-sm font-semibold text-sky-900 mb-2">
        Ask about {currentReport.title}
      </h1>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={aiInputs[selectedReport] || ''}
          onChange={(e) =>
            setAiInputs((prev) => ({
              ...prev,
              [selectedReport]: e.target.value,
            }))
          }
          placeholder="Ask AI about this report..."
          className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSendAIQuery();
          }}
          className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          disabled={!aiInputs[selectedReport]?.trim()}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
      {aiHistory[selectedReport]?.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-sky-700">
          {aiHistory[selectedReport].map((entry, index) => (
            <div key={index}>
              <strong>Q:</strong> {entry.query}
              <br />
              <strong>A:</strong> {entry.response}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )}
</div>

              </div>
            </div>
          )}

          <div className="mb-6">
            {drillDownData ? renderDrillDownView() : renderTable()}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              {!drillDownData && (
                <>
                  <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
                  <ul className="text-sm text-black space-y-1">
                    {Object.entries(data.metrics || {}).map(([key, val]) => (
                      <li key={key} className="flex justify-between">
                        <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <span className="font-medium">
                          {typeof val === 'number' ? `$${val.toLocaleString()}` : val}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Render AI Dropdown */}
          {renderAIDropdown()}
        </main>
      </div>
    </div>
  );
};

export default FinancialReports;