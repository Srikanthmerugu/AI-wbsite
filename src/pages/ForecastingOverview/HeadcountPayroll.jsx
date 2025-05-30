
import React, { useState, useRef, useEffect } from "react";
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FiFilter, FiDollarSign, FiTrendingUp, FiUserMinus, FiSave, FiUpload, FiDownload, FiUsers, FiGitMerge } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsFilter, BsCheckCircle, BsClock, BsXCircle, BsDiagram3 } from 'react-icons/bs';
import { NavLink } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const HeadcountPayroll = () => {
  const [activeTab, setActiveTab] = useState("payrollCosts"); // Main content tab
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const initialEmployees = [
    {
      id: 1, empId: "E001", name: "Alice Wonderland", department: "Engineering", role: "Senior Developer",
      forecastMonths: [
        { month: "Jan 2025", aiSalary: 10000, aiBonus: 1500, aiBenefits: 2000, userSalary: 10000, userBonus: 1500, userBenefits: 2000 },
        { month: "Feb 2025", aiSalary: 10000, aiBonus: 1500, aiBenefits: 2000, userSalary: 10000, userBonus: 1500, userBenefits: 2000 },
        { month: "Mar 2025", aiSalary: 10100, aiBonus: 1600, aiBenefits: 2050, userSalary: 10100, userBonus: 1600, userBenefits: 2050 },
      ]
    },
    {
      id: 2, empId: "E002", name: "Bob The Builder", department: "Product", role: "Product Manager",
      forecastMonths: [
        { month: "Jan 2025", aiSalary: 12000, aiBonus: 2000, aiBenefits: 2500, userSalary: 12000, userBonus: 2000, userBenefits: 2500 },
        { month: "Feb 2025", aiSalary: 12000, aiBonus: 2000, aiBenefits: 2500, userSalary: 12000, userBonus: 2000, userBenefits: 2500 },
        { month: "Mar 2025", aiSalary: 12200, aiBonus: 2100, aiBenefits: 2550, userSalary: 12200, userBonus: 2100, userBenefits: 2550 },
      ]
    },
    {
      id: 3, empId: "E003", name: "Charlie Brown", department: "Sales", role: "Sales Executive",
      forecastMonths: [
        { month: "Jan 2025", aiSalary: 8000, aiBonus: 2500, aiBenefits: 1500, userSalary: 8000, userBonus: 2500, userBenefits: 1500 },
        { month: "Feb 2025", aiSalary: 8000, aiBonus: 3000, aiBenefits: 1500, userSalary: 8000, userBonus: 3000, userBenefits: 1500 },
        { month: "Mar 2025", aiSalary: 8200, aiBonus: 3500, aiBenefits: 1550, userSalary: 8200, userBonus: 3500, userBenefits: 1550 },
      ]
    }
  ];
  const [employees, setEmployees] = useState(initialEmployees);

  // Sample data for other tabs
  const [headcountGrowthData, setHeadcountGrowthData] = useState({
    labels: ["Jan 2025", "Feb 2025", "Mar 2025"],
    datasets: [
      { label: "Target Headcount", data: [150, 155, 160], borderColor: "rgba(14, 165, 233, 1)", backgroundColor: "rgba(14, 165, 233, 0.1)", tension: 0.3 },
      { label: "Projected Headcount", data: [148, 152, 158], borderColor: "rgba(16, 185, 129, 1)", backgroundColor: "rgba(16, 185, 129, 0.1)", tension: 0.3 },
    ],
  });

  const [attritionData, setAttritionData] = useState({
    labels: ["Jan 2025", "Feb 2025", "Mar 2025"],
    datasets: [
      { label: "Voluntary Attrition (%)", data: [1.5, 1.2, 1.4], borderColor: "rgba(245, 158, 11, 1)", backgroundColor: "rgba(245, 158, 11, 0.1)", yAxisID: 'yPercent' },
      { label: "Involuntary Attrition (#)", data: [2, 1, 1], borderColor: "rgba(239, 68, 68, 1)", backgroundColor: "rgba(239, 68, 68, 0.1)", type: 'bar', yAxisID: 'yCount' },
    ],
  });

  const [workforceScenarios, setWorkforceScenarios] = useState([
    { id: 1, name: "Baseline", description: "Current hiring plan and cost structure.", impact: { payroll: 81500 * 4, headcount: 158 } }, // Example annual payroll
    { id: 2, name: "Hiring Freeze Q2", description: "Freeze all new hires starting Q2.", impact: { payroll: 78000 * 4, headcount: 150 } },
    { id: 3, name: "5% Salary Increase", description: "Across the board 5% salary increase.", impact: { payroll: 85575 * 4, headcount: 158 } },
  ]);

  const [versions, setVersions] = useState([]);

  const calculateTotals = () => {
    const newTotals = {
      totalHeadcount: employees.length,
      periodTotalSalary: 0,
      periodTotalBonus: 0,
      periodTotalBenefits: 0,
      grandTotalPayroll: 0,
      monthlyBreakdown: [],
    };

    const months = employees.length > 0 ? employees[0].forecastMonths.map(fm => fm.month) : ["Jan 2025", "Feb 2025", "Mar 2025"];

    months.forEach(monthName => {
      let monthlySalary = 0;
      let monthlyBonus = 0;
      let monthlyBenefits = 0;

      employees.forEach(emp => {
        const monthData = emp.forecastMonths.find(fm => fm.month === monthName);
        if (monthData) {
          monthlySalary += monthData.userSalary;
          monthlyBonus += monthData.userBonus;
          monthlyBenefits += monthData.userBenefits;
        }
      });

      newTotals.monthlyBreakdown.push({
        month: monthName,
        totalSalary: monthlySalary,
        totalBonus: monthlyBonus,
        totalBenefits: monthlyBenefits,
      });

      newTotals.periodTotalSalary += monthlySalary;
      newTotals.periodTotalBonus += monthlyBonus;
      newTotals.periodTotalBenefits += monthlyBenefits;
    });

    newTotals.grandTotalPayroll = newTotals.periodTotalSalary + newTotals.periodTotalBonus + newTotals.periodTotalBenefits;
    return newTotals;
  };

  const [totals, setTotals] = useState(calculateTotals());

  useEffect(() => {
    setTotals(calculateTotals());
  }, [employees]);

  const handleAdjustmentChange = (employeeId, month, field, value) => {
    setEmployees(prevEmployees => {
      return prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          const updatedForecastMonths = emp.forecastMonths.map(fm => {
            if (fm.month === month) {
              return { ...fm, [field]: parseFloat(value) || 0 };
            }
            return fm;
          });
          return { ...emp, forecastMonths: updatedForecastMonths };
        }
        return emp;
      });
    });
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    setVersions(prev => [
      ...prev,
      { period, timestamp, data: JSON.parse(JSON.stringify(employees)), totals: JSON.parse(JSON.stringify(totals)) },
    ]);
    setHasChanges(false);
    // Here you would typically send data to a backend
    alert("Changes saved as a new version!");
  };

  const handleExport = () => {
    const exportData = [];
    employees.forEach(emp => {
      const empRow = {
        'Employee ID': emp.empId,
        'Name': emp.name,
        'Department': emp.department,
        'Role': emp.role,
      };
      emp.forecastMonths.forEach(fm => {
        empRow[`${fm.month} Salary (AI)`] = fm.aiSalary;
        empRow[`${fm.month} Salary (User)`] = fm.userSalary;
        empRow[`${fm.month} Bonus (AI)`] = fm.aiBonus;
        empRow[`${fm.month} Bonus (User)`] = fm.userBonus;
        empRow[`${fm.month} Benefits (AI)`] = fm.aiBenefits;
        empRow[`${fm.month} Benefits (User)`] = fm.userBenefits;
      });
      exportData.push(empRow);
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Forecast");
    
    const fileName = `Payroll_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Placeholder for import logic
    alert("Import functionality would be implemented here based on your Excel structure.");
    e.target.value = ''; // Reset file input
  };

  const payrollChartData = {
    labels: totals.monthlyBreakdown.map(m => m.month),
    datasets: [
      {
        label: "Total Salary",
        data: totals.monthlyBreakdown.map(m => m.totalSalary),
        backgroundColor: "rgba(14, 165, 233, 0.6)", // Sky
        borderColor: "rgba(14, 165, 233, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Bonus",
        data: totals.monthlyBreakdown.map(m => m.totalBonus),
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Benefits",
        data: totals.monthlyBreakdown.map(m => m.totalBenefits),
        backgroundColor: "rgba(245, 158, 11, 0.6)", // Amber
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, title: { display: true, text: "Amount ($)" } },
      x: { grid: { display: false }, title: { display: true, text: "Month" } },
    },
  };
  
  const attritionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
    scales: {
      yPercent: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Rate (%)' }, grid: { color: "rgba(0,0,0,0.05)"} },
      yCount: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Count (#)' }, grid: { drawOnChartArea: false } },
      x: { grid: { display: false }, title: { display: true, text: "Month" } },
    },
  };

  const monthsInPeriod = employees.length > 0 ? employees[0].forecastMonths.map(fm => fm.month) : ["Jan 2025", "Feb 2025", "Mar 2025"];


  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiUsers className="mr-2" />Headcount & Payroll Forecast</h1>
            <p className="text-sky-100 text-xs">
              Manage hiring plans, payroll costs, and workforce scenarios.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-sky-800 font-bold mr-2">Period:</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-2 border-2 bg-sky-100 text-sky-900 border-sky-800 outline-0 rounded-lg text-sm">
                <option>Q1 2025</option> <option>Q2 2025</option> <option>Q3 2025</option> <option>Q4 2025</option>
              </select>
            </div>
             <button
                                        onClick={() => window.print()}
                                        className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
                                        <FiDownload className="text-sky-50" />
                                        <span className="text-sky-50">Export</span>
                                    </button>
          </div>
        </div>
      </div>

      {/* Secondary Action Tabs */}
      <div className="flex gap-5 border-b mt-5 py-3 border-gray-200 mb-6">
        {/* <button className={`py-2 px-4 font-medium text-sm ${activeTab === 'create' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveTab('create')}>
          Create Forecast
        </button>
        <button className={`py-2 px-4 font-medium text-sm ${activeTab === 'importView' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveTab('importView')}>
          Import Forecast
        </button>
        <button className={`py-2 px-4 font-medium text-sm ${activeTab === 'compare' ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-2xl' : 'text-sky-900 hover:text-sky-500 border rounded-2xl'}`} onClick={() => setActiveTab('compare')}>
          Compare Scenarios
        </button> */}
        <div className="flex space-x-1 rounded-lg">
              {/* Main Content Tabs */}
              <NavLink to="#" onClick={() => setActiveTab("payrollCosts")} className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "payrollCosts" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                <FiDollarSign className="inline mr-1" /> Payroll Costs
              </NavLink>
              <NavLink to="#" onClick={() => setActiveTab("headcountGrowth")} className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "headcountGrowth" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                <FiTrendingUp className="inline mr-1" /> Headcount Growth
              </NavLink>
              <NavLink to="#" onClick={() => setActiveTab("attritionAnalysis")} className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "attritionAnalysis" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                <FiUserMinus className="inline mr-1" /> Attrition
              </NavLink>
              <NavLink to="#" onClick={() => setActiveTab("workforceScenarios")} className={`px-3 py-2 rounded-lg text-sm font-medium ${activeTab === "workforceScenarios" ? "bg-sky-900 text-sky-50" : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"}`}>
                <BsDiagram3 className="inline mr-1" /> Scenarios
              </NavLink>
            </div>
        <div className="relative ml-auto" ref={filtersRef}>
          <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm">
            <BsFilter className="mr-1" /> Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
              <div className="py-1">
                <label className="block text-xs text-gray-700 mb-1">Department</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>All Departments</option><option>Engineering</option><option>Product</option><option>Sales</option><option>Marketing</option>
                </select>
              </div>
              <div className="py-1">
                <label className="block text-xs text-gray-700 mb-1">Role Type</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>All Roles</option><option>Developer</option><option>Manager</option><option>Executive</option>
                </select>
              </div>
              <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">Apply Filters</button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "payrollCosts" && (
        <>
          <div className="flex flex-col mt-5 md:flex-row gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
              <h2 className="text-lg font-semibold text-sky-900 mb-3">Payroll Summary ({period})</h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">Total Headcount</p>
                  <p className="text-xl font-bold text-sky-900">{totals.totalHeadcount}</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">Total Payroll Cost (Period)</p>
                  <p className="text-xl font-bold text-sky-900">${totals.grandTotalPayroll.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">Avg. Cost per Employee (Period)</p>
                  <p className="text-xl font-bold text-sky-900">
                    ${totals.totalHeadcount > 0 ? (totals.grandTotalPayroll / totals.totalHeadcount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex-2">
              <h2 className="text-lg font-semibold text-sky-900 mb-3">Payroll Cost Trend</h2>
              <div className="h-[250px]"><Bar data={payrollChartData} options={chartOptions} /></div>
            </div>
          </div>

          <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-900">Employee Payroll Details</h2>
                <div className="flex space-x-2">
                  <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-2"/>Export</button>
                  <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                    <FiUpload className="mr-2"/>Import
                    <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
                  </label>
                  <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-4 py-2 text-sm rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save Changes</button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-300px)] relative">
                <table className="min-w-full divide-y divide-sky-100">
                  <thead className="bg-sky-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[220px]">Employee</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Department</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Role</th>
                      {monthsInPeriod.map(month => (
                        <th key={month} className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase" colSpan="3">{month}</th>
                      ))}
                    </tr>
                    <tr className="bg-sky-50 sticky top-[48px] z-10">
                      <th className="sticky left-0 bg-sky-50 z-20"></th><th></th><th></th>
                      {monthsInPeriod.map(month => (
                        <React.Fragment key={`${month}-sub`}>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center">Salary</th>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center">Bonus</th>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center">Benefits</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {employees.map((emp, index) => (
                      <tr key={emp.id} className={index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}>
                        <td className={`px-3 py-2 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}`}>
                          <div className="font-semibold">{emp.name}</div>
                          <div className="text-xs text-sky-600">ID: {emp.empId}</div>
                        </td>
                        <td className="px-3 py-2 text-sm text-sky-800">{emp.department}</td>
                        <td className="px-3 py-2 text-sm text-sky-800">{emp.role}</td>
                        {emp.forecastMonths.map(fm => (
                          <React.Fragment key={`${emp.id}-${fm.month}`}>
                            {[ "Salary", "Bonus", "Benefits"].map(type => {
                              const aiField = `ai${type}`;
                              const userField = `user${type}`;
                              return (
                                <td key={type} className="px-2 py-2 text-sm text-sky-800">
                                  <span className="text-xs text-gray-500 block">AI: ${fm[aiField].toLocaleString()}</span>
                                  <input
                                    type="number"
                                    value={fm[userField]}
                                    onChange={(e) => handleAdjustmentChange(emp.id, fm.month, userField, e.target.value)}
                                    className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                                  />
                                </td>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-sky-100 font-semibold sticky bottom-0 z-[5]">
                      <td className="px-3 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-10">Total</td>
                      <td className="px-3 py-3 text-sm text-sky-900"></td>
                      <td className="px-3 py-3 text-sm text-sky-900"></td>
                      {totals.monthlyBreakdown.map(monthTotal => (
                        <React.Fragment key={`${monthTotal.month}-total`}>
                          <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center">${monthTotal.totalSalary.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center">${monthTotal.totalBonus.toLocaleString()}</td>
                          <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center">${monthTotal.totalBenefits.toLocaleString()}</td>
                        </React.Fragment>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "headcountGrowth" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Headcount Growth Trend</h2>
            <div className="h-[300px]"><Line data={headcountGrowthData} options={chartOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Growth Summary</h2>
             <p className="text-sky-700">View detailed metrics about hiring targets, actual hires, and net headcount changes over the period.</p>
             {/* Placeholder for summary table or KPIs */}
             <div className="mt-4 space-y-2">
                <div className="p-3 bg-sky-50 rounded-lg flex justify-between"><span>Target Headcount (End of Period):</span> <span className="font-bold">160</span></div>
                <div className="p-3 bg-sky-50 rounded-lg flex justify-between"><span>Projected Headcount (End of Period):</span> <span className="font-bold">158</span></div>
                <div className="p-3 bg-sky-50 rounded-lg flex justify-between"><span>Net Change Required:</span> <span className="font-bold text-red-600">-2</span></div>
             </div>
          </div>
        </div>
      )}

      {activeTab === "attritionAnalysis" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Analysis</h2>
            <div className="h-[300px]"><Line data={attritionData} options={attritionChartOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Summary & Adjustments</h2>
            <p className="text-sky-700 mb-3">Adjust attrition rate assumptions to see impact on forecasts.</p>
            <div className="space-y-3">
                <div><label className="block text-sm font-medium text-sky-700">Projected Voluntary Attrition Rate (%):</label><input type="number" defaultValue="1.3" className="w-full mt-1 p-2 border border-sky-300 rounded"/></div>
                <div><label className="block text-sm font-medium text-sky-700">Projected Involuntary Attrition (# per month):</label><input type="number" defaultValue="1" className="w-full mt-1 p-2 border border-sky-300 rounded"/></div>
                <button className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Update Attrition Model</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "workforceScenarios" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Workforce Planning Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workforceScenarios.map((scenario) => (
              <div key={scenario.id} className="border border-sky-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">{scenario.name}</h3>
                <p className="text-sm text-sky-600 mb-3">{scenario.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-sky-700">Projected Payroll:</span> <span className="font-medium">${scenario.impact.payroll.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-sky-700">Projected Headcount:</span> <span className="font-medium">{scenario.impact.headcount}</span></div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">Create New Scenario</button>
        </div>
      )}
      
      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Create New Payroll Forecast</h2>
          <p className="text-sky-700">This section would guide users to build a new forecast from scratch, define parameters, and input initial data or assumptions.</p>
          <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">Start New Forecast Wizard</button>
        </div>
      )}

      {activeTab === "importView" && ( // Renamed from "import" to avoid conflict if "import" is used as keyword
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Payroll Forecast Data</h2>
          <p className="text-sky-700 mb-4">Upload bulk employee and payroll data from Excel or CSV. Ensure your file matches the required template.</p>
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center w-max">
            <FiUpload className="mr-2" /> Import Master Payroll File
            <input type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
          </label>
           <p className="mt-4 text-xs text-sky-600">Note: Import functionality here is a placeholder. A real application would define specific file formats and processing logic.</p>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Compare Forecast Versions</h2>
          <p className="text-sky-700 mb-2">Select and compare different saved versions of your payroll forecast.</p>
          {versions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-sky-800 mb-2">Saved Forecast Versions:</h3>
              <ul className="list-disc pl-5 text-sky-700 space-y-1">
                {versions.map((version, index) => (
                  <li key={index} className="text-sm">
                    Forecast for {version.period}, saved on {new Date(version.timestamp).toLocaleString()}
                    <button className="ml-3 px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600">Load</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sky-600">No saved versions to compare. Make changes in 'Payroll Costs' and click 'Save Changes' to create a version.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeadcountPayroll;