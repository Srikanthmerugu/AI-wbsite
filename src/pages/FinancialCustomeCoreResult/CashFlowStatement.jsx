import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPrinter,
  FiSend,
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

const CashFlowStatement = () => {
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    period: "quarterly",
    entity: "all",
    view: "summary",
    customRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  // Sample data for cash flow statement
  const cashFlowData = {
    quarterly: {
      tableData: [
        { category: "Operating Activities", Q1: 5000, Q2: 6000, Q3: 7000, Q4: 8000, isHeader: true },
        { category: "Net Income", Q1: 3200, Q2: 5600, Q3: 8000, Q4: 10400 },
        { category: "Depreciation", Q1: 800, Q2: 800, Q3: 800, Q4: 800 },
        { category: "Accounts Receivable", Q1: -500, Q2: -600, Q3: -700, Q4: -800 },
        { category: "Accounts Payable", Q1: 500, Q2: 600, Q3: 700, Q4: 800 },
        { category: "Other Operating Activities", Q1: 1000, Q2: 600, Q3: 200, Q4: -400 },
        { category: "Net Cash from Operations", Q1: 5000, Q2: 6000, Q3: 7000, Q4: 8000, isTotal: true },
        
        { category: "Investing Activities", Q1: -2000, Q2: -1500, Q3: -1000, Q4: -500, isHeader: true },
        { category: "Capital Expenditures", Q1: -1500, Q2: -1000, Q3: -500, Q4: 0 },
        { category: "Investments", Q1: -500, Q2: -500, Q3: -500, Q4: -500 },
        { category: "Net Cash from Investing", Q1: -2000, Q2: -1500, Q3: -1000, Q4: -500, isTotal: true },
        
        { category: "Financing Activities", Q1: 3000, Q2: 2500, Q3: 2000, Q4: 1500, isHeader: true },
        { category: "Debt Issued", Q1: 2000, Q2: 1500, Q3: 1000, Q4: 500 },
        { category: "Debt Repaid", Q1: -500, Q2: -500, Q3: -500, Q4: -500 },
        { category: "Dividends Paid", Q1: -500, Q2: -500, Q3: -500, Q4: -500 },
        { category: "Net Cash from Financing", Q1: 3000, Q2: 2500, Q3: 2000, Q4: 1500, isTotal: true },
        
        { category: "Net Change in Cash", Q1: 6000, Q2: 7000, Q3: 8000, Q4: 9000, isTotal: true, isGrandTotal: true },
        { category: "Cash at Beginning", Q1: 10000, Q2: 16000, Q3: 23000, Q4: 31000 },
        { category: "Cash at End", Q1: 16000, Q2: 23000, Q3: 31000, Q4: 40000, isTotal: true, isGrandTotal: true },
      ],
      metrics: {
        operatingCashFlow: 26000,
        freeCashFlow: 21000,
        cashConversionCycle: 45,
        insights: [
          "Operating cash flow shows consistent growth quarter over quarter",
          "Positive free cash flow indicates healthy liquidity position",
          "Reduced capital expenditures in later quarters reflect completion of key projects"
        ]
      }
    },
    monthly: {
      tableData: [
        { category: "Operating Activities", M1: 1500, M2: 1600, M3: 1700, M4: 1800, M5: 1900, M6: 2000, isHeader: true },
        { category: "Net Income", M1: 1000, M2: 1100, M3: 1200, M4: 1300, M5: 1400, M6: 1500 },
        { category: "Depreciation", M1: 200, M2: 200, M3: 200, M4: 200, M5: 200, M6: 200 },
        { category: "Accounts Receivable", M1: -100, M2: -120, M3: -140, M4: -160, M5: -180, M6: -200 },
        { category: "Accounts Payable", M1: 100, M2: 120, M3: 140, M4: 160, M5: 180, M6: 200 },
        { category: "Other Operating Activities", M1: 300, M2: 300, M3: 300, M4: 100, M5: 100, M6: 300 },
        { category: "Net Cash from Operations", M1: 1500, M2: 1600, M3: 1700, M4: 1800, M5: 1900, M6: 2000, isTotal: true },
        
        { category: "Investing Activities", M1: -500, M2: -400, M3: -300, M4: -200, M5: -100, M6: 0, isHeader: true },
        { category: "Capital Expenditures", M1: -400, M2: -300, M3: -200, M4: -100, M5: 0, M6: 0 },
        { category: "Investments", M1: -100, M2: -100, M3: -100, M4: -100, M5: -100, M6: 0 },
        { category: "Net Cash from Investing", M1: -500, M2: -400, M3: -300, M4: -200, M5: -100, M6: 0, isTotal: true },
        
        { category: "Financing Activities", M1: 800, M2: 700, M3: 600, M4: 500, M5: 400, M6: 300, isHeader: true },
        { category: "Debt Issued", M1: 600, M2: 500, M3: 400, M4: 300, M5: 200, M6: 100 },
        { category: "Debt Repaid", M1: -100, M2: -100, M3: -100, M4: -100, M5: -100, M6: -100 },
        { category: "Dividends Paid", M1: -100, M2: -100, M3: -100, M4: -100, M5: -100, M6: -100 },
        { category: "Net Cash from Financing", M1: 800, M2: 700, M3: 600, M4: 500, M5: 400, M6: 300, isTotal: true },
        
        { category: "Net Change in Cash", M1: 1800, M2: 1900, M3: 2000, M4: 2100, M5: 2200, M6: 2300, isTotal: true, isGrandTotal: true },
        { category: "Cash at Beginning", M1: 10000, M2: 11800, M3: 13700, M4: 15700, M5: 17800, M6: 20000 },
        { category: "Cash at End", M1: 11800, M2: 13700, M3: 15700, M4: 17800, M5: 20000, M6: 22300, isTotal: true, isGrandTotal: true },
      ],
      metrics: {
        operatingCashFlow: 10500,
        freeCashFlow: 8500,
        cashConversionCycle: 42,
        insights: [
          "Monthly operating cash flow shows steady increase",
          "Declining investing activities reflect reduced capital needs",
          "Conservative financing approach with decreasing reliance on debt"
        ]
      }
    }
  };

  const handleDrillDown = (rowData) => {
    if (rowData.isHeader || rowData.isTotal) return;
    
    const periodKeys = filters.period === "quarterly" 
      ? ["Q1", "Q2", "Q3", "Q4"]
      : ["M1", "M2", "M3", "M4", "M5", "M6"];
    
    const drillDownItems = periodKeys.map(key => ({
      field: key,
      value: formatCurrency(rowData[key]),
      trend: rowData[key] >= 0
    }));

    setDrillDownData({
      title: `${rowData.category} Details`,
      data: drillDownItems,
      insights: [
        getDrillDownInsight(rowData),
        "Detailed transaction history available upon further drill down"
      ]
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getDrillDownInsight = (rowData) => {
    const periodKeys = filters.period === "quarterly" 
      ? ["Q1", "Q2", "Q3", "Q4"]
      : ["M1", "M2", "M3", "M4", "M5", "M6"];
    
    const values = periodKeys.map(key => rowData[key]).filter(v => v !== undefined);
    const trend = values[values.length - 1] - values[0];
    
    if (trend > 0) {
      return `${rowData.category} shows positive trend increasing by ${formatCurrency(trend)} over the period`;
    } else if (trend < 0) {
      return `${rowData.category} shows negative trend decreasing by ${formatCurrency(Math.abs(trend))} over the period`;
    } else {
      return `${rowData.category} remains stable over the period`;
    }
  };

  const getCSVData = () => {
    const currentData = cashFlowData[filters.period].tableData;
    const periodKeys = filters.period === "quarterly" 
      ? ["Q1", "Q2", "Q3", "Q4"]
      : ["M1", "M2", "M3", "M4", "M5", "M6"];
    
    return currentData.map(row => {
      const csvRow = { Category: row.category };
      periodKeys.forEach(key => {
        csvRow[key] = formatCurrency(row[key]);
      });
      return csvRow;
    });
  };

  const renderTable = () => {
    const currentData = cashFlowData[filters.period].tableData;
    const periods = filters.period === "quarterly" 
      ? ["Q1", "Q2", "Q3", "Q4"] 
      : ["M1", "M2", "M3", "M4", "M5", "M6"];
    
    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-sky-100 text-sky-900">
              <th className="px-4 py-2 text-left">Cash Flow Category</th>
              {periods.map((period, idx) => (
                <th key={idx} className="px-4 py-2 text-right">{period}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => {
              const isHeader = row.isHeader;
              const isTotal = row.isTotal;
              const isGrandTotal = row.isGrandTotal;
              
              return (
                <tr 
                  key={index}
                  className={`border-b border-sky-200 ${
                    isHeader ? "bg-gray-100 font-semibold" : 
                    isGrandTotal ? "bg-blue-50 font-bold" : 
                    isTotal ? "bg-gray-50 font-semibold" : 
                    "hover:bg-sky-50 cursor-pointer"
                  }`}
                  onClick={() => !isHeader && !isTotal && handleDrillDown(row)}
                >
                  <td className={`px-4 py-2 ${
                    isHeader ? "text-gray-700" : 
                    isGrandTotal ? "text-blue-700" : 
                    isTotal ? "text-gray-700" : "text-gray-900"
                  }`}>
                    {row.category}
                  </td>
                  {periods.map((periodKey) => {
                    const value = row[periodKey];
                    const isPositive = value >= 0;
                    
                    return (
                      <td 
                        key={periodKey}
                        className={`px-4 py-2 text-right ${
                          isGrandTotal ? "text-blue-700 font-bold" : 
                          isTotal ? "text-gray-700 font-semibold" : 
                          isHeader ? "text-gray-700" : 
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(value)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKeyMetrics = () => {
    const metrics = cashFlowData[filters.period].metrics;
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
        <ul className="text-sm text-black space-y-2">
          <li className="flex justify-between items-center">
            <span>Operating Cash Flow:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(metrics.operatingCashFlow)}
              <FiTrendingUp className="inline ml-1" />
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Free Cash Flow:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(metrics.freeCashFlow)}
              <FiTrendingUp className="inline ml-1" />
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Cash Conversion Cycle (days):</span>
            <span className="font-medium text-sky-800">
              {metrics.cashConversionCycle}
            </span>
          </li>
        </ul>

        {metrics.insights && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
              <FiAlertCircle className="mr-1" /> Cash Flow Insights
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
                {metrics.insights[activeInsight]}
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
            Back to Cash Flow
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Period Details</h4>
            <table className="w-full text-sm">
              <tbody>
                {drillDownData.data.map((item, index) => (
                  <tr key={index} className="border-b border-sky-100">
                    <td className="py-2 font-medium text-sky-900">{item.field}</td>
                    <td className={`py-2 text-right ${item.trend ? "text-green-600" : "text-red-600"}`}>
                      {item.value}
                      {item.trend ? (
                        <FiTrendingUp className="inline ml-1" />
                      ) : (
                        <FiTrendingDown className="inline ml-1" />
                      )}
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
      const response = `AI analysis for Cash Flow: ${aiInput} (This is a mock response showing how AI insights would appear)`;
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
    const insights = cashFlowData[filters.period].metrics.insights;
    if (insights?.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filters.period]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Cash Flow Statement</h1>
            <p className="text-sky-100 text-xs">
              Track inflow and outflow of cash
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Cash Flow Statement</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                {drillDownData ? drillDownData.title : "Cash Flow Statement"}
              </h2>
              <p className="text-sky-600 text-sm mb-2">
                {drillDownData ? "Detailed view of selected item" : "Operational, investing, and financing cash flows"}
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
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">
                            View
                          </label>
                          <select
                            value={filters.view}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                view: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sky-300 rounded text-xs"
                          >
                            <option value="summary">Summary View</option>
                            <option value="detailed">Detailed View</option>
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-2">
              <CSVLink
                data={getCSVData()}
                filename={`cash-flow-statement-${filters.period}.csv`}
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
                      Ask about Cash Flow
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
                    <p className="font-medium">Operating Cash Flow</p>
                    <p className="text-black">
                      Positive trend showing increasing cash generation from core operations
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700">
                    <FiDollarSign size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Investing Activities</p>
                    <p className="text-black">
                      Decreasing outflows indicate completion of major capital projects
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full mr-3 bg-purple-100 text-purple-700">
                    <FiAlertCircle size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Financing Strategy</p>
                    <p className="text-black">
                      Conservative approach with reduced reliance on debt financing
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

export default CashFlowStatement;