import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPrinter,
  FiSend,
  FiFilter,
  FiAlertCircle,
  FiTarget,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

const SalesFunnelReport = () => {
  const [drillDownData, setDrillDownData] = useState(null);
  const [filters, setFilters] = useState({
    region: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiHistory, setAiHistory] = useState([]);

  // Sample data for Sales Funnel Metrics report
  const salesFunnelData = {
    tableData: [
      { id: 1, stage: "Leads", count: 10000, conversionRate: null, timeInStage: 5 },
      { id: 2, stage: "Qualified (MQL)", count: 2500, conversionRate: 25.0, timeInStage: 10 },
      { id: 3, stage: "Opportunity (SQL)", count: 1000, conversionRate: 40.0, timeInStage: 15 },
      { id: 4, stage: "Proposal Sent", count: 500, conversionRate: 50.0, timeInStage: 12 },
      { id: 5, stage: "Negotiation", count: 250, conversionRate: 50.0, timeInStage: 8 },
      { id: 6, stage: "Closed Won", count: 150, conversionRate: 60.0, timeInStage: 2 },
    ],
    metrics: {
      totalLeads: 10000,
      totalWon: 150,
      overallConversionRate: 1.5,
      averageSalesCycle: 52, // Sum of timeInStage
      insights: [
        "The conversion from MQL to SQL (40%) is strong, indicating good lead quality.",
        "The largest drop-off is from Leads to MQL (75% drop). Consider refining top-of-funnel targeting.",
        "AI suggests that deals spending more than 10 days in 'Negotiation' have a 70% lower chance of closing."
      ]
    }
  };

  const handleDrillDown = (rowData, prevRow) => {
    const dropOff = prevRow ? prevRow.count - rowData.count : 0;
    setDrillDownData({
      title: `${rowData.stage} Stage Details`,
      data: [
        { field: "Deals / Leads in Stage", value: rowData.count.toLocaleString() },
        { field: "Conversion from Previous Stage", value: rowData.conversionRate ? `${rowData.conversionRate.toFixed(1)}%` : "N/A", isPositive: rowData.conversionRate ? rowData.conversionRate >= 50 : null },
        { field: "Drop-off from Previous Stage", value: dropOff.toLocaleString(), isNegative: dropOff > 0 },
        { field: "Average Time in Stage (Days)", value: rowData.timeInStage },
      ],
      insights: [
        getDrillDownInsight(rowData),
        "This stage's performance is consistent with the last quarter's trend.",
      ]
    });
  };

  const getDrillDownInsight = (rowData) => {
    if (rowData.stage === 'Leads') {
        return "This is the top of the funnel. Focus on lead source quality to improve downstream conversions.";
    }
    if (rowData.conversionRate < 40) {
      return `The conversion rate of ${rowData.conversionRate.toFixed(1)}% is below the benchmark of 40%. This may indicate a bottleneck.`;
    } else {
      return `A strong conversion rate of ${rowData.conversionRate.toFixed(1)}% indicates this stage is performing efficiently.`;
    }
  };

  const getCSVData = () => {
    return salesFunnelData.tableData.map(row => ({
      Stage: row.stage,
      Count: row.count,
      "Conversion Rate (%)": row.conversionRate,
      "Time in Stage (Days)": row.timeInStage,
    }));
  };

  const renderTable = () => {
    return (
      <div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100 max-h-[30rem]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-sky-100 text-sky-900">
            <tr>
              <th className="px-4 py-2 text-left">Funnel Stage</th>
              <th className="px-4 py-2 text-right">Count</th>
              <th className="px-4 py-2 text-right">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {salesFunnelData.tableData.map((row, index) => (
              <tr 
                key={index} 
                className="border-b border-sky-200 hover:bg-sky-50 cursor-pointer"
                onClick={() => handleDrillDown(row, salesFunnelData.tableData[index - 1] || null)}
              >
                <td className="px-4 py-2 font-medium flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-blue-${900 - (index*100)}`}></div>
                    {row.stage}
                </td>
                <td className="px-4 py-2 text-right font-semibold text-gray-800">{row.count.toLocaleString()}</td>
                <td className={`px-4 py-2 text-right font-semibold ${row.conversionRate && row.conversionRate >= 50 ? "text-green-600" : "text-amber-600"}`}>
                  {row.conversionRate ? `${row.conversionRate.toFixed(1)}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKeyMetrics = () => {
    const { metrics } = salesFunnelData;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
        <ul className="text-sm text-black space-y-2">
          <li className="flex justify-between items-center">
            <span>Total Leads:</span>
            <span className="font-medium text-sky-800">{metrics.totalLeads.toLocaleString()}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Deals Won:</span>
            <span className="font-medium text-green-600">{metrics.totalWon.toLocaleString()}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Overall Conversion Rate:</span>
            <span className="font-medium text-sky-800">{metrics.overallConversionRate.toFixed(1)}%</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Average Sales Cycle (Days):</span>
            <span className="font-medium text-sky-800">{metrics.averageSalesCycle}</span>
          </li>
        </ul>

        {metrics.insights && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
              <FiAlertCircle className="mr-1" /> Funnel Insights
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
            Back to Funnel Report
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-sky-800 mb-3">Stage Details</h4>
            <table className="w-full text-sm">
              <tbody>
                {drillDownData.data.map((item, index) => (
                  <tr key={index} className="border-b border-sky-100">
                    <td className="py-2 font-medium text-sky-900">{item.field}</td>
                    <td className={`py-2 text-right ${item.isPositive ? "text-green-600" : item.isNegative ? "text-red-600" : "text-gray-700"}`}>
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
      const response = `AI analysis for Sales Funnel: ${aiInput} (This is a mock response)`;
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
    if (salesFunnelData.metrics.insights?.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % salesFunnelData.metrics.insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [salesFunnelData.metrics.insights]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Sales Funnel Metrics Report</h1>
            <p className="text-sky-100 text-xs">Visualizes the stages of the sales funnel, tracking conversions.</p>
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Sales Funnel Metrics</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                {drillDownData ? drillDownData.title : "Sales Funnel Performance"}
              </h2>
              <p className="text-sky-600 text-sm mb-2">
                {drillDownData ? "Detailed view of selected stage" : "Conversion rates through the sales process"}
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
                          <label className="block text-xs font-medium text-sky-700 mb-1">Sales Region</label>
                          <select value={filters.region} onChange={(e) => setFilters(f => ({...f, region: e.target.value}))} className="w-full p-2 border border-sky-300 rounded text-xs">
                            <option value="all">All Regions</option>
                            <option value="NA">North America</option>
                            <option value="EMEA">EMEA</option>
                            <option value="APAC">APAC</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            <CSVLink data={getCSVData()} filename={"sales-funnel-report.csv"} className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200">
              <FiDownload className="mr-1" /> CSV
            </CSVLink>
            <div className="relative">
              <button onClick={() => setShowAIDropdown(true)} className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs">
                <BsStars className="mr-1" /> Ask AI
              </button>
              {showAIDropdown && (
                  <motion.div ref={aiChatbotRef} className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <h1 className="text-sm font-semibold text-sky-900 mb-2">Ask about Sales Funnel</h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="e.g., Where is our biggest drop-off?" className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" onClick={(e) => e.stopPropagation()} />
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

export default SalesFunnelReport;