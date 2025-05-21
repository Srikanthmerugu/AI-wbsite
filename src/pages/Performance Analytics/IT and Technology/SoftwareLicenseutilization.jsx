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
import { motion } from "framer-motion";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiChevronRight,
  FiFilter, 
  FiDollarSign,
  FiUsers,
  FiAlertCircle,
  FiPieChart,
  FiDatabase,
  FiCalendar,
  FiChevronDown,
  FiSend
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsLightningCharge } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RiDragMove2Fill } from "react-icons/ri";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SoftwareLicenseUtilization = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    period: "Current Quarter",
    vendor: "All Vendors",
    department: "All Departments",
    status: "All Statuses"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState({
    utilizationBySoftware: "bar",
    trendAnalysis: "line"
  });
  const [aiInput, setAiInput] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [dropdownWidget, setDropdownWidget] = useState(null);
  const [hoveredChartType, setHoveredChartType] = useState(null);
  const filtersRef = useRef(null);

  // Financial-grade license data
  const licenseData = {
    kpis: [
      {
        title: "Total Licenses",
        value: "2,850",
        change: "+8%",
        isPositive: false,
        icon: <FiDatabase />,
        description: "Total software licenses owned",
        forecast: "2,900 predicted next quarter",
        financialImpact: null
      },
      {
        title: "Active Ratio",
        value: "68%",
        change: "+3%",
        isPositive: true,
        icon: <FiUsers />,
        description: "Active licenses / Total licenses",
        forecast: "70% predicted next quarter",
        financialImpact: null
      },
      {
        title: "Underutilized",
        value: "24",
        change: "-5",
        isPositive: true,
        icon: <FiAlertCircle />,
        description: "Software products <50% utilized",
        forecast: "20 predicted next quarter",
        financialImpact: null
      },
      {
        title: "Wasted Spend",
        value: "$42K",
        change: "+$3K",
        isPositive: false,
        icon: <FiDollarSign />,
        description: "Monthly cost of inactive licenses",
        forecast: "$38K predicted next quarter",
        financialImpact: "$504K annualized"
      },
      {
        title: "Utilization Rate",
        value: "72%",
        change: "+2%",
        isPositive: true,
        icon: <FiPieChart />,
        description: "Overall license utilization",
        forecast: "74% predicted next quarter",
        financialImpact: "Benchmark: 80%"
      },
      {
        title: "Top Waste",
        value: "MS Office",
        change: "12% worse",
        isPositive: false,
        icon: <BsLightningCharge />,
        description: "Highest cost underutilization",
        forecast: "Adobe CC next quarter",
        financialImpact: "$15K/month"
      }
    ],
    utilizationBySoftware: {
      labels: ["MS Office", "Adobe CC", "Zoom", "Salesforce", "Slack", "AWS", "GSuite"],
      datasets: [{
        label: "Utilization %",
        data: [58, 72, 85, 68, 91, 78, 82],
        backgroundColor: [
          "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"
        ].map(c => `${c}80`),
        borderColor: [
          "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"
        ],
        borderWidth: 1
      }]
    },
    licenseDistribution: {
      labels: ["Active", "Inactive", "Unassigned"],
      datasets: [{
        data: [1938, 762, 150],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderColor: ["#059669", "#DC2626", "#D97706"],
        borderWidth: 1
      }]
    },
    departmentUtilization: {
      labels: ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations"],
      datasets: [
        {
          label: "Active",
          data: [420, 380, 210, 150, 120, 180],
          backgroundColor: "#10B981"
        },
        {
          label: "Inactive",
          data: [80, 120, 65, 45, 60, 55],
          backgroundColor: "#EF4444"
        },
        {
          label: "Unassigned",
          data: [25, 15, 10, 5, 20, 10],
          backgroundColor: "#F59E0B"
        }
      ]
    },
    utilizationTrend: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "Utilization Rate",
          data: [65, 68, 70, 69, 71, 72, 73, 72],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.3,
          fill: true
        },
        {
          label: "AI Forecast",
          data: [null, null, null, null, null, null, 73, 72],
          borderColor: "#3B82F6",
          borderDash: [5, 5],
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 0
        }
      ]
    }
  };

  const licenseTableData = [
    {
      software: "Microsoft Office 365",
      vendor: "Microsoft",
      licenses: 850,
      active: 490,
      inactive: 360,
      utilization: "58%",
      costPerLicense: "$12",
      totalCost: "$10,200",
      wasted: "$4,320",
      renewal: "2024-12-15",
      department: "Company-wide"
    },
    {
      software: "Adobe Creative Cloud",
      vendor: "Adobe",
      licenses: 320,
      active: 230,
      inactive: 90,
      utilization: "72%",
      costPerLicense: "$45",
      totalCost: "$14,400",
      wasted: "$4,050",
      renewal: "2024-11-01",
      department: "Marketing"
    },
    {
      software: "Zoom Pro",
      vendor: "Zoom",
      licenses: 280,
      active: 238,
      inactive: 42,
      utilization: "85%",
      costPerLicense: "$15",
      totalCost: "$4,200",
      wasted: "$630",
      renewal: "2025-03-01",
      department: "Company-wide"
    },
    {
      software: "Salesforce Enterprise",
      vendor: "Salesforce",
      licenses: 180,
      active: 122,
      inactive: 58,
      utilization: "68%",
      costPerLicense: "$150",
      totalCost: "$27,000",
      wasted: "$8,700",
      renewal: "2024-09-30",
      department: "Sales"
    },
    {
      software: "Slack Enterprise",
      vendor: "Slack",
      licenses: 300,
      active: 273,
      inactive: 27,
      utilization: "91%",
      costPerLicense: "$12",
      totalCost: "$3,600",
      wasted: "$324",
      renewal: "2025-01-15",
      department: "Company-wide"
    }
  ];

  const aiRecommendations = [
    {
      title: "Microsoft License Reclamation",
      description: "360 inactive Office 365 licenses identified. Reclaiming could save $4,320/month.",
      action: "Reclaim Licenses",
      impact: "$51,840 annual savings",
      urgency: "high"
    },
    {
      title: "Adobe License Tier Adjustment",
      description: "72 casual users could downgrade to lower-tier plan, saving $2,880/month.",
      action: "Downgrade Plan",
      impact: "$34,560 annual savings",
      urgency: "medium"
    },
    {
      title: "Salesforce License Reallocation",
      description: "22 inactive Sales licenses could be reassigned to new Marketing hires.",
      action: "Reassign Licenses",
      impact: "$3,300 monthly cost avoidance",
      urgency: "medium"
    }
  ];

  const toggleChartType = (chartId, type) => {
    setSelectedChartType(prev => ({ ...prev, [chartId]: type }));
  };

  const handleSendAIQuery = (widgetId) => {
    if (aiInput[widgetId]?.trim()) {
      console.log(`AI Query for ${widgetId}:`, aiInput[widgetId]);
      setAiInput(prev => ({ ...prev, [widgetId]: "" }));
      setShowAIDropdown(null);
    }
  };

  const renderChart = (type, data, options = {}) => {
    switch (type) {
      case "line": return <Line data={data} options={options} />;
      case "bar": return <Bar data={data} options={options} />;
      case "doughnut": return <Doughnut data={data} options={options} />;
      default: return <Bar data={data} options={options} />;
    }
  };

  const EnhancedChartCard = ({ title, chartType, chartData, widgetId }) => {
    const dropdownRef = useOutsideClick(() => setDropdownWidget(null));
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-gray-800">{title}</h3>
          <div className="flex space-x-2 relative">
            <button 
              onClick={() => setShowAIDropdown(showAIDropdown === widgetId ? null : widgetId)} 
              className="p-1 rounded hover:bg-gray-100" 
              data-tooltip-id="ai-tooltip" 
              data-tooltip-content="Ask AI"
            >
              <BsStars />
            </button>
            {showAIDropdown === widgetId && (
              <div className="absolute right-0 top-5 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-2">
                <div className="flex flex-col items-center space-x-2">
                  <h1 className="text-xs">Ask about {title}</h1>
                  <div className="flex justify-between gap-3">
                    <input 
                      type="text" 
                      value={aiInput[widgetId] || ""} 
                      onChange={(e) => setAiInput(prev => ({ ...prev, [widgetId]: e.target.value }))} 
                      placeholder="Ask AI..." 
                      className="w-full p-1 border border-gray-300 rounded text-xs" 
                    />
                    <button 
                      onClick={() => handleSendAIQuery(widgetId)} 
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
                      disabled={!aiInput[widgetId]?.trim()}
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-48">
          {renderChart(chartType, chartData.data, chartData.options)}
        </div>
      </div>
    );
  };

  const KPICard = ({ title, value, change, isPositive, icon, description, forecast, financialImpact }) => {
    return (
      <motion.div 
        variants={cardVariants} 
        initial="hidden" 
        animate="visible" 
        whileHover={{ y: -3 }} 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
            <div className={`flex items-center mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              <span className="text-xs font-medium">{change} {isPositive ? "↑" : "↓"}</span>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{description}</p>
              {financialImpact && (
                <p className="text-xs font-medium text-gray-700 mt-1">{financialImpact}</p>
              )}
              <p className="text-xs text-gray-500 italic mt-1">Forecast: {forecast}</p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-gray-100">
            <div className="text-gray-600">{icon}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              <Link to="/it-technology-spend" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                IT & Technology
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">License Utilization</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Software License Utilization</h1>
            <p className="text-blue-100 text-xs">Optimize license allocation and reduce wasted spend</p>
            <p className="text-blue-100 text-xs mt-1">Data updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              type="button" 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-blue-900 rounded-lg border border-blue-200 hover:bg-white hover:text-blue-900 transition-colors duration-200" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
              >
                <option>Current Quarter</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.vendor}
                onChange={(e) => setFilters({...filters, vendor: e.target.value})}
              >
                <option>All Vendors</option>
                <option>Microsoft</option>
                <option>Adobe</option>
                <option>Salesforce</option>
                <option>Zoom</option>
                <option>Slack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Underutilized</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {licenseData.kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            icon={kpi.icon}
            description={kpi.description}
            forecast={kpi.forecast}
            financialImpact={kpi.financialImpact}
          />
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization by Software */}
        <EnhancedChartCard 
          title="License Utilization by Software" 
          chartType={selectedChartType.utilizationBySoftware} 
          chartData={{
            data: licenseData.utilizationBySoftware,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `${context.label}: ${context.raw}% utilization`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }
          }} 
          widgetId="utilizationBySoftware" 
        />

        {/* License Distribution */}
        <EnhancedChartCard 
          title="License Distribution" 
          chartType="doughnut" 
          chartData={{
            data: licenseData.licenseDistribution,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right' },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} licenses (${percentage}%)`;
                    }
                  }
                }
              }
            }
          }} 
          widgetId="licenseDistribution" 
        />
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Utilization */}
        <EnhancedChartCard 
          title="Department-wise License Utilization" 
          chartType="bar" 
          chartData={{
            data: licenseData.departmentUtilization,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true
                }
              }
            }
          }} 
          widgetId="departmentUtilization" 
        />

        {/* Utilization Trend */}
        <EnhancedChartCard 
          title="Utilization Trend with Forecast" 
          chartType={selectedChartType.trendAnalysis} 
          chartData={{
            data: licenseData.utilizationTrend,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              },
              scales: {
                y: {
                  min: 50,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }
          }} 
          widgetId="trendAnalysis" 
        />
      </div>

      {/* License Details Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-800">License Inventory Details</h3>
          <div className="flex space-x-2">
            <button className="text-xs text-blue-600 hover:text-blue-800">
              Export CSV
            </button>
            <button className="text-xs text-blue-600 hover:text-blue-800">
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Software</th>
                <th className="px-4 py-2">Vendor</th>
                <th className="px-4 py-2">Licenses</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Inactive</th>
                <th className="px-4 py-2">Utilization</th>
                <th className="px-4 py-2">Monthly Cost</th>
                <th className="px-4 py-2">Wasted</th>
                <th className="px-4 py-2">Renewal</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenseTableData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{row.software}</td>
                  <td className="px-4 py-2">{row.vendor}</td>
                  <td className="px-4 py-2">{row.licenses}</td>
                  <td className="px-4 py-2">{row.active}</td>
                  <td className="px-4 py-2">{row.inactive}</td>
                  <td className={`px-4 py-2 font-medium ${
                    parseFloat(row.utilization) > 80 ? "text-green-600" : 
                    parseFloat(row.utilization) > 60 ? "text-amber-500" : "text-red-600"
                  }`}>{row.utilization}</td>
                  <td className="px-4 py-2">{row.totalCost}</td>
                  <td className="px-4 py-2 text-red-600">{row.wasted}</td>
                  <td className="px-4 py-2">{row.renewal}</td>
                  <td className="px-4 py-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800 mr-2">
                      Optimize
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-gray-800">AI-Powered Optimization Recommendations</h3>
          <button 
            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
            onClick={() => setShowAIDropdown("aiRecommendations")}
          >
            <BsStars className="mr-1" /> Ask AI
          </button>
        </div>
        {showAIDropdown === "aiRecommendations" && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={aiInput["aiRecommendations"] || ""}
                onChange={(e) => setAiInput(prev => ({ ...prev, ["aiRecommendations"]: e.target.value }))}
                placeholder="Ask about license optimization..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={() => handleSendAIQuery("aiRecommendations")}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!aiInput["aiRecommendations"]?.trim()}
              >
                <FiSend />
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiRecommendations.map((rec, i) => (
            <div key={i} className={`p-3 rounded-lg border ${
              rec.urgency === "high" ? "border-red-200 bg-red-50" : 
              rec.urgency === "medium" ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"
            }`}>
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-800 mb-2">{rec.title}</h4>
                {rec.urgency === "high" && (
                  <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">High Impact</span>
                )}
              </div>
              <p className="text-xs text-gray-700 mb-3">{rec.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-700">{rec.impact}</span>
                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  {rec.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default SoftwareLicenseUtilization;