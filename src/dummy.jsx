// src/pages/Budgeting/RevenueBasedBudgeting/RevenueBasedBudgeting.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiDownload,
  FiSend,
  FiChevronDown,
  FiChevronRight,
  FiTrendingUp,
  FiTarget,
  FiRepeat,
  FiEdit,
  FiPlus,
  FiSearch
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsGraphUp, BsPieChart, BsTable } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { formatCurrency, formatPercentage } from "../../../utils/formatters";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// Custom hooks
const useOutsideClick = (callback) => {
  const ref = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);
  return ref;
};

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
};

// Revenue types for dropdown
const REVENUE_TYPES = [
  { value: "subscription", label: "Subscription (Recurring)" },
  { value: "product", label: "Product (One-time)" },
  { value: "services", label: "Services" },
  { value: "licensing", label: "Licensing" },
];

// Mock data structure for revenue projections
const initialRevenueData = [
  {
    id: "cust-001",
    client: "Acme Corp",
    product: "Enterprise SaaS",
    revenueType: "subscription",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    units: 150,
    unitPrice: 500,
    monthlyRevenue: 75000,
    annualRevenue: 900000,
    churnRate: 5,
    upsellRate: 10,
    winProbability: 95,
    historicalGrowth: 12,
    aiConfidence: 92,
    segments: ["enterprise", "west-region"],
  },
  {
    id: "cust-002",
    client: "Beta Solutions",
    product: "Professional Services",
    revenueType: "services",
    startDate: "2025-03-15",
    endDate: "2025-09-15",
    units: 10,
    unitPrice: 1000,
    monthlyRevenue: 10000,
    annualRevenue: 60000,
    churnRate: 0,
    upsellRate: 0,
    winProbability: 85,
    historicalGrowth: 8,
    aiConfidence: 88,
    segments: ["midmarket", "central-region"],
  },
  // More sample clients...
];

// KPI data
const kpiData = [
  { 
    id: "totalRevenue", 
    title: "Total Projected Revenue", 
    value: 4850000, 
    change: "+15% vs LY", 
    isPositive: true, 
    icon: <FiTrendingUp size={16}/>, 
    componentPath: "#" 
  },
  { 
    id: "recurringRevenue", 
    title: "Recurring Revenue", 
    value: 3200000, 
    change: "66% of Total", 
    isPositive: true, 
    icon: <FiRepeat size={16}/>, 
    componentPath: "#" 
  },
  { 
    id: "newBusiness", 
    title: "New Business", 
    value: 850000, 
    change: "+22% vs Target", 
    isPositive: true, 
    icon: <FiTarget size={16}/>, 
    componentPath: "#" 
  },
  { 
    id: "netRevenueRetention", 
    title: "Net Revenue Retention", 
    value: 108, 
    change: "+3% vs LY", 
    isPositive: true, 
    icon: <FiDollarSign size={16}/>, 
    componentPath: "#",
    format: (val) => `${val}%`
  },
];

// Chart configurations
const charts = {
  revenueMix: {
    title: "Revenue Mix by Type",
    data: {
      labels: ["Subscription", "Product", "Services", "Licensing"],
      datasets: [{
        data: [3200000, 850000, 600000, 200000],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  },
  revenueTrend: {
    title: "Monthly Revenue Trend",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Projected",
          data: [350000, 370000, 390000, 400000, 420000, 440000, 450000, 470000, 490000, 500000, 520000, 540000],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Previous Year",
          data: [300000, 310000, 330000, 340000, 350000, 360000, 370000, 380000, 400000, 410000, 420000, 430000],
          borderColor: "#94A3B8",
          borderDash: [5, 5],
          backgroundColor: "transparent",
          tension: 0.4
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { 
          ticks: { callback: value => formatCurrency(value) },
          title: { display: true, text: 'Revenue' }
        }
      }
    }
  },
  churnAnalysis: {
    title: "Churn & Retention Analysis",
    data: {
      labels: ["Enterprise", "Midmarket", "SMB"],
      datasets: [
        {
          label: "Churn Rate",
          data: [5, 8, 12],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          yAxisID: 'y'
        },
        {
          label: "Net Retention",
          data: [112, 105, 98],
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Churn Rate %' },
          ticks: { callback: value => `${value}%` },
          min: 0,
          max: 15
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Net Retention %' },
          ticks: { callback: value => `${value}%` },
          min: 90,
          max: 120,
          grid: { drawOnChartArea: false }
        }
      }
    }
  }
};

// Enhanced Chart Card Component
const ChartCard = ({ title, chartData, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartType, setChartType] = useState('bar');
  
  const renderChart = () => {
    switch (chartType) {
      case 'bar': return <Bar data={chartData.data} options={chartData.options} />;
      case 'line': return <Line data={chartData.data} options={chartData.options} />;
      case 'doughnut': return <Doughnut data={chartData.data} options={chartData.options} />;
      default: return <Bar data={chartData.data} options={chartData.options} />;
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          {title === "Revenue Mix by Type" && <BsPieChart className="text-blue-500" />}
          {title === "Monthly Revenue Trend" && <BsGraphUp className="text-blue-500" />}
          {title === "Churn & Retention Analysis" && <BsTable className="text-blue-500" />}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="doughnut">Doughnut</option>
          </select>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-500 hover:text-slate-700"
          >
            {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <div className="h-64">{renderChart()}</div>
              {children && (
                <div className="mt-4 text-sm text-slate-600">
                  {children}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Revenue Projection Table Component
const RevenueProjectionTable = ({ data, onEdit }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter] = useState('');
  const [revenueTypeFilter, setRevenueTypeFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(filter.toLowerCase()) || 
                         item.product.toLowerCase().includes(filter.toLowerCase());
    const matchesType = revenueTypeFilter === 'all' || item.revenueType === revenueTypeFilter;
    return matchesSearch && matchesType;
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Revenue Projections</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={revenueTypeFilter}
            onChange={(e) => setRevenueTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All Revenue Types</option>
            {REVENUE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Client / Product</th>
              <th className="px-4 py-3 text-left font-medium">Revenue Type</th>
              <th className="px-4 py-3 text-right font-medium">Monthly Revenue</th>
              <th className="px-4 py-3 text-right font-medium">Annual Revenue</th>
              <th className="px-4 py-3 text-right font-medium">Churn Rate</th>
              <th className="px-4 py-3 text-right font-medium">Upsell Rate</th>
              <th className="px-4 py-3 text-right font-medium">AI Confidence</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <tr 
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => toggleRow(item.id)}
                >
                  <td className="px-4 py-3 font-medium text-slate-700">
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleRow(item.id); }}
                        className="mr-2 text-slate-400 hover:text-slate-600"
                      >
                        {expandedRow === item.id ? <FiChevronDown /> : <FiChevronRight />}
                      </button>
                      <div>
                        <div className="font-medium">{item.client}</div>
                        <div className="text-xs text-slate-500">{item.product}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.revenueType === 'subscription' ? 'bg-blue-100 text-blue-800' :
                      item.revenueType === 'product' ? 'bg-green-100 text-green-800' :
                      item.revenueType === 'services' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {REVENUE_TYPES.find(t => t.value === item.revenueType)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    {formatCurrency(item.monthlyRevenue)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    {formatCurrency(item.annualRevenue)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.churnRate < 5 ? 'bg-green-100 text-green-800' :
                      item.churnRate < 10 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.churnRate}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.upsellRate > 15 ? 'bg-green-100 text-green-800' :
                      item.upsellRate > 5 ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {item.upsellRate}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-full max-w-[80px] bg-slate-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.aiConfidence >= 85 ? 'bg-green-500' :
                            item.aiConfidence >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${item.aiConfidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{item.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                      className="p-1 text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
                
                {expandedRow === item.id && (
                  <tr className="bg-slate-50">
                    <td colSpan="8" className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 mb-1">Contract Period</h4>
                          <p className="text-sm">{item.startDate} to {item.endDate}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 mb-1">Pricing</h4>
                          <p className="text-sm">{item.units} units × {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 mb-1">AI Insights</h4>
                          <p className="text-sm">
                            {item.aiConfidence >= 85 ? 'High confidence' : 
                             item.aiConfidence >= 70 ? 'Moderate confidence' : 'Low confidence'} based on historical trends
                          </p>
                        </div>
                        <div className="md:col-span-3">
                          <h4 className="text-xs font-semibold text-slate-500 mb-1">Segments</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.segments.map(segment => (
                              <span key={segment} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                                {segment}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, change, isPositive, icon, format = (val) => val }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{format(value)}</p>
          <div className={`flex items-center mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const RevenueBasedBudgeting = () => {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState(initialRevenueData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [filters, setFilters] = useState({
    period: "2025",
    scenario: "Base",
    view: "Detailed"
  });
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useOutsideClick(() => setShowFilters(false));

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedItem) => {
    setRevenueData(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setIsEditModalOpen(false);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.annualRevenue, 0);
  const recurringRevenue = revenueData
    .filter(item => item.revenueType === 'subscription')
    .reduce((sum, item) => sum + item.annualRevenue, 0);

  // Update KPIs with calculated values
  const updatedKpiData = kpiData.map(kpi => {
    if (kpi.id === 'totalRevenue') return { ...kpi, value: totalRevenue };
    if (kpi.id === 'recurringRevenue') return { ...kpi, value: recurringRevenue };
    return kpi;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-5 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue-Based Budgeting</h1>
            <p className="text-blue-100 text-sm mt-1">
              Align spending with income trends and performance metrics
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg border border-blue-300 hover:bg-white hover:text-blue-800 transition-colors"
            >
              <FiFilter /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg border border-blue-300 hover:bg-white hover:text-blue-800 transition-colors">
              <FiDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-md mb-6 border border-slate-200"
          ref={filtersRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget Period</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scenario</label>
              <select
                value={filters.scenario}
                onChange={(e) => setFilters({...filters, scenario: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="Base">Base</option>
                <option value="Optimistic">Optimistic (+15%)</option>
                <option value="Pessimistic">Pessimistic (-10%)</option>
                <option value="Downside">Downside (-25%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">View</label>
              <select
                value={filters.view}
                onChange={(e) => setFilters({...filters, view: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="Summary">Summary</option>
                <option value="Detailed">Detailed</option>
                <option value="By Product">By Product</option>
                <option value="By Region">By Region</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button 
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/budgeting" className="hover:text-blue-600">Budgeting</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-blue-600">Revenue-Based</span>
      </div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        {updatedKpiData.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Mix Chart */}
        <div className="lg:col-span-1">
          <ChartCard title="Revenue Mix by Type" chartData={charts.revenueMix}>
            <div className="mt-3 text-xs text-slate-600">
              <div className="flex items-start gap-2 mb-2">
                <BsStars className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p>
                  <span className="font-semibold">AI Insight:</span> Recurring revenue accounts for {Math.round((recurringRevenue / totalRevenue) * 100)}% of total projected revenue. Consider increasing investment in customer success to maintain high retention.
                </p>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Revenue Trend" chartData={charts.revenueTrend}>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="text-xs text-slate-600">
                <div className="font-semibold mb-1">Seasonal Pattern:</div>
                <p>Revenue typically increases 8-12% in Q4 due to seasonal demand. AI has projected a conservative 7% increase.</p>
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-semibold mb-1">Recommendation:</div>
                <p>Align marketing spend with projected revenue growth to maximize ROI during peak periods.</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Revenue Projection Table */}
      <div className="mb-6">
        <RevenueProjectionTable data={revenueData} onEdit={handleEdit} />
      </div>

      {/* Churn Analysis Chart */}
      <div className="mb-6">
        <ChartCard title="Churn & Retention Analysis" chartData={charts.churnAnalysis}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="text-xs text-slate-600">
              <div className="font-semibold mb-1">Key Finding:</div>
              <p>SMB segment shows higher churn (12%) but also has the highest upsell potential. Focus retention efforts here.</p>
            </div>
            <div className="text-xs text-slate-600">
              <div className="font-semibold mb-1">AI Suggestion:</div>
              <p>Implement targeted customer success programs for SMBs to reduce churn by 3-5% while maintaining upsell rates.</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && currentEditItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Edit Revenue Projection: {currentEditItem.client}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                  <input
                    type="text"
                    value={currentEditItem.client}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, client: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                  <input
                    type="text"
                    value={currentEditItem.product}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, product: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Revenue Type</label>
                  <select
                    value={currentEditItem.revenueType}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, revenueType: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    {REVENUE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Units</label>
                  <input
                    type="number"
                    value={currentEditItem.units}
                    onChange={(e) => {
                      const units = parseInt(e.target.value) || 0;
                      const monthlyRevenue = units * currentEditItem.unitPrice;
                      setCurrentEditItem({
                        ...currentEditItem,
                        units,
                        monthlyRevenue,
                        annualRevenue: monthlyRevenue * (currentEditItem.revenueType === 'subscription' ? 12 : 1)
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={currentEditItem.unitPrice}
                    onChange={(e) => {
                      const unitPrice = parseInt(e.target.value) || 0;
                      const monthlyRevenue = currentEditItem.units * unitPrice;
                      setCurrentEditItem({
                        ...currentEditItem,
                        unitPrice,
                        monthlyRevenue,
                        annualRevenue: monthlyRevenue * (currentEditItem.revenueType === 'subscription' ? 12 : 1)
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Churn Rate (%)</label>
                  <input
                    type="number"
                    value={currentEditItem.churnRate}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, churnRate: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upsell Rate (%)</label>
                  <input
                    type="number"
                    value={currentEditItem.upsellRate}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, upsellRate: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    value={currentEditItem.winProbability}
                    onChange={(e) => setCurrentEditItem({...currentEditItem, winProbability: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contract Period</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={currentEditItem.startDate}
                      onChange={(e) => setCurrentEditItem({...currentEditItem, startDate: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-md"
                   