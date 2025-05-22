import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble } from "react-chartjs-2";
import { FiFilter, FiPlus, FiSend, FiEye, FiEyeOff } from "react-icons/fi"; // Changed: Added FiEye and FiEyeOff for toggling visibility
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RiDragMove2Fill } from "react-icons/ri";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Sample KPI Data (aligned with sidebar metrics)
const kpiData = {
  revenuePerEmployee: {
    title: "Revenue per Employee",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue/Employee ($K)",
          data: [50, 60, 70, 90, 100, 120],
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    value: 120,
    change: "+10%",
    defaultType: "line",
    // Changed: Added detailed data for modal
    details: {
      description: "Revenue generated per employee over the last 6 months.",
      breakdown: [
        { month: "Jan", value: 50, department: "Sales" },
        { month: "Feb", value: 60, department: "Sales" },
        { month: "Mar", value: 70, department: "Marketing" },
        { month: "Apr", value: 90, department: "Marketing" },
        { month: "May", value: 100, department: "Operations" },
        { month: "Jun", value: 120, department: "Operations" },
      ],
    },
  },
  marketingROI: {
    title: "Marketing ROI",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "ROI (%)",
          data: [30, 40, 45, 50, 49, 60],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    value: 60,
    change: "+20%",
    defaultType: "bar",
    details: {
      description: "Return on investment for marketing campaigns over the last 6 months.",
      breakdown: [
        { month: "Jan", value: 30, campaign: "Email Marketing" },
        { month: "Feb", value: 40, campaign: "Email Marketing" },
        { month: "Mar", value: 45, campaign: "Social Media" },
        { month: "Apr", value: 50, campaign: "Social Media" },
        { month: "May", value: 49, campaign: "PPC Ads" },
        { month: "Jun", value: 60, campaign: "PPC Ads" },
      ],
    },
  },
  costPerLead: {
    title: "Cost per Lead",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Cost ($)",
          data: [20, 22, 24, 28, 30, 35],
          backgroundColor: "rgba(14, 165, 233, 0.2)",
          borderColor: "rgba(14, 165, 233, 1)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    value: 35,
    change: "-5%",
    defaultType: "area",
    details: {
      description: "Cost incurred per lead acquisition over the last 6 months.",
      breakdown: [
        { month: "Jan", value: 20, source: "Google Ads" },
        { month: "Feb", value: 22, source: "Google Ads" },
        { month: "Mar", value: 24, source: "LinkedIn Ads" },
        { month: "Apr", value: 28, source: "LinkedIn Ads" },
        { month: "May", value: 30, source: "Facebook Ads" },
        { month: "Jun", value: 35, source: "Facebook Ads" },
      ],
    },
  },
  profitability: {
    title: "Profitability by Segment",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        { label: "Product", data: [10, 15, 20, 25], backgroundColor: "rgba(34, 197, 94, 0.7)" },
        { label: "Region", data: [5, 10, 15, 20], backgroundColor: "rgba(59, 130, 246, 0.7)" },
        { label: "Business Unit", data: [8, 12, 18, 22], backgroundColor: "rgba(14, 165, 233, 0.7)" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: { x: { stacked: true }, y: { stacked: true } },
    },
    value: 25,
    change: "+15%",
    defaultType: "bar",
    details: {
      description: "Profitability breakdown by product, region, and business unit over the last 4 quarters.",
      breakdown: [
        { quarter: "Q1", product: 10, region: 5, businessUnit: 8 },
        { quarter: "Q2", product: 15, region: 10, businessUnit: 12 },
        { quarter: "Q3", product: 20, region: 15, businessUnit: 18 },
        { quarter: "Q4", product: 25, region: 20, businessUnit: 22 },
      ],
    },
  },
};

// Helper functions for gauge (unchanged)
function getNormalizedValue(metric) {
  const lastValue = metric.value || 0;
  const maxValue = Math.max(lastValue, 100) * 1.2;
  return Math.min(lastValue / maxValue, 1);
}

function getNeedleAngle(metric) {
  const normalized = getNormalizedValue(metric);
  return normalized * Math.PI - Math.PI / 2;
}

function getGaugeColor(metric) {
  const normalized = getNormalizedValue(metric);
  if (normalized < 0.3) return "#ef4444";
  if (normalized < 0.7) return "#f59e0b";
  return "#10b981";
}

