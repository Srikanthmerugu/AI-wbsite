import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { 
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, 
  FiFilter, FiPlus, FiChevronDown, FiSend, FiUser, 
  FiMap, FiLayers, FiRefreshCw, FiUsers, FiShoppingCart 
} from "react-icons/fi";
import { 
  BsStars, BsThreeDotsVertical, BsGraphUpArrow, 
  BsCashCoin, BsBoxArrowUpRight 
} from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RiDragMove2Fill } from "react-icons/ri";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

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

const PerformanceAnalytics = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    timePeriod: "Last Quarter",
    region: "All Regions",
    product: "All Products",
    segment: "All Segments"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState(["revenueTrend", "conversionFunnel", "retentionRate"]);
  const [chartTypes, setChartTypes] = useState({
    revenueTrend: "line",
    conversionFunnel: "bar",
    retentionRate: "line",
    regionalBreakdown: "bar"
  });
  const [dropdownWidget, setDropdownWidget] = useState(null);
  const [hoveredChartType, setHoveredChartType] = useState(null);
  const [aiInput, setAiInput] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const filtersRef = useRef(null);

  // KPI Data
  const kpiData = [
    {
      id: 1,
      name: 'Total Revenue',
      value: '$2.85M',
      change: '+12%',
      trend: 'up',
      forecast: '$3.1M next quarter',
      icon: <FiDollarSign size={18} />,
      color: 'text-green-600',
      componentPath: '/revenue-breakdown'
    },
    {
      id: 2,
      name: 'CAC',
      value: '$450',
      change: '-8%',
      trend: 'down',
      forecast: '$420 next quarter',
      icon: <FiShoppingCart size={18} />,
      color: 'text-amber-600',
      componentPath: '/cac-clv'
    },
    {
      id: 3,
      name: 'CLV',
      value: '$2,150',
      change: '+5%',
      trend: 'up',
      forecast: '$2,250 next quarter',
      icon: <BsCashCoin size={18} />,
      color: 'text-blue-600',
      componentPath: '/cac-clv'
    },
    {
      id: 4,
      name: 'Churn Rate',
      value: '3.2%',
      change: '-0.4%',
      trend: 'down',
      forecast: '3.0% next quarter',
      icon: <FiRefreshCw size={18} />,
      color: 'text-red-600',
      componentPath: '/churn-retention'
    },
    {
      id: 5,
      name: 'Conversion Rate',
      value: '22%',
      change: '+2%',
      trend: 'up',
      forecast: '23% next quarter',
      icon: <BsGraphUpArrow size={18} />,
      color: 'text-purple-600',
      componentPath: '/pipeline-conversion'
    },
    {
      id: 6,
      name: 'Marketing ROI',
      value: '4.8x',
      change: '+0.3',
      trend: 'up',
      forecast: '5.0x next quarter',
      icon: <FiTrendingUp size={18} />,
      color: 'text-teal-600',
      componentPath: '/marketing-campaign'
    }
  ];

  // Chart Data
  const charts = {
    revenueTrend: {
      title: "Revenue Trend",
      componentPath: "/revenue-breakdown",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [450, 520, 600, 580, 700, 750],
            borderColor: "#4BC0C0",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            fill: true,
            tension: 0.4,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: (value) => `$${value}K` } }
        }
      }
    },
    conversionFunnel: {
      title: "Conversion Funnel",
      componentPath: "/pipeline-conversion",
      data: {
        labels: ["Leads", "MQL", "SQL", "Opportunity", "Customer"],
        datasets: [
          {
            label: "Count",
            data: [10000, 6500, 3200, 1500, 750],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(234, 179, 8, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(239, 68, 68, 0.7)"
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(234, 179, 8, 1)",
              "rgba(139, 92, 246, 1)",
              "rgba(239, 68, 68, 1)"
            ],
            borderWidth: 1,
          }
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    },
    retentionRate: {
      title: "Customer Retention",
      componentPath: "/churn-retention",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Retention Rate",
            data: [92, 91, 90, 89, 88, 87],
            borderColor: "#4BC0C0",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            fill: true,
            tension: 0.4,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { 
            min: 80,
            max: 100,
            ticks: { callback: (value) => `${value}%` } 
          }
        }
      }
    },
    regionalBreakdown: {
      title: "Regional Breakdown",
      componentPath: "/revenue-breakdown",
      data: {
        labels: ["North America", "Europe", "Asia", "South America", "Africa"],
        datasets: [
          {
            label: "Revenue (K)",
            data: [1500, 800, 450, 200, 100],
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          }
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        scales: {
          y: { ticks: { callback: (value) => `$${value}K` } }
        }
      }
    }
  };

  // Navigation items
  const navItems = [
    { name: "Sales Dashboard", icon: <FiDollarSign />, path: "/sales-dashboard" },
    { name: "Pipeline & Conversion", icon: <FiTrendingUp />, path: "/pipeline-conversion" },
    { name: "CAC & CLV", icon: <BsCashCoin />, path: "/cac-clv" },
    { name: "Churn & Retention", icon: <FiRefreshCw />, path: "/churn-retention" },
    { name: "Marketing Campaigns", icon: <FiUsers />, path: "/marketing-campaign" },
    { name: "Revenue Breakdown", icon: <FiPieChart />, path: "/revenue-breakdown" }
  ];

  const toggleChartType = (widgetId, type) => {
    setChartTypes(prev => ({ ...prev, [widgetId]: type }));
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
      case "pie": return <Pie data={data} options={options} />;
      case "doughnut": return <Doughnut data={data} options={options} />;
      default: return <Line data={data} options={options} />;
    }
  };

  const EnhancedChartCard = ({ widgetId, index }) => {
    const dropdownRef = useOutsideClick(() => setDropdownWidget(null));
    const data = charts[widgetId];
    
    return (
      <Draggable draggableId={widgetId} index={index}>
        {(provided) => (
          <div 
            className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-all duration-300"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold text-sky-800">{data.title}</h3>
              <div className="flex space-x-2 relative">
                <div className="relative chart-dropdown">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDropdownWidget(dropdownWidget === widgetId ? null : widgetId); }} 
                    className="p-1 rounded hover:bg-gray-100"
                    data-tooltip-id="chart-type-tooltip" 
                    data-tooltip-content="Options"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {dropdownWidget === widgetId && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1 text-xs text-gray-800">
                        <div 
                          className="relative" 
                          onMouseEnter={() => setHoveredChartType(widgetId)} 
                          onMouseLeave={() => setHoveredChartType(null)}
                        >
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                            All Chart Types <FiChevronDown className="ml-1 text-xs" />
                          </div>
                          {hoveredChartType === widgetId && (
                            <div className="absolute top-0 left-full w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1" style={{ marginLeft: "-1px" }}>
                              {["line", "bar", "pie", "doughnut"].map((type) => (
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
                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate(data.componentPath)}>
                          Analyze
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
                  <div className="absolute right-0 top-5 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-2">
                    <div className="flex flex-col items-center space-x-2">
                      <h1 className="text-xs">Ask regarding the {data.title}</h1>
                      <div className="flex justify-between gap-3 p-2">
                        <input 
                          type="text" 
                          value={aiInput[widgetId] || ""} 
                          onChange={(e) => setAiInput(prev => ({ ...prev, [widgetId]: e.target.value }))} 
                          placeholder="Ask AI..." 
                          className="w-full p-1 border border-gray-300 rounded text-xs" 
                        />
                        <button 
                          onClick={() => handleSendAIQuery(widgetId)} 
                          className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600" 
                          disabled={!aiInput[widgetId]?.trim()}
                        >
                          <FiSend />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div {...provided.dragHandleProps} className="p-1 rounded hover:bg-gray-100 cursor-move">
                  <RiDragMove2Fill />
                </div>
              </div>
            </div>
            <div className="h-48">
              {renderChart(chartTypes[widgetId], {
                labels: data.labels,
                datasets: data.datasets
              }, data.options)}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const KPICard = ({ kpi }) => {
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const [localAIInput, setLocalAIInput] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowAIDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendAIQuery = () => {
      if (localAIInput.trim()) {
        console.log(`AI Query for ${kpi.name}:`, localAIInput);
        setLocalAIInput("");
        setShowAIDropdown(false);
      }
    };

    return (
      <motion.div 
        variants={cardVariants} 
        initial="hidden" 
        animate="visible" 
        whileHover={{ y: -3 }} 
        className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center justify-between relative">
              <div className="text-sky-600 text-sm font-medium">{kpi.name}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowAIDropdown(!showAIDropdown); }} 
                className="p-1 rounded hover:bg-gray-100"
                data-tooltip-id="ai-tooltip" 
                data-tooltip-content="Ask AI"
              >
                <BsStars />
              </button>
              {showAIDropdown && (
                <div 
                  ref={dropdownRef} 
                  className="absolute right-0 top-5 mt-2 w-44 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={localAIInput} 
                      onChange={(e) => setLocalAIInput(e.target.value)} 
                      placeholder="Ask AI..." 
                      className="w-full p-1 border border-gray-300 rounded text-xs" 
                      onClick={(e) => e.stopPropagation()} 
                    />
                    <button 
                      onClick={handleSendAIQuery} 
                      className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600" 
                      disabled={!localAIInput.trim()}
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xl font-bold mt-1">{kpi.value}</div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs">
                <span className={`${kpi.trend === 'up' ? kpi.color : 'text-red-600'}`}>
                  {kpi.change} {kpi.trend === 'up' ? '↑' : '↓'}
                </span>
                <span className="text-sky-600 ml-1">vs previous</span>
              </div>
              <div className="text-xs text-sky-500 flex items-center">
                <BsStars className="mr-1" /> {kpi.forecast}
              </div>
            </div>
          </div>
          <div className={`p-2 rounded-lg bg-sky-50 ${kpi.color}`}>
            {kpi.icon}
          </div>
        </div>
      </motion.div>
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveWidgets(items);
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with filters */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Performance Analytics</h1>
            <p className="text-sky-100 text-xs">AI-driven insights across all business metrics</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" /> Filters
            </button>
            <select
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={filters.timePeriod}
              onChange={(e) => setFilters({...filters, timePeriod: e.target.value})}
            >
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Last Year</option>
              <option>Custom Range</option>
            </select>
            <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <BsBoxArrowUpRight className="mr-1" /> Export
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
              >
                <option>All Regions</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia</option>
                <option>South America</option>
                <option>Africa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.product}
                onChange={(e) => setFilters({...filters, product: e.target.value})}
              >
                <option>All Products</option>
                <option>Product A</option>
                <option>Product B</option>
                <option>Product C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
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
            <div className="flex items-end">
              <button className="px-4 py-2 text-sm bg-sky-600 text-white rounded hover:bg-sky-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpiData.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {navItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-sky-100 text-sky-600 mb-2">
                  {item.icon}
                </div>
                <h3 className="text-sm font-medium text-sky-800">{item.name}</h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Chart Widgets */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="charts" direction="horizontal">
          {(provided) => (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {activeWidgets.map((widgetId, index) => (
                <EnhancedChartCard 
                  key={widgetId}
                  widgetId={widgetId}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-5 rounded-xl shadow-sm border border-sky-200 mt-6">
        <h3 className="text-lg font-semibold text-sky-800 mb-3 flex items-center">
          <BsStars className="text-blue-500 mr-2" />
          AI Performance Insights
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Revenue Growth Opportunity</div>
            <div className="text-sky-700">Enterprise segment shows 25% higher growth potential than SMB. Consider reallocating 15% of SMB resources to enterprise sales.</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Churn Risk Alert</div>
            <div className="text-sky-700">Customers with 6-12 months tenure have 18% higher churn risk. Recommend implementing a loyalty program for this cohort.</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Marketing Optimization</div>
            <div className="text-sky-700">Content marketing yields 3.2x higher ROI than paid ads for lead generation. Suggest increasing content budget by 20%.</div>
          </div>
        </div>
        <div className="mt-4 flex">
          <input 
            type="text" 
            placeholder="Ask about any performance metric..." 
            className="flex-1 p-2 border border-gray-300 rounded-l text-sm" 
          />
          <button className="bg-sky-600 text-white px-4 py-2 rounded-r hover:bg-sky-700">
            Ask AI
          </button>
        </div>
      </div>

      <ReactTooltip id="chart-type-tooltip" place="top" effect="solid" />
      <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default PerformanceAnalytics;