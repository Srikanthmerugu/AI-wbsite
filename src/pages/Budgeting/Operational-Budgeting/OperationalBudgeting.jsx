// src/pages/Budgeting/OperationalBudgeting/OperationalBudgeting.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiDownload,
  FiSend,
  FiChevronDown,
  FiChevronRight,
  FiClipboard,
  FiPercent,
  FiActivity
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
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
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
};

const OperationalBudgeting = () => {
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
    { title: "Total Operational Budget", value: "$12,500,000", change: "+5.2% vs LY", isPositive: false, icon: <FiDollarSign />, aiInsight: "Budget increase is driven by headcount growth and new software subscriptions." },
    { title: "Variance to Target", value: "-$225,000", change: "1.8% Under Budget", isPositive: true, icon: <FiPercent />, aiInsight: "Marketing and R&D spending is below forecast, offsetting IT overages." },
    { title: "Departments Budgeted", value: "7 / 7", change: "100% Submitted", isPositive: true, icon: <FiUsers />, aiInsight: "All departments have submitted. Awaiting final FP&A review for 2 departments." },
    { title: "AI Cost Optimization", value: "$320,000", change: "Identified Savings", isPositive: true, icon: <BsStars />, aiInsight: "Top opportunities in software license consolidation and travel policy adjustments." },
  ];

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

  const opexByDepartmentData = {
    labels: ["Marketing", "Sales", "IT", "HR", "R&D", "Finance", "Operations"],
    datasets: [{ data: [25, 30, 18, 12, 20, 8, 12], backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#0EA5E9", "#EC4899"], borderColor: "#fff", borderWidth: 2 }],
  };

  const opexByCategoryData = {
    labels: ["Salaries & Wages", "Software", "Marketing Spend", "Travel", "Office", "Consulting"],
    datasets: [{ label: "Amount ($)", data: [5500000, 1500000, 2200000, 800000, 600000, 1900000], backgroundColor: "rgba(16, 185, 129, 0.7)", borderColor: "rgba(16, 185, 129, 1)", borderWidth: 1 }],
  };
  
  const budgetVsActualTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      { label: "Budgeted Opex", data: [1000, 1020, 1050, 1030, 1100, 1080, 1120, 1150], borderColor: "#3B82F6", backgroundColor: "rgba(59, 130, 246, 0.1)", fill: true, tension: 0.4 },
      { label: "Actual Opex", data: [980, 1010, 1070, 1015, 1080, 1050, 1110, 1130], borderColor: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.1)", fill: true, tension: 0.4 },
    ],
  };

  const handleSendAIQuery = () => {
    if (!aiInput.trim()) return;
    const newQuery = { type: 'user', text: aiInput };
    const newResponse = { type: 'ai', text: `Regarding "${aiInput}", I see Marketing spend is 8% over budget YTD, while R&D is 12% under. The primary driver for Marketing overspend is a 20% increase in digital ad campaigns.` };
    setAiChatHistory(prev => [...prev, newQuery, newResponse]);
    setAiInput("");
  };

  const KPICard = ({ title, value, change, isPositive, icon, aiInsight }) => {
    const [showAiInsight, setShowAiInsight] = useState(false);
    const insightRef = useOutsideClick(() => setShowAiInsight(false));
    return (
      <motion.div variants={cardVariants} whileHover={{ y: -4 }} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-sky-800 uppercase tracking-wider">{title}</p>
            <div className="p-2 rounded-full bg-sky-100 text-sky-600">{icon}</div>
          </div>
          <p className="text-2xl font-bold text-sky-900">{value}</p>
          <div className={`flex items-center mt-1 text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</div>
        </div>
        <div className="mt-4 relative">
          <button onClick={() => setShowAiInsight(p => !p)} className="flex items-center text-xs text-sky-600 hover:text-sky-800" data-tooltip-id="ai-kpi-tooltip" data-tooltip-content="View AI Insight">
            <BsStars className="mr-1.5" /> AI Quick Insight
          </button>
          {showAiInsight && (
            <div ref={insightRef} className="absolute bottom-full mb-2 w-full max-w-xs bg-white p-3 rounded-md shadow-xl z-20 border border-gray-200 text-xs text-gray-700">
              <h4 className="font-semibold text-sky-800 mb-1">AI Insight:</h4>{aiInsight}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ChartCard = ({ title, chartComponent: Chart, data, options, widgetId }) => {
    const [aiDropdown, setAiDropdown] = useState(null);
    const [optionsDropdown, setOptionsDropdown] = useState(null);
    const aiRef = useOutsideClick(() => setAiDropdown(null));
    const optionsRef = useOutsideClick(() => setOptionsDropdown(null));

    return (
      <motion.div variants={cardVariants} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold text-sky-800">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className="relative" ref={aiRef}>
              <button onClick={() => setAiDropdown(aiDropdown === widgetId ? null : widgetId)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500" data-tooltip-id="chart-ai-tooltip" data-tooltip-content="Ask AI about this chart"><BsStars size={16} /></button>
              {aiDropdown === widgetId && (
                <div className="absolute right-0 mt-2 w-64 bg-white p-3 rounded-md shadow-xl z-20 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Ask AI about {title}:</p>
                  <textarea placeholder="e.g., 'What are the key drivers?'" className="w-full p-2 border border-gray-300 rounded-md text-xs mb-2 h-16 resize-none" />
                  <button className="w-full py-1.5 px-3 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600">Send</button>
                </div>
              )}
            </div>
            <div className="relative" ref={optionsRef}>
              <button onClick={() => setOptionsDropdown(optionsDropdown === widgetId ? null : widgetId)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500" data-tooltip-id="chart-options-tooltip" data-tooltip-content="Options"><BsThreeDotsVertical size={16} /></button>
              {optionsDropdown === widgetId && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-20 border border-gray-200 py-1">
                  <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Export Data (CSV)</button>
                  <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">View Fullscreen</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow h-64"><Chart data={data} options={{...options, maintainAspectRatio: false, responsive: true}} /></div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen relative bg-sky-50">
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Operational Budgeting Dashboard</h1>
              <p className="text-sky-100 text-sm mt-1">Explore and monitor the key components of core business expense planning.</p>
            </div>
            <div className="flex space-x-2 mt-3 md:mt-0">
              <button onClick={() => setShowFilters(p => !p)} className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors">
                <FiFilter className="mr-1.5" /> Filters
              </button>
              <button onClick={() => window.print()} className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors">
                <FiDownload className="mr-1.5" /> Export View
              </button>
            </div>
          </div>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200" ref={filtersRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Budget Period', 'Scenario', 'View'].map(filter => (
                <div key={filter}><label className="block text-sm font-medium text-gray-700 mb-1">{filter}</label><select className="w-full p-2 border border-gray-300 rounded-md text-sm"><option>Default</option></select></div>
              ))}
            </div>
            <div className="mt-4 text-right"><button onClick={() => setShowFilters(false)} className="px-4 py-2 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700">Apply</button></div>
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
        <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {kpiData.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
        </motion.div>
        
        {/* Chart Section */}
        <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="lg:col-span-2"><ChartCard title="Opex by Department" chartComponent={Doughnut} data={opexByDepartmentData} options={{plugins: { legend: { position: "right", labels: {font: {size: 10}, boxWidth: 12} } }}} widgetId="deptChart" /></div>
          <div className="lg:col-span-3"><ChartCard title="Opex by Expense Category" chartComponent={Bar} data={opexByCategoryData} options={{indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: value => `$${(value/1000000)}M` } } }}} widgetId="catChart" /></div>
        </motion.div>
        <motion.div variants={cardVariants} className="mt-6"><ChartCard title="Budget vs. Actual Trend (YTD, in Thousands)" chartComponent={Line} data={budgetVsActualTrendData} options={{plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: value => `$${value}k` } } }}} widgetId="trendChart" /></motion.div>

        {/* AI Assistant Panel */}
        {/* <motion.div variants={cardVariants} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 mt-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAIChat(p => !p)}>
            <h3 className="text-md font-semibold text-sky-800">AI Budgeting Assistant</h3>
            <button className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center">
              {showAIChat ? "Hide Assistant" : "Ask AI"}
              {showAIChat ? <FiChevronDown className="ml-1"/> : <BsStars className="ml-1" />}
            </button>
          </div>
          {showAIChat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-sky-200 pt-4 mt-3" ref={aiChatRef}>
              <div className="max-h-60 overflow-y-auto mb-3 p-2 bg-sky-50 rounded-md space-y-3">
                {aiChatHistory.length === 0 && <p className="text-xs text-gray-500 text-center py-4">Ask a question, e.g., "Show variance insights for Marketing & R&D"</p>}
                {aiChatHistory.map((chat, index) => (<div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-2.5 rounded-lg text-xs ${chat.type === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>{chat.text}</div></div>))}
              </div>
              <div className="flex items-center space-x-2">
                <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendAIQuery()} placeholder="Ask about your operational budget..." className="flex-grow p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                <button onClick={handleSendAIQuery} className="p-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50" disabled={!aiInput.trim()}><FiSend size={18}/></button>
              </div>
            </motion.div>
          )}
        </motion.div> */}
      </motion.div>
      <ReactTooltip id="ai-kpi-tooltip" place="top" effect="solid" />
      <ReactTooltip id="chart-ai-tooltip" place="top" effect="solid" />
      <ReactTooltip id="chart-options-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default OperationalBudgeting;