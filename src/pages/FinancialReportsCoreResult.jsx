import React, { useState, useEffect, useRef } from 'react';
import {
  FiChevronDown,
  FiChevronRight,
  FiDownload,
  FiPrinter,
  FiFilter,
  FiSend,
  FiX,
  FiTable,
  FiDollarSign,
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { GrLinkNext } from 'react-icons/gr';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Sample Data (Unchanged)
const sampleData = {
  pnl: {
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
      { account: 'Cash', current: 45000, previous: 38000, positive: true },
      { account: 'Accounts Receivable', current: 32000, previous: 28000, positive: true },
      { account: 'Inventory', current: 28000, previous: 31000, positive: false },
      { account: 'Total Assets', current: 185000, previous: 172000, positive: true },
      { account: 'Accounts Payable', current: 22000, previous: 18000, positive: false },
      { account: 'Total Liabilities', current: 85000, previous: 78000, positive: false },
      { account: 'Retained Earnings', current: 100000, previous: 94000, positive: true },
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
      { ratio: 'Current Ratio', value: 2.5, benchmark: 1.5, goodAbove: true },
      { ratio: 'Debt-to-Equity', value: 0.8, benchmark: 1.0, goodBelow: true },
      { ratio: 'ROE', value: 18, benchmark: 15, goodAbove: true },
      { ratio: 'Gross Margin', value: 35, benchmark: 30, goodAbove: true },
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

// Animation Variants for Sequential Card Entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState('core');
  const [expandedReports, setExpandedReports] = useState({});
  const [chartTypes, setChartTypes] = useState({});
  const [viewModes, setViewModes] = useState({}); // New state for chart/table view
  const [timeRange, setTimeRange] = useState('6M');
  const [filters, setFilters] = useState({
    dateRange: 'Month',
    category: 'All',
    department: 'All',
  });
  const [aiInputs, setAiInputs] = useState({});
  const [aiHistory, setAiHistory] = useState({});
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

  // Handle chart type change
  const handleChartTypeChange = (reportId, type) => {
    setChartTypes((prev) => ({ ...prev, [reportId]: type }));
  };

  // Handle view mode change (chart/table)
  const handleViewModeChange = (reportId) => {
    setViewModes((prev) => ({
      ...prev,
      [reportId]: prev[reportId] === 'table' ? 'chart' : 'table',
    }));
  };

  // Handle AI input and send
  const handleSendAIQuery = (reportId) => {
    const input = aiInputs[reportId] || '';
    if (input.trim()) {
      const response = `AI Insight for ${reportId}: ${input} (e.g., variance due to seasonal trends)`;
      setAiHistory((prev) => ({
        ...prev,
        [reportId]: [...(prev[reportId] || []), { query: input, response }],
      }));
      setAiInputs((prev) => ({ ...prev, [reportId]: '' }));
      setShowAIDropdown(null);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ dateRange: 'Month', category: 'All', department: 'All' });
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Report Definitions
  const coreReports = [
    {
      id: 'pnl',
      title: 'Profit & Loss Statement',
      description: 'Actual vs. Budget vs. Forecast',
    },
    {
      id: 'balanceSheet',
      title: 'Balance Sheet',
      description: 'Assets, Liabilities, and Equity Summary',
    },
    {
      id: 'cashFlow',
      title: 'Cash Flow Statement',
      description: 'Operational, Investing, and Financing Cash Flow',
    },
    {
      id: 'arAging',
      title: 'AR Aging Reports',
      description: 'Overdue Receivables Breakdown',
    },
    {
      id: 'apAging',
      title: 'AP Aging Reports',
      description: 'Overdue Payments Breakdown',
    },
    {
      id: 'budgetVsActuals',
      title: 'Budget vs. Actuals',
      description: 'Variance Analysis & Cost Overruns',
    },
    {
      id: 'financialRatios',
      title: 'Financial Ratio Analysis',
      description: 'Liquidity, Profitability, and Efficiency Ratios',
    },
    {
      id: 'departmental',
      title: 'Departmental Performance Reports',
      description: 'Cost Centers, P&L by Business Unit',
    },
  ];

  const customReports = [
    {
      id: 'custom1',
      title: 'Custom Revenue Report',
      description: 'Revenue vs. Expenses by Quarter',
    },
    {
      id: 'custom2',
      title: 'Regional Sales Report',
      description: 'Sales by Region',
    },
  ];

  // Render Chart or Table
  const renderChart = (reportId) => {
    const data = sampleData[reportId];
    if (!data || !data.tableData) {
      return (
        <div className="flex items-center justify-center h-48 bg-sky-50 rounded-lg">
          <p className="text-sky-600 text-sm">No data available</p>
        </div>
      );
    }

    const viewMode = viewModes[reportId] || 'chart';

    if (viewMode === 'table') {
      return (
        <div className="h-48 overflow-y-auto bg-white/50 rounded-lg border border-sky-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100 text-sky-800">
                {Object.keys(data.tableData[0]).map((key) => (
                  <th key={key} className="px-2 py-1 text-left capitalize">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.tableData.map((row, index) => (
                <tr key={index} className="border-b border-sky-200">
                  {Object.entries(row).map(([key, value], i) => (
                    <td key={i} className="px-2 py-1 text-sky-700">
                      {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    const chartType = chartTypes[reportId] || (
      reportId === 'arAging' || reportId === 'apAging' || reportId === 'custom2' || reportId === 'financialRatios' ? 'pie' :
      reportId === 'custom1' ? 'line' : 'bar'
    );

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10 } } },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: chartType !== 'pie' ? {
        x: { ticks: { font: { size: 8 } } },
        y: { ticks: { font: { size: 8 }, callback: (value) => `$${value.toLocaleString()}` } },
      } : undefined,
    };

    return (
      <div className="h-48 relative group">
        <motion.div
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {chartType === 'pie' ? (
            <Pie data={data} options={options} />
          ) : chartType === 'line' ? (
            <Line data={data} options={options} />
          ) : (
            <Bar data={data} options={options} />
          )}
        </motion.div>
      </div>
    );
  };

  // Render Related Data
  const renderRelatedData = (reportId) => {
    const data = sampleData[reportId];
    if (!data) return null;

    if (data.metrics) {
      return (
        <div className="space-y-2">
          {Object.entries(data.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-sky-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className={`text-sky-900 font-medium ${value < 0 ? 'text-red-600' : ''}`}>
                {typeof value === 'number' ? `$${Math.abs(value).toLocaleString()}` : value}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Fallback to mini-table
    return (
      <div className="max-h-32 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-sky-100 text-sky-800">
              {Object.keys(data.tableData[0]).map((key) => (
                <th key={key} className="px-2 py-1 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableData.slice(0, 3).map((row, index) => (
              <tr key={index} className="border-b border-sky-200">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-2 py-1 text-sky-700">
                    {typeof value === 'boolean' ? (value ? '↑' : '↓') : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex text-sky-900 items-center">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-sky-900 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-600"
            >
              <svg
                className="w-3 h-3 me-2.5 text-sky-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="text-sky-900">Dashboard</span>
            </a>
          </li>
          {/* <li>
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <a
                href="/p&l-Dashboard"
                className="ms-1 text-sm font-medium text-sky-900 hover:text-blue-600 md:ms-2"
              >
                Profit & Loss
              </a>
            </div>
          </li> */}
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white">Financial Reports</h1>
              <p className="text-sky-100 text-xs">Discover actionable financial insights</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="py-2 px-4 text-sm font-medium cursor-pointer text-sky-50 bg-sky-800 rounded-lg hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="12M">Last 12 Months</option>
                <option value="YTD">Year to Date</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center py-2 px-4 text-sm font-medium text-sky-50 bg-sky-800 rounded-lg hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <FiFilter className="mr-2" /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md mt-6 border border-sky-100"
              ref={filtersRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-sky-900">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-sky-600 hover:text-sky-800 flex items-center"
                >
                  <FiX className="mr-1" /> Reset
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Month</option>
                    <option>Quarter</option>
                    <option>YTD</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>All</option>
                    <option>Revenue</option>
                    <option>Expenses</option>
                    <option>Assets</option>
                    <option>Liabilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>All</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                    <option>R&D</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-lg p-4 mt-6 shadow-sm border border-sky-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="flex space-x-2">
            {['core', 'custom'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-sky-600 text-white'
                    : 'text-sky-600 bg-sky-100 hover:bg-sky-200'
                }`}
              >
                {tab === 'core' ? 'Core Reports' : 'Custom Reports'}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Report List */}
        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(activeTab === 'core' ? coreReports : customReports).map((report) => (
            <motion.div
              key={report.id}
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-sky-100 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
            >
              <button
                onClick={() => toggleReport(report.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-sky-50/50"
              >
                <div>
                  <h3 className="text-base font-semibold text-sky-900 flex items-center gap-2">
                    {report.title}
                    {report.id === 'pnl' && (
                      <Link
                        to="/p&l-Dashboard"
                        className="text-sky-500 hover:text-sky-700 hover:pl-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* <FiDollarSign className="w-5 h-5" /> */}
                        <GrLinkNext className="w-5 h-5" hover:w-7 h-7/>

                      </Link>
                    )}
                  </h3>
                  <p className="text-xs text-sky-600 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">
                    {report.id.includes('aging') ? 'Monthly' : 'Quarterly'}
                  </span>
                  {expandedReports[report.id] ? (
                    <FiChevronDown className="text-sky-500 w-5 h-5" />
                  ) : (
                    <FiChevronRight className="text-sky-500 w-5 h-5" />
                  )}
                </div>
              </button>
              {expandedReports[report.id] && (
                <div className="p-4 border-t border-sky-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                      {['bar', 'pie', 'line'].map((type) => (
                        <button
                          key={type}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChartTypeChange(report.id, type);
                          }}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            (chartTypes[report.id] || (
                              report.id === 'arAging' || report.id === 'apAging' || report.id === 'custom2' || report.id === 'financialRatios' ? 'pie' :
                              report.id === 'custom1' ? 'line' : 'bar'
                            )) === type
                              ? 'bg-sky-600 text-white'
                              : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                          } ${viewModes[report.id] === 'table' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={viewModes[report.id] === 'table'}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <CSVLink
                        data={sampleData[report.id]?.tableData || []}
                        filename={`${report.title}.csv`}
                        className="flex items-center px-3 py-1 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiDownload className="mr-1" /> CSV
                      </CSVLink>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                        }}
                        className="flex items-center px-3 py-1 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 text-xs"
                      >
                        <FiPrinter className="mr-1" /> Print
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewModeChange(report.id);
                        }}
                        className="flex items-center px-3 py-1 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 text-xs"
                      >
                        <FiTable className="mr-1" /> {viewModes[report.id] === 'table' ? 'Chart' : 'Table'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAIDropdown(report.id);
                        }}
                        className="flex items-center px-3 py-1 text-sky-800 rounded-lg hover:bg-sky-200 text-xs"
                      >
                        <BsStars className="mr-1" /> Ask AI
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 p-3 rounded-lg border border-sky-100">
                      {renderChart(report.id)}
                    </div>
                    <div className="bg-white/50 p-3 ml-35 rounded-lg border border-sky-100">
                      <h4 className="text-xs font-semibold text-sky-900 mb-2">Key Metrics</h4>
                      {renderRelatedData(report.id)}
                    </div>
                  </div>
                  {showAIDropdown === report.id && (
                    <motion.div
                      ref={aiChatbotRef}
                      className="mt-4 absolute top-28 right-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <h1 className="text-sm font-semibold text-sky-900 mb-2">
                        Ask about {report.title}
                      </h1>
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="text"
                          value={aiInputs[report.id] || ''}
                          onChange={(e) =>
                            setAiInputs((prev) => ({
                              ...prev,
                              [report.id]: e.target.value,
                            }))
                          }
                          placeholder="Ask AI about this report..."
                          className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendAIQuery(report.id);
                          }}
                          className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                          disabled={!aiInputs[report.id]?.trim()}
                        >
                          <FiSend className="w-5 h-5" />
                        </button>
                      </div>
                      {aiHistory[report.id]?.length > 0 && (
                        <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-sky-700">
                          {aiHistory[report.id].map((entry, index) => (
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
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialReports;