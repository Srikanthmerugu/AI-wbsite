import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPrinter,
  FiSend,
  FiChevronRight,
  FiChevronLeft,
  FiFilter,
  FiChevronDown,
  FiTable,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

const BalanceSheet = () => {
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    period: "all",
    entity: "all",
    hierarchy: "group",
    customRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  // Sample data for balance sheet
  const balanceSheetData = {
    tableData: [
      { account: "Cash", current: 45000, previous: 38000, change: 18.4 },
      { account: "Accounts Receivable", current: 32000, previous: 28000, change: 14.3 },
      { account: "Inventory", current: 28000, previous: 31000, change: -9.7 },
      { account: "Prepaid Expenses", current: 5000, previous: 4000, change: 25.0 },
      { account: "Total Current Assets", current: 110000, previous: 101000, change: 8.9, isTotal: true },
      
      { account: "Property, Plant & Equipment", current: 60000, previous: 58000, change: 3.4 },
      { account: "Accumulated Depreciation", current: -15000, previous: -12000, change: 25.0 },
      { account: "Net PPE", current: 45000, previous: 46000, change: -2.2 },
      
      { account: "Intangible Assets", current: 30000, previous: 25000, change: 20.0 },
      { account: "Total Assets", current: 185000, previous: 172000, change: 7.6, isTotal: true },
      
      { account: "Accounts Payable", current: 22000, previous: 18000, change: 22.2 },
      { account: "Short-Term Debt", current: 15000, previous: 20000, change: -25.0 },
      { account: "Accrued Liabilities", current: 8000, previous: 7000, change: 14.3 },
      { account: "Total Current Liabilities", current: 45000, previous: 45000, change: 0.0, isTotal: true },
      
      { account: "Long-Term Debt", current: 40000, previous: 33000, change: 21.2 },
      { account: "Total Liabilities", current: 85000, previous: 78000, change: 9.0, isTotal: true },
      
      { account: "Common Stock", current: 20000, previous: 20000, change: 0.0 },
      { account: "Retained Earnings", current: 80000, previous: 74000, change: 8.1 },
      { account: "Total Equity", current: 100000, previous: 94000, change: 6.4, isTotal: true },
      
      { account: "Total Liabilities & Equity", current: 185000, previous: 172000, change: 7.6, isTotal: true },
    ],
    metrics: {
      currentRatio: 2.44,
      quickRatio: 1.71,
      debtToEquity: 0.85,
      workingCapital: 65000,
      insights: [
        "Current ratio of 2.44 indicates strong liquidity position",
        "9% increase in total liabilities due to new equipment financing",
        "Retained earnings grew by 8.1% reflecting profitable operations"
      ]
    }
  };

  const handleDrillDown = (rowData) => {
    setDrillDownData({
      title: `${rowData.account} Details`,
      data: [
        { field: "Current Period", value: `$${rowData.current.toLocaleString()}` },
        { field: "Previous Period", value: `$${rowData.previous.toLocaleString()}` },
        { field: "Change", value: `${rowData.change}%`, isPositive: rowData.change >= 0 }
      ],
      insights: [
        getDrillDownInsight(rowData),
        "Detailed transaction history available upon further drill down"
      ]
    });
  };

  const getDrillDownInsight = (rowData) => {
    if (rowData.change >= 0) {
      return `${rowData.account} increased by ${rowData.change}% from previous period`;
    } else {
      return `${rowData.account} decreased by ${Math.abs(rowData.change)}% from previous period`;
    }
  };

  const renderTable = () => {
    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-sky-100 text-sky-900">
              <th className="px-4 py-2 text-left">Account</th>
              <th className="px-4 py-2 text-right">Current Period</th>
              <th className="px-4 py-2 text-right">Previous Period</th>
              <th className="px-4 py-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {balanceSheetData.tableData.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-sky-200 hover:bg-sky-50 ${row.isTotal ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => !row.isTotal && handleDrillDown(row)}
              >
                <td className="px-4 py-2 font-medium">{row.account}</td>
                <td className="px-4 py-2 text-right">${row.current.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">${row.previous.toLocaleString()}</td>
                <td className={`px-4 py-2 text-right ${row.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {row.change >= 0 ? "+" : ""}{row.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKeyMetrics = () => {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
        <ul className="text-sm text-black space-y-2">
          <li className="flex justify-between items-center">
            <span>Current Ratio:</span>
            <span className="font-medium text-green-600">
              {balanceSheetData.metrics.currentRatio.toFixed(2)}
              <FiTrendingUp className="inline ml-1" />
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Quick Ratio:</span>
            <span className="font-medium text-green-600">
              {balanceSheetData.metrics.quickRatio.toFixed(2)}
              <FiTrendingUp className="inline ml-1" />
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Debt-to-Equity:</span>
            <span className="font-medium text-sky-800">
              {balanceSheetData.metrics.debtToEquity.toFixed(2)}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Working Capital:</span>
            <span className="font-medium text-green-600">
              ${balanceSheetData.metrics.workingCapital.toLocaleString()}
              <FiTrendingUp className="inline ml-1" />
            </span>
          </li>
        </ul>

        {balanceSheetData.metrics.insights && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
              <FiAlertCircle className="mr-1" /> Performance Insights
            </h4>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInsight}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs bg-sky-100 p-3 rounded-lg border border-sky-200"
              >
                {balanceSheetData.metrics.insights[activeInsight]}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  const renderDrillDownView = () => {
    if (!drillDownData) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-sky-900">{drillDownData.title}</h3>
          <button 
            onClick={() => setDrillDownData(null)}
            className="text-sm text-sky-600 hover:text-sky-800"
          >
            Back to Balance Sheet
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Details</h4>
            <table className="w-full text-sm">
              <tbody>
                {drillDownData.data.map((item, index) => (
                  <tr key={index} className="border-b border-sky-100">
                    <td className="py-2 font-medium text-sky-900">{item.field}</td>
                    <td className={`py-2 text-right ${item.isPositive ? "text-green-600" : item.isPositive === false ? "text-red-600" : "text-gray-700"}`}>
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Insights</h4>
            <ul className="space-y-3 text-sm">
              {drillDownData.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-sky-500">
                    <FiAlertCircle className="h-full w-full" />
                  </div>
                  <p className="ml-2 text-gray-700">{insight}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const handleSendAIQuery = () => {
    if (aiInput.trim()) {
      const response = `AI analysis for Balance Sheet: ${aiInput} (This is a mock response showing how AI insights would appear)`;
      setAiHistory(prev => [...prev, { query: aiInput, response }]);
      setAiInput("");
      setShowAIDropdown(false);
    }
  };

  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Rotate insights every 5 seconds
  useEffect(() => {
    if (balanceSheetData.metrics.insights?.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % balanceSheetData.metrics.insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [balanceSheetData.metrics.insights]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Balance Sheet</h1>
            <p className="text-sky-100 text-xs">
              Snapshot of assets, liabilities, and equity
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200"
          >
            <FiDownload className="text-sky-50 hover:text-sky-900" />
            <span className="text-sky-50 hover:text-sky-900">Export</span>
          </button>
        </div>
      </div>

      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link to="/financial-core-reports" className="inline-flex items-center text-sm font-medium text-sky-900 hover:text-blue-600">
              Financial Reports
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Balance Sheet</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                {drillDownData ? drillDownData.title : "Balance Sheet"}
              </h2>
              <p className="text-sky-600 text-sm mb-2">
                {drillDownData ? "Detailed view of selected item" : "Assets, liabilities, and equity as of current period"}
              </p>
            </div>
            <Link to="/financial-core-reports" className="text-sky-500 hover:text-sky-700 mt-1">
              <button
                type="button"
                className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              >
                Back to Reports
                <GrLinkNext className="ml-1 w-4 h-4 hover:w-5 hover:h-5 transition-all" />
              </button>
            </Link>
          </div>
        </div>

        {!drillDownData && (
          <div className="mb-4 flex flex-wrap gap-2 justify-end items-center">
            <div className="flex gap-2">
              <div className="relative" ref={filtersRef}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg px-3 py-2 text-xs"
                >
                  <FiFilter className="mr-2" /> Filter
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-sky-200 p-4 right-0"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">
                            Time Period
                          </label>
                          <select
                            value={filters.period}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                period: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sky-300 rounded text-xs"
                          >
                            <option value="current">Current Period</option>
                            <option value="previous">Previous Period</option>
                            <option value="comparison">Comparison View</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">
                            Entity
                          </label>
                          <select
                            value={filters.entity}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                entity: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sky-300 rounded text-xs"
                          >
                            <option value="all">All Entities</option>
                            <option value="ny">New York Branch</option>
                            <option value="sf">San Francisco Branch</option>
                            <option value="tx">Texas Branch</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">
                            Hierarchy
                          </label>
                          <select
                            value={filters.hierarchy}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                hierarchy: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sky-300 rounded text-xs"
                          >
                            <option value="group">Group Level</option>
                            <option value="department">Department Level</option>
                            <option value="location">Location Level</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-2">
              <CSVLink
                data={balanceSheetData.tableData}
                filename={"balance-sheet.csv"}
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
                  onClick={() => setShowAIDropdown(true)}
                  className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs"
                >
                  <BsStars className="mr-1" /> Ask AI
                </button>

                {showAIDropdown && (
                  <motion.div
                    ref={aiChatbotRef}
                    className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h1 className="text-sm font-semibold text-sky-900 mb-2">
                      Ask about Balance Sheet
                    </h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask AI about this report..."
                        className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={handleSendAIQuery}
                        className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                        disabled={!aiInput.trim()}
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                    {aiHistory.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-sky-700">
                        {aiHistory.map((entry, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{!drillDownData && renderKeyMetrics()}</div>
          <div>
            <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-200">
              <h3 className="text-sm font-semibold text-sky-900 mb-3">
                Quick Analysis
              </h3>
              <div className="text-xs text-sky-700 space-y-3">
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3 bg-green-100 text-green-700">
                    <FiTrendingUp size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Assets Growth</p>
                    <p className="text-black">
                      Total assets increased by 7.6% compared to previous period
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700">
                    <FiAlertCircle size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Liquidity Position</p>
                    <p className="text-black">
                      Current ratio of 2.44 indicates strong ability to cover short-term obligations
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3 bg-purple-100 text-purple-700">
                    <FiTable size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Debt Management</p>
                    <p className="text-black">
                      Debt-to-equity ratio of 0.85 shows balanced capital structure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;