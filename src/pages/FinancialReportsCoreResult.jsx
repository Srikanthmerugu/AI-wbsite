import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
	FiDownload,
	FiPrinter,
	FiSend,
	FiChevronRight,
	FiChevronLeft,
	FiFilter,
	FiChevronDown,
	FiTable,
	FiTrendingUp,
	FiTrendingDown,
	FiAlertCircle,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { CSVLink } from "react-csv";
import { GrLinkNext } from "react-icons/gr";

// Embedded Sample Data with enhanced metrics
const sampleData = {
	pnl: {
		tableData: [
			{ month: "Jan", Actual: 12000, Budget: 15000, Forecast: 13000 },
			{ month: "Feb", Actual: 19000, Budget: 15000, Forecast: 17000 },
			{ month: "Mar", Actual: 15000, Budget: 17000, Forecast: 16000 },
			{ month: "Apr", Actual: 18000, Budget: 20000, Forecast: 19000 },
			{ month: "May", Actual: 22000, Budget: 21000, Forecast: 23000 },
			{ month: "Jun", Actual: 24000, Budget: 23000, Forecast: 25000 },
		],
		metrics: {
			totalActual: 110000,
			totalBudget: 111000,
			variance: -1000,
			variancePercentage: -0.9,
			insights: [
				"Revenue exceeded forecast in Q2 due to seasonal demand",
				"Higher marketing spend impacted March profits",
				"Cost savings in operations improved May results",
			],
		},
	},
	balanceSheet: {
		tableData: [
			{ account: "Cash", current: 45000, previous: 38000 },
			{ account: "Accounts Receivable", current: 32000, previous: 28000 },
			{ account: "Inventory", current: 28000, previous: 31000 },
			{ account: "Total Assets", current: 185000, previous: 172000 },
			{ account: "Accounts Payable", current: 22000, previous: 18000 },
			{ account: "Total Liabilities", current: 85000, previous: 78000 },
			{ account: "Retained Earnings", current: 100000, previous: 94000 },
		],
		metrics: {
			totalAssets: 185000,
			totalLiabilities: 85000,
			netEquity: 100000,
			assetGrowth: 7.6,
			liabilityGrowth: 9.0,
			insights: [
				"15% increase in cash reserves from improved collections",
				"Inventory reduction of 9.7% reflects better stock management",
				"Increased liabilities due to new equipment financing",
			],
		},
	},
	cashFlow: {
		tableData: [
			{ month: "Jan", Operational: 5000, Investing: -2000, Financing: 3000 },
			{ month: "Feb", Operational: 6000, Investing: -1500, Financing: 2500 },
			{ month: "Mar", Operational: 7000, Investing: -1000, Financing: 2000 },
			{ month: "Apr", Operational: 8000, Investing: -500, Financing: 1500 },
			{ month: "May", Operational: 9000, Investing: 0, Financing: 1000 },
			{ month: "Jun", Operational: 10000, Investing: -200, Financing: 800 },
		],
		metrics: {
			netCashFlow: 42000,
			operationalTotal: 41000,
			investingTotal: -5200,
			financingTotal: 10800,
			insights: [
				"Positive operational cash flow throughout all months",
				"Investing activities show consistent capital expenditure",
				"Financing activities indicate steady funding",
			],
		},
	},
	arAging: {
		tableData: [
			{ category: "Current", amount: 45000 },
			{ category: "1-30 days", amount: 12000 },
			{ category: "31-60 days", amount: 8000 },
			{ category: "61-90 days", amount: 5000 },
			{ category: "90+ days", amount: 3000 },
		],
		metrics: {
			totalReceivables: 73000,
			overdue: 28000,
			overduePercentage: 38.4,
			insights: [
				"90+ days overdue accounts represent 4.1% of total receivables",
				"Current accounts show healthy 61.6% of total",
				"Focus needed on 31-60 days bracket to prevent further aging",
			],
		},
	},
	apAging: {
		tableData: [
			{ category: "Current", amount: 35000 },
			{ category: "1-30 days", amount: 10000 },
			{ category: "31-60 days", amount: 6000 },
			{ category: "61-90 days", amount: 4000 },
			{ category: "90+ days", amount: 2000 },
		],
		metrics: {
			totalPayables: 57000,
			overdue: 22000,
			overduePercentage: 38.6,
			insights: [
				"Vendor payments mostly current (61.4%)",
				"90+ days overdue payables represent 3.5% of total",
				"Review needed for 1-30 days bracket to maintain good relationships",
			],
		},
	},
	budgetVsActuals: {
		tableData: [
			{ month: "Jan", Actual: 12000, Budget: 15000 },
			{ month: "Feb", Actual: 19000, Budget: 15000 },
			{ month: "Mar", Actual: 15000, Budget: 17000 },
			{ month: "Apr", Actual: 18000, Budget: 20000 },
			{ month: "May", Actual: 22000, Budget: 21000 },
			{ month: "Jun", Actual: 24000, Budget: 23000 },
		],
		metrics: {
			totalActual: 110000,
			totalBudget: 111000,
			variance: -1000,
			variancePercentage: -0.9,
			favorableVariance: 13000,
			unfavorableVariance: -14000,
			insights: [
				"February showed highest positive variance (+26.7%)",
				"April had largest negative variance (-10.0%)",
				"Overall performance within 1% of budget",
			],
		},
	},
	financialRatios: {
		tableData: [
			{ ratio: "Current Ratio", value: 2.5, benchmark: 1.5 },
			{ ratio: "Debt-to-Equity", value: 0.8, benchmark: 1.0 },
			{ ratio: "ROE", value: 18, benchmark: 15 },
			{ ratio: "Gross Margin", value: 35, benchmark: 30 },
		],
		metrics: {
			averageRatio: 2.5,
			aboveBenchmark: 3,
			belowBenchmark: 1,
			insights: [
				"All ratios except one are above industry benchmarks",
				"Strong current ratio indicates good liquidity position",
				"ROE of 18% shows effective use of equity",
			],
		},
	},
	departmental: {
		tableData: [
			{ department: "Sales", cost: 50000, profit: 20000 },
			{ department: "Marketing", cost: 30000, profit: 15000 },
			{ department: "Operations", cost: 40000, profit: 18000 },
			{ department: "R&D", cost: 25000, profit: 12000 },
			{ department: "HR", cost: 20000, profit: 10000 },
		],
		metrics: {
			totalCost: 165000,
			totalProfit: 75000,
			profitMargin: 31.3,
			mostProfitable: "Sales",
			leastProfitable: "HR",
			insights: [
				"Sales department generates highest absolute profit",
				"Marketing shows best profit margin at 33.3%",
				"R&D investment showing good returns at 32.4% margin",
			],
		},
	},
	custom1: {
		tableData: [
			{ quarter: "Q1", Revenue: 50000, Expenses: 30000 },
			{ quarter: "Q2", Revenue: 55000, Expenses: 32000 },
			{ quarter: "Q3", Revenue: 60000, Expenses: 34000 },
			{ quarter: "Q4", Revenue: 65000, Expenses: 36000 },
		],
		metrics: {
			totalRevenue: 230000,
			totalExpenses: 132000,
			netProfit: 98000,
			growthRate: 9.1,
			insights: [
				"Consistent quarter-over-quarter revenue growth",
				"Expenses growing at slower rate than revenue (6.7% vs 9.1%)",
				"Q4 shows highest profitability margin",
			],
		},
	},
	custom2: {
		tableData: [
			{ region: "Region A", amount: 40000 },
			{ region: "Region B", amount: 35000 },
			{ region: "Region C", amount: 30000 },
		],
		metrics: {
			totalSales: 105000,
			topRegion: "Region A",
			topRegionPercentage: 38.1,
			growthPotential: 22.2,
			insights: [
				"Region A accounts for 38.1% of total sales",
				"Region C shows highest growth potential at 22.2%",
				"Balanced regional distribution reduces market risk",
			],
		},
	},
};

