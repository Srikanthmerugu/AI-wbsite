import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiChevronRight, FiDownload, FiPrinter, FiFilter, FiSend } from "react-icons/fi";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { BsStars } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, Tooltip, Legend);

// Sample Data
const sampleData = {
  pnl: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Actual", data: [12000, 19000, 15000, 18000, 22000], backgroundColor: "rgba(54, 162, 235, 0.7)" },
      { label: "Budget", data: [15000, 15000, 17000, 20000, 21000], backgroundColor: "rgba(255, 99, 132, 0.7)" },
      { label: "Forecast", data: [13000, 17000, 16000, 19000, 23000], backgroundColor: "rgba(75, 192, 192, 0.7)" },
    ],
    tableData: [
      { month: "Jan", Actual: 12000, Budget: 15000, Forecast: 13000 },
      { month: "Feb", Actual: 19000, Budget: 15000, Forecast: 17000 },
      { month: "Mar", Actual: 15000, Budget: 17000, Forecast: 16000 },
      { month: "Apr", Actual: 18000, Budget: 20000, Forecast: 19000 },
      { month: "May", Actual: 22000, Budget: 21000, Forecast: 23000 },
    ],
  },
  balanceSheet: {
    tableData: [
      { account: "Cash", current: 45000, previous: 38000, positive: true },
      { account: "Accounts Receivable", current: 32000, previous: 28000, positive: true },
      { account: "Inventory", current: 28000, previous: 31000, positive: false },
      { account: "Total Assets", current: 185000, previous: 172000, positive: true },
      { account: "Accounts Payable", current: 22000, previous: 18000, positive: false },
      { account: "Total Liabilities", current: 85000, previous: 78000, positive: false },
      { account: "Retained Earnings", current: 100000, previous: 94000, positive: true },
    ],
  },
  cashFlow: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Operational", data: [5000, 6000, 7000, 8000, 9000], backgroundColor: "rgba(54, 162, 235, 0.7)" },
      { label: "Investing", data: [-2000, -1500, -1000, -500, 0], backgroundColor: "rgba(255, 99, 132, 0.7)" },
      { label: "Financing", data: [3000, 2500, 2000, 1500, 1000], backgroundColor: "rgba(75, 192, 192, 0.7)" },
    ],
    tableData: [
      { month: "Jan", Operational: 5000, Investing: -2000, Financing: 3000 },
      { month: "Feb", Operational: 6000, Investing: -1500, Financing: 2500 },
      { month: "Mar", Operational: 7000, Investing: -1000, Financing: 2000 },
      { month: "Apr", Operational: 8000, Investing: -500, Financing: 1500 },
      { month: "May", Operational: 9000, Investing: 0, Financing: 1000 },
    ],
  },
  arAging: {
    labels: ["Current", "1-30 days", "31-60 days", "61-90 days", "90+ days"],
    datasets: [
      {
        data: [45000, 12000, 8000, 5000, 3000],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
      },
    ],
    tableData: [
      { category: "Current", amount: 45000 },
      { category: "1-30 days", amount: 12000 },
      { category: "31-60 days", amount: 8000 },
      { category: "61-90 days", amount: 5000 },
      { category: "90+ days", amount: 3000 },
    ],
  },
  apAging: {
    labels: ["Current", "1-30 days", "31-60 days", "61-90 days", "90+ days"],
    datasets: [
      {
        data: [35000, 10000, 6000, 4000, 2000],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
      },
    ],
    tableData: [
      { category: "Current", amount: 35000 },
      { category: "1-30 days", amount: 10000 },
      { category: "31-60 days", amount: 6000 },
      { category: "61-90 days", amount: 4000 },
      { category: "90+ days", amount: 2000 },
    ],
  },
  budgetVsActuals: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Actual", data: [12000, 19000, 15000, 18000, 22000], backgroundColor: "rgba(54, 162, 235, 0.7)" },
      { label: "Budget", data: [15000, 15000, 17000, 20000, 21000], backgroundColor: "rgba(255, 99, 132, 0.7)" },
    ],
    tableData: [
      { month: "Jan", Actual: 12000, Budget: 15000 },
      { month: "Feb", Actual: 19000, Budget: 15000 },
      { month: "Mar", Actual: 15000, Budget: 17000 },
      { month: "Apr", Actual: 18000, Budget: 20000 },
      { month: "May", Actual: 22000, Budget: 21000 },
    ],
  },
  financialRatios: {
    tableData: [
      { ratio: "Current Ratio", value: 2.5, benchmark: 1.5, goodAbove: true },
      { ratio: "Debt-to-Equity", value: 0.8, benchmark: 1.0, goodBelow: true },
      { ratio: "ROE", value: 18, benchmark: 15, goodAbove: true },
    ],
  },
  departmental: {
    tableData: [
      { department: "Sales", cost: 50000, profit: 20000 },
      { department: "Marketing", cost: 30000, profit: 15000 },
      { department: "Operations", cost: 40000, profit: 18000 },
      { department: "R&D", cost: 25000, profit: 12000 },
      { department: "HR", cost: 20000, profit: 10000 },
    ],
  },
  custom1: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      { label: "Revenue", data: [50000, 55000, 60000, 65000], backgroundColor: "rgba(54, 162, 235, 0.7)" },
      { label: "Expenses", data: [30000, 32000, 34000, 36000], backgroundColor: "rgba(255, 99, 132, 0.7)" },
    ],
    tableData: [
      { quarter: "Q1", Revenue: 50000, Expenses: 30000 },
      { quarter: "Q2", Revenue: 55000, Expenses: 32000 },
      { quarter: "Q3", Revenue: 60000, Expenses: 34000 },
      { quarter: "Q4", Revenue: 65000, Expenses: 36000 },
    ],
  },
  custom2: {
    labels: ["Region A", "Region B", "Region C"],
    datasets: [
      {
        data: [40000, 35000, 30000],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
      },
    ],
    tableData: [
      { region: "Region A", amount: 40000 },
      { region: "Region B", amount: 35000 },
      { region: "Region C", amount: 30000 },
    ],
  },
};

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState("core");
  const [expandedReports, setExpandedReports] = useState({});
  const [viewMode, setViewMode] = useState("chart");
  const [timeRange, setTimeRange] = useState("6M");
  const [aiInputs, setAiInputs] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef(null);
  const aiChatbotRef = useRef(null);

  // Toggle report expansion
  const toggleReport = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  // Handle AI input and send
  const handleSendAIQuery = (reportId) => {
    const input = aiInputs[reportId] || "";
    if (input.trim()) {
      console.log(`AI Query for ${reportId}:`, input); // Replace with actual AI logic
      setAiInputs((prev) => ({ ...prev, [reportId]: "" }));
      setShowAIDropdown(null);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Report Definitions
  const coreReports = [
    { id: "pnl", title: "Profit & Loss Statement", description: "Actual vs Budget vs Forecast" },
    { id: "balanceSheet", title: "Balance Sheet", description: "Assets, Liabilities, and Equity Summary" },
    { id: "cashFlow", title: "Cash Flow Statement", description: "Operational, Investing, and Financing Cash Flow" },
    { id: "arAging", title: "AR Aging Reports", description: "Overdue receivables breakdown" },
    { id: "apAging", title: "AP Aging Reports", description: "Overdue Payments Breakdown" },
    { id: "budgetVsActuals", title: "Budget vs. Actuals", description: "Variance Analysis & Cost Overruns" },
    { id: "financialRatios", title: "Financial Ratio Analysis", description: "Liquidity, Profitability, and Efficiency Ratios" },
    { id: "departmental", title: "Departmental Performance Reports", description: "Cost Centers, P&L by Business Unit" },
  ];

  const customReports = [
    { id: "custom1", title: "Custom Revenue Report", description: "Revenue vs Expenses by Quarter" },
    { id: "custom2", title: "Regional Sales Report", description: "Sales by Region" },
  ];

  // Render Chart or Table
  const renderContent = (reportId) => {
    const data = sampleData[reportId];
    if (!data) return <div className="text-gray-500">No data available</div>;

    const toggleView = () => setViewMode(viewMode === "chart" ? "table" : "chart");

    if (viewMode === "chart") {
      if (reportId === "balanceSheet" || reportId === "financialRatios" || reportId === "departmental") {
        return (
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data.tableData[0]).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.tableData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof value === "boolean" ? (value ? "↑" : "↓") : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={toggleView}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              View as Chart
            </button>
          </div>
        );
      }
      return (
        <div className="mt-4 h-80">
          {reportId === "arAging" || reportId === "apAging" ? (
            <Pie data={data} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
          ) : (
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
                scales: { x: { stacked: false }, y: { stacked: false } },
              }}
            />
          )}
          <button
            onClick={toggleView}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            View as Table
          </button>
        </div>
      );
    } else {
      return (
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(data.tableData[0]).map((key) => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          <button
            onClick={toggleView}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            View as Chart
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        




          {/* Header */}
              <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-bold text-white">Financial Reports</h1>
                    <p className="text-sky-100 text-sm">Access and analyze all financial insights</p>
                  </div>
                  <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="flex items-center outline-0 py-2 px-3 text-sm font-medium text-white bg-sky-900 rounded-lg  hover:bg-white hover:text-sky-900 transition-colors duration-200"
                >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="12M">Last 12 Months</option>
                <option value="YTD">Year to Date</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center py-2 px-3 text-sm font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
                >
                <FiFilter className="mr-2" /> Filters
              </button>
            </div>
                </div>
              </div>

        {/* Filters (Collapsible) */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6" ref={filtersRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Month</option>
                  <option>Quarter</option>
                  <option>YTD</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>All</option>
                  <option>Revenue</option>
                  <option>Expenses</option>
                  <option>Assets</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("core")}
              className={`py-4 px-6 text-lg font-medium transition-colors ${
                activeTab === "core"
                  ? "border-b-2 border-sky-600 text-sky-700"
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Core Reports
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-4 px-6 text-lg font-medium transition-colors ${
                activeTab === "custom"
                  ? "border-b-2 border-sky-600 text-sky-700"
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Custom Reports
            </button>
          </nav>
        </div>

        {/* Report List */}
        <div className="mt-6 space-y-6">
          {(activeTab === "core" ? coreReports : customReports).map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <button
                onClick={() => toggleReport(report.id)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                    {report.id.includes("aging") ? "Monthly" : "Quarterly"}
                  </span>
                  {expandedReports[report.id] ? (
                    <FiChevronDown className="text-gray-500 w-6 h-6" />
                  ) : (
                    <FiChevronRight className="text-gray-500 w-6 h-6" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAIDropdown(report.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                                   <BsStars />
                   
                  </button>
                  {showAIDropdown === report.id && (
                    <div
                      ref={aiChatbotRef}
                      className="absolute right-6 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 border border-gray-200 p-3"
                    >                      <h1 className="text-sm w-full my-2 text-sky-700">Ask regarding the {report.title}</h1>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={aiInputs[report.id] || ""}
                          onChange={(e) => setAiInputs((prev) => ({ ...prev, [report.id]: e.target.value }))}
                          placeholder="Ask AI about this report..."
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          onClick={() => handleSendAIQuery(report.id)}
                          className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                          disabled={!aiInputs[report.id]?.trim()}
                        >
                          <FiSend className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {expandedReports[report.id] && (
                <div className="p-6 border-t border-gray-200">
                  {renderContent(report.id)}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <FiDownload className="mr-2" /> Export
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <FiPrinter className="mr-2" /> Print
                    </button>
                    <button className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <FiFilter className="mr-2" /> Filter Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;