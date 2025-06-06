
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiSave,
  FiUpload,
  FiDownload,
  FiInfo,
  FiPlusCircle,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronRight,
  FiCalendar,
  FiTrendingUp,
  FiPieChart,
  FiPrinter,
  FiSettings,
  FiEdit,    // <<< NEW IMPORT
  FiTrash2,  // <<< NEW IMPORT
} from "react-icons/fi";
import { BsStars, BsGraphUp, BsExclamationTriangleFill } from "react-icons/bs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const DEPARTMENTS = {
  MARKETING: "Marketing",
  SALES: "Sales",
  IT: "Information Technology",
  HR: "Human Resources",
  OPERATIONS: "Operations",
  RD: "Research & Development",
  FINANCE: "Finance",
};

const SCENARIOS = {
  BASELINE: "Baseline",
  STRETCH: "Stretch Case",
  WORST_CASE: "Worst Case",
};

const PERIODS = ["FY 2025", "H1 2025", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
const MONTHS_FY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_H1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Helper function to generate monthly data with slight, realistic variance
const generateMonthlyValues = (baseValue, monthsArray) => {
  const monthly = {};
  monthsArray.forEach(month => {
    // Simple variation for mock data to look more realistic
    monthly[month] = Math.round(baseValue * (0.8 + Math.random() * 0.4));
  });
  return monthly;
};

// MOCK DATA: Simulating a configuration that would be fetched from a backend
const MOCK_DEPARTMENT_CONFIG = {
  [DEPARTMENTS.MARKETING]: {
    expenseCategories: [
      { id: "mkt_adv", name: "Digital Advertising", glCode: "60100", 
        drivers: [{ id: "da_spend", name: "Monthly Ad Spend Target", type: "currency", value: 20000 }],
        aiExplanation: "Based on historical Q1 spend, planned product launch, and projected 15% increase in CPC.",
        isRecurring: true,
      },
      { id: "mkt_evt", name: "Events & Conferences", glCode: "60200", 
        drivers: [
          { id: "ec_major_qty", name: "Major Events (Qty)", type: "number", value: 1 },
          { id: "ec_major_cost", name: "Avg Cost/Major Event", type: "currency", value: 15000 },
          { id: "ec_minor_qty", name: "Minor Events (Qty)", type: "number", value: 3 },
          { id: "ec_minor_cost", name: "Avg Cost/Minor Event", type: "currency", value: 3000 },
        ],
        aiExplanation: "Includes Annual Summit in Q3. AI predicts slightly higher venue and travel costs due to inflation.",
        isRecurring: false,
      },
      { id: "mkt_tools", name: "Marketing Software & Tools", glCode: "60300", 
        drivers: [{ id: "mt_monthly_lic", name: "Monthly License Costs", type: "currency", value: 5000 }],
        aiExplanation: "Standard SaaS subscriptions. AI suggests a 5% buffer for potential new tool adoption mid-year.",
        isRecurring: true,
      },
    ],
  },
  [DEPARTMENTS.IT]: {
    expenseCategories: [
      { id: "it_infra", name: "Cloud Infrastructure (AWS/Azure)", glCode: "70100", 
        drivers: [{ id: "ci_monthly_spend", name: "Avg. Monthly Cloud Spend", type: "currency", value: 30000 }],
        aiExplanation: "Projected based on 10% YoY growth in data processing and storage needs, consistent with user growth.",
        isRecurring: true,
      },
      { id: "it_hw", name: "Hardware Purchases (Laptops, Servers)", glCode: "70200", 
        drivers: [
          { id: "hw_laptops_qty", name: "New Laptops (Qty)", type: "number", value: 20 },
          { id: "hw_laptops_cost", name: "Avg Cost/Laptop", type: "currency", value: 1500 },
          { id: "hw_servers_qty", name: "New Servers (Qty)", type: "number", value: 2 },
          { id: "hw_servers_cost", name: "Avg Cost/Server", type: "currency", value: 8000 },
        ],
        aiExplanation: "Hardware refresh cycle for 20% of staff and new server for R&D project. Costs reflect current market prices.",
        isRecurring: false,
      },
      { id: "it_sw", name: "Software Licenses (Enterprise)", glCode: "70300", 
        drivers: [{ id: "sw_annual_cost", name: "Total Annual License Cost", type: "currency", value: 120000 }],
        aiExplanation: "Includes major renewals for ERP and CRM. AI accounts for a standard 3% vendor price increase.",
        isRecurring: true,
      },
    ],
  },
  // Placeholders for other departments to demonstrate scalability
  [DEPARTMENTS.SALES]: { expenseCategories: [ { id: "sales_comm", name: "Sales Commissions", glCode: "61100", drivers: [{ id: "comm_rate", name: "Avg Commission Rate %", type: "number", value: 10 }, {id: "sales_target", name:"Sales Target", type:"currency", value: 5000000}], aiExplanation: "Based on historical attainment and new compensation plan.", isRecurring: true } ] },
  [DEPARTMENTS.HR]: { expenseCategories: [ { id: "hr_recruit", name: "Recruitment Fees", glCode: "62100", drivers: [{ id: "hires_qty", name: "Planned New Hires", type: "number", value: 25 }, {id: "avg_fee", name:"Avg Fee per Hire", type:"currency", value: 8000}], aiExplanation: "Based on company growth targets and competitive talent market.", isRecurring: false } ] },
  [DEPARTMENTS.OPERATIONS]: { expenseCategories: [] },
  [DEPARTMENTS.RD]: { expenseCategories: [] },
  [DEPARTMENTS.FINANCE]: { expenseCategories: [] },
};

const DepartmentBudgeting = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS.MARKETING);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS.BASELINE);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  
  const [budgetData, setBudgetData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showAiExplanation, setShowAiExplanation] = useState(null); // { categoryId: 'xxx', text: '...' }

  const currentMonths = selectedPeriod.startsWith("H1") ? MONTHS_H1 : MONTHS_FY;

  // This function calculates the total budget for a category based on its drivers
  const calculateTotalFromDrivers = (category, months) => {
    let total = 0;
    // Specific calculation logic per category ID for robust demo
    switch (category.id) {
        case "mkt_adv":
        case "mkt_tools":
        case "it_infra":
            total = category.drivers[0].value * months.length;
            break;
        case "it_sw":
            total = category.drivers[0].value; // Annual cost
            break;
        case "mkt_evt":
            total = (category.drivers.find(d => d.id === "ec_major_qty").value * category.drivers.find(d => d.id === "ec_major_cost").value) +
                    (category.drivers.find(d => d.id === "ec_minor_qty").value * category.drivers.find(d => d.id === "ec_minor_cost").value);
            break;
        case "it_hw":
            total = (category.drivers.find(d => d.id === "hw_laptops_qty").value * category.drivers.find(d => d.id === "hw_laptops_cost").value) +
                    (category.drivers.find(d => d.id === "hw_servers_qty").value * category.drivers.find(d => d.id === "hw_servers_cost").value);
            break;
        default:
            // Fallback for simple cases
            if (category.drivers.length > 0 && category.drivers[0].type === "currency") {
                total = category.drivers[0].value * (category.drivers[0].name.toLowerCase().includes("annual") ? 1 : months.length);
            }
            break;
    }
    return total;
  };

  useEffect(() => {
    // This effect simulates fetching and preparing data when filters change.
    const deptConfig = JSON.parse(JSON.stringify(MOCK_DEPARTMENT_CONFIG[selectedDepartment])); // Deep copy for reset
    if (!deptConfig || !deptConfig.expenseCategories) {
      setBudgetData([]);
      setKpiData({});
      return;
    }

    const newBudgetData = deptConfig.expenseCategories.map(cat => {
      // For demo, AI baseline is 95% of the user's initial driver-based budget
      const userBudgetTotal = calculateTotalFromDrivers(cat, currentMonths);
      const aiTotal = Math.round(userBudgetTotal * 0.95); 

      const userBudgetMonthly = generateMonthlyValues(userBudgetTotal / currentMonths.length, currentMonths);
      const aiBaselineMonthly = generateMonthlyValues(aiTotal / currentMonths.length, currentMonths);

      return {
        ...cat,
        aiBaselineMonthly,
        aiTotal,
        userBudgetMonthly,
        userBudgetTotal,
        varianceVsAI: userBudgetTotal - aiTotal,
        lastYearBudget: Math.round(aiTotal * (0.8 + Math.random() * 0.2)), // Mock last year
        comments: [],
        approvalStatus: "Pending",
      };
    });
    setBudgetData(newBudgetData);
    setHasChanges(false);
  }, [selectedDepartment, selectedScenario, selectedPeriod]);


  useEffect(() => {
    // This effect recalculates KPIs whenever the main budget data changes.
    if (budgetData.length === 0) {
        setKpiData({});
        return;
    };
    
    const totalUserBudget = budgetData.reduce((sum, item) => sum + item.userBudgetTotal, 0);
    const totalAIBudget = budgetData.reduce((sum, item) => sum + item.aiTotal, 0);
    const totalLastYear = budgetData.reduce((sum, item) => sum + item.lastYearBudget, 0);
    
    setKpiData({
      totalBudget: totalUserBudget,
      aiSuggestedTotal: totalAIBudget,
      varianceVsAI: totalUserBudget - totalAIBudget,
      varianceVsLastYear: totalUserBudget - totalLastYear,
      categoriesCount: budgetData.length,
    });
    
  }, [budgetData]);


  const handleDriverChange = (categoryIndex, driverIndex, newValue) => {
    const updatedBudgetData = [...budgetData];
    const categoryToUpdate = updatedBudgetData[categoryIndex];
    
    categoryToUpdate.drivers[driverIndex].value = parseFloat(newValue) || 0;

    // Recalculate totals for the updated category
    const newUserBudgetTotal = calculateTotalFromDrivers(categoryToUpdate, currentMonths);
    categoryToUpdate.userBudgetTotal = newUserBudgetTotal;
    categoryToUpdate.userBudgetMonthly = generateMonthlyValues(newUserBudgetTotal / currentMonths.length, currentMonths);
    categoryToUpdate.varianceVsAI = newUserBudgetTotal - categoryToUpdate.aiTotal;

    setBudgetData(updatedBudgetData);
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving budget data:", budgetData);
    setHasChanges(false);
    alert(`${selectedDepartment} budget for ${selectedScenario} saved!`);
  };
  
  const handleSubmitForApproval = () => {
    console.log("Submitting for approval:", budgetData);
    alert(`${selectedDepartment} budget for ${selectedScenario} submitted for approval.`);
  };

  // <<< NEW FUNCTION FOR DELETING A ROW >>>
  const handleDeleteRow = (categoryIdToDelete, categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
        setBudgetData(prevData => prevData.filter(item => item.id !== categoryIdToDelete));
        setHasChanges(true);
    }
  };

  // Chart Data Preparation
  const categoryChartData = {
    labels: budgetData.map(cat => cat.name.length > 20 ? cat.name.substring(0,18)+'...' : cat.name),
    datasets: [{
        data: budgetData.map(cat => cat.userBudgetTotal),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'],
        borderColor: '#fff',
        borderWidth: 2,
    }],
  };

  const trendChartData = {
    labels: currentMonths,
    datasets: [
      {
        label: 'Total User Budget',
        data: currentMonths.map(month => budgetData.reduce((sum, cat) => sum + (cat.userBudgetMonthly[month] || 0), 0)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Total AI Baseline',
        data: currentMonths.map(month => budgetData.reduce((sum, cat) => sum + (cat.aiBaselineMonthly[month] || 0), 0)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Breadcrumb Navigation */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                    <Link to="/operational-budgeting" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                      Operational Budgeting
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Department-Level Budgeting</span>
                  </div>
                </li>
              </ol>
            </nav>
      
      <header className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 p-4 rounded-lg shadow-md text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl font-bold">Department-Level Operational Budgeting</h1>
            <p className="text-sky-200 text-xs">Plan and manage expenses with AI-powered insights and driver-based modeling.</p>
          </div>
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
             <button
                onClick={() => window.print()}
                className="flex gap-2 items-center py-1.5 px-3 text-xs font-medium bg-sky-600 rounded-md border border-sky-500 hover:bg-sky-500 transition-colors">
                <FiPrinter /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Control Filters */}
        <div>
          <label htmlFor="departmentSelect" className="block text-xs font-medium text-slate-600 mb-1">Department</label>
          <select id="departmentSelect" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
            {Object.values(DEPARTMENTS).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="scenarioSelect" className="block text-xs font-medium text-slate-600 mb-1">Scenario</label>
          <select id="scenarioSelect" value={selectedScenario} onChange={e => setSelectedScenario(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
            {Object.values(SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="periodSelect" className="block text-xs font-medium text-slate-600 mb-1">Period</label>
          <select id="periodSelect" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI Cards */}
        {kpiData.totalBudget !== undefined && (
          <>
            <KPIBudgetCard title="Total Department Budget" value={`$${kpiData.totalBudget?.toLocaleString()}`} icon={<FiDollarSign className="text-sky-600" />} />
            <KPIBudgetCard title="AI Suggested Total" value={`$${kpiData.aiSuggestedTotal?.toLocaleString()}`} icon={<BsStars className="text-purple-500" />} />
            <KPIBudgetCard title="Variance vs AI" value={`${kpiData.varianceVsAI <= 0 ? '' : '+'}$${kpiData.varianceVsAI?.toLocaleString()}`}
              isPositive={kpiData.varianceVsAI <= 0} icon={<BsGraphUp className={kpiData.varianceVsAI > 0 ? "text-red-500" : "text-green-500"} />} />
            <KPIBudgetCard title="YoY Variance" value={`${kpiData.varianceVsLastYear <= 0 ? '' : '+'}$${kpiData.varianceVsLastYear?.toLocaleString()}`}
              isPositive={kpiData.varianceVsLastYear <= 0} icon={<FiTrendingUp className={kpiData.varianceVsLastYear > 0 ? "text-red-500" : "text-green-500"} />} />
            <KPIBudgetCard title="Budget Categories" value={kpiData.categoriesCount} icon={<FiFilter className="text-slate-500" />} />
          </>
        )}
      </div>
      
      <div className="space-y-6">
        {/* --- Budget Details Table (Full Width) --- */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {selectedDepartment} Budget Details - {selectedScenario} ({selectedPeriod})
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={handleSave} disabled={!hasChanges}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center transition-colors font-semibold ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sm" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}>
                <FiSave className="mr-1.5" /> Save Changes
              </button>
              <button onClick={handleSubmitForApproval}
                className="px-3 py-1.5 text-xs rounded-md flex items-center bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold shadow-sm">
                <FiCheckCircle className="mr-1.5" /> Submit for Approval
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg" style={{maxHeight: '60vh'}}>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-100 z-20 min-w-[200px]">Expense Category</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[250px]">Drivers (User Input)</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[150px]">AI Baseline</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[150px]">User Budget</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">Variance (vs AI)</th>
                  {currentMonths.map(month => (
                    <th key={month} className="px-3 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">{month}</th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Status</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {budgetData.map((cat, catIndex) => {
                  const rowBgClass = catIndex % 2 === 0 ? "bg-white" : "bg-slate-50";
                  return (
                  <tr key={cat.id} className={`${rowBgClass} hover:bg-sky-50/70`}>
                    <td className={`px-3 py-2 font-medium text-slate-800 sticky left-0 z-[5] ${rowBgClass} border-r border-slate-200 min-w-[200px]`}>
                      <div>{cat.name}</div>
                      <div className="text-xs text-slate-500 font-normal">GL: {cat.glCode} {cat.isRecurring && <span className="text-sky-600">(Recurring)</span>}</div>
                    </td>
                    <td className="px-3 py-2 min-w-[250px] space-y-2">
                      {cat.drivers.map((driver, driverIndex) => (
                        <div key={driver.id} className="flex items-center gap-2">
                          <label htmlFor={`${cat.id}-${driver.id}`} className="text-xs text-slate-600 w-2/3 truncate" title={driver.name}>{driver.name}:</label>
                          <input type="number" id={`${cat.id}-${driver.id}`} value={driver.value}
                            onChange={e => handleDriverChange(catIndex, driverIndex, e.target.value)}
                            className="w-1/3 p-1 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-sky-500 bg-white"
                            step={driver.type === 'currency' ? '100' : '1'} />
                        </div>
                      ))}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-700 min-w-[150px]">
                      ${cat.aiTotal.toLocaleString()}
                      <FiInfo className="ml-1.5 inline text-sky-500 hover:text-sky-700 cursor-pointer" 
                        onClick={() => setShowAiExplanation({ categoryId: cat.id, text: cat.aiExplanation })} title="View AI Explanation" />
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900 min-w-[150px]">
                      ${cat.userBudgetTotal.toLocaleString()}
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold min-w-[120px] ${cat.varianceVsAI > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {cat.varianceVsAI > 0 ? '+' : ''}${cat.varianceVsAI.toLocaleString()}
                    </td>
                    {currentMonths.map(month => (
                      <td key={month} className="px-3 py-2 text-right text-slate-700 min-w-[100px]">
                        ${(cat.userBudgetMonthly[month] || 0).toLocaleString()}
                      </td>
                    ))}
                     <td className="px-3 py-2 text-center text-xs min-w-[100px]">
                        <span className={`px-2 py-1 rounded-full font-semibold ${
                            cat.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 
                            cat.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>{cat.approvalStatus}</span>
                    </td>
                    {/* <<< MODIFIED ACTIONS COLUMN >>> */}
                    <td className="px-3 py-2 text-center text-slate-500 min-w-[120px]">
                      <div className="flex items-center justify-center gap-4">
                        <button title="Comments" className="hover:text-sky-600 transition-colors">
                          <FiMessageSquare />
                        </button>
                        <button title="Edit drivers directly in the input fields" className="text-slate-400 cursor-not-allowed">
                          <FiEdit />
                        </button>
                        <button onClick={() => handleDeleteRow(cat.id, cat.name)} title="Delete Row" className="hover:text-red-600 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
                {/* --- Totals Row --- */}
                <tr className="bg-slate-200 font-bold sticky bottom-0 z-[5] border-t-2 border-slate-300">
                    <td className="px-3 py-2 text-slate-900 sticky left-0 bg-slate-200 z-[6] border-r border-slate-300">Total</td>
                    <td className="px-3 py-2 bg-slate-200"></td>
                    <td className="px-3 py-2 text-right text-slate-900">${kpiData.aiSuggestedTotal?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-slate-900">${kpiData.totalBudget?.toLocaleString()}</td>
                    <td className={`px-3 py-2 text-right ${kpiData.varianceVsAI > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {kpiData.varianceVsAI > 0 ? '+' : ''}${kpiData.varianceVsAI?.toLocaleString()}
                    </td>
                    {currentMonths.map(month => (
                      <td key={`total-${month}`} className="px-3 py-2 text-right text-slate-900">
                        ${budgetData.reduce((sum, cat) => sum + (cat.userBudgetMonthly[month] || 0), 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-3 py-2 bg-slate-200"></td>
                    <td className="px-3 py-2 bg-slate-200"></td>
                </tr>
              </tbody>
            </table>
          </div>
            <button className="mt-4 text-sm text-sky-600 hover:text-sky-800 flex items-center font-semibold">
                <FiPlusCircle className="mr-2"/> Add Expense Category
            </button>
        </div>

        {/* --- Charts and AI Insights Row --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Budget Allocation by Category</h3>
            <div className="h-64">
              {budgetData.length > 0 ? <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels:{font:{size:10}, boxWidth: 12} } } }} /> : <p className="text-sm text-gray-500 text-center pt-10">No categories to display.</p>}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-md font-semibold text-slate-800 mb-3">Monthly Budget Trend</h3>
             <div className="h-64">
              {budgetData.length > 0 ? <Bar data={trendChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end', labels:{font:{size:10}, boxWidth: 12} } }, scales: { y: { ticks: { callback: value => `$${value/1000}k` } }, x: { grid: { display: false } } } }} /> : <p className="text-sm text-gray-500 text-center pt-10">No categories to display.</p>}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                <BsStars className="mr-2 text-purple-500"/> AI Insights & Recommendations
            </h3>
            <div className="space-y-2">
            {MOCK_DEPARTMENT_CONFIG[selectedDepartment]?.expenseCategories.slice(0,2).map(cat => (
                <div key={`insight-${cat.id}`} className="text-xs text-slate-700 p-2 bg-slate-50 rounded-md border border-slate-200">
                    <strong className="text-slate-800">{cat.name}:</strong> {cat.aiExplanation}
                    {Math.random() > 0.6 && <span className="mt-1 text-amber-600 flex items-center text-xs font-semibold"><BsExclamationTriangleFill className="mr-1.5 flex-shrink-0"/> AI Risk Flag: Consider a 10% cost increase for Q4 due to market volatility.</span>}
                </div>
            ))}
            </div>
            <button className="text-xs text-sky-600 hover:underline mt-3 font-medium">View All AI Insights</button>
          </div>
        </div>
      </div>


      {showAiExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setShowAiExplanation(null)}>
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800 flex items-center"><BsStars className="mr-2 text-purple-500"/> AI Explanation</h4>
                <FiXCircle className="text-2xl text-gray-400 hover:text-red-500 cursor-pointer transition-colors" onClick={() => setShowAiExplanation(null)} />
            </div>
            <p className="text-sm text-slate-600 mb-2"><strong>Category:</strong> {budgetData.find(c => c.id === showAiExplanation.categoryId)?.name}</p>
            <p className="text-sm text-slate-700 bg-slate-100 p-3 rounded-md border border-slate-200">{showAiExplanation.text}</p>
            <button onClick={() => setShowAiExplanation(null)} className="mt-5 px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors w-full font-semibold">
                Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const KPIBudgetCard = ({ title, value, icon, isPositive }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-sky-300 transition-all duration-200">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <span className="text-2xl text-slate-400">{icon}</span>
    </div>
    <p className={`text-2xl font-bold text-slate-800 mt-2 ${isPositive === false ? 'text-red-600' : isPositive === true ? 'text-green-600' : ''}`}>
        {value}
    </p>
  </div>
);

export default DepartmentBudgeting;