const reports = [
	{
		id: "pnl",
		title: "Profit & Loss Statement",
		desc: "Actual vs. Budget vs. Forecast",
	},
	{
		id: "balanceSheet",
		title: "Balance Sheet",
		desc: "Assets, Liabilities, and Equity Summary",
	},
	{
		id: "cashFlow",
		title: "Cash Flow Statement",
		desc: "Operational, Investing, and Financing Cash Flow",
	},
	{
		id: "arAging",
		title: "AR Aging Reports",
		desc: "Overdue Receivables Breakdown",
	},
	{
		id: "apAging",
		title: "AP Aging Reports",
		desc: "Overdue Payments Breakdown",
	},
	{
		id: "budgetVsActuals",
		title: "Budget vs. Actuals",
		desc: "Variance Analysis & Cost Overruns",
	},
	{
		id: "financialRatios",
		title: "Financial Ratio Analysis",
		desc: "Liquidity, Profitability, and Efficiency Ratios",
	},
	{
		id: "departmental",
		title: "Departmental Performance Reports",
		desc: "Cost Centers, P&L by Business Unit",
	},
	{
		id: "custom1",
		title: "Custom Revenue Report",
		desc: "Revenue vs. Expenses by Quarter",
	},
	{ id: "custom2", title: "Regional Sales Report", desc: "Sales by Region" },
];

