import React, { useState, useRef, useEffect } from "react";
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
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
} from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiFilter,
  FiPlus,
  FiChevronDown,
  FiSend,
} from "react-icons/fi";
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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Static Data
const kpiData = {
  Revenue: { value: 108325, target: "101%", change: "+1%" },
  grossProfit: { value: 31020, target: "108%", change: "+6%" },
  Expenses: { value: 17513, target: "110%", change: "+8%" },
  netProfit: { value: 13968, target: "114%", change: "+9%" },
  cashFlow: { value: 221, change: "+5%" },
  headcount: { value: 126, change: "+1%" },
};

const charts = {
  revenueTrend: {
    title: "Revenue Trend",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [12000, 19000, 15000, 18000, 22000, 25000],
          backgroundColor: "rgba(14, 165, 233, 0.2)",
          borderColor: "rgba(14, 165, 233, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Projected",
          data: [11000, 18000, 16000, 17000, 21000, 24000],
          backgroundColor: "rgba(56, 189, 248, 0.2)",
          borderColor: "rgba(56, 189, 248, 1)",
          borderWidth: 2,
          tension: 0.4,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "line",
  },
  expenseBreakdown: {
    title: "Expense Breakdown",
    data: {
      labels: ["Salaries", "Marketing", "Operations", "R&D", "IT"],
      datasets: [
        {
          label: "Expenses",
          data: [50000, 20000, 15000, 10000, 5000],
          backgroundColor: [
            "rgba(239, 68, 68, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(234, 179, 8, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(139, 92, 246, 0.7)",
          ],
          borderColor: [
            "rgba(239, 68, 68, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(234, 179, 8, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(139, 92, 246, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "pie",
  },
  profitAnalysis: {
    title: "Profit Analysis",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Gross Profit",
          data: [45000, 48000, 52000, 55000],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
        },
        {
          label: "Net Profit",
          data: [35000, 38000, 42000, 45000],
          backgroundColor: "rgba(139, 92, 246, 0.2)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "bar",
  },
  cashFlow: {
    title: "Cash Flow",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Inflow",
          data: [5000, 7000, 4000, 9000, 6000, 8000],
          backgroundColor: "rgba(14, 165, 233, 0.2)",
          borderColor: "rgba(14, 165, 233, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Outflow",
          data: [3000, 5000, 2000, 7000, 4000, 6000],
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "line",
  },
  Expenses: {
    title: "Expenses",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Expenses",
          data: [15000, 16000, 17000, 17513],
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
        },
        {
          label: "Target",
          data: [14000, 15000, 16000, 17000],
          backgroundColor: "rgba(22, 163, 74, 0.2)",
          borderColor: "rgba(22, 163, 74, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "line",
  },
  netProfit: {
    title: "Net Profit",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Net Profit",
          data: [12000, 13000, 14000, 13968],
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          borderColor: "rgba(245, 158, 11, 1)",
          borderWidth: 2,
        },
        {
          label: "Target",
          data: [11000, 12000, 13000, 13500],
          backgroundColor: "rgba(217, 119, 6, 0.2)",
          borderColor: "rgba(217, 119, 6, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "bar",
  },
  headcount: {
    title: "Headcount",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Employees",
          data: [120, 122, 124, 125, 126, 126],
          backgroundColor: "rgba(167, 139, 250, 0.2)",
          borderColor: "rgba(167, 139, 250, 1)",
          borderWidth: 2,
        },
        {
          label: "Target",
          data: [118, 120, 122, 123, 125, 125],
          backgroundColor: "rgba(126, 99, 235, 0.2)",
          borderColor: "rgba(126, 99, 235, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
    defaultType: "line",
  },
};

const FinancialOverview = () => {
  const [showAIChatbot, setShowAIChatbot] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("Acme Corporation");
  const [analyzedWidgets, setAnalyzedWidgets] = useState([]);
  const [activeWidgets, setActiveWidgets] = useState([
    "revenueTrend",
    "expenseBreakdown",
    "profitAnalysis",
    "cashFlow",
    "Expenses",
    "netProfit",
    "headcount",
  ]);
  const [chartTypes, setChartTypes] = useState({
    revenueTrend: "line",
    expenseBreakdown: "pie",
    profitAnalysis: "bar",
    cashFlow: "line",
    Expenses: "line",
    netProfit: "bar",
    headcount: "line",
  });

  const [dropdownWidget, setDropdownWidget] = useState(null);
  const [hoveredChartType, setHoveredChartType] = useState(null);
  const [aiInputs, setAiInputs] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [showChartTypeDropdown, setShowChartTypeDropdown] = useState({});

  const filtersRef = useRef(null);
  const aiChatbotRef = useRef(null);

  const toggleAnalyze = (widgetId) => {
    setAnalyzedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };
  
  
  // Toggle chart type
  const toggleChartType = (widgetId, type) => {
    setChartTypes((prev) => ({
      ...prev,
      [widgetId]: type,
    }));
  };
  

  // Toggle chart type dropdown
  const toggleChartTypeDropdown = (widgetId) => {
    setShowChartTypeDropdown((prev) => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }));
  };

  // Handle sending AI query
  const handleSendAIQuery = (widgetId) => {
    if (aiInputs[widgetId]?.trim()) {
      console.log(`AI Query for ${widgetId}:`, aiInputs[widgetId]);
      setAiInputs((prev) => ({
        ...prev,
        [widgetId]: ""
      }));
      setShowAIDropdown(null);
    }
  };

  // Render chart based on type
  const renderChart = (type, data, options = {}) => {
    switch (type) {
      case "line":
        return <Line data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
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

  // Enhanced ChartCard component with drag handle and AI dropdown
  const EnhancedChartCard = ({ title, chartType, chartData, widgetId, index, analyzedWidgets, toggleAnalyze}) => {
    
    const isAnalyzing = analyzedWidgets.includes(widgetId);

    const exportToCSV = () => {
      const rows = [];
      const headers = ["Label", ...chartData.data.datasets.map((ds) => ds.label)];
      rows.push(headers);
  
      chartData.data.labels.forEach((label, idx) => {
        const row = [label];
        chartData.data.datasets.forEach((ds) => {
          row.push(ds.data[idx]);
        });
        rows.push(row);
      });
  
      const csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${widgetId}_analysis.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <Draggable draggableId={widgetId} index={index}>
        {(provided) => (
          <div
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-sky-800">{title}</h3>
              <div className="flex space-x-2 relative">
              <div className="relative chart-dropdown">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setDropdownWidget(dropdownWidget === widgetId ? null : widgetId);
    }}
    className="p-1 rounded hover:bg-gray-100"
    data-tooltip-id="chart-type-tooltip"
    data-tooltip-content="Options"
  >
    <BsThreeDotsVertical />
  </button>

  {dropdownWidget === widgetId && (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
      <div className="py-1 text-xs text-gray-800">
      
      <div className="relative" onMouseEnter={() => setHoveredChartType(widgetId)} onMouseLeave={() => setHoveredChartType(null)}>
  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
    All Chart Types
    <FiChevronDown className="ml-1 text-xs" />
  </div>

  {hoveredChartType === widgetId && (
    <div
      className="absolute top-0 left-full w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1"
      style={{ marginLeft: "-1px" }}
    >
      {["line", "bar", "pie", "doughnut", "radar", "polarArea", "bubble"].map((type) => (
        <button
          key={type}
          onClick={(e) => {
            e.stopPropagation();
            toggleChartType(widgetId, type);
            setDropdownWidget(null);
            setHoveredChartType(null);
          }}
          className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </button>
      ))}
    </div>
  )}
</div>



<div
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    toggleAnalyze(widgetId);
    setDropdownWidget(null);
  }}
>
  {analyzedWidgets.includes(widgetId) ? "Hide Analysis" : "Analyze"}
</div>
      </div>
    </div>
  )}
</div>

                <button
                  onClick={() => setShowAIDropdown(showAIDropdown === widgetId ? null : widgetId)}
                  className="p-1 rounded hover:bg-gray-100"
                  data-tooltip-id="ai-tooltip"
                  data-tooltip-content="Ask AI"
                >
                  <BsStars />
                </button>
                {showAIDropdown === widgetId && (
                  <div
                    ref={aiChatbotRef}
                    className="absolute right-0 top-5 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-2"
                  >
                    <div className="flex flex-col items-center space-x-2">
                      <h1 className="text-xs">Ask regarding the {title}</h1>
                      <div className="flex justify-between gap-3">
                      <input
  type="text"
  value={aiInputs[widgetId] || ""}
  onChange={(e) => setAiInputs((prev) => ({
    ...prev,
    [widgetId]: e.target.value
  }))}
  placeholder="Ask AI..."
  className="w-full p-1 border border-gray-300 rounded text-xs"
/>
                        <button
                          onClick={() => handleSendAIQuery(widgetId)}
                          className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                          disabled={!aiInput.trim()}
                        >
                          <FiSend />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  {...provided.dragHandleProps}
                  className="p-1 rounded hover:bg-gray-100 cursor-move"
                >
                  <RiDragMove2Fill />
                </div>
              </div>
            </div>
            {!isAnalyzing && (
  <div className="h-48">
    {renderChart(chartType, chartData.data, chartData.options)}
  </div>
)}

{isAnalyzing && (
  <div className="mt-3 border rounded overflow-hidden">
    <div className="flex justify-between items-center bg-sky-50 p-2 border-b">
      <button
        onClick={() => toggleAnalyze(widgetId)}
        className="text-xs text-sky-700 border border-sky-300 px-2 py-1 rounded hover:bg-sky-100 transition"
      >
        Hide Analysis
      </button>
      <button
        onClick={exportToCSV}
        className="text-xs text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-50 transition"
      >
        Export CSV
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs text-left border-collapse">
        <thead className="bg-sky-100 text-sky-800">
          <tr>
            <th className="p-2 border">Label</th>
            {chartData.data.datasets.map((ds, i) => (
              <th key={i} className="p-2 border">{ds.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chartData.data.labels.map((label, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              <td className="p-2 border">{label}</td>
              {chartData.data.datasets.map((ds, i) => (
                <td key={i} className="p-2 border">
                  {ds.data[rowIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


          </div>
        )}
      </Draggable>
    );
  };

  // KPI Card Component with AI Button
  const KPICard = ({ title, value, change, isPositive, icon }) => {
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowAIDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle sending AI query
    const handleSendAIQuery = () => {
      if (aiInputs[title]?.trim()) {
        console.log(`AI Query for ${title}:`, aiInputs[title]);
        setAiInputs((prev) => ({
          ...prev,
          [title]: ""
        }));
        setShowAIDropdown(false);
      }
    };

    // Determine if the metric requires a dollar sign
    const needsDollarSign = [
      "Revenue",
      "grossProfit",
      "Expenses",
      "netProfit",
      "cashFlow",
    ].includes(title.replace(/ /g, ""));

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -3 }}
        className="bg-white p-3 rounded-lg shadow-sm border border-sky-100 relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider truncate">
                {title}
              </p>
              <button
                onClick={() => setShowAIDropdown(!showAIDropdown)}
                className="p-1 rounded hover:bg-gray-100"
                data-tooltip-id="ai-tooltip"
                data-tooltip-content="Ask AI" 
              >
                <BsStars />
              </button>
              {showAIDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-5 mt-2 w-full sm:w-44 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
                >
                  <div className="flex items-center space-x-2">
                  <input
  type="text"
  value={aiInputs[title] || ""}
  onChange={(e) => setAiInputs((prev) => ({
    ...prev,
    [title]: e.target.value
  }))}
  placeholder="Ask AI..."
  className="w-full p-1 border border-gray-300 rounded text-xs"
/>
                    <button
                      onClick={handleSendAIQuery}
                      className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600"
                      disabled={!aiInput.trim()}
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-sky-900 mt-1">
              {needsDollarSign && "$"}
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <div className={`flex items-center mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              <span className="text-[10px] font-medium">
                {change} {isPositive ? "↑" : "↓"} vs last period
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors duration-200">
            <div className="text-sky-600 hover:text-sky-800 transition-colors duration-200">
              {icon}
            </div>
          </div>
        </div>
        <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
      </motion.div>
    );
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActiveWidgets(items);
  };

  // Placeholder Table Component
  const DataTable = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
      <h3 className="text-sm font-semibold text-sky-800 mb-2">Summary Table</h3>
      <table className="w-full text-xs text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Metric</th>
            <th className="p-2 text-left">Value</th>
            <th className="p-2 text-left">Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(kpiData).map(([key, value], index) => {
            const needsDollarSign = [
              "Revenue",
              "grossProfit",
              "Expenses",
              "netProfit",
              "cashFlow",
            ].includes(key);
            return (
              <tr key={index} className="border-b">
                <td className="p-2">{key.replace(/([A-Z])/g, " $1")}</td>
                <td className="p-2">
                  {needsDollarSign && "$"}
                  {typeof value.value === "number" ? value.value.toLocaleString() : value.value}
                </td>
                <td className="p-2">{value.change || value.target}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Financial Dashboard</h1>
            <p className="text-sky-100 text-xs">{selectedCompany}</p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" />
              Filters
            </button>
            <button
              type="button"
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <FiPlus className="mr-1" />
              Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options (Collapsible) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
                <option>Month</option>
                <option>Quarter</option>
                <option>YTD</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Business Unit
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
                <option>All</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Geography
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
                <option>All</option>
                <option>USA</option>
                <option>UK</option>
                <option>Germany</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Client Demographics
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
                <option>All</option>
                <option>By Industry</option>
                <option>By Revenue Person</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Object.entries(kpiData).map(([key, value], index) => (
          <KPICard
            key={key}
            title={key.replace(/([A-Z])/g, " $1")}
            value={value.value}
            change={value.change || value.target}
            isPositive={value.change?.startsWith("+") || value.target?.startsWith("+")}
            icon={
              key === "Revenue" ? (
                <FiTrendingUp size={16} />
              ) : key === "grossProfit" || key === "Expenses" || key === "netProfit" ? (
                <FiDollarSign size={16} />
              ) : key === "cashFlow" ? (
                <FiTrendingUp size={16} />
              ) : (
                <FiPieChart size={16} />
              )
            }
          />
        ))}
      </div>

      {/* Charts Section - Widgets with Drag and Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="charts">
          {(provided) => (
            <div
              className="grid gap-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Row 1: 3 charts (2 vertical + 1 spanning 2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <EnhancedChartCard
                  title={charts.revenueTrend.title}
                  chartType={chartTypes.revenueTrend}
                  chartData={charts.revenueTrend}
                  widgetId="revenueTrend"
                  index={0}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
                <EnhancedChartCard
                  title={charts.expenseBreakdown.title}
                  chartType={chartTypes.expenseBreakdown}
                  chartData={charts.expenseBreakdown}
                  widgetId="expenseBreakdown"
                  index={1}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
                <EnhancedChartCard
                  title={charts.profitAnalysis.title}
                  chartType={chartTypes.profitAnalysis}
                  chartData={charts.profitAnalysis}
                  widgetId="profitAnalysis"
                  index={2}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
              </div>

              {/* Row 2: 2 charts side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <EnhancedChartCard
                  title={charts.cashFlow.title}
                  chartType={chartTypes.cashFlow}
                  chartData={charts.cashFlow}
                  widgetId="cashFlow"
                  index={3}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
                <EnhancedChartCard
                  title={charts.Expenses.title}
                  chartType={chartTypes.Expenses}
                  chartData={charts.Expenses}
                  widgetId="Expenses"
                  index={4}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
              </div>

              {/* Row 3: 2 charts + 1 table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <EnhancedChartCard
                  title={charts.netProfit.title}
                  chartType={chartTypes.netProfit}
                  chartData={charts.netProfit}
                  widgetId="netProfit"
                  index={5}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
                <EnhancedChartCard
                  title={charts.headcount.title}
                  chartType={chartTypes.headcount}
                  chartData={charts.headcount}
                  widgetId="headcount"
                  index={6}
                  analyzedWidgets={analyzedWidgets}
                  toggleAnalyze={toggleAnalyze}
                />
                <DataTable />
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Tooltips */}
      <ReactTooltip id="chart-type-tooltip" place="top" effect="solid" />
      <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default FinancialOverview;