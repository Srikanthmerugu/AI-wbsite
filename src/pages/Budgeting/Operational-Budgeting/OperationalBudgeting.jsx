// src/pages/Budgeting/OperationalBudgeting/OperationalBudgeting.jsx
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
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiDownload,
  FiSend,
  FiChevronDown,
  FiChevronRight,
  FiHardDrive,
  FiBriefcase,
  FiClipboard,
  FiCpu,
  FiPercent,
  FiCheckCircle,
  FiAlertCircle,
  FiPieChart,
  FiBarChart2,
  FiActivity
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
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
  }, [callback, ref]);
  return ref;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const OperationalBudgeting = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    budgetPeriod: "Annual Budget 2024",
    scenario: "Base Scenario",
    view: "Consolidated"
  });
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useOutsideClick(() => setShowFilters(false));
  const [aiInput, setAiInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const aiChatRef = useOutsideClick(() => setShowAIChat(false));

  const kpiData = [
    {
      title: "Total Operational Budget",
      value: "$12,500,000",
      change: "+5.2% vs LY",
      isPositive: true,
      icon: <FiDollarSign />,
      description: "Approved Opex for the current period.",
      aiInsight: "Budget increase primarily driven by headcount growth and new software subscriptions."
    },
    {
      title: "Variance to Target",
      value: "-1.8%",
      change: "Under Budget",
      isPositive: true,
      icon: <FiPercent />,
      description: "Current spend against allocated budget.",
      aiInsight: "Marketing and R&D spending below forecast, offsetting IT overages."
    },
    {
      title: "Departments Budgeted",
      value: "7 / 7",
      change: "100% Submitted",
      isPositive: true,
      icon: <FiUsers />,
      description: "Progress of departmental budget submissions.",
      aiInsight: "All departments have submitted. Awaiting final FP&A review for 2 departments."
    },
    {
      title: "AI Cost Optimization Potential",
      value: "$320,000",
      change: "Identified Savings",
      isPositive: true,
      icon: <BsStars />,
      description: "Potential savings from AI recommendations.",
      aiInsight: "Top opportunities in software license consolidation and travel policy adjustments."
    },
  ];

  const opexByDepartmentData = {
    labels: ["Marketing", "Sales", "IT", "HR", "R&D", "Finance", "Operations"],
    datasets: [
      {
        label: "Operational Expenses",
        data: [2500000, 3000000, 1800000, 1200000, 2000000, 800000, 1200000],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(244, 114, 182, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(244, 114, 182, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const opexByCategoryData = {
    labels: ["Salaries & Wages", "Software & Subscriptions", "Marketing Spend", "Travel & Expenses", "Office & Utilities", "Consulting Fees"],
    datasets: [
      {
        label: "Amount ($)",
        data: [5500000, 1500000, 2200000, 800000, 600000, 1900000],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };
  
  const budgetVsActualTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Budgeted Opex",
        data: [1000000, 1020000, 1050000, 1030000, 1100000, 1080000],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Actual Opex",
        data: [980000, 1010000, 1070000, 1015000, 1080000, 1050000],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const navigationItems = [
    {
      title: "Department-Level Budgeting",
      description: "Drill down into budgets for Marketing, Sales, IT, HR, R&D, etc. Assign owners and track individual department plans.",
      icon: <FiUsers className="text-3xl text-blue-500" />,
      path: "/department-budgeting", // Update path as per your routing
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Fixed vs. Variable Expenses",
      description: "Categorize and plan for recurring vs. project-based expenses. Analyze cost behavior and flexibility.",
      icon: <FiClipboard className="text-3xl text-green-500" />,
      path: "/fixed-variable-expense", // Update path
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: "AI Cost Optimization",
      description: "Leverage AI to identify areas for reducing spend without impacting operations. Get actionable suggestions.",
      icon: <BsStars className="text-3xl text-purple-500" />,
      path: "/ai-cost-optimization", // Update path
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
    {
      title: "Budget vs. Actuals Tracking",
      description: "Monitor spending against budget in real-time. Automated variance analysis and spending control alerts.",
      icon: <FiActivity className="text-3xl text-yellow-500" />,
      path: "/budget-vs-actuals", // Update path
      bgColor: "bg-yellow-50",
      hoverColor: "hover:bg-yellow-100",
    },
  ];

  const handleSendAIQuery = () => {
    if (aiInput.trim()) {
      const newQuery = { type: 'user', text: aiInput };
      // Simulate AI response
      const newResponse = { type: 'ai', text: `Okay, I've analyzed your query regarding "${aiInput}". Based on current operational budget data, here's an insight: The IT department shows a 15% YoY increase, primarily due to new cloud infrastructure costs. Would you like to drill down into IT spend?` };
      setAiChatHistory([...aiChatHistory, newQuery, newResponse]);
      setAiInput("");
    }
  };
  
  const renderChart = (ChartComponent, data, options) => (
    <div className="h-64 md:h-72"> {/* Adjusted height for better responsiveness */}
      <ChartComponent data={data} options={options} />
    </div>
  );

  const KPICard = ({ title, value, change, isPositive, icon, description, aiInsight }) => {
    const [showAiInsight, setShowAiInsight] = useState(false);
    const insightRef = useOutsideClick(() => setShowAiInsight(false));

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -3 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-sky-700 uppercase tracking-wider">{title}</p>
            <div className="p-2 rounded-full bg-sky-100 text-sky-600">
              {icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-sky-900">{value}</p>
          <div className={`flex items-center mt-1 text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <span>{change}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        </div>
        <div className="mt-3 relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowAiInsight(!showAiInsight); }}
            className="flex items-center text-xs text-sky-600 hover:text-sky-800"
            data-tooltip-id="ai-kpi-tooltip"
            data-tooltip-content="View AI Insight"
          >
            <BsStars className="mr-1" /> AI Quick Insight
          </button>
          {showAiInsight && (
            <div ref={insightRef} className="absolute bottom-full mb-2 w-64 bg-white p-3 rounded-md shadow-lg z-20 border border-gray-200 text-xs text-gray-700">
              <h4 className="font-semibold text-sky-700 mb-1">AI Insight:</h4>
              {aiInsight}
            </div>
          )}
        </div>
         <ReactTooltip id="ai-kpi-tooltip" place="top" effect="solid" />
      </motion.div>
    );
  };

  const ChartCard = ({ title, chartComponent, chartData, chartOptions, actionLink, actionText, widgetId }) => {
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const [localAIInput, setLocalAIInput] = useState("");
    const aiDropdownRef = useOutsideClick(() => setShowAIDropdown(false));
    const [dropdownWidget, setDropdownWidget] = useState(null);
    const optionsDropdownRef = useOutsideClick(() => setDropdownWidget(null));

    const handleLocalAISend = () => {
        if (localAIInput.trim()) {
            console.log(`AI Query for ${title}: ${localAIInput}`);
            // Add to main chat or handle specific chart AI logic
            const newQuery = { type: 'user', text: `Regarding ${title}: ${localAIInput}` };
            const newResponse = { type: 'ai', text: `AI analysis for ${title}: The current trend indicates positive growth. Consider exploring segment-specific strategies.` };
            setAiChatHistory(prev => [...prev, newQuery, newResponse]);
            if (!showAIChat) setShowAIChat(true); // Open main chat if closed
            setLocalAIInput("");
            setShowAIDropdown(false);
        }
    };
  
    return (
      <motion.div 
        variants={cardVariants} 
        className="bg-white p-4 rounded-lg shadow-sm border border-sky-100"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-sky-800">{title}</h3>
          <div className="flex items-center space-x-2">
             <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setDropdownWidget(dropdownWidget === widgetId ? null : widgetId); }} 
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                    data-tooltip-id="chart-options-tooltip"
                    data-tooltip-content="Chart Options"
                >
                    <BsThreeDotsVertical size={16} />
                </button>
                {dropdownWidget === widgetId && (
                    <div ref={optionsDropdownRef} className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-20 border border-gray-200 py-1">
                        <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Export Data (CSV)</button>
                        <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">View Fullscreen</button>
                        <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Change Chart Type</button>
                    </div>
                )}
             </div>
            <div className="relative">
                <button 
                    onClick={(e) => {e.stopPropagation(); setShowAIDropdown(!showAIDropdown);}}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                    data-tooltip-id="chart-ai-tooltip"
                    data-tooltip-content="Ask AI about this chart"
                >
                    <BsStars size={16} />
                </button>
                {showAIDropdown && (
                    <div ref={aiDropdownRef} className="absolute right-0 mt-2 w-64 bg-white p-3 rounded-md shadow-xl z-20 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Ask AI about {title}:</p>
                        <textarea 
                            value={localAIInput}
                            onChange={(e) => setLocalAIInput(e.target.value)}
                            placeholder="e.g., 'What are the key drivers?'"
                            className="w-full p-2 border border-gray-300 rounded-md text-xs mb-2 h-16 resize-none"
                        />
                        <button 
                            onClick={handleLocalAISend}
                            className="w-full py-1.5 px-3 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors"
                        >
                            Send to AI
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
        {renderChart(chartComponent, chartData, chartOptions)}
        {actionLink && actionText && (
            <div className="mt-3 text-right">
                <Link to={actionLink} className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center justify-end">
                    {actionText} <GrLinkNext className="ml-1" />
                </Link>
            </div>
        )}
        <ReactTooltip id="chart-options-tooltip" place="top" effect="solid" />
        <ReactTooltip id="chart-ai-tooltip" place="top" effect="solid" />
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md"> {/* Darker gradient */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Operational Budgeting Overview</h1>
            <p className="text-sky-100 text-sm mt-1">
              Summary of core business expense planning for {filters.budgetPeriod} ({filters.scenario})
            </p>
          </div>
          <div className="flex space-x-2 mt-3 md:mt-0">
            <button
              type="button"
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-700 rounded-lg border border-sky-600 hover:bg-sky-600 transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1.5" /> Filters
            </button>
            <button
              onClick={() => window.print()} // Simplified export for overview
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-700 rounded-lg border border-sky-600 hover:bg-sky-600 transition-colors duration-200"
            >
              <FiDownload className="mr-1.5" /> Export View
            </button>
          </div>
        </div>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200" 
          ref={filtersRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                value={filters.budgetPeriod}
                onChange={(e) => setFilters({ ...filters, budgetPeriod: e.target.value })}
              >
                <option>Annual Budget 2024</option>
                <option>Annual Budget 2025</option>
                <option>Q1 2024 Forecast</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scenario</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                value={filters.scenario}
                onChange={(e) => setFilters({ ...filters, scenario: e.target.value })}
              >
                <option>Base Scenario</option>
                <option>Stretch Scenario</option>
                <option>Worst Case Scenario</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data View</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                value={filters.view}
                onChange={(e) => setFilters({ ...filters, view: e.target.value })}
              >
                <option>Consolidated</option>
                <option>By Department Group</option>
                <option>By Cost Center Type</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-right">
            <button 
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Navigation to Sub-Modules */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-semibold text-sky-800 mb-4">Dive Deeper into Operational Budgeting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.0, boxShadow: "0px 5px 15px rgba(0,74,128,0.1)" }}
                className={`p-4 rounded-lg  ${item.bgColor} ${item.hoverColor} transition-all duration-100 flex items-start space-x-4 h-full`}
              >
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                </div>
                <FiChevronRight className="ml-auto text-gray-400 self-center text-lg" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            icon={kpi.icon}
            description={kpi.description}
            aiInsight={kpi.aiInsight}
          />
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Opex by Department"
          chartComponent={Doughnut}
          chartData={opexByDepartmentData}
          chartOptions={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "right", labels: {font: {size: 10}} } },
          }}
          widgetId="opexByDept"
        />
        <ChartCard
          title="Opex by Category"
          chartComponent={Bar}
          chartData={opexByCategoryData}
          chartOptions={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, ticks: {font: {size: 10}} }, y: { ticks: {font: {size: 10}} } },
          }}
          widgetId="opexByCat"
        />
      </div>
      
      {/* Budget vs Actual Trend */}
       <ChartCard
          title="Budget vs. Actual Opex Trend (YTD)"
          chartComponent={Line}
          chartData={budgetVsActualTrendData}
          chartOptions={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: {font: {size: 10}} } },
            scales: { 
                y: { beginAtZero: false, ticks: {font: {size: 10}, callback: value => `$${value/1000}K`} },
                x: { ticks: {font: {size: 10}} }
            },
          }}
          widgetId="budgetActualTrend"
        />

      {/* AI Chat/Insights Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-sky-800">AI Budgeting Assistant</h3>
          <button 
            onClick={() => setShowAIChat(!showAIChat)}
            className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center"
          >
            {showAIChat ? <FiChevronDown className="mr-1"/> : <BsStars className="mr-1" /> } 
            {showAIChat ? "Hide Assistant" : "Ask AI"}
          </button>
        </div>
        
        {showAIChat && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            ref={aiChatRef} 
            className="border-t border-sky-200 pt-3"
          >
            <div className="max-h-60 overflow-y-auto mb-3 p-2 bg-sky-50 rounded-md space-y-3">
              {aiChatHistory.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">Ask a question about your operational budget...</p>
              )}
              {aiChatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2.5 rounded-lg text-xs ${chat.type === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendAIQuery()}
                placeholder="e.g., 'Show top 3 variance drivers' or 'Forecast Q3 Opex'"
                className="flex-grow p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                onClick={handleSendAIQuery}
                className="p-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                disabled={!aiInput.trim()}
              >
                <FiSend size={18}/>
              </button>
            </div>
          </motion.div>
        )}
         {!showAIChat && aiChatHistory.length === 0 && (
             <p className="text-xs text-gray-500 border-t border-sky-200 pt-3">
                Unlock powerful insights by interacting with our AI Budgeting Assistant. Click "Ask AI" to get started.
             </p>
         )}
      </div>

      <ReactTooltip id="global-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default OperationalBudgeting;