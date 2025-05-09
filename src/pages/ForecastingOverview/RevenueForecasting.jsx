import React, { useState, useRef, useEffect } from "react";
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FiFilter, FiDollarSign, FiClock, FiCheckCircle, FiSave, FiUpload, FiDownload } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsFilter, BsCheckCircle, BsClock, BsXCircle } from 'react-icons/bs';
import { NavLink } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const RevenueForecasting = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [revenueClients, setRevenueClients] = useState([
    {
      name: "Client 1",
      industry: "Tech",
      previous: 10000,
      month1: { ai: 11000, user: 0 },
      month2: { ai: 11500, user: 0 },
      month3: { ai: 12000, user: 0 },
    },
    {
      name: "Client 2",
      industry: "Retail",
      previous: 8000,
      month1: { ai: 8500, user: 0 },
      month2: { ai: 8700, user: 0 },
      month3: { ai: 9000, user: 0 },
    },
    {
      name: "Client 3",
      industry: "Finance",
      previous: 12000,
      month1: { ai: 12500, user: 0 },
      month2: { ai: 13000, user: 0 },
      month3: { ai: 13500, user: 0 },
    },
    {
      name: "Client 4",
      industry: "Tech",
      previous: 9000,
      month1: { ai: 9500, user: 0 },
      month2: { ai: 9800, user: 0 },
      month3: { ai: 10000, user: 0 },
    },
    {
      name: "Client 5",
      industry: "Retail",
      previous: 7000,
      month1: { ai: 7400, user: "" },
      month2: { ai: 7600, user: 0 },
      month3: { ai: 7800, user: 0 },
    },
	{
		name: "Client 6",
		industry: "Finance",
		previous: 12000,
		month1: { ai: 12500, user: 0 },
		month2: { ai: 13000, user: 0 },
		month3: { ai: 13500, user: 0 },
	  },
  ]);
  const [revenueVersions, setRevenueVersions] = useState([]);
  const [revenueForecasts, setRevenueForecasts] = useState({});
  const [revenueTotals, setRevenueTotals] = useState({
    aiTotal: 0,
    userTotal: 0,
    previousTotal: 0,
    month1Ai: 0,
    month1User: 0,
    month2Ai: 0,
    month2User: 0,
    month3Ai: 0,
    month3User: 0
  });
  const [filters, setFilters] = useState({
    period: "all",
    entity: "all",
    hierarchy: "group",
    customRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);

  // Initialize totals on first render
  useEffect(() => {
    calculateAndSetTotals(revenueClients);
  }, []);

  // Calculate totals - only called when needed (on save or initial load)
  const calculateAndSetTotals = (clients) => {
    const aiTotal = clients.reduce(
      (sum, client) => sum + client.month1.ai + client.month2.ai + client.month3.ai,
      0,
    );
    const userTotal = clients.reduce(
      (sum, client) => sum + client.month1.user + client.month2.user + client.month3.user,
      0,
    );
    const previousTotal = clients.reduce((sum, client) => sum + client.previous, 0);
    const month1Ai = clients.reduce((sum, client) => sum + client.month1.ai, 0);
    const month1User = clients.reduce((sum, client) => sum + client.month1.user, 0);
    const month2Ai = clients.reduce((sum, client) => sum + client.month2.ai, 0);
    const month2User = clients.reduce((sum, client) => sum + client.month2.user, 0);
    const month3Ai = clients.reduce((sum, client) => sum + client.month3.ai, 0);
    const month3User = clients.reduce((sum, client) => sum + client.month3.user, 0);
    
    setRevenueTotals({
      aiTotal,
      userTotal,
      previousTotal,
      month1Ai,
      month1User,
      month2Ai,
      month2User,
      month3Ai,
      month3User
    });
  };

  // Revenue Trend Chart Data - uses the stored totals
  const revenueTrendData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Actual Revenue",
        data: [85000, 87000, 90000, null, null, null],
        borderColor: "rgba(14, 165, 233, 1)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "AI Forecast",
        data: [
          null,
          null,
          null,
          revenueTotals.aiTotal / 3,
          revenueTotals.aiTotal / 3,
          revenueTotals.aiTotal / 3,
        ],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "User Forecast",
        data: [
          null,
          null,
          null,
          revenueTotals.userTotal / 3,
          revenueTotals.userTotal / 3,
          revenueTotals.userTotal / 3,
        ],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const handleInputChange = (index, month, value) => {
    setRevenueClients(prev => {
      const newClients = [...prev];
      newClients[index] = {
        ...newClients[index],
        [month]: {
          ...newClients[index][month],
          user: parseFloat(value) || 0
        }
      };
      return newClients;
    });
    setHasChanges(true);
  };
  
  const handleSaveAll = () => {
    // Calculate new totals and save everything
    calculateAndSetTotals(revenueClients);
    
    const timestamp = new Date().toISOString();
    setRevenueForecasts(prev => ({
      ...prev,
      [period]: revenueClients,
    }));
    setRevenueVersions(prev => [
      ...prev,
      { 
        period, 
        timestamp, 
        data: [...revenueClients], 
        totals: {...revenueTotals} 
      },
    ]);
    setHasChanges(false);
  };
  
  const handleExport = () => {
    const exportData = revenueClients.map(client => ({
      'Client Name': client.name,
      'Industry': client.industry,
      'Previous Month': client.previous,
      'Month 1 AI Suggested': client.month1.ai,
      'Month 1 Adjustments': client.month1.user,
      'Month 2 AI Suggested': client.month2.ai,
      'Month 2 Adjustments': client.month2.user,
      'Month 3 AI Suggested': client.month3.ai,
      'Month 3 Adjustments': client.month3.user,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Forecast");
    
    const fileName = `Revenue_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const importedClients = jsonData.map(row => ({
        name: row['Client Name'],
        industry: row['Industry'] || 'Tech',
        previous: row['Previous Month'] || 0,
        month1: {
          ai: row['Month 1 AI Suggested'] || 0,
          user: row['Month 1 Adjustments'] || 0
        },
        month2: {
          ai: row['Month 2 AI Suggested'] || 0,
          user: row['Month 2 Adjustments'] || 0
        },
        month3: {
          ai: row['Month 3 AI Suggested'] || 0,
          user: row['Month 3 Adjustments'] || 0
        }
      }));
  
      setRevenueClients(importedClients);
      setHasChanges(true);
      e.target.value = '';
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing file. Please check the file format and try again.");
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Revenue Forecast</h1>
            <p className="text-sky-100 text-xs">
              Create and adjust revenue forecasts with AI insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 rounded-lg">
              <NavLink
                to="#"
                onClick={() => setActiveTab("revenue")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "revenue"
                    ? "bg-sky-900 text-sky-50"
                    : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"
                }`}>
                Revenue Forecast
              </NavLink>
            </div>
            <div className="">
              <label className="text-sm text-sky-800 font-bold mr-2">
                Forecast Period:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="p-2 border-2 bg-sky-100 text-sky-900 border-sky-800 outline-0 rounded-lg text-sm">
                <option>Q1 2025</option>
                <option>Q2 2025</option>
                <option>Q3 2025</option>
                <option>Q4 2025</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 border-b mt-5 py-3 border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'create' ? 'text-sky-50 border-b-2 border--600 border-1 bg-sky-800 rounded-2xl' : 'text-sky-900 border-1 rounded-2xl hover:text-sky-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Forecast
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'import' ? 'text-sky-50 border-b-2 border--600 border-1 bg-sky-800 rounded-2xl' : 'text-sky-900 border-1 rounded-2xl hover:text-sky-500'}`}
          onClick={() => setActiveTab('import')}
        >
          Import Forecast
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'compare' ? 'text-sky-50 border-b-2 border--600 border-1 bg-sky-800 rounded-2xl' : 'text-sky-900 border-1 rounded-2xl hover:text-sky-500'}`}
          onClick={() => setActiveTab('compare')}
        >
          Compare Scenarios
        </button>
        <div className="relative ml-auto" ref={filtersRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm"
          >
            <BsFilter className="mr-1" /> Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
              <div className="py-1">
                <label className="block text-xs text-gray-700 mb-1">Time Period</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>Next 3 Months</option>
                  <option>Next 6 Months</option>
                  <option>Next 12 Months</option>
                </select>
              </div>
              <div className="py-1">
                <label className="block text-xs text-gray-700 mb-1">Scenario</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>Baseline</option>
                  <option>Best Case</option>
                  <option>Worst Case</option>
                </select>
              </div>
              <div className="py-1">
                <label className="block text-xs text-gray-700 mb-1">Department</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>All Departments</option>
                  <option>Sales</option>
                  <option>Operations</option>
                  <option>Finance</option>
                </select>
              </div>
              <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col mt-5 md:flex-row gap-4">
          {/* Revenue Forecast Summary */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
            <h2 className="text-lg font-semibold text-sky-900 mb-3">
              Revenue Forecast Summary
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-sky-50 rounded-lg">
                <p className="text-xs font-medium text-sky-700">
                  Total for Period
                </p>
                <p className="text-xl font-bold text-sky-900">
                  ${revenueTotals.userTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg">
                <p className="text-xs font-medium text-sky-700">
                  AI Suggested Forecast
                </p>
                <p className="text-xl font-bold text-sky-900">
                  ${revenueTotals.aiTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-sky-50 rounded-lg">
                <p className="text-xs font-medium text-sky-700">
                  Variance (User vs AI)
                </p>
                <p className={`text-xl font-bold ${
                  revenueTotals.userTotal >= revenueTotals.aiTotal 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ${Math.abs(revenueTotals.userTotal - revenueTotals.aiTotal).toLocaleString()} 
                  ({((revenueTotals.userTotal - revenueTotals.aiTotal) / revenueTotals.aiTotal * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex-2">
            <h2 className="text-lg font-semibold text-sky-900 mb-3">
              Revenue Trend
            </h2>
            <div className="h-[250px]">
              <Line
                data={revenueTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: { color: "rgba(0, 0, 0, 0.05)" },
                      title: { display: true, text: "Revenue ($)" },
                    },
                    x: {
                      grid: { display: false },
                      title: { display: true, text: "Month" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Revenue Client Forecast Table */}
        <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-sky-900">Revenue Forecast Editor</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <FiDownload className="mr-2" /> Export
                </button>
                <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center">
                  <FiUpload className="mr-2" /> Import
                  <input 
                    type="file" 
                    onChange={handleImport}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />
                </label>
                <button 
                  onClick={handleSaveAll}
                  disabled={!hasChanges}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                    hasChanges
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiSave className="mr-2" /> Save All Changes
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[calc(100vh-250px)] relative">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[180px]">
                      Client Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">
                      Previous Month
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                      Month 1
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                      Month 2
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                      Month 3
                    </th>
                  </tr>
                  <tr className="bg-sky-50 sticky top-[48px] z-10">
                    <th className="sticky left-0 bg-sky-50 z-20"></th>
                    <th></th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      AI Suggested
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      Your Adjustment
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      AI Suggested
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      Your Adjustment
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      AI Suggested
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                      Your Adjustment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {revenueClients.map((client, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                      <td className="px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 bg-white z-10">
                        <div className="font-semibold">{client.name}</div>
                        <div className="text-xs text-sky-600">{client.industry}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-800">
                        ${client.previous.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                        ${client.month1.ai.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 bg-sky-50">
                        <input
                          type="number"
                          value={client.month1.user}
                          onChange={(e) => handleInputChange(index, 'month1', e.target.value)}
                          className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                        ${client.month2.ai.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 bg-sky-50">
                        <input
                          type="number"
                          value={client.month2.user}
                          onChange={(e) => handleInputChange(index, 'month2', e.target.value)}
                          className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                        ${client.month3.ai.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 bg-sky-50">
                        <input
                          type="number"
                          value={client.month3.user}
                          onChange={(e) => handleInputChange(index, 'month3', e.target.value)}
                          className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-sky-100 font-semibold sticky bottom-0">
                    <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-10">Total</td>
                    <td className="px-4 py-3 text-sm text-sky-900">
                      ${revenueTotals.previousTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month1Ai.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month1User.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month2Ai.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month2User.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month3Ai.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                      ${revenueTotals.month3User.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Revenue Version History */}
        <div className="bg-white p-6 mt-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Revenue Version History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-100">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">
                    AI Forecast Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">
                    User Forecast Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {revenueVersions.map((version, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                    <td className="px-4 py-3 text-sm text-sky-800">
                      {version.period}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-800">
                      {new Date(version.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-800">
                      ${version.totals.aiTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-sky-800">
                      ${version.totals.userTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setRevenueClients(version.data);
                          setRevenueTotals(version.totals);
                          setHasChanges(false);
                        }}
                        className="text-sm text-sky-700 hover:text-sky-900"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueForecasting;