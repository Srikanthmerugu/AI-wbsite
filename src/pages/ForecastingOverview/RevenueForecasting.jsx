
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
import { FiFilter, FiDollarSign, FiClock, FiCheckCircle, FiSave, FiUpload, FiDownload, FiInfo, FiPrinter } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsFilter, BsCheckCircle, BsClock, BsXCircle } from 'react-icons/bs';

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

const SCENARIOS = {
  BASELINE: "Baseline",
  BEST_CASE: "Best Case",
  WORST_CASE: "Worst Case",
};

const initialClientData = [
  {
    name: "Client 1", industry: "Tech", previous: 10000,
    [SCENARIOS.BASELINE]: { month1: { ai: 11000, user: 11000 }, month2: { ai: 11500, user: 11500 }, month3: { ai: 12000, user: 12000 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 12000, user: 12000 }, month2: { ai: 13000, user: 13000 }, month3: { ai: 14000, user: 14000 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 9000, user: 9000 }, month2: { ai: 8500, user: 8500 }, month3: { ai: 8000, user: 8000 } },
  },
  {
    name: "Client 2", industry: "Retail", previous: 8000,
    [SCENARIOS.BASELINE]: { month1: { ai: 8500, user: 8500 }, month2: { ai: 8700, user: 8700 }, month3: { ai: 9000, user: 9000 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 9000, user: 9000 }, month2: { ai: 9500, user: 9500 }, month3: { ai: 10000, user: 10000 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 7500, user: 7500 }, month2: { ai: 7000, user: 7000 }, month3: { ai: 6500, user: 6500 } },
  },
  {
    name: "Client 3", industry: "Finance", previous: 12000,
    [SCENARIOS.BASELINE]: { month1: { ai: 12500, user: 12500 }, month2: { ai: 13000, user: 13000 }, month3: { ai: 13500, user: 13500 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 13500, user: 13500 }, month2: { ai: 14500, user: 14500 }, month3: { ai: 15500, user: 15500 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 11000, user: 11000 }, month2: { ai: 10500, user: 10500 }, month3: { ai: 10000, user: 10000 } },
  },
  {
    name: "Client 4", industry: "Tech", previous: 9000,
    [SCENARIOS.BASELINE]: { month1: { ai: 9500, user: 9500 }, month2: { ai: 9800, user: 9800 }, month3: { ai: 10000, user: 10000 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 10000, user: 10000 }, month2: { ai: 10500, user: 10500 }, month3: { ai: 11000, user: 11000 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 8500, user: 8500 }, month2: { ai: 8200, user: 8200 }, month3: { ai: 8000, user: 8000 } },
  },
  {
    name: "Client 5", industry: "Retail", previous: 7000,
    [SCENARIOS.BASELINE]: { month1: { ai: 7400, user: 7400 }, month2: { ai: 7600, user: 7600 }, month3: { ai: 7800, user: 7800 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 8000, user: 8000 }, month2: { ai: 8200, user: 8200 }, month3: { ai: 8500, user: 8500 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 6500, user: 6500 }, month2: { ai: 6300, user: 6300 }, month3: { ai: 6000, user: 6000 } },
  },
  {
    name: "Client 6", industry: "Finance", previous: 12000,
    [SCENARIOS.BASELINE]: { month1: { ai: 12500, user: 12500 }, month2: { ai: 13000, user: 13000 }, month3: { ai: 13500, user: 13500 } },
    [SCENARIOS.BEST_CASE]: { month1: { ai: 13500, user: 13500 }, month2: { ai: 14500, user: 14500 }, month3: { ai: 15500, user: 15500 } },
    [SCENARIOS.WORST_CASE]: { month1: { ai: 11000, user: 11000 }, month2: { ai: 10500, user: 10500 }, month3: { ai: 10000, user: 10000 } },
  },
];


