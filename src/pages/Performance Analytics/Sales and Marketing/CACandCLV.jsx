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
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiChevronRight, 
  FiFilter, 
  FiDollarSign,
  FiPieChart,
  FiUsers,
  FiSend,
  FiChevronDown,
  FiRefreshCw
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsCashCoin } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { GrLinkNext } from "react-icons/gr";

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

const CACandCLV = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    timePeriod: "Last Quarter",
    segment: "All Segments",
    channel: "All Channels"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState({
    cacClvTrend: "line",
    cacBreakdown: "doughnut"
  });
  const [aiInput, setAiInput] = useState("");
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const filtersRef = useRef(null);
  const aiDropdownRef = useRef(null);

  // Sample data for CAC/CLV metrics
  const cacClvData = {
    cacClvTrend: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "CAC ($)",
          data: [450, 420, 390, 410],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: "CLV ($)",
          data: [3200, 3500, 3800, 4100],
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    cacBreakdown: {
      labels: ["Paid Ads", "Content Marketing", "Events", "SEO", "Referrals"],
      datasets: [{
        label: "CAC Contribution",
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(239, 68, 68, 0.7)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 1
      }]
    },
    segmentPerformance: {
      labels: ["Enterprise", "SMB", "Startup", "Education"],
      datasets: [
        {
          label: "CAC ($)",
          data: [850, 350, 280, 420],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1
        },
        {
          label: "CLV ($)",
          data: [12500, 4200, 3800, 3500],
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1
        }
      ]
    },
    ratioTrend: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [{
        label: "CAC:CLV Ratio",
        data: [7.1, 8.3, 9.7, 10.0],
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 2,
        tension: 0.4
      }]
    }
  };

  const kpiData = [
    {
      title: "Average CAC",
      value: "$410",
      change: "+5%",
      isPositive: false,
      icon: <FiTrendingDown />,
      description: "Cost to acquire a new customer"
    },
    {
      title: "Average CLV",
      value: "$4,100",
      change: "+8%",
      isPositive: true,
      icon: <FiTrendingUp />,
      description: "Lifetime value per customer"
    },
    {
      title: "CAC:CLV Ratio",
      value: "1:10",
      change: "+0.3",
      isPositive: true,
      icon: <BsCashCoin />,
      description: "Ideal is 1:3 or better"
    },
    {
      title: "Payback Period",
      value: "14",
      change: "-2",
      isPositive: true,
      icon: <FiRefreshCw />,
      description: "Months to recover CAC"
    }
  ];

  const campaignData = [
    {
      campaign: "Q3 Webinar Series",
      spend: "$45,000",
      leads: 420,
      customers: 38,
      cac: "$1,184",
      clv: "$4,200",
      ratio: "1:3.5",
      channel: "Events"
    },
    {
      campaign: "Google Ads - Brand",
      spend: "$85,000",
      leads: 1250,
      customers: 92,
      cac: "$924",
      clv: "$3,800",
      ratio: "1:4.1",
      channel: "Paid Ads"
    },
    {
      campaign: "LinkedIn Content",
      spend: "$32,000",
      leads: 680,
      customers: 45,
      cac: "$711",
      clv: "$4,500",
      ratio: "1:6.3",
      channel: "Content"
    },
    {
      campaign: "SEO Organic",
      spend: "$28,000",
      leads: 950,
      customers: 65,
      cac: "$431",
      clv: "$5,200",
      ratio: "1:12.1",
      channel: "SEO"
    },
    {
      campaign: "Referral Program",
      spend: "$15,000",
      leads: 320,
      customers: 42,
      cac: "$357",
      clv: "$6,800",
      ratio: "1:19.0",
      channel: "Referrals"
    }
  ];

  const segmentData = [
    {
      segment: "Enterprise",
      cac: "$850",
      clv: "$12,500",
      ratio: "1:14.7",
      retention: "36 months",
      profitMargin: "42%"
    },
    {
      segment: "SMB",
      cac: "$350",
      clv: "$4,200",
      ratio: "1:12.0",
      retention: "24 months",
      profitMargin: "38%"
    },
    {
      segment: "Startup",
      cac: "$280",
      clv: "$3,800",
      ratio: "1:13.6",
      retention: "18 months",
      profitMargin: "35%"
    },
    {
      segment: "Education",
      cac: "$420",
      clv: "$3,500",
      ratio: "1:8.3",
      retention: "12 months",
      profitMargin: "30%"
    }
  ];

  const toggleChartType = (chartId, type) => {
    setSelectedChartType(prev => ({ ...prev, [chartId]: type }));
  };

  const handleSendAIQuery = () => {
    if (aiInput.trim()) {
      console.log("AI Query:", aiInput);
      setAiInput("");
      setShowAIDropdown(false);
    }
  };

  const renderChart = (type, data, options = {}) => {
    switch (type) {
      case "line": return <Line data={data} options={options} />;
      case "bar": return <Bar data={data} options={options} />;
      case "doughnut": return <Doughnut data={data} options={options} />;
      case "pie": return <Pie data={data} options={options} />;
      default: return <Bar data={data} options={options} />;
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setShowAIDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 p-4 min-h-screen bg-sky-50">
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
                      <Link to="/sales-performance-dashboard" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                        Sales Dashboard
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                      <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">CAC & CLV</span>
                    </div>
                  </li>
                </ol>
              </nav>
        
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Customer Acquisition Cost (CAC) & Lifetime Value (CLV)</h1>
            <p className="text-sky-100 text-xs">Profitability by customer segment</p>
            <p className="text-sky-100 text-xs mt-1">Data showing from 06/01/24 - 07/31/24</p>
          </div>
          <div className="flex space-x-2">
            {/* <button 
              type="button" 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" /> Filters
            </button> */}
            <button 
              type="button" 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              onClick={() => setShowAIDropdown(!showAIDropdown)}
            >
              <BsStars className="mr-1" /> Ask AI
            </button>
            <Link
                            to="/sales-performance-table"
                            >
                                 <button
                                     type="button"
                                     className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                                      View More
                                      <GrLinkNext className="ml-1 w-4 h-4 hover:w-5 hover:h-5 transition-all" />
                                 </button>
                         </Link>
          </div>
        </div>
      </div>

      {/* AI Dropdown */}
      {showAIDropdown && (
        <div ref={aiDropdownRef} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-800 mb-2">AI Assistant for CAC/CLV Analysis</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask about CAC trends, CLV predictions, or channel efficiency..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleSendAIQuery}
              className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
              disabled={!aiInput.trim()}
            >
              <FiSend />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>Try asking:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>"Which channel gives the lowest CAC?"</li>
              <li>"Forecast CAC next quarter for SMB vs Enterprise"</li>
              <li>"What's the optimal marketing spend to maintain 1:10 ratio?"</li>
            </ul>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.timePeriod}
                onChange={(e) => setFilters({...filters, timePeriod: e.target.value})}
              >
                <option>Last Quarter</option>
                <option>Last Month</option>
                <option>Last Week</option>
                <option>Year to Date</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Segment</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.segment}
                onChange={(e) => setFilters({...filters, segment: e.target.value})}
              >
                <option>All Segments</option>
                <option>Enterprise</option>
                <option>SMB</option>
                <option>Startup</option>
                <option>Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Channel</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.channel}
                onChange={(e) => setFilters({...filters, channel: e.target.value})}
              >
                <option>All Channels</option>
                <option>Paid Ads</option>
                <option>Content Marketing</option>
                <option>Events</option>
                <option>SEO</option>
                <option>Referrals</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-sky-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{kpi.title}</p>
                <p className="text-lg font-bold text-sky-900 mt-1">{kpi.value}</p>
                <div className={`flex items-center mt-2 ${kpi.isPositive ? "text-green-500" : "text-red-500"}`}>
                  <span className="text-xs font-medium">{kpi.change} {kpi.isPositive ? "↑" : "↓"} vs last period</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors duration-200">
                <div className="text-sky-600 hover:text-sky-800 transition-colors duration-200">{kpi.icon}</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAC/CLV Trend */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">CAC & CLV Trend</h3>
          </div>
          <div className="h-64">
            {renderChart(
              selectedChartType.cacClvTrend,
              cacClvData.cacClvTrend,
              {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'CAC ($)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'CLV ($)'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }
            )}
          </div>
        </div>

        {/* CAC Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">CAC by Acquisition Channel</h3>
          </div>
          <div className="h-64">
            {renderChart(
              selectedChartType.cacBreakdown,
              cacClvData.cacBreakdown,
              {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.raw}% ($${Math.round(context.raw/100 * 410 * 1000).toLocaleString()})`;
                      }
                    }
                  }
                }
              }
            )}
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Performance */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">CAC & CLV by Customer Segment</h3>
          </div>
          <div className="h-64">
            <Bar
              data={cacClvData.segmentPerformance}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            {cacClvData.segmentPerformance.labels.map((label, i) => (
              <div key={i} className="p-1 bg-sky-50 rounded">
                <p className="font-medium text-sky-800">{label}</p>
                <p className="text-gray-600">CAC: ${cacClvData.segmentPerformance.datasets[0].data[i]}</p>
                <p className="text-gray-600">CLV: ${cacClvData.segmentPerformance.datasets[1].data[i].toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ratio Trend */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">CAC:CLV Ratio Trend</h3>
          </div>
          <div className="h-64">
            <Line
              data={cacClvData.ratioTrend}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Ratio: ${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'CAC:CLV Ratio'
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>Industry benchmark: 1:3 (healthy), 1:5+ (excellent)</p>
          </div>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-sky-800">Campaign Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-sky-700 uppercase bg-sky-50">
              <tr>
                <th className="px-4 py-2">Campaign</th>
                <th className="px-4 py-2">Channel</th>
                <th className="px-4 py-2">Spend</th>
                <th className="px-4 py-2">Leads</th>
                <th className="px-4 py-2">Customers</th>
                <th className="px-4 py-2">CAC</th>
                <th className="px-4 py-2">CLV</th>
                <th className="px-4 py-2">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-sky-50">
                  <td className="px-4 py-2 font-medium">{row.campaign}</td>
                  <td className="px-4 py-2">{row.channel}</td>
                  <td className="px-4 py-2">{row.spend}</td>
                  <td className="px-4 py-2">{row.leads}</td>
                  <td className="px-4 py-2">{row.customers}</td>
                  <td className="px-4 py-2">{row.cac}</td>
                  <td className="px-4 py-2">{row.clv}</td>
                  <td className={`px-4 py-2 font-medium ${parseFloat(row.ratio.split(':')[1]) > 5 ? 'text-green-500' : 'text-amber-500'}`}>
                    {row.ratio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Segment Profitability Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-sky-800">Segment Profitability</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-sky-700 uppercase bg-sky-50">
              <tr>
                <th className="px-4 py-2">Segment</th>
                <th className="px-4 py-2">CAC</th>
                <th className="px-4 py-2">CLV</th>
                <th className="px-4 py-2">Ratio</th>
                <th className="px-4 py-2">Retention</th>
                <th className="px-4 py-2">Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {segmentData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-sky-50">
                  <td className="px-4 py-2 font-medium">{row.segment}</td>
                  <td className="px-4 py-2">{row.cac}</td>
                  <td className="px-4 py-2">{row.clv}</td>
                  <td className={`px-4 py-2 font-medium ${parseFloat(row.ratio.split(':')[1]) > 5 ? 'text-green-500' : 'text-amber-500'}`}>
                    {row.ratio}
                  </td>
                  <td className="px-4 py-2">{row.retention}</td>
                  <td className="px-4 py-2">{row.profitMargin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-sky-800">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Most Efficient Channel</h4>
            <p className="text-xs text-gray-700">Referral program has the lowest CAC at $357 and highest ratio at 1:19. Consider increasing referral incentives by 20% to scale this channel.</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Segment Opportunity</h4>
            <p className="text-xs text-gray-700">Education segment has the lowest ratio (1:8.3). Recommend reducing CAC through targeted content marketing rather than paid ads.</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Budget Optimization</h4>
            <p className="text-xs text-gray-700">Reallocating 15% of paid ads budget to SEO could improve overall CAC by ~8% based on current performance metrics.</p>
          </div>
        </div>
      </div>

      <ReactTooltip id="chart-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default CACandCLV;