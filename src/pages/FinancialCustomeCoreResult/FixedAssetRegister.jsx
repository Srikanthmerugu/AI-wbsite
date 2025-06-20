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
  FiHardDrive,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

const FixedAssetRegister = () => {
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  // Sample data for Fixed Asset Register report
  const fixedAssetData = {
    tableData: [
      { id: 1, asset: "Office Building", category: "Property", purchaseDate: "2018-05-20", cost: 750000, usefulLife: 20, status: "Active", accumulatedDepreciation: 140625 },
      { id: 2, asset: "Delivery Fleet (5 Vans)", category: "Vehicles", purchaseDate: "2022-01-10", cost: 150000, usefulLife: 5, status: "Active", accumulatedDepreciation: 90000 },
      { id: 3, asset: "Dell Server Rack", category: "IT Equipment", purchaseDate: "2021-08-15", cost: 45000, usefulLife: 5, status: "Active", accumulatedDepreciation: 27000 },
      { id: 4, asset: "Manufacturing Press", category: "Machinery", purchaseDate: "2019-11-01", cost: 300000, usefulLife: 10, status: "Active", accumulatedDepreciation: 127500 },
      { id: 5, asset: "Old Forklift", category: "Machinery", purchaseDate: "2015-03-01", cost: 40000, usefulLife: 10, status: "Fully Depreciated", accumulatedDepreciation: 40000 },
      { id: 6, "asset": "Conference Room AV System", "category": "Office Equipment", "purchaseDate": "2023-02-28", "cost": 25000, "usefulLife": 7, "status": "Active", "accumulatedDepreciation": 3571 },
    ],
    metrics: {
      totalCost: 1310000,
      totalAccumulatedDepreciation: 428696,
      totalNetBookValue: 881304,
      averageAssetAge: 4.2, // in years
      insights: [
        "IT Equipment represents 25% of annual depreciation but only 3.4% of total asset cost.",
        "The 'Old Forklift' is fully depreciated. Consider planning for its replacement to avoid operational disruption.",
        "The delivery fleet will reach the end of its useful life in under 2 years. Budget for replacement CAPEX."
      ]
    }
  };

  const handleDrillDown = (rowData) => {
    const netBookValue = rowData.cost - rowData.accumulatedDepreciation;
    setDrillDownData({
      title: `${rowData.asset} Details`,
      data: [
        { field: "Category", value: rowData.category },
        { field: "Status", value: rowData.status },
        { field: "Purchase Date", value: new Date(rowData.purchaseDate).toLocaleDateString() },
        { field: "Original Cost", value: formatCurrency(rowData.cost) },
        { field: "Useful Life (Years)", value: rowData.usefulLife },
        { field: "Accumulated Depreciation", value: formatCurrency(rowData.accumulatedDepreciation) },
        { field: "Net Book Value", value: formatCurrency(netBookValue), isTotal: true },
      ],
      insights: [
        getDrillDownInsight(rowData),
        "Asset is currently in good working condition according to last maintenance check."
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
    const depreciationPercentage = (rowData.accumulatedDepreciation / rowData.cost) * 100;
    if (rowData.status === 'Fully Depreciated') {
        return "This asset is fully depreciated and its cost has been completely expensed.";
    }
    return `Asset is ${depreciationPercentage.toFixed(1)}% depreciated. It has an estimated remaining useful life.`;
  };

  const getCSVData = () => {
    return fixedAssetData.tableData.map(row => ({
        Asset: row.asset,
        Category: row.category,
        "Purchase Date": row.purchaseDate,
        "Original Cost": row.cost,
        "Useful Life (Years)": row.usefulLife,
        "Accumulated Depreciation": row.accumulatedDepreciation,
        "Net Book Value": row.cost - row.accumulatedDepreciation,
        Status: row.status,
    }));
  };

  const renderTable = () => {
    const filteredTableData = fixedAssetData.tableData.filter(row => 
        (filters.category === 'all' || row.category === filters.category) &&
        (filters.status === 'all' || row.status === filters.status)
    );

    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100 max-h-[30rem]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-sky-100 text-sky-900">
            <tr>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-right">Cost</th>
              <th className="px-4 py-2 text-right">Accumulated Depreciation</th>
              <th className="px-4 py-2 text-right">Net Book Value</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableData.map((row, index) => {
                const netBookValue = row.cost - row.accumulatedDepreciation;
                return (
                    <tr 
                        key={index} 
                        className="border-b border-sky-200 hover:bg-sky-50 cursor-pointer"
                        onClick={() => handleDrillDown(row)}
                    >
                        <td className="px-4 py-2 font-medium">
                            <div>{row.asset}</div>
                            <div className="text-gray-500 text-xs">{row.category}</div>
                        </td>
                        <td className="px-4 py-2 text-right">{formatCurrency(row.cost)}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(row.accumulatedDepreciation)}</td>
                        <td className="px-4 py-2 text-right font-semibold">{formatCurrency(netBookValue)}</td>
                        <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {row.status}
                            </span>
                        </td>
                    </tr>
                )
            })}
             <tr className="bg-gray-100 font-semibold sticky bottom-0">
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2 text-right">{formatCurrency(fixedAssetData.metrics.totalCost)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(fixedAssetData.metrics.totalAccumulatedDepreciation)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(fixedAssetData.metrics.totalNetBookValue)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderKeyMetrics = () => {
    const { metrics } = fixedAssetData;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
        <ul className="text-sm text-black space-y-2">
          <li className="flex justify-between items-center">
            <span>Total Asset Cost:</span>
            <span className="font-medium text-sky-800">{formatCurrency(metrics.totalCost)}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Total Depreciation:</span>
            <span className="font-medium text-sky-800">{formatCurrency(metrics.totalAccumulatedDepreciation)}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Total Net Book Value:</span>
            <span className="font-medium text-green-600">{formatCurrency(metrics.totalNetBookValue)}</span>
          </li>
           <li className="flex justify-between items-center">
            <span>Average Asset Age:</span>
            <span className="font-medium text-sky-800">{metrics.averageAssetAge.toFixed(1)} years</span>
          </li>
        </ul>

        {metrics.insights && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
              <FiAlertCircle className="mr-1" /> Asset Insights
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
            Back to Asset Register
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Asset Details</h4>
            <table className="w-full text-sm">
              <tbody>
                {drillDownData.data.map((item, index) => (
                  <tr key={index} className="border-b border-sky-100">
                    <td className="py-2 font-medium text-sky-900">{item.field}</td>
                    <td className={`py-2 text-right ${item.isTotal ? "font-semibold text-sky-800" : "text-gray-700"}`}>
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
      const response = `AI analysis for Fixed Assets: ${aiInput} (This is a mock response)`;
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
    if (fixedAssetData.metrics.insights?.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % fixedAssetData.metrics.insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [fixedAssetData.metrics.insights]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Fixed Asset Register Report</h1>
            <p className="text-sky-100 text-xs">Lists all fixed assets with depreciation schedules.</p>
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Fixed Asset Register</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                {drillDownData ? drillDownData.title : "Fixed Asset Summary"}
              </h2>
              <p className="text-sky-600 text-sm mb-2">
                {drillDownData ? "Detailed view of selected asset" : "Company-wide register of fixed assets"}
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
                          <label className="block text-xs font-medium text-sky-700 mb-1">Asset Category</label>
                          <select value={filters.category} onChange={(e) => setFilters(f => ({...f, category: e.target.value}))} className="w-full p-2 border border-sky-300 rounded text-xs">
                            <option value="all">All Categories</option>
                            <option value="Property">Property</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="IT Equipment">IT Equipment</option>
                            <option value="Machinery">Machinery</option>
                            <option value="Office Equipment">Office Equipment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-sky-700 mb-1">Status</label>
                          <select value={filters.status} onChange={(e) => setFilters(f => ({...f, status: e.target.value}))} className="w-full p-2 border border-sky-300 rounded text-xs">
                            <option value="all">All</option>
                            <option value="Active">Active</option>
                            <option value="Fully Depreciated">Fully Depreciated</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            <CSVLink data={getCSVData()} filename={"fixed-asset-register.csv"} className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200">
              <FiDownload className="mr-1" /> CSV
            </CSVLink>
            <div className="relative">
              <button onClick={() => setShowAIDropdown(true)} className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs">
                <BsStars className="mr-1" /> Ask AI
              </button>
              {showAIDropdown && (
                  <motion.div ref={aiChatbotRef} className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <h1 className="text-sm font-semibold text-sky-900 mb-2">Ask about Fixed Assets</h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="e.g., Which assets are fully depreciated?" className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" onClick={(e) => e.stopPropagation()} />
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

export default FixedAssetRegister;