const KeyFinancialKPIs = () => {
  const [activeKPIs, setActiveKPIs] = useState([
    { id: "revenuePerEmployee", enabled: true },
    { id: "marketingROI", enabled: true },
    { id: "costPerLead", enabled: true },
    { id: "profitability", enabled: true },
  ]);
  const [chartTypes, setChartTypes] = useState({
    revenuePerEmployee: "line",
    marketingROI: "bar",
    costPerLead: "area",
    profitability: "bar",
  });
  const [showChartTypeDropdown, setShowChartTypeDropdown] = useState({
    revenuePerEmployee: false,
    marketingROI: false,
    costPerLead: false,
    profitability: false,
  });
  const [aiInputs, setAiInputs] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [timeRange, setTimeRange] = useState("6M");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("charts");
  // Changed: Added state for modal
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const filtersRef = useRef(null);
  const aiChatbotRef = useRef(null);

  // Close dropdowns when clicking outside (unchanged)
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

  // Toggle chart type (unchanged)
  const toggleChartType = (kpiId, type) => {
    setChartTypes({ ...chartTypes, [kpiId]: type });
    setShowChartTypeDropdown({ ...showChartTypeDropdown, [kpiId]: false });
  };

  // Toggle chart type dropdown (unchanged)
  const toggleChartTypeDropdown = (kpiId) => {
    setShowChartTypeDropdown({ ...showChartTypeDropdown, [kpiId]: !showChartTypeDropdown[kpiId] });
  };

  // Changed: Toggle KPI visibility
  const toggleKPI = (kpiId) => {
    setActiveKPIs((prev) =>
      prev.map((kpi) =>
        kpi.id === kpiId ? { ...kpi, enabled: !kpi.enabled } : kpi
      )
    );
  };

  // Handle drag and drop (unchanged)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(activeKPIs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveKPIs(items);
  };

  // Handle AI input and send (unchanged)
  const handleSendAIQuery = (kpiId) => {
    const input = aiInputs[kpiId] || "";
    if (input.trim()) {
      console.log(`AI Query for ${kpiId}:`, input);
      setAiInputs((prev) => ({ ...prev, [kpiId]: "" }));
      setShowAIDropdown(null);
    }
  };

  // Render chart based on type (unchanged)
  const renderChart = (type, data, options = {}) => {
    switch (type) {
      case "line":
        return <Line data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "area":
        return <Line data={data} options={{ ...options, fill: true }} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      case "radar":
        return <Radar data={data} options={options} />;
      case "polarArea":
        return <PolarArea data={data} options={options} />;
      case "bubble":
        return <Bubble data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  // Changed: KPI Card Component with modal trigger
  const KPICard = ({ id, index }) => {
    const metric = kpiData[id];
    const [showLocalAIDropdown, setShowLocalAIDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowLocalAIDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="bg-white rounded-lg shadow-md p-4 border border-sky-100 hover:shadow-lg transition-all duration-300 relative"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-md font-semibold text-sky-800">{metric.title}</h3>
              <div className="flex space-x-2">
                {/* Changed: Added toggle visibility button */}
                <button
                  onClick={() => toggleKPI(id)}
                  className="p-1 rounded hover:bg-gray-100"
                  data-tooltip-id={`toggle-tooltip-${id}`}
                >
                  {activeKPIs.find((kpi) => kpi.id === id).enabled ? <FiEyeOff /> : <FiEye />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => toggleChartTypeDropdown(id)}
                    className="p-1 rounded hover:bg-gray-100"
                    data-tooltip-id="chart-type-tooltip"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {showChartTypeDropdown[id] && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      {["line", "bar", "pie", "area", "doughnut", "radar", "polarArea"].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleChartType(id, type)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowLocalAIDropdown(true)}
                  className="p-1 rounded hover:bg-gray-100"
                  data-tooltip-id="ai-tooltip"
                >
                  <BsStars />
                </button>
                {showLocalAIDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={aiInputs[id] || ""}
                        onChange={(e) => setAiInputs((prev) => ({ ...prev, [id]: e.target.value }))}
                        placeholder="Ask AI..."
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => handleSendAIQuery(id)}
                        className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600"
                        disabled={!aiInputs[id]?.trim()}
                      >
                        <FiSend />
                      </button>
                    </div>
                  </div>
                )}
                <div {...provided.dragHandleProps} className="p-1 rounded hover:bg-gray-100 cursor-move">
                  <RiDragMove2Fill />
                </div>
              </div>
            </div>

            {/* Gauge or Chart based on metric */}
            {metric.title.includes("Days") || metric.title.includes("Ratio") ? (
              <div className="relative w-full h-32 mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path d="M10 45 A40 40 0 0 1 90 45" fill="none" stroke="#e0f2fe" strokeWidth="8" />
                  <path
                    d="M10 45 A40 40 0 0 1 90 45"
                    fill="none"
                    stroke={getGaugeColor(metric)}
                    strokeWidth="8"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - 125.6 * getNormalizedValue(metric)}
                  />
                  <circle cx="50" cy="45" r="3" fill="#0ea5e9" />
                  <line
                    x1="50"
                    y1="45"
                    x2={50 + 35 * Math.cos(getNeedleAngle(metric))}
                    y2={45 + 35 * Math.sin(getNeedleAngle(metric))}
                    stroke="#0ea5e9"
                    strokeWidth="2"
                  />
                  <text x="50" y="30" textAnchor="middle" className="text-lg font-bold fill-sky-900">
                    {metric.value}
                    {metric.title.includes("ROI") ? "%" : metric.title.includes("Cost") ? "$" : ""}
                  </text>
                </svg>
                {getNormalizedValue(metric) < 0.3 && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br">!</div>
                )}
                {getNormalizedValue(metric) >= 0.7 && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br">✓</div>
                )}
              </div>
            ) : (
              <div className="h-48">
                {renderChart(chartTypes[id], metric.data, metric.options)}
              </div>
            )}

            {/* Change Indicator and View Details Button */}
            <div className="flex justify-between items-center">
              <span
                className={`flex items-center text-sm font-medium ${
                  metric.change.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.change}
                {metric.change.startsWith("+") ? (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
              {/* Changed: Added View Details button */}
              <button
                onClick={() => setShowDetailsModal(id)}
                className="text-sm text-sky-600 hover:text-sky-800 underline"
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // Changed: Modal Component for Detailed Data
  const DetailsModal = ({ kpiId, onClose }) => {
    const metric = kpiData[kpiId];
    if (!metric || !metric.details) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sky-800">{metric.title} - Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">{metric.details.description}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-100">
              <thead className="bg-sky-50">
                <tr>
                  {metric.title === "Profitability by Segment" ? (
                    <>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Quarter</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Product (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Region (%)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Business Unit (%)</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                        {metric.title === "Revenue per Employee" ? "Department" : metric.title === "Marketing ROI" ? "Campaign" : "Source"}
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sky-100">
                {metric.details.breakdown.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                    {metric.title === "Profitability by Segment" ? (
                      <>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">{row.quarter}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">{row.product}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">{row.region}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">{row.businessUnit}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">{row.month}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">
                          {row.value}
                          {metric.title.includes("ROI") ? "%" : metric.title.includes("Cost") ? "$" : "k"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">
                          {row.department || row.campaign || row.source}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Placeholder Table Component (unchanged)
  const DataTable = () => (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-sky-100">
      <div className="p-4 border-b border-sky-100 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sky-900">Detailed KPI Breakdown</h3>
        <div className="text-sm text-sky-600">
          Showing data for{" "}
          {timeRange === "3M"
            ? "last 3 months"
            : timeRange === "6M"
            ? "last 6 months"
            : timeRange === "12M"
            ? "last 12 months"
            : "year to date"}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-sky-100">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Metric</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Value</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-100">
            {activeKPIs
              .filter((kpi) => kpi.enabled)
              .map((kpi) => {
                const metric = kpiData[kpi.id];
                return (
                  <tr key={kpi.id} className={activeKPIs.indexOf(kpi) % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-sky-900">{metric.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-800">
                      {metric.value}
                      {metric.title.includes("ROI") ? "%" : metric.title.includes("Cost") ? "$" : "k"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          metric.change.startsWith("+") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Key Financial KPIs Dashboard</h1>
            <p className="text-sky-100 text-sm">Performance metrics and financial indicators</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-sky-900 text-white border border-white/30 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="12M">Last 12 Months</option>
              <option value="YTD">Year to Date</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === "charts" ? "table" : "charts")}
              className="bg-sky-900 hover:bg-sky-700 text-white px-4 py-1 rounded-md text-sm border border-white/30 transition-colors"
            >
              {viewMode === "charts" ? "Table View" : "Chart View"}
            </button>
            <button
              className="flex items-center py-2 px-3 text-sm font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" />
              Filters
            </button>
            <button
              className="flex items-center py-2 px-3 text-sm font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900"
            >
              <FiPlus className="mr-1" />
              Add Metric
            </button>
          </div>
        </div>
      </div>

      {/* Filters (Collapsible) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Month</option>
                <option>Quarter</option>
                <option>YTD</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>All</option>
                <option>Product</option>
                <option>Region</option>
                <option>Business Unit</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid with Drag-and-Drop */}
      {viewMode === "charts" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="kpis" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {activeKPIs
                  .filter((kpi) => kpi.enabled)
                  .map((kpi, index) => (
                    <KPICard key={kpi.id} id={kpi.id} index={index} />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {viewMode === "table" && <DataTable />}

      {/* Changed: Render Modal if a KPI is selected */}
      {showDetailsModal && (
        <DetailsModal
          kpiId={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
        />
      )}

      {/* Tooltips */}
      <ReactTooltip id="chart-type-tooltip" place="top" effect="solid" content="Change chart type" />
      <ReactTooltip id="ai-tooltip" place="top" effect="solid" content="Ask AI" />
      {/* Changed: Added tooltips for toggle buttons */}
      {activeKPIs.map((kpi) => (
        <ReactTooltip
          key={kpi.id}
          id={`toggle-tooltip-${kpi.id}`}
          place="top"
          effect="solid"
          content={kpi.enabled ? "Hide KPI" : "Show KPI"}
        />
      ))}
    </div>
  );
};

export default KeyFinancialKPIs;