const timePeriods = [
	{ id: "all", name: "All Months" },
	{ id: "current", name: "Current Month" },
	{ id: "last", name: "Last Month" },
	{ id: "qtd", name: "Quarter to Date" },
	{ id: "ytd", name: "Year to Date" },
	{ id: "custom", name: "Custom Range" },
];

const entities = [
	{ id: "all", name: "All Entities" },
	{ id: "ny", name: "New York Branch" },
	{ id: "sf", name: "San Francisco Branch" },
	{ id: "tx", name: "Texas Branch" },
];

const hierarchies = [
	{ id: "group", name: "Group Level" },
	{ id: "department", name: "Department Level" },
	{ id: "product", name: "Product Level" },
];

const FinancialReports = () => {
	const [selectedReport, setSelectedReport] = useState("pnl");
	const [aiInputs, setAiInputs] = useState({});
	const [aiHistory, setAiHistory] = useState({});
	const [showAIDropdown, setShowAIDropdown] = useState(null);
	const [drillDownData, setDrillDownData] = useState(null);
	const [filters, setFilters] = useState({
		period: "all",
		entity: "all",
		hierarchy: "group",
		customRange: { start: "", end: "" },
	});
	const [showFilters, setShowFilters] = useState(false);
	const [activeInsight, setActiveInsight] = useState(0);

	const data = sampleData[selectedReport];
	const currentReport = reports.find((r) => r.id === selectedReport);

	// Filter data based on selected filters
	const filteredData = React.useMemo(() => {
		if (!data || !data.tableData) return { tableData: [], metrics: {} };

		let result = [...data.tableData];

		// Apply period filter
		if (filters.period === "current") {
			result = result.slice(-1);
		} else if (filters.period === "last") {
			result = result.slice(-2, -1);
		} else if (filters.period === "qtd") {
			result = result.slice(-3);
		} else if (filters.period === "ytd") {
			result = result; // Show all data for year-to-date (adjust if needed)
		}
		// For 'all' period, we don't filter - show everything

		return {
			tableData: result,
			metrics: data.metrics,
		};
	}, [data, filters]);

	// Rotate insights every 5 seconds
	useEffect(() => {
		if (data?.metrics?.insights?.length > 1) {
			const interval = setInterval(() => {
				setActiveInsight((prev) => (prev + 1) % data.metrics.insights.length);
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [data]);

	const handleSendAIQuery = () => {
		const input = aiInputs[selectedReport] || "";
		if (input.trim()) {
			const response = `AI Insight for ${selectedReport}: ${input} (mock insight)`;
			setAiHistory((prev) => ({
				...prev,
				[selectedReport]: [
					...(prev[selectedReport] || []),
					{ query: input, response },
				],
			}));
			setAiInputs((prev) => ({ ...prev, [selectedReport]: "" }));
			setShowAIDropdown(null);
		}
	};

	const handleDrillDown = (rowData) => {
		setDrillDownData({
			title: ` ${Object.values(rowData)[0]}`,
			data: Object.entries(rowData).map(([key, value]) => ({
				field: key,
				value: typeof value === "number" ? `$${value.toLocaleString()}` : value,
			})),
			insights: [
				`Detailed analysis for ${Object.values(rowData)[0]}`,
				keyInsightsForRow(rowData),
			],
		});
	};

	const keyInsightsForRow = (rowData) => {
		if (selectedReport === "pnl") {
			const variance = rowData.Actual - rowData.Budget;
			if (variance > 0) {
				return `Performance exceeded budget by $${Math.abs(
					variance,
				).toLocaleString()} (${Math.round(
					(variance / rowData.Budget) * 100,
				)}%)`;
			} else {
				return `Performance below budget by $${Math.abs(
					variance,
				).toLocaleString()} (${Math.round(
					(variance / rowData.Budget) * 100,
				)}%)`;
			}
		}
		// Add insights for other report types
		return "Key metrics within expected ranges";
	};

	const renderTable = () => {
		if (!filteredData || !filteredData.tableData)
			return <p>No data available</p>;

		return (
			<div className="overflow-y-auto bg-white/50 rounded-lg border border-sky-100 h-56">
				<table className="w-full text-xs">
					<thead>
						<tr className="bg-sky-100 text-sky-900">
							{Object.keys(filteredData.tableData[0]).map((key) => (
								<th key={key} className="px-2 py-1 text-left capitalize">
									{key}
								</th>
							))}
							{/* <th className="px-2 py-1 text-left">Actions</th> */}
						</tr>
					</thead>
					<tbody>
						{filteredData.tableData.map((row, index) => (
							<tr
								key={index}
								className="border-b border-sky-200 hover:bg-sky-50">
								{Object.entries(row).map(([key, value], i) => (
									<td key={i} className="px-2 py-1 text-black">
										{typeof value === "number" ? (
											<div className="flex items-center">
												${value.toLocaleString()}
												{key === "Actual" && row.Budget && (
													<span
														className={`ml-2 text-xs ${
															value >= row.Budget
																? "text-green-600"
																: "text-red-600"
														}`}>
														{value >= row.Budget ? (
															<FiTrendingUp className="inline" />
														) : (
															<FiTrendingDown className="inline" />
														)}
														<span className="ml-2">
															{value >= row.Budget ? "+" : ""}
															{Math.round(
																((value - row.Budget) / row.Budget) * 100,
															)}
															%
														</span>
													</span>
												)}
											</div>
										) : (
											value
										)}
									</td>
								))}
								{/* <td className="px-2 py-1">
									<button
										onClick={() => handleDrillDown(row)}
										className="text-sky-600 hover:text-sky-800 text-xs flex items-center">
										View in detail <FiChevronRight className="ml-1" />
									</button>
								</td> */}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// const renderDrillDownView = () => {
	// 	return (
	// 		<div className="bg-white/50 rounded-lg border border-sky-100 p-4 h-96">
	// 			<div className="flex justify-between items-center mb-4">
	// 				<h3 className="text-sm font-semibold text-sky-900">
	// 					Detailed Analysis
	// 				</h3>
	// 				<button
	// 					onClick={() => setDrillDownData(null)}
	// 					className="flex items-center text-sky-600 hover:text-sky-800 text-xs">
	// 					<FiChevronLeft className="mr-1" /> Back to Report
	// 				</button>
	// 			</div>

	// 			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
	// 				<div className="md:col-span-2">
	// 					<table className="w-full text-xs">
	// 						<thead>
	// 							<tr className="bg-sky-100 text-sky-800">
	// 								<th className="px-2 py-1 text-left">Field</th>
	// 								<th className="px-2 py-1 text-left">Value</th>
	// 							</tr>
	// 						</thead>
	// 						<tbody>
	// 							{drillDownData.data.map((item, index) => (
	// 								<tr key={index} className="border-b border-sky-200">
	// 									<td className="px-2 py-1 text-black capitalize">
	// 										{item.field}
	// 									</td>
	// 									<td className="px-2 py-1 text-black">{item.value}</td>
	// 								</tr>
	// 							))}
	// 						</tbody>
	// 					</table>
	// 				</div>

	// 				<div className="bg-sky-50/50 p-3 rounded-lg">
	// 					<h4 className="text-xs font-semibold text-sky-900 mb-2 flex items-center">
	// 						<FiAlertCircle className="mr-1" /> Key Insights
	// 					</h4>
	// 					<div className="text-xs text-black space-y-2">
	// 						{drillDownData.insights.map((insight, i) => (
	// 							<p key={i} className="p-2 bg-white/50 rounded">
	// 								{insight}
	// 							</p>
	// 						))}
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// };

	const renderKeyMetrics = () => {
		if (!filteredData.metrics) return null;

		return (
			<div className="space-y-3">
				<h3 className="text-sm font-semibold text-sky-900 mb-2">Key Metrics</h3>
				<ul className="text-sm text-black space-y-2">
					{Object.entries(filteredData.metrics).map(([key, val]) => {
						if (key === "insights") return null;

						const isNegative =
							typeof val === "number" &&
							key.toLowerCase().includes("variance") &&
							val < 0;
						const isPositive =
							typeof val === "number" &&
							key.toLowerCase().includes("variance") &&
							val > 0;
						const isCurrency =
							typeof val === "number" &&
							!key.toLowerCase().includes("percentage") &&
							!key.toLowerCase().includes("ratio");

						return (
							<li key={key} className="flex justify-between items-center">
								<span className="capitalize">
									{key
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (str) => str.toUpperCase())}
									:
								</span>
								<span
									className={`font-medium ${
										isNegative
											? "text-red-600"
											: isPositive
											? "text-green-600"
											: "text-sky-800"
									}`}>
									{isCurrency
										? `$${Math.abs(val).toLocaleString()}`
										: typeof val === "number"
										? `${val.toLocaleString()}${
												key.toLowerCase().includes("percentage") ? "%" : ""
										  }`
										: val}
									{isNegative && <FiTrendingDown className="inline ml-1" />}
									{isPositive && <FiTrendingUp className="inline ml-1" />}
								</span>
							</li>
						);
					})}
				</ul>

				{filteredData.metrics.insights && (
					<div className="mt-4">
						<h4 className="text-xs font-semibold  text-sky-900 mb-2 flex items-center">
							<FiAlertCircle className="mr-1" /> Performance Insights
						</h4>
						<AnimatePresence mode="wait">
							<motion.div
								key={activeInsight}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className="text-xs bg-sky-100 p-3 rounded-lg border border-sky-200 ">
								{filteredData.metrics.insights[activeInsight]}
							</motion.div>
						</AnimatePresence>
					</div>
				)}
			</div>
		);
	};

	const aiChatbotRef = useRef(null);
	const filtersRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				aiChatbotRef.current &&
				!aiChatbotRef.current.contains(event.target)
			) {
				setShowAIDropdown(null);
			}
			if (filtersRef.current && !filtersRef.current.contains(event.target)) {
				setShowFilters(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="min-h-screen bg-sky-50 p-6">
			<div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
				<h1 className="text-lg font-bold text-white">Financial Reports</h1>
				<p className="text-sky-100 text-xs">
					Discover actionable financial insights
				</p>
			</div>

			<div className="flex gap-6">
				<aside className="w-1/4 bg-white p-4 rounded-xl shadow-md">
					<h2 className="text-sky-800 text-md font-semibold mb-4">Reports</h2>
					<ul className="space-y-2">
						{reports.map((r) => (
							<li
								key={r.id}
								onClick={() => {
									setSelectedReport(r.id);
									setDrillDownData(null);
								}}
								className={`px-3 py-2 rounded-md text-sm cursor-pointer transition ${
									selectedReport === r.id
										? "bg-sky-100 text-sky-800 font-semibold"
										: "text-sky-700 hover:bg-sky-50"
								}`}>
								{r.title}
							</li>
						))}
					</ul>
				</aside>

				<main className="w-3/4 bg-white p-6 rounded-xl shadow-md">
					<div className="mb-4">
						<div className="flex justify-between items-start">
							<div>
								<h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
									{drillDownData ? drillDownData.title : currentReport?.title}
								</h2>
								<p className="text-sky-600 text-sm mb-2">
									{drillDownData
										? "Detailed view of selected item"
										: currentReport?.desc}
								</p>
							</div>
							{selectedReport === "pnl" && !drillDownData && (
								<Link
									to="/p&l-Dashboard"
									className="text-sky-500 hover:text-sky-700 mt-1">
									<button
										type="button"
										className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200 ">
										View More
										<GrLinkNext className="ml-1 w-4 h-4 hover:w-5 hover:h-5 transition-all" />
									</button>
								</Link>
							)}
						</div>
					</div>

					{!drillDownData && (
						<div className="mb-4 flex flex-wrap gap-2 justify-end items-center">
							<div className="flex gap-2">
								<div className="relative" ref={filtersRef}>
									<button
										onClick={() => setShowFilters(!showFilters)}
										className="flex items-center bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg px-3 py-2 text-xs">
										<FiFilter className="mr-2" /> Filter
									</button>

									<AnimatePresence>
										{showFilters && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-sky-200 p-4">
												<div className="space-y-3">
													<div>
														<label className="block text-xs font-medium text-sky-700 mb-1">
															Time Period
														</label>
														<select
															value={filters.period}
															onChange={(e) =>
																setFilters({
																	...filters,
																	period: e.target.value,
																})
															}
															className="w-full p-2 border border-sky-300 rounded text-xs">
															{timePeriods.map((period) => (
																<option key={period.id} value={period.id}>
																	{period.name}
																</option>
															))}
														</select>
													</div>

													<div>
														<label className="block text-xs font-medium text-sky-700 mb-1">
															Entity
														</label>
														<select
															value={filters.entity}
															onChange={(e) =>
																setFilters({
																	...filters,
																	entity: e.target.value,
																})
															}
															className="w-full p-2 border border-sky-300 rounded text-xs">
															{entities.map((entity) => (
																<option key={entity.id} value={entity.id}>
																	{entity.name}
																</option>
															))}
														</select>
													</div>

													<div>
														<label className="block text-xs font-medium text-sky-700 mb-1">
															Hierarchy
														</label>
														<select
															value={filters.hierarchy}
															onChange={(e) =>
																setFilters({
																	...filters,
																	hierarchy: e.target.value,
																})
															}
															className="w-full p-2 border border-sky-300 rounded text-xs">
															{hierarchies.map((hierarchy) => (
																<option key={hierarchy.id} value={hierarchy.id}>
																	{hierarchy.name}
																</option>
															))}
														</select>
													</div>

													{filters.period === "custom" && (
														<div className="grid grid-cols-2 gap-2">
															<div>
																<label className="block text-xs font-medium text-sky-700 mb-1">
																	Start Date
																</label>
																<input
																	type="date"
																	value={filters.customRange.start}
																	onChange={(e) =>
																		setFilters({
																			...filters,
																			customRange: {
																				...filters.customRange,
																				start: e.target.value,
																			},
																		})
																	}
																	className="w-full p-2 border border-sky-300 rounded text-xs"
																/>
															</div>
															<div>
																<label className="block text-xs font-medium text-sky-700 mb-1">
																	End Date
																</label>
																<input
																	type="date"
																	value={filters.customRange.end}
																	onChange={(e) =>
																		setFilters({
																			...filters,
																			customRange: {
																				...filters.customRange,
																				end: e.target.value,
																			},
																		})
																	}
																	className="w-full p-2 border border-sky-300 rounded text-xs"
																/>
															</div>
														</div>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>

							<div className="flex gap-2">
								<CSVLink
									data={filteredData.tableData || []}
									filename={`${selectedReport}.csv`}
									className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200">
									<FiDownload className="mr-1" /> CSV
								</CSVLink>
								<button
									onClick={() => window.print()}
									className="flex items-center px-3 py-2 bg-sky-100 text-sky-800 rounded-lg text-xs hover:bg-sky-200">
									<FiPrinter className="mr-1" /> Print
								</button>
								<div className="relative">
									<button
										onClick={() => setShowAIDropdown(selectedReport)}
										className="flex items-center px-3 py-2 text-sky-800 rounded-lg bg-sky-100 hover:bg-sky-200 text-xs">
										<BsStars className="mr-1" /> Ask AI
									</button>

									{showAIDropdown === selectedReport && currentReport && (
										<motion.div
											ref={aiChatbotRef}
											className="absolute z-50 mt-2 right-0 w-80 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-sky-200 p-2"
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}>
											<h1 className="text-sm font-semibold text-sky-900 mb-2">
												Ask about {currentReport.title}
											</h1>
											<div className="flex items-center space-x-2 mb-4">
												<input
													type="text"
													value={aiInputs[selectedReport] || ""}
													onChange={(e) =>
														setAiInputs((prev) => ({
															...prev,
															[selectedReport]: e.target.value,
														}))
													}
													placeholder="Ask AI about this report..."
													className="w-full p-2 border border-sky-300 rounded-lg bg-sky-50 text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
													onClick={(e) => e.stopPropagation()}
												/>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleSendAIQuery();
													}}
													className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
													disabled={!aiInputs[selectedReport]?.trim()}>
													<FiSend className="w-5 h-5" />
												</button>
											</div>
											{aiHistory[selectedReport]?.length > 0 && (
												<div className="space-y-2 max-h-32 overflow-y-auto text-xs text-sky-700">
													{aiHistory[selectedReport].map((entry, index) => (
														<div key={index}>
															<strong>Q:</strong> {entry.query}
															<br />
															<strong>A:</strong> {entry.response}
														</div>
													))}
												</div>
											)}
										</motion.div>
									)}
								</div>
							</div>
						</div>
					)}

					<div className="mb-6">
						{drillDownData ? renderDrillDownView() : renderTable()}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>{!drillDownData && renderKeyMetrics()}</div>
						<div className="bg-sky-50/50 p-4 rounded-lg border border-sky-200">
							<h3 className="text-sm font-semibold text-sky-900 mb-3">
								Quick Analysis
							</h3>
							<div className="text-xs text-sky-700 space-y-3">
								{selectedReport === "pnl" && (
									<>
										<div className="flex items-start">
											<div
												className={`p-2 rounded-full mr-3 ${
													filteredData.metrics.variance >= 0
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}>
												{filteredData.metrics.variance >= 0 ? (
													<FiTrendingUp size={16} />
												) : (
													<FiTrendingDown size={16} />
												)}
											</div>
											<div>
												<p className="font-medium">Overall Performance</p>
												<p className="text-black">
													{filteredData.metrics.variance >= 0
														? "Surplus"
														: "Deficit"}{" "}
													of $
													{Math.abs(
														filteredData.metrics.variance,
													).toLocaleString()}{" "}
													({filteredData.metrics.variancePercentage}%) compared
													to budget
												</p>
											</div>
										</div>
										<div className="flex items-start">
											<div className="p-2 rounded-full mr-3 bg-blue-100 text-blue-700">
												<FiAlertCircle size={16} />
											</div>
											<div>
												<p className="font-medium">Top Impact Area</p>
												<p className="text-black">
													February showed highest positive variance (+26.7%) due
													to seasonal sales
												</p>
											</div>
										</div>
									</>
								)}
								{selectedReport === "balanceSheet" && (
									<div className="flex items-start">
										<div className="p-2 rounded-full mr-3 bg-green-100 text-green-700">
											<FiTrendingUp size={16} />
										</div>
										<div>
											<p className="font-medium">Assets Growth</p>
											<p>
												Total assets increased by{" "}
												{filteredData.metrics.assetGrowth}% compared to previous
												period
											</p>
										</div>
									</div>
								)}
								{/* Add analysis for other report types */}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default FinancialReports;
