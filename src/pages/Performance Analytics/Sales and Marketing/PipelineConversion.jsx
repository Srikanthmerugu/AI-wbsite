import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  FiFilter, 
  FiClock, 
  FiUsers, 
  FiDollarSign,
  FiSend,
  FiChevronDown,
  FiRefreshCw,
  FiChevronRight
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

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

const PipelineConversion = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    timePeriod: "Last Quarter",
    team: "All Teams",
    leadSource: "All Sources"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState({
    conversionTrend: "line",
    stageDuration: "bar"
  });
  const [aiInput, setAiInput] = useState("");
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const filtersRef = useRef(null);
  const aiDropdownRef = useRef(null);

  // Sample data for the pipeline metrics
  const pipelineData = {
    funnelMetrics: {
      labels: ["Leads", "MQLs", "SQLs", "Opportunities", "Wins"],
      datasets: [{
        data: [12500, 8500, 4890, 2450, 628],
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
    conversionRates: {
      labels: ["Lead to MQL", "MQL to SQL", "SQL to Oppty", "Oppty to Win"],
      datasets: [{
        label: "Conversion Rate (%)",
        data: [68, 57.5, 50.1, 25.6],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1
      }]
    },
    conversionTrend: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Lead to MQL (%)",
          data: [65, 68, 70, 72],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: "Oppty to Win (%)",
          data: [22, 25, 26, 28],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    stageDuration: {
      labels: ["Prospect", "Qualify", "Demo", "Proposal", "Negotiation", "Close"],
      datasets: [{
        label: "Days in Stage",
        data: [7, 14, 21, 10, 18, 12],
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1
      }]
    },
    leadSourcePerformance: {
      labels: ["Web", "Social", "Email", "PPC", "Event", "Referral", "Other"],
      datasets: [
        {
          label: "Leads",
          data: [4200, 3800, 1500, 1200, 800, 700, 300],
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1
        },
        {
          label: "Conversion Rate (%)",
          data: [18, 15, 22, 12, 25, 30, 10],
          backgroundColor: "rgba(234, 179, 8, 0.7)",
          borderColor: "rgba(234, 179, 8, 1)",
          borderWidth: 1
        }
      ]
    }
  };

  const kpiData = [
    {
      title: "Lead-to-Customer Rate",
      value: "5.02%",
      change: "+0.8%",
      isPositive: true,
      icon: <FiTrendingUp />,
      description: "Percentage of leads that convert to customers"
    },
    {
      title: "Avg Deal Close Time",
      value: "42",
      change: "-3",
      isPositive: true,
      icon: <FiClock />,
      description: "Average days from lead to closed deal"
    },
    {
      title: "Avg Touchpoints",
      value: "8.2",
      change: "+0.5",
      isPositive: false,
      icon: <FiUsers />,
      description: "Average interactions per opportunity"
    },
    {
      title: "Pipeline Value",
      value: "$3.2M",
      change: "+12%",
      isPositive: true,
      icon: <FiDollarSign />,
      description: "Total value of current opportunities"
    }
  ];

  const pipelineTableData = [
    {
      leadSource: "Web",
      leads: 4200,
      mqls: 2856,
      sqls: 1642,
      opportunities: 823,
      wins: 210,
      conversionRate: "5.0%",
      avgDaysToClose: 45
    },
    {
      leadSource: "Social",
      leads: 3800,
      mqls: 2470,
      sqls: 1420,
      opportunities: 710,
      wins: 182,
      conversionRate: "4.8%",
      avgDaysToClose: 52
    },
    {
      leadSource: "Email",
      leads: 1500,
      mqls: 1125,
      sqls: 647,
      opportunities: 324,
      wins: 83,
      conversionRate: "5.5%",
      avgDaysToClose: 38
    },
    {
      leadSource: "PPC",
      leads: 1200,
      mqls: 780,
      sqls: 449,
      opportunities: 225,
      wins: 58,
      conversionRate: "4.8%",
      avgDaysToClose: 49
    },
    {
      leadSource: "Event",
      leads: 800,
      mqls: 600,
      sqls: 345,
      opportunities: 173,
      wins: 50,
      conversionRate: "6.3%",
      avgDaysToClose: 41
    }
  ];

  const toggleChartType = (chartId, type) => {
    setSelectedChartType(prev => ({ ...prev, [chartId]: type }));
  };

  const handleSendAIQuery = (widgetId) => {
    if (aiInput[widgetId]?.trim()) {
      console.log(`AI Query for ${widgetId}:`, aiInput[widgetId]);
      setaiInput(prev => ({ ...prev, [widgetId]: "" }));
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
                      <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Pipeline & Conversion</span>
                    </div>
                  </li>
                </ol>
              </nav>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Pipeline & Conversion Analysis</h1>
            <p className="text-sky-100 text-xs">Lead-to-Customer Ratio, Deal Close Time</p>
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
          </div>
        </div>
      </div>

      {/* AI Dropdown */}
      {showAIDropdown && (
        <div ref={aiDropdownRef} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-800 mb-2">AI Assistant for Pipeline Analysis</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask about conversion rates, bottlenecks, or predictions..."
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
              <li>"Why are MQL to SQL conversions dropping in Q2?"</li>
              <li>"Predict close rate based on current pipeline."</li>
              <li>"Which lead source has the shortest sales cycle?"</li>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Team</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.team}
                onChange={(e) => setFilters({...filters, team: e.target.value})}
              >
                <option>All Teams</option>
                <option>Enterprise Sales</option>
                <option>SMB Sales</option>
                <option>Inside Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.leadSource}
                onChange={(e) => setFilters({...filters, leadSource: e.target.value})}
              >
                <option>All Sources</option>
                <option>Web</option>
                <option>Social</option>
                <option>Email</option>
                <option>PPC</option>
                <option>Event</option>
                <option>Referral</option>
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
              <button 
                            onClick={() =>  setShowAIDropdown(showAIDropdown === widgetId ? null : widgetId)} 
                            className="p-1 rounded hover:bg-gray-100" 
                            data-tooltip-id="ai-tooltip" 
                            data-tooltip-content="Ask AI"
                          >
                            <BsStars />
                          </button>
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
        {/* Funnel Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">Sales Funnel Metrics</h3>
          </div>
          <div className="h-64">
            <Bar
              data={pipelineData.funnelMetrics}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.x.toLocaleString()} ${context.dataset.label || ''}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Number of Leads'
                    }
                  },
                  y: {
                    stacked: true
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
            {pipelineData.funnelMetrics.labels.map((label, i) => (
              <div key={i} className="p-1 bg-sky-50 rounded">
                <p className="font-medium text-sky-800">{label}</p>
                <p className="text-gray-600">{pipelineData.funnelMetrics.datasets[0].data[i].toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">Conversion Rates by Stage</h3>
          </div>
          <div className="h-64">
            <Bar
              data={pipelineData.conversionRates}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y}% conversion`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Conversion Rate (%)'
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            {pipelineData.conversionRates.labels.map((label, i) => (
              <div key={i} className="p-1 bg-sky-50 rounded">
                <p className="font-medium text-sky-800">{label}</p>
                <p className="text-gray-600">{pipelineData.conversionRates.datasets[0].data[i]}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Trend */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">Conversion Trends Over Time</h3>
          </div>
          <div className="h-64">
            {renderChart(
              selectedChartType.conversionTrend,
              pipelineData.conversionTrend,
              {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Conversion Rate (%)'
                    }
                  }
                }
              }
            )}
          </div>
        </div>

        {/* Stage Duration */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800">Average Days in Each Sales Stage</h3>
          </div>
          <div className="h-64">
            {renderChart(
              selectedChartType.stageDuration,
              pipelineData.stageDuration,
              {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Days in Stage'
                    }
                  }
                }
              }
            )}
          </div>
        </div>
      </div>

      {/* Lead Source Performance Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-sky-800">Lead Source Performance</h3>
          {/* <button 
            className="flex items-center text-xs text-sky-600 hover:text-sky-800"
            onClick={() => navigate("/pipeline-conversion")}
          >
            View Detailed Analysis <FiChevronDown className="ml-1" />
          </button> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-sky-700 uppercase bg-sky-50">
              <tr>
                <th className="px-4 py-2">Lead Source</th>
                <th className="px-4 py-2">Leads</th>
                <th className="px-4 py-2">MQLs</th>
                <th className="px-4 py-2">SQLs</th>
                <th className="px-4 py-2">Oppties</th>
                <th className="px-4 py-2">Wins</th>
                <th className="px-4 py-2">Conv. Rate</th>
                <th className="px-4 py-2">Avg Days</th>
              </tr>
            </thead>
            <tbody>
              {pipelineTableData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-sky-50">
                  <td className="px-4 py-2 font-medium">{row.leadSource}</td>
                  <td className="px-4 py-2">{row.leads.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.mqls.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.sqls.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.opportunities.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.wins.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.conversionRate}</td>
                  <td className="px-4 py-2">{row.avgDaysToClose}</td>
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
          <button 
            className="flex items-center text-xs text-sky-600 hover:text-sky-800"
            onClick={() => setShowAIDropdown(true)}
          >
            <BsStars className="mr-1" /> Ask Another Question
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Conversion Bottleneck</h4>
            <p className="text-xs text-gray-700">The largest drop in your funnel is from SQL to Opportunity (50.1%). Consider additional qualification criteria or sales training to improve this stage.</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Fastest Converting Source</h4>
            <p className="text-xs text-gray-700">Event leads convert at 6.3% (vs average 5.02%) and close in 41 days. Consider increasing event marketing budget by 15-20%.</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-sky-800 mb-2">Pipeline Forecast</h4>
            <p className="text-xs text-gray-700">Based on current pipeline of $3.2M and historical close rates, predicted revenue next quarter is $2.4-$2.7M.</p>
          </div>
        </div>
      </div>

      <ReactTooltip id="chart-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default PipelineConversion;