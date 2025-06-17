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
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FiFilter, FiDollarSign, FiUsers, FiDownload, FiSend, FiChevronDown, FiChevronRight, FiClipboard, FiPercent, FiActivity, FiEdit } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// Mock Data for the Hub
const budgetProgressData = [
    { name: "Revenue", status: 95, color: "bg-green-500" },
    { name: "Cost of Goods Sold", status: 85, color: "bg-green-500" },
    { name: "Marketing", status: 75, color: "bg-yellow-500" },
    { name: "Sales", status: 60, color: "bg-yellow-500" },
    { name: "IT", status: 90, color: "bg-green-500" },
    { name: "HR & People", status: 50, color: "bg-yellow-500" },
    { name: "General & Admin", status: 100, color: "bg-green-500" },
];

const kpiData = [
    { title: "Total Budget vs. Last Year", value: "$12.5M", change: "+5.2%", isPositive: false },
    { title: "Revenue Budget vs. Last Year", value: "$25.0M", change: "+8.1%", isPositive: true },
    { title: "Headcount (FTE) vs. Last Year", value: "150", change: "+15 FTEs", isPositive: false },
    { title: "AI Optimization Potential", value: "$320K", change: "Identified Savings", isPositive: true },
];

// Chart data comparing Budget vs Last Year
const opexByDeptChartData = {
    labels: ["Marketing", "Sales", "IT", "HR", "R&D", "G&A"],
    datasets: [
        {
            label: 'FY2025 Budget',
            data: [2500000, 3000000, 1800000, 1200000, 2000000, 1500000],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        },
        {
            label: 'FY2024 Actuals',
            data: [2300000, 2800000, 1750000, 1100000, 1800000, 1400000],
            backgroundColor: 'rgba(107, 114, 128, 0.5)',
            borderColor: 'rgba(107, 114, 128, 1)',
            borderWidth: 1,
        }
    ]
};

const BudgetingHub = () => {
    const navigate = useNavigate();
    const [planningHorizon, setPlanningHorizon] = useState("1-Year"); // 1-Year, 3-Year, 5-Year
    
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
    };

    const KPICard = ({ title, value, change, isPositive }) => (
        <motion.div variants={cardVariants} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex flex-col justify-between">
            <div>
                <p className="text-sm font-semibold text-sky-700 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-sky-900 mt-2">{value}</p>
            </div>
            <div className={`flex items-center mt-2 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                <span>{change}</span>
            </div>
        </motion.div>
    );
    
    const ChartCard = ({ title, chartComponent, chartData, chartOptions }) => (
        <motion.div variants={cardVariants} className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-sky-800">{title}</h3>
                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                    <BsThreeDotsVertical size={16} />
                </button>
            </div>
            <div className="h-80">
                {chartComponent(chartData, chartOptions)}
            </div>
        </motion.div>
    );

    const BudgetProgressTracker = () => (
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Budgeting Progress & Status</h3>
            <div className="space-y-4">
                {budgetProgressData.map((dept) => (
                    <div key={dept.name}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-700">{dept.name}</p>
                            <p className="text-sm font-semibold text-sky-800">{dept.status}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`${dept.color} h-2.5 rounded-full`} style={{ width: `${dept.status}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
            <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-xl font-bold text-white">Budgeting Hub</h1>
                            <p className="text-sky-100 text-sm mt-1">
                                Central dashboard for all budget planning, tracking, and analysis activities.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-3 md:mt-0">
                             {/* This button should be conditionally rendered based on user role (e.g., admin/FP&A) */}
                             <button
                                onClick={() => navigate('/budgeting/settings/guidelines')}
                                className="flex items-center py-2 px-3 text-xs font-medium text-sky-800 bg-white rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors"
                            >
                                <FiEdit className="mr-1.5" /> Set Corporate Guidelines
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-700 rounded-lg border border-sky-600 hover:bg-sky-600"
                            >
                                <FiDownload className="mr-1.5" /> Export View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Planning Horizon Toggle */}
                <div className="my-6 p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-center">
                    <div className="flex items-center space-x-1 bg-sky-100 p-1 rounded-md">
                        {["1-Year Detailed", "3-Year Strategic", "5-Year Strategic"].map(horizon => (
                            <button
                                key={horizon}
                                onClick={() => setPlanningHorizon(horizon.split(' ')[0])}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                                    planningHorizon === horizon.split(' ')[0]
                                        ? "bg-white text-sky-700 shadow"
                                        : "bg-transparent text-sky-600 hover:bg-sky-200"
                                }`}
                            >
                                {horizon} Plan
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Progress Tracker */}
                    <div className="lg:col-span-1">
                        <BudgetProgressTracker />
                    </div>

                    {/* Right Column: KPIs and Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {kpiData.map((kpi, index) => <KPICard key={index} {...kpi} />)}
                        </div>
                        
                        <ChartCard 
                            title="Budgeted Opex vs. Last Year by Department"
                            chartComponent={(data, options) => <Bar data={data} options={options} />}
                            chartData={opexByDeptChartData}
                            chartOptions={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { stacked: false },
                                    y: {
                                        stacked: false,
                                        ticks: { callback: value => `$${(value / 1000000)}M` }
                                    },
                                },
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </div>
                </div>
            </motion.div>
            <ReactTooltip id="global-tooltip" place="top" effect="solid" />
        </div>
    );
};

export default BudgetingHub;