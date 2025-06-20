import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPrinter,
  FiSend,
  FiFilter,
  FiAlertCircle,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

const OpexReport = () => {
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    department: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  // Sample data for OpEx report
  const opexData = {
    tableData: [
      { id: 1, category: "Salaries & Wages", department: "G&A", budget: 1200000, actual: 1215000 },
      { id: 2, category: "Marketing Campaigns", department: "Marketing", budget: 500000, actual: 485000 },
      { id: 3, category: "Cloud Infrastructure", department: "IT", budget: 350000, actual: 380000 },
      { id: 4, category: "Rent & Utilities", department: "G&A", budget: 240000, actual: 240000 },
      { id: 5, category: "Sales Commissions", department: "Sales", budget: 200000, actual: 225000 },
      { id: 6, category: "Software Licenses", department: "IT", budget: 180000, actual: 175000 },
      { id: 7, category: "Travel & Entertainment", department: "Sales", budget: 150000, actual: 165000 },
      { id: 8, category: "R&D Supplies", department: "R&D", budget: 90000, actual: 85000 },
    ],
    metrics: {
      totalBudget: 2910000,
      totalActual: 2965000,
      totalVariance: -55000,
      favorableCategories: 3,
      unfavorableCategories: 4,
      insights: [
        "Overall operating expenses are 1.9% over budget, primarily driven by IT and Sales.",
        "Salaries & Wages, the largest expense category, is currently 1.25% over budget.",
        "Marketing spend is under budget by $15k, presenting a potential reallocation opportunity."
      ]
    }
  };

  const handleDrillDown = (rowData) => {
    const variance = rowData.budget - rowData.actual;
    setDrillDownData({
      title: `${rowData.category} Details`,
      data: [
        { field: "Department", value: rowData.department },
        { field: "Budget", value: formatCurrency(rowData.budget) },
        { field: "Actual Cost", value: formatCurrency(rowData.actual) },
        { field: "Variance", value: formatCurrency(variance), isPositive: variance >= 0 },
      ],
      insights: [
        getDrillDownInsight(rowData),
        "This category's spending is trending consistently with historical data.",
        "Contact Department Head: Alex Johnson (alex.j@company.com)"
      ]
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getDrillDownInsight = (rowData) => {
    const variance = rowData.budget - rowData.actual;
    if (variance < 0) {
      return `Spending is ${formatCurrency(Math.abs(variance))} over budget. This is driven by [mock reason, e.g., unplanned software renewals].`;
    } else {
      return `Spending is ${formatCurrency(variance)} under budget due to efficient cost management.`;
    }
  };

  const getCSVData = () => {
    return opexData.tableData.map(row => ({
        Category: row.category,
        Department: row.department,
        Budget: row.budget,
        Actual: row.actual,
        Variance: row.budget - row.actual,
    }));
  };

  const renderTable = () => {
    const filteredTableData = filters.department === 'all' 
      ? opexData.tableData 
      : opexData.tableData.filter(row => row.department === filters.department);

    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100 max-h-[30rem]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-sky-100 text-sky-900">
            <tr>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-right">Budget</th>
              <th className="px-4 py-2 text-right">Actual</th>
              <th className="px-4 py-2 text-right">Variance</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableData.map((row, index) => {
                const variance = row.budget - row.actual;
                return (
                    <tr 
                        key={index} 
                        className="border-b border-sky-200 hover:bg-sky-50 cursor-pointer"
                        onClick={() => handleDrillDown(row)}
                    >
                        <td className="px-4 py-2 font-medium">{row.category}</td>
                        <td className="px-4 py-2 text-gray-600">{row.department}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(row.budget)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(row.actual)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(variance)}
                        </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKeyMetrics = () => {
    const { metrics } = opexData;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
        <ul className="text-sm text-black space-y-2">
          <li className="flex justify-between items-center">
            <span>Total Budget:</span>
            <span className="font-medium text-sky-800">{formatCurrency(metrics.totalBudget)}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Total Actual Spend:</span>
            <span className="font-medium text-sky-800">{formatCurrency(metrics.totalActual)}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Overall Variance:</span>
            <span className={`font-medium ${metrics.totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(metrics.totalVariance)}
              {metrics.totalVariance >= 0 ? <FiTrendingUp className="inline ml-1"/> : <FiTrendingDown className="inline ml-1"/>}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Categories Over Budget:</span>
            <span className="font-medium text-red-600">{metrics.unfavorableCategories}</span>
          </li>
        </ul>

        {metrics.insights && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
              <FiAlertCircle className="mr-1" /> OpEx Insights
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
          <button onClick={() => setDrillDownData(null)} className="text-sm text-sky-600 hover:text-sky-800">
            Back to OpEx Report
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Expense Details</h4>
            <table className="w-full text-sm">
              <tbody>
                {drillDownData.data.map((item, index) => (
                  <tr key={index} className="border-b border-sky-100">
                    <td className="py-2 font-medium text-sky-900">{item.field}</td>
                    <td className={`py-2 text-right ${item.isPositive === true ? "text-green-600" : item.isPositive === false ? "text-red-600" : "text-gray-700"}`}>
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
      const response = `AI analysis for OpEx: ${aiInput} (This is a mock response)`;
      setAiHistory(prev => [...prev, { query: aiInput, response }]);
      setAiInput("");
      setShowAIDropdown(false);
    }
  };

  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) setShowAIDropdown(false);
      if (filtersRef.current && !filtersRef.current.contains(event.target)) setShowFilters(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (opexData.metrics.insights?.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % opexData.metrics.insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [opexData.metrics.insights]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Operating Expenses (OpEx) Report</h1>
            <p className="text-sky-100 text-xs">Details operating expenses by category and department.</p>
          </div>
          <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 transition-colors">
            <FiDownload /><span>Export</span>
          </button>
        </div>
      </div>

      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/financial-core-reports" className="inline-flex items-center text-sm font-medium text-sky-900 hover:text-blue-600">
              Financial Reports
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <GrLinkNext className="w-3 h-3 text-gray-400 mx-1" />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">OpEx Report</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                {drillDownData ? drillDownData.title : "Operating Expenses Summary"}
              </h2>
              <p className="text-sky-600 text-sm mb-2">
                {drillDownData ? "Detailed view of expense category" : "Budget vs. Actual spend across all departments"}
              </p>
            </div>
            <Link to="/financial-core-reports" className="text-sky-500 hover:text-sky-700 mt-1">
              <button type="button" className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                Back to Reports <GrLinkNext className="ml-1 w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {!drillDownData && (
          <div className="mb-4 flex flex-wrap gap-2 justify-end items-center">
             <div className="relative" ref={filtersRef}>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg px-3 py-2 text-xs">
                  <FiFilter className="mr-2" /> Filter
                </button>
                <AnimatePresence>
                  {showFilters && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-sky-200 p-4 right-0">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">Department</label>
                          <select value={filters.department} onChange={(e) => setFilters(f => ({...f, department: e.target.value}))} className="w-full p-2 border border-sky-300 rounded text-xs">
                            <option value="all">All Departments</option>
                            <option value="Marketing">Marketing</option>
                            <option value="IT">IT</option>
                            <option value="R&D">R&D</option>
                            <option value="Sales">Sales</option>
                            <option value="G&A">G&A</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            <CSVLink data={getCSVData()} filename={"opex-report.csv"} className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200">
              <FiDownload className="mr-1" /> CSV
            </CSVLink>
            <div className="relative">
              <button onClick={() => setShowAIDropdown(true)} className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs">
                <BsStars className="mr-1" /> Ask AI
              </button>
              {showAIDropdown && (
                  <motion.div ref={aiChatbotRef} className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <h1 className="text-sm font-semibold text-sky-900 mb-2">Ask about OpEx</h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="e.g., Why is IT over budget?" className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" onClick={(e) => e.stopPropagation()} />
                      <button onClick={handleSendAIQuery} className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50" disabled={!aiInput.trim()}>
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          {drillDownData ? renderDrillDownView() : renderTable()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{!drillDownData && renderKeyMetrics()}</div>
          <div>{/* Placeholder for a potential chart or additional analysis */}</div>
        </div>
      </div>
    </div>
  );
};

export default OpexReport;