const RevenueForecasting = () => {
  const [activeTab, setActiveTab] = useState("create"); // create, import, compare
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [revenueClients, setRevenueClients] = useState(JSON.parse(JSON.stringify(initialClientData))); // Deep copy
  const [activeScenario, setActiveScenario] = useState(SCENARIOS.BASELINE);
  const [scenarioAssumptions, setScenarioAssumptions] = useState({
    [SCENARIOS.BASELINE]: "Standard growth assumptions, stable market conditions.",
    [SCENARIOS.BEST_CASE]: "Assumes successful new product launches, strong marketing campaigns, and favorable economic outlook.",
    [SCENARIOS.WORST_CASE]: "Considers potential economic downturn, increased competitor activity, or supply chain disruptions.",
  });

  const [revenueVersions, setRevenueVersions] = useState([]);
  const [revenueTotals, setRevenueTotals] = useState({
    aiTotal: 0, userTotal: 0, previousTotal: 0,
    month1Ai: 0, month1User: 0, month2Ai: 0, month2User: 0, month3Ai: 0, month3User: 0
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const calculateTotalsForScenario = (clients, scenarioKey) => {
    if (!scenarioKey || !clients || clients.length === 0) {
      return {
        aiTotal: 0, userTotal: 0, previousTotal: 0,
        month1Ai: 0, month1User: 0, month2Ai: 0, month2User: 0, month3Ai: 0, month3User: 0
      };
    }

    const scenarioClientsData = clients.map(c => c[scenarioKey] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} });

    const aiTotal = scenarioClientsData.reduce((sum, client) => sum + (client.month1?.ai || 0) + (client.month2?.ai || 0) + (client.month3?.ai || 0), 0);
    const userTotal = scenarioClientsData.reduce((sum, client) => sum + (client.month1?.user || 0) + (client.month2?.user || 0) + (client.month3?.user || 0), 0);
    const previousTotal = clients.reduce((sum, client) => sum + (client.previous || 0), 0);
    
    const month1Ai = scenarioClientsData.reduce((sum, client) => sum + (client.month1?.ai || 0), 0);
    const month1User = scenarioClientsData.reduce((sum, client) => sum + (client.month1?.user || 0), 0);
    const month2Ai = scenarioClientsData.reduce((sum, client) => sum + (client.month2?.ai || 0), 0);
    const month2User = scenarioClientsData.reduce((sum, client) => sum + (client.month2?.user || 0), 0);
    const month3Ai = scenarioClientsData.reduce((sum, client) => sum + (client.month3?.ai || 0), 0);
    const month3User = scenarioClientsData.reduce((sum, client) => sum + (client.month3?.user || 0), 0);
    
    return {
      aiTotal, userTotal, previousTotal,
      month1Ai, month1User, month2Ai, month2User, month3Ai, month3User
    };
  };

  useEffect(() => {
    setRevenueTotals(calculateTotalsForScenario(revenueClients, activeScenario));
  }, [revenueClients, activeScenario]);


  const revenueTrendData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"], 
    datasets: [
      {
        label: "Actual Revenue (Past)",
        data: [85000, 87000, 90000, null, null, null], 
        borderColor: "rgba(14, 165, 233, 1)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: `AI Forecast (${activeScenario.substring(0,10)}...)`,
        data: [
          null, null, null,
          revenueTotals.month1Ai,
          revenueTotals.month2Ai,
          revenueTotals.month3Ai,
        ],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: `User Forecast (${activeScenario.substring(0,10)}...)`,
        data: [
          null, null, null,
          revenueTotals.month1User,
          revenueTotals.month2User,
          revenueTotals.month3User,
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
      const newClients = JSON.parse(JSON.stringify(prev)); 
      if (!newClients[index][activeScenario]) { 
        newClients[index][activeScenario] = {
            month1: { ai: 0, user: 0 },
            month2: { ai: 0, user: 0 },
            month3: { ai: 0, user: 0 },
        };
      }
      newClients[index][activeScenario][month] = {
        ...newClients[index][activeScenario][month],
        user: parseFloat(value) || 0
      };
      return newClients;
    });
    setHasChanges(true);
  };
  
  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    const currentTotalsByScenario = {};
    Object.values(SCENARIOS).forEach(scen => {
      currentTotalsByScenario[scen] = calculateTotalsForScenario(revenueClients, scen);
    });

    setRevenueVersions(prev => [
      ...prev,
      { 
        period, 
        timestamp, 
        data: JSON.parse(JSON.stringify(revenueClients)), 
        totalsByScenario: currentTotalsByScenario,
        assumptions: JSON.parse(JSON.stringify(scenarioAssumptions))
      },
    ]);
    setRevenueTotals(calculateTotalsForScenario(revenueClients, activeScenario)); 
    setHasChanges(false);
    alert("Forecast version saved successfully!");
  };
  
  const handleExport = () => {
    const exportDataRows = [];
    exportDataRows.push([`Revenue Forecast for Scenario: ${activeScenario}`]);
    exportDataRows.push([`Assumptions: ${scenarioAssumptions[activeScenario] || 'N/A'}`]);
    exportDataRows.push([]); // Empty row for spacing

    const clientDataForExport = revenueClients.map(client => {
        const scenarioData = client[activeScenario] || { month1:{ai:0,user:0}, month2:{ai:0,user:0}, month3:{ai:0,user:0} };
        return {
          'Client Name': client.name,
          'Industry': client.industry,
          'Previous Month': client.previous,
          // 'Scenario': activeScenario, // This is now in the title row
          'Month 1 AI Suggested': scenarioData.month1.ai,
          'Month 1 Adjustments': scenarioData.month1.user,
          'Month 2 AI Suggested': scenarioData.month2.ai,
          'Month 2 Adjustments': scenarioData.month2.user,
          'Month 3 AI Suggested': scenarioData.month3.ai,
          'Month 3 Adjustments': scenarioData.month3.user,
        };
      });

    const totalsRow = {
        'Client Name': 'TOTALS',
        'Industry': '',
        'Previous Month': revenueTotals.previousTotal,
        'Month 1 AI Suggested': revenueTotals.month1Ai,
        'Month 1 Adjustments': revenueTotals.month1User,
        'Month 2 AI Suggested': revenueTotals.month2Ai,
        'Month 2 Adjustments': revenueTotals.month2User,
        'Month 3 AI Suggested': revenueTotals.month3Ai,
        'Month 3 Adjustments': revenueTotals.month3User,
    };
    
    const worksheet = XLSX.utils.json_to_sheet([]); // Start empty
    XLSX.utils.sheet_add_aoa(worksheet, [exportDataRows[0]], { origin: "A1" }); // Add Title
    XLSX.utils.sheet_add_aoa(worksheet, [exportDataRows[1]], { origin: "A2" }); // Add Assumptions
    XLSX.utils.sheet_add_json(worksheet, clientDataForExport, { origin: "A4", skipHeader: false }); // Add client data with headers
    XLSX.utils.sheet_add_json(worksheet, [totalsRow], { origin: -1, skipHeader: true }); // Append totals row without header

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Revenue Forecast`);
    
    const fileName = `Revenue_Forecast_${activeScenario.replace(/\s+/g, '_')}_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  
      const clientMap = new Map(revenueClients.map(c => [c.name, JSON.parse(JSON.stringify(c))]));

      jsonData.forEach(row => {
        const clientName = row['Client Name'];
        if (clientMap.has(clientName)) {
          const clientToUpdate = clientMap.get(clientName);
          if (!clientToUpdate[activeScenario]) {
            clientToUpdate[activeScenario] = {};
          }
          clientToUpdate[activeScenario].month1 = {
            ai: row['Month 1 AI Suggested'] ?? clientToUpdate[activeScenario]?.month1?.ai ?? 0,
            user: row['Month 1 Adjustments'] ?? clientToUpdate[activeScenario]?.month1?.user ?? 0
          };
          clientToUpdate[activeScenario].month2 = {
            ai: row['Month 2 AI Suggested'] ?? clientToUpdate[activeScenario]?.month2?.ai ?? 0,
            user: row['Month 2 Adjustments'] ?? clientToUpdate[activeScenario]?.month2?.user ?? 0
          };
          clientToUpdate[activeScenario].month3 = {
            ai: row['Month 3 AI Suggested'] ?? clientToUpdate[activeScenario]?.month3?.ai ?? 0,
            user: row['Month 3 Adjustments'] ?? clientToUpdate[activeScenario]?.month3?.user ?? 0
          };
          clientToUpdate.previous = row['Previous Month'] ?? clientToUpdate.previous;
          clientToUpdate.industry = row['Industry'] ?? clientToUpdate.industry;
          
          clientMap.set(clientName, clientToUpdate);
        } else {
          console.warn(`Client "${clientName}" not found in existing data. Skipping for import.`);
        }
      });
  
      setRevenueClients(Array.from(clientMap.values()));
      setHasChanges(true);
      alert(`Data for ${activeScenario} scenario imported successfully. Review and save changes.`);
      e.target.value = '';
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing file. Please check the file format and try again.");
    }
  };

  const handleRestoreVersion = (version) => {
    setRevenueClients(JSON.parse(JSON.stringify(version.data))); 
    setScenarioAssumptions(JSON.parse(JSON.stringify(version.assumptions)));
    setHasChanges(false); 
    alert(`Version from ${new Date(version.timestamp).toLocaleString()} restored.`);
  };

  const currentClientDataForScenario = (client) => {
    return client[activeScenario] || { 
      month1: { ai: 0, user: 0 }, 
      month2: { ai: 0, user: 0 }, 
      month3: { ai: 0, user: 0 } 
    };
  };

  const firstHeaderRowHeight = "2.5rem"; 

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50"> {/* Changed base bg to sky-50 */}
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Revenue Forecast & Scenario Planning</h1>
            <p className="text-sky-100 text-xs">
              Create, adjust, and compare revenue forecasts with AI insights and scenario modeling.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="">
              <label htmlFor="forecastPeriodSelect" className="text-sm text-white font-medium mr-2"> {/* Changed label text color */}
                Forecast Period:
              </label>
              <select
                id="forecastPeriodSelect"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="p-1.5 border bg-sky-50 text-sky-900 border-sky-200 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500"> {/* Adjusted style */}
                <option>Q1 2025</option>
                <option>Q2 2025</option>
                <option>Q3 2025</option>
                <option>Q4 2025</option>
              </select>
            </div>
            <button
                onClick={() => window.print()}
                className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
                <FiPrinter className="text-sky-50" /> {/* Changed icon */}
                <span className="text-sky-50">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Scenario Selector */}
      <div className="flex items-center gap-3 border-b mt-5 py-3 border-gray-200 mb-6">
        {['create', 'import', 'compare'].map(tabId => (
          <button
            key={tabId}
            className={`py-2 px-4 font-medium text-sm ${activeTab === tabId ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-t-lg' : 'text-sky-900 hover:text-sky-500 hover:bg-sky-100 rounded-t-lg'}`}
            onClick={() => setActiveTab(tabId)}
          >
            {tabId === 'create' && 'Create/Edit Forecast'}
            {tabId === 'import' && 'Import Forecast Data'}
            {tabId === 'compare' && 'Compare Scenarios'}
          </button>
        ))}
        <div className="ml-4"> {/* Scenario Dropdown container */}
            <label htmlFor="scenarioSelectTab" className="text-sm font-medium text-sky-800 mr-2">Active Scenario:</label>
            <select
                id="scenarioSelectTab"
                value={activeScenario}
                onChange={(e) => {
                    if (hasChanges) {
                        if(window.confirm("You have unsaved changes. Are you sure you want to switch scenarios without saving?")) {
                            setActiveScenario(e.target.value);
                            setHasChanges(false); // Reset changes flag as we are switching
                        } else {
                            e.target.value = activeScenario; // Revert dropdown if user cancels
                        }
                    } else {
                        setActiveScenario(e.target.value);
                    }
                }}
                className="p-1.5 border border-sky-300 bg-white text-sky-900 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
            >
                {Object.values(SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
        </div>
        <div className="relative ml-auto" ref={filtersRef}> {/* Filters button aligned to the far right */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm"
          >
            <BsFilter className="mr-1" /> Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-1 w-60 bg-white rounded-md shadow-lg z-20 border border-gray-200 p-3 space-y-2">
              {/* Filter content here */}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'create' && (
          <>
            <div className="flex flex-col mt-5 md:flex-row gap-4 mb-6"> {/* Added mb-6 */}
              <div className="bg-white p-4 rounded-lg shadow-sm flex-1 border border-gray-200"> {/* Added border */}
                <h2 className="text-lg font-semibold text-sky-900 mb-3">
                  {activeScenario} Forecast Summary
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <p className="text-xs font-medium text-sky-700">
                      Total User Forecast for Period
                    </p>
                    <p className="text-xl font-bold text-sky-900">
                      ${revenueTotals.userTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <p className="text-xs font-medium text-sky-700">
                      Total AI Suggested for Period
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
                      ({revenueTotals.aiTotal !== 0 ? ((revenueTotals.userTotal - revenueTotals.aiTotal) / revenueTotals.aiTotal * 100).toFixed(1) : '0.0'}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm flex-2 border border-gray-200"> {/* Added border */}
                <h2 className="text-lg font-semibold text-sky-900 mb-3">
                  Revenue Trend (incl. {activeScenario} Forecast)
                </h2>
                <div className="h-[250px]">
                  <Line
                    data={revenueTrendData}
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { 
                          legend: { position: "top" }, 
                          tooltip: { 
                              mode: "index", 
                              intersect: false,
                              callbacks: { label: ctx => `${ctx.dataset.label.replace(/\.\.\.\)/,')')}: $${ctx.raw.toLocaleString()}` } // Show full name in tooltip
                          } 
                      },
                      scales: {
                        y: { beginAtZero: false, grid: { color: "rgba(0, 0, 0, 0.05)" }, title: { display: true, text: "Revenue ($)" } },
                        x: { grid: { display: false }, title: { display: true, text: "Month" } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            
            


            <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden border border-gray-200"> {/* Added border */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-sky-900">Revenue Forecast Editor ({activeScenario})</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleExport}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FiDownload className="mr-2" /> Export Scenario
                    </button>
                    <button 
                      onClick={handleSaveAll}
                      disabled={!hasChanges}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                        hasChanges
                          ? "bg-sky-600 text-white hover:bg-sky-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FiSave className="mr-2" /> Save All Changes & Scenarios
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-[calc(100vh-200px)] relative"> {/* Adjusted max-h for new layout */}
                  <table className="min-w-full divide-y divide-sky-100">
                    <thead className="bg-sky-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[180px]">
                          Client Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">
                          Previous Month
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[240px]" colSpan="2"> {/* Added min-w */}
                          Month 1
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[240px]" colSpan="2"> {/* Added min-w */}
                          Month 2
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[240px]" colSpan="2"> {/* Added min-w */}
                          Month 3
                        </th>
                      </tr>
                      <tr className={`bg-sky-50 sticky z-10`} style={{top: firstHeaderRowHeight}}> {/* Corrected style application */}
                        <th className="sticky left-0 bg-sky-50 z-20 min-w-[180px]"></th>
                        <th className="bg-sky-50 min-w-[120px]"></th>
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px] relative group"> {/* Added min-w */}
                          AI Suggested
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max p-1.5 text-xs text-white bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                            AI considers historical data, seasonality, market trends for the {activeScenario} scenario.
                          </span>
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px]"> {/* Added min-w */}
                          Your Adjustment
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px]">AI Suggested</th> {/* Added min-w */}
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px]">Your Adjustment</th> {/* Added min-w */}
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px]">AI Suggested</th> {/* Added min-w */}
                        <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100 min-w-[120px]">Your Adjustment</th> {/* Added min-w */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {revenueClients.map((client, index) => {
                        const clientScenarioData = currentClientDataForScenario(client);
                        const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                        return (
                        <tr key={index} className={`${rowBgClass} hover:bg-sky-100/50`}>
                          <td className={`px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${rowBgClass} min-w-[180px]`}> {/* Added min-w */}
                            <div className="font-semibold">{client.name}</div>
                            <div className="text-xs text-sky-600">{client.industry}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-sky-800 min-w-[120px]"> {/* Added min-w */}
                            ${client.previous.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            ${(clientScenarioData.month1?.ai || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            <input
                              type="number"
                              value={clientScenarioData.month1?.user || ''}
                              onChange={(e) => handleInputChange(index, 'month1', e.target.value)}
                              className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white" /* Added bg-white & adjusted padding/border */
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            ${(clientScenarioData.month2?.ai || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            <input
                              type="number"
                              value={clientScenarioData.month2?.user || ''}
                              onChange={(e) => handleInputChange(index, 'month2', e.target.value)}
                              className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white" /* Added bg-white & adjusted padding/border */
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            ${(clientScenarioData.month3?.ai || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 bg-sky-50 min-w-[120px]"> {/* Added min-w */}
                            <input
                              type="number"
                              value={clientScenarioData.month3?.user || ''}
                              onChange={(e) => handleInputChange(index, 'month3', e.target.value)}
                              className="w-full p-1.5 border border-sky-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white" /* Added bg-white & adjusted padding/border */
                            />
                          </td>
                        </tr>
                      )})}
                      <tr className="bg-sky-100 font-semibold sticky bottom-0 z-[5]">
                        <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[6] min-w-[180px]">Total</td> {/* Added min-w */}
                        <td className="px-4 py-3 text-sm text-sky-900 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.previousTotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month1Ai.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month1User.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month2Ai.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month2User.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month3Ai.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200 min-w-[120px]"> {/* Added min-w */}
                          ${revenueTotals.month3User.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mb-6 mt-6 p-4 bg-sky-100/70 rounded-lg shadow-sm border border-sky-200"> {/* Adjusted bg color and border */}
                <label htmlFor="scenarioAssumptionsText" className="block text-md font-semibold text-sky-800 mb-2">
                    Assumptions for {activeScenario} Scenario (Custom Revenue Drivers):
                </label>
                 <p className="text-xs text-sky-700 mb-2">
                    Detail key assumptions, market conditions, and specific drivers for the <strong>{activeScenario}</strong>.
                </p>
                <textarea
                    id="scenarioAssumptionsText"
                    value={scenarioAssumptions[activeScenario] || ''}
                    onChange={(e) => {
                        setScenarioAssumptions(prev => ({...prev, [activeScenario]: e.target.value}));
                        setHasChanges(true);
                    }}
                    rows="3" // Reduced rows
                    className="w-full p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white" // Added bg-white
                    placeholder={`e.g., Pricing increase by 5%, Sales growth at 10% MoM, Churn rate at 2%...`}
                />
            </div>
          </>
        )}

        {activeTab === 'import' && (
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200"> {/* Added border */}
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Forecast Data for {activeScenario} Scenario</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload an Excel (.xlsx, .xls) or CSV (.csv) file to import revenue forecast data.
              The data will be imported into the currently selected scenario: <strong>{activeScenario}</strong>.
              Ensure your file has columns like 'Client Name', 'Previous Month', 'Month 1 AI Suggested', 'Month 1 Adjustments', etc.
            </p>
            <div className="border-2 border-dashed border-sky-300 rounded-lg p-8 text-center">
              <FiUpload className="mx-auto text-4xl text-sky-500 mb-3" />
              <label 
                htmlFor="importFile"
                className="px-6 py-3 bg-blue-600 text-white text-md font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File to Import
              </label>
              <input 
                id="importFile"
                type="file" 
                onChange={handleImport}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-3">Supported formats: XLSX, XLS, CSV</p>
            </div>
             <div className="mt-6">
                <h3 className="text-md font-semibold text-sky-800 mb-2">Instructions & Expected Format:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>The import will attempt to match clients by 'Client Name'. Ensure names are consistent.</li>
                    <li>Columns for AI suggestions (e.g., 'Month 1 AI Suggested') will update the AI baseline if provided; otherwise, existing AI values are kept.</li>
                    <li>Columns for adjustments (e.g., 'Month 1 Adjustments') will update user forecast values.</li>
                    <li>If 'Previous Month' or 'Industry' are in the file, they will update the respective client data.</li>
                    <li>Data is imported into the <strong>{activeScenario}</strong> scenario. Change the active scenario if you wish to import into a different one.</li>
                </ul>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200"> {/* Added border */}
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Compare Revenue Forecast Scenarios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">Metric</th>
                    {Object.values(SCENARIOS).map(scenarioName => (
                      <th key={scenarioName} className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">{scenarioName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {['Total AI Suggested', 'Total User Forecast', 'Variance (User vs AI)', 'Assumptions'].map(metric => (
                    <tr key={metric} className={metric === 'Assumptions' ? 'align-top' : ''}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{metric}</td>
                      {Object.values(SCENARIOS).map(scenarioName => {
                        const totals = calculateTotalsForScenario(revenueClients, scenarioName);
                        let value;
                        let className = "text-sm text-sky-700";
                        if (metric === 'Total AI Suggested') {
                          value = `$${totals.aiTotal.toLocaleString()}`;
                        } else if (metric === 'Total User Forecast') {
                          value = `$${totals.userTotal.toLocaleString()}`;
                          className = "text-sm font-semibold text-sky-800";
                        } else if (metric === 'Variance (User vs AI)') {
                          const varianceVal = totals.userTotal - totals.aiTotal;
                          const percentage = totals.aiTotal !== 0 ? ((varianceVal / totals.aiTotal) * 100).toFixed(1) : '0.0';
                          value = `${varianceVal >= 0 ? '+' : ''}$${varianceVal.toLocaleString()} (${percentage}%)`;
                          className = `text-sm font-semibold ${varianceVal >= 0 ? 'text-green-600' : 'text-red-600'}`;
                        } else if (metric === 'Assumptions') {
                            value = scenarioAssumptions[scenarioName] || 'N/A';
                            className = "text-xs text-gray-600 whitespace-pre-wrap break-words max-w-xs"; 
                        }
                        return (
                          <td key={`${metric}-${scenarioName}`} className={`px-5 py-4 ${className}`}>
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200"> {/* Added border */}
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Revenue Version History
          </h2>
          {revenueVersions.length === 0 ? (
            <p className="text-sm text-gray-500">No versions saved yet. Click "Save All Changes & Scenarios" to create a version.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Timestamp</th>
                    {Object.values(SCENARIOS).map(scen => (
                         <th key={scen} className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">{scen} User Total</th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {revenueVersions.map((version, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}>
                      <td className="px-4 py-3 text-sm text-sky-800">{version.period}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{new Date(version.timestamp).toLocaleString()}</td>
                      {Object.values(SCENARIOS).map(scen => (
                        <td key={`${index}-${scen}-total`} className="px-4 py-3 text-sm text-sky-800">
                            ${(version.totalsByScenario[scen]?.userTotal || 0).toLocaleString()}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRestoreVersion(version)}
                          className="text-sm text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueForecasting;