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
    RadialLinearScale,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Pie, Radar, PolarArea, Bubble } from "react-chartjs-2";
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
	FiActivity,
} from "react-icons/fi";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

// (ChartJS registration and other constants remain the same)
ChartJS.register( CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler );
const useOutsideClick = (callback) => { const ref = useRef(); useEffect(() => { const handleClick = (event) => { if (ref.current && !ref.current.contains(event.target)) { callback(); } }; document.addEventListener("mousedown", handleClick); return () => document.removeEventListener("mousedown", handleClick); }, [callback]); return ref; };
const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } }, };
const kpiData = [ { id: "totalBudget", title: "Total Operational Budget", value: 12500000, change: "+5.2%", isPositive: false, icon: <FiDollarSign size={16}/>, componentPath: "#" }, { id: "variance", title: "Variance to Target", value: -225000, change: "1.8% Under", isPositive: true, icon: <FiPercent size={16}/>, componentPath: "#" }, { id: "deptBudgeted", title: "Departments Budgeted", value: "7 / 7", change: "100% Submitted", isPositive: true, icon: <FiUsers size={16}/>, componentPath: "#" }, { id: "aiOptimization", title: "AI Cost Optimization", value: 320000, change: "Identified Savings", isPositive: true, icon: <BsStars size={16}/>, componentPath: "#" }, ];
const charts = { opexByDepartment: { title: "Opex by Department", componentPath: "/department-budgeting", data: { labels: ["Marketing", "Sales", "IT", "HR", "R&D", "Finance", "Operations"], datasets: [{ data: [25, 30, 18, 12, 20, 8, 12], backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#0EA5E9", "#EC4899"], borderColor: "#fff", borderWidth: 2 }], }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: "right", labels: {font: {size: 10}, boxWidth: 12} } }}, defaultType: "doughnut", }, opexByCategory: { title: "Opex by Expense Category", componentPath: "/fixed-variable-expense", data: { labels: ["Salaries & Wages", "Software", "Marketing Spend", "Travel", "Office", "Consulting"], datasets: [{ label: "Amount ($)", data: [5500000, 1500000, 2200000, 800000, 600000, 1900000], backgroundColor: "rgba(16, 185, 129, 0.7)", borderColor: "rgba(16, 185, 129, 1)", borderWidth: 1 }], }, options: { maintainAspectRatio: false, responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: value => `$${(value/1000000)}M` } } }}, defaultType: "bar", }, budgetVsActualTrend: { title: "Budget vs. Actual Trend (YTD, in Thousands)", componentPath: "/budget-vs-actuals", data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], datasets: [ { label: "Budgeted Opex", data: [1000, 1020, 1050, 1030, 1100, 1080, 1120, 1150], borderColor: "#3B82F6", backgroundColor: "rgba(59, 130, 246, 0.1)", fill: true, tension: 0.4 }, { label: "Actual Opex", data: [980, 1010, 1070, 1015, 1080, 1050, 1110, 1130], borderColor: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.1)", fill: true, tension: 0.4 }, ], }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: value => `$${value}k` } } }}, defaultType: "line" } };
const navigationItems = [ { title: "Department-Level Budgeting", description: "Drill down into budgets for Marketing, Sales, IT, HR, R&D, etc. Assign owners and track individual department plans.", icon: <FiUsers className="text-3xl text-blue-500" />, path: "/department-budgeting", bgColor: "bg-blue-50", hoverColor: "hover:bg-blue-100" }, { title: "Fixed vs. Variable Expenses", description: "Categorize and plan for recurring vs. project-based expenses. Analyze cost behavior and flexibility.", icon: <FiClipboard className="text-3xl text-green-500" />, path: "/fixed-variable-expense", bgColor: "bg-green-50", hoverColor: "hover:bg-green-100" }, { title: "AI Cost Optimization", description: "Leverage AI to identify areas for reducing spend without impacting operations. Get actionable suggestions.", icon: <BsStars className="text-3xl text-purple-500" />, path: "/ai-cost-optimization", bgColor: "bg-purple-50", hoverColor: "hover:bg-purple-100" }, { title: "Budget vs. Actuals Tracking", description: "Monitor spending against budget in real-time. Automated variance analysis and spending control alerts.", icon: <FiActivity className="text-3xl text-yellow-500" />, path: "/budget-vs-actuals", bgColor: "bg-yellow-50", hoverColor: "hover:bg-yellow-100" }, ];


// REFACTORED: EnhancedChartCard is now self-contained
const EnhancedChartCard = ({ title, componentPath, chartType, chartData, widgetId, onChartTypeChange }) => {
    const navigate = useNavigate();

    // State is now local to each card instance
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChartTypeMenuOpen, setIsChartTypeMenuOpen] = useState(false);
    const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
    const [localAiInput, setLocalAiInput] = useState("");

    const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
    const aiDropdownRef = useOutsideClick(() => setIsAiDropdownOpen(false));

    const handleSendAIQuery = () => {
        if (localAiInput.trim()) {
            console.log(`AI Query for ${widgetId}:`, localAiInput);
            setLocalAiInput("");
            setIsAiDropdownOpen(false);
        }
    };

    const renderChart = (type, data, options = {}) => {
        // This helper function could also be defined outside if preferred
		switch (type) {
			case "line": return <Line data={data} options={options} />;
			case "bar": return <Bar data={data} options={options} />;
			case "pie": return <Pie data={data} options={options} />;
			case "doughnut": return <Doughnut data={data} options={options} />;
			case "radar": return <Radar data={data} options={options} />;
			case "polarArea": return <PolarArea data={data} options={options} />;
			case "bubble": return <Bubble data={data} options={options} />;
			default: return <Line data={data} options={options} />;
		}
	};
    
    return (
        <motion.div variants={cardVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-sky-800">{title}</h3>
                <div className="flex space-x-2 relative">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(p => !p)} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="chart-options-tooltip" data-tooltip-content="Options"><BsThreeDotsVertical /></button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                <div className="py-1 text-xs text-gray-800">
                                    <div className="relative" onMouseEnter={() => setIsChartTypeMenuOpen(true)} onMouseLeave={() => setIsChartTypeMenuOpen(false)}>
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                                            All Chart Types <FiChevronDown className="ml-1 text-xs" />
                                        </div>
                                        {isChartTypeMenuOpen && (
                                            <div className="absolute top-0 left-full w-40 bg-white rounded-md shadow-lg border border-gray-200 z-30 py-1" style={{ marginLeft: "-20px" }}>
                                                {["line", "bar", "pie", "doughnut", "radar", "polarArea", "bubble"].map((type) => (
                                                    <button key={type} onClick={() => { onChartTypeChange(widgetId, type); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition">
                                                        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate(componentPath); setIsDropdownOpen(false); }}>Analyze</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={aiDropdownRef}>
                        <button onClick={() => setIsAiDropdownOpen(p => !p)} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Ask AI"><BsStars /></button>
                        {isAiDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-2 px-2">
                                <h1 className="text-xs text-center mb-1">Ask regarding {title}</h1>
                                <div className="flex justify-between gap-3 w-full">
                                    <input type="text" value={localAiInput} onChange={(e) => setLocalAiInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1 border border-gray-300 rounded text-xs" />
                                    <button onClick={handleSendAIQuery} className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600" disabled={!localAiInput.trim()}><FiSend /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-grow h-64">{renderChart(chartType, chartData.data, chartData.options)}</div>
        </motion.div>
    );
};


const OperationalBudgeting = () => {
    const navigate = useNavigate();
	const [filters, setFilters] = useState({ budgetPeriod: "Annual Budget 2024", scenario: "Base Scenario", view: "Consolidated" });
	const [showFilters, setShowFilters] = useState(false);
	const filtersRef = useOutsideClick(() => setShowFilters(false));

    // Parent state now only tracks the chosen chart type, not the UI state
    const [chartTypes, setChartTypes] = useState({
        opexByDepartment: 'doughnut',
        opexByCategory: 'bar',
        budgetVsActualTrend: 'line',
    });
	
    // This function is passed down to the child to update the parent's state
    const toggleChartType = (widgetId, type) => {
		setChartTypes((prev) => ({
			...prev,
			[widgetId]: type,
		}));
	};

    // The KPICard already managed its own state correctly, so it remains unchanged.
    const KPICard = ({ title, value, change, isPositive, icon, componentPath }) => {
		const [showAIDropdown, setShowAIDropdown] = useState(false);
		const [localAIInput, setLocalAIInput] = useState("");
		const dropdownRef = useRef(null);
		useEffect(() => { const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setShowAIDropdown(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => { document.removeEventListener("mousedown", handleClickOutside); }; }, []);
		const handleSendAIQuery = () => { if (localAIInput.trim()) { console.log(`AI Query for ${title}:`, localAIInput); setLocalAIInput(""); setShowAIDropdown(false); } };
        const needsDollarSign = ["Total Operational Budget", "Variance to Target", "AI Cost Optimization"].includes(title);
		return (
			<motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -3 }} className="bg-white p-3 rounded-lg shadow-sm border border-sky-100 relative cursor-pointer" onClick={() => navigate(componentPath)}>
				<div className="flex justify-between items-start">
					<div>
						<div className="flex items-center justify-between">
							<p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider truncate">{title}</p>
							<button onClick={(e) => { e.stopPropagation(); setShowAIDropdown(!showAIDropdown); }} className="p-1 rounded hover:bg-gray-100" data-tooltip-id="ai-tooltip" data-tooltip-content="Ask AI"><BsStars /></button>
							{showAIDropdown && ( <div ref={dropdownRef} className="absolute right-0 top-5 mt-2 w-full sm:w-44 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2" onClick={(e) => e.stopPropagation()}> <div className="flex items-center space-x-2"> <input type="text" value={localAIInput} onChange={(e) => setLocalAIInput(e.target.value)} placeholder="Ask AI..." className="w-full p-1 border border-gray-300 rounded text-xs" onClick={(e) => e.stopPropagation()} /> <button onClick={handleSendAIQuery} className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600" disabled={!localAIInput.trim()}><FiSend /></button> </div> </div> )}
						</div>
						<p className="text-sm font-bold text-sky-900 mt-1">{needsDollarSign && "$"}{typeof value === "number" ? value.toLocaleString() : value}</p>
						<div className={`flex items-center mt-2 ${ isPositive ? "text-green-500" : "text-red-500" }`}><span className="text-[10px] font-medium">{change} {isPositive ? "↑" : "↓"} vs LY</span></div>
					</div>
					<div className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors duration-200"><div className="text-sky-600 hover:text-sky-800 transition-colors duration-200">{icon}</div></div>
				</div>
			</motion.div>
		);
	};

	return (
		<div className="space-y-6 p-4 md:p-6 min-h-screen relative bg-sky-50">
			<motion.div initial="hidden" animate="visible" variants={cardVariants}>
				{/* Header Section */}
				<div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
						<div><h1 className="text-xl font-bold text-white">Operational Budgeting Dashboard</h1><p className="text-sky-100 text-sm mt-1">Explore and monitor the key components of core business expense planning.</p></div>
						<div className="flex space-x-2 mt-3 md:mt-0">
							<button onClick={() => setShowFilters((p) => !p)} className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors"><FiFilter className="mr-1.5" /> Filters</button>
							<button onClick={() => window.print()} className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors"><FiDownload className="mr-1.5" /> Export View</button>
						</div>
					</div>
				</div>

				{/* Filters Dropdown */}
				{showFilters && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200" ref={filtersRef}> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {["Budget Period", "Scenario", "View"].map((filter) => (<div key={filter}><label className="block text-sm font-medium text-gray-700 mb-1">{filter}</label><select className="w-full p-2 border border-gray-300 rounded-md text-sm"><option>Default</option></select></div>))} </div> <div className="mt-4 text-right"><button onClick={() => setShowFilters(false)} className="px-4 py-2 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700">Apply</button></div> </motion.div> )}

				{/* Navigation to Sub-Modules */}
				<div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mt-6">
					<h3 className="text-lg font-semibold text-sky-800 mb-4">Dive Deeper into Operational Budgeting</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{navigationItems.map((item, index) => ( <Link to={item.path} key={index}> <motion.div variants={cardVariants} whileHover={{ scale: 1.0, boxShadow: "0px 5px 15px rgba(0,74,128,0.1)" }} className={`p-4 rounded-lg  ${item.bgColor} ${item.hoverColor} transition-all duration-100 flex items-start space-x-4 h-full`}> <div className="flex-shrink-0 mt-1">{item.icon}</div> <div><h4 className="font-semibold text-gray-800">{item.title}</h4><p className="text-xs text-gray-600 mt-1">{item.description}</p></div> <FiChevronRight className="ml-auto text-gray-400 self-center text-lg" /> </motion.div> </Link> ))}
					</div>
				</div>

				{/* KPI Cards Section */}
				<motion.div variants={cardVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
					{kpiData.map((kpi) => <KPICard key={kpi.id} {...kpi} />)}
				</motion.div>

				{/* Chart Section */}
				<motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
					<div className="lg:col-span-2">
                        <EnhancedChartCard title={charts.opexByDepartment.title} chartType={chartTypes.opexByDepartment} chartData={charts.opexByDepartment} widgetId="opexByDepartment" componentPath={charts.opexByDepartment.componentPath} onChartTypeChange={toggleChartType} />
                    </div>
					<div className="lg:col-span-3">
                        <EnhancedChartCard title={charts.opexByCategory.title} chartType={chartTypes.opexByCategory} chartData={charts.opexByCategory} widgetId="opexByCategory" componentPath={charts.opexByCategory.componentPath} onChartTypeChange={toggleChartType} />
                    </div>
				</motion.div>
				<motion.div variants={cardVariants} className="mt-6">
                    <EnhancedChartCard title={charts.budgetVsActualTrend.title} chartType={chartTypes.budgetVsActualTrend} chartData={charts.budgetVsActualTrend} widgetId="budgetVsActualTrend" componentPath={charts.budgetVsActualTrend.componentPath} onChartTypeChange={toggleChartType} />
                </motion.div>
			</motion.div>
            
			{/* Tooltips */}
			<ReactTooltip id="ai-tooltip" place="top" effect="solid" />
			<ReactTooltip id="chart-options-tooltip" place="top" effect="solid" />
		</div>
	);
};

export default OperationalBudgeting;