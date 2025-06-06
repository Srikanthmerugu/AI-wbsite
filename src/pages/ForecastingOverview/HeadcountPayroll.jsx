
import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FiFilter, FiDollarSign, FiTrendingUp, FiUserMinus, FiSave, FiUpload, FiDownload, FiUsers, FiGitMerge, FiEdit2, FiPrinter } from "react-icons/fi";
import { BsStars, BsDiagram3, BsX, BsFilter as BsFilterIcon } from 'react-icons/bs'; // Added BsFilterIcon
import { Tooltip as ReactTooltip } from 'react-tooltip';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

const DUMMY_MONTHS_FALLBACK = ["Jan 2025", "Feb 2025", "Mar 2025"];

const initialEmployeesData = [
  { id: 1, empId: "E001", name: "Alice Wonderland", department: "Engineering", role: "Senior Developer",
    forecastMonths: [
      { month: "Jan 2025", aiSalary: 10000, aiBonus: 1500, aiBenefits: 2000, userSalary: 10000, userBonus: 1500, userBenefits: 2000 },
      { month: "Feb 2025", aiSalary: 10000, aiBonus: 1500, aiBenefits: 2000, userSalary: 10000, userBonus: 1500, userBenefits: 2000 },
      { month: "Mar 2025", aiSalary: 10100, aiBonus: 1600, aiBenefits: 2050, userSalary: 10100, userBonus: 1600, userBenefits: 2050 },
    ]
  },
  { id: 2, empId: "E002", name: "Bob The Builder", department: "Product", role: "Product Manager",
    forecastMonths: [
      { month: "Jan 2025", aiSalary: 12000, aiBonus: 2000, aiBenefits: 2500, userSalary: 12000, userBonus: 2000, userBenefits: 2500 },
      { month: "Feb 2025", aiSalary: 12000, aiBonus: 2000, aiBenefits: 2500, userSalary: 12000, userBonus: 2000, userBenefits: 2500 },
      { month: "Mar 2025", aiSalary: 12200, aiBonus: 2100, aiBenefits: 2550, userSalary: 12200, userBonus: 2100, userBenefits: 2550 },
    ]
  },
  { id: 3, empId: "E003", name: "Charlie Brown", department: "Sales", role: "Sales Executive",
    forecastMonths: [
      { month: "Jan 2025", aiSalary: 8000, aiBonus: 2500, aiBenefits: 1500, userSalary: 8000, userBonus: 2500, userBenefits: 1500 },
      { month: "Feb 2025", aiSalary: 8000, aiBonus: 3000, aiBenefits: 1500, userSalary: 8000, userBonus: 3000, userBenefits: 1500 },
      { month: "Mar 2025", aiSalary: 8200, aiBonus: 3500, aiBenefits: 1550, userSalary: 8200, userBonus: 3500, userBenefits: 1550 },
    ]
  },
   { id: 4, empId: "E004", name: "Diana Prince", department: "Engineering", role: "Software Engineer",
    forecastMonths: [
      { month: "Jan 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
      { month: "Feb 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
      { month: "Mar 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
    ]
  }
];

const initialDepartmentHeadcountData = [
  { department: "Engineering", forecastMonths: [ { month: "Jan 2025", aiHeadcount: 25, userHeadcount: 25 }, { month: "Feb 2025", aiHeadcount: 26, userHeadcount: 26 }, { month: "Mar 2025", aiHeadcount: 27, userHeadcount: 27 } ] },
  { department: "Product", forecastMonths: [ { month: "Jan 2025", aiHeadcount: 10, userHeadcount: 10 }, { month: "Feb 2025", aiHeadcount: 10, userHeadcount: 10 }, { month: "Mar 2025", aiHeadcount: 11, userHeadcount: 11 } ] },
  { department: "Sales", forecastMonths: [ { month: "Jan 2025", aiHeadcount: 15, userHeadcount: 15 }, { month: "Feb 2025", aiHeadcount: 16, userHeadcount: 16 }, { month: "Mar 2025", aiHeadcount: 17, userHeadcount: 17 } ] },
  { department: "Marketing", forecastMonths: [ { month: "Jan 2025", aiHeadcount: 8, userHeadcount: 8 }, { month: "Feb 2025", aiHeadcount: 8, userHeadcount: 8 }, { month: "Mar 2025", aiHeadcount: 9, userHeadcount: 9 } ] },
];

const HeadcountPayroll = () => {
  const [activeTab, setActiveTab] = useState("payrollCosts");
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [employees, setEmployees] = useState(() => JSON.parse(JSON.stringify(initialEmployeesData)));
  const [departmentHeadcountForecast, setDepartmentHeadcountForecast] = useState(() => JSON.parse(JSON.stringify(initialDepartmentHeadcountData)));
  
  const [projectedVoluntaryAttrition, setProjectedVoluntaryAttrition] = useState(1.3);
  const [projectedInvoluntaryAttrition, setProjectedInvoluntaryAttrition] = useState(1);

  const [workforceScenarios] = useState([
    { id: 1, name: "Baseline", description: "Current hiring plan and cost structure. Standard attrition rates apply.", impact: { payroll: 81500 * 4, headcount: 64 } },
    { id: 2, name: "Hiring Freeze Q2", description: "Freeze all new hires starting Q2. Assumes slightly higher voluntary attrition due to morale.", impact: { payroll: 78000 * 4, headcount: 60 } },
    { id: 3, name: "5% Salary Increase", description: "Across the board 5% salary increase effective start of period. Potential retention improvement.", impact: { payroll: 85575 * 4, headcount: 64 } },
    { id: 4, name: "Targeted Layoffs (5%)", description: "Strategic reduction in force by 5% in non-critical areas. Includes severance costs.", impact: { payroll: 77000 * 4, headcount: 61 } },
  ]);

  const [versions, setVersions] = useState([]);

  const monthsInPeriod = useMemo(() => {
    if (employees.length > 0 && employees[0].forecastMonths.length > 0) {
      return employees[0].forecastMonths.map(fm => fm.month);
    }
    if (departmentHeadcountForecast.length > 0 && departmentHeadcountForecast[0].forecastMonths.length > 0) {
        return departmentHeadcountForecast[0].forecastMonths.map(fm => fm.month);
    }
    return DUMMY_MONTHS_FALLBACK;
  }, [employees, departmentHeadcountForecast]);


  const payrollTotals = useMemo(() => {
    const newTotals = {
      totalActiveEmployees: employees.length, periodTotalSalary: 0, periodTotalBonus: 0, periodTotalBenefits: 0, grandTotalPayroll: 0, monthlyBreakdown: [],
    };
    monthsInPeriod.forEach(monthName => {
      let monthlySalary = 0, monthlyBonus = 0, monthlyBenefits = 0;
      employees.forEach(emp => {
        const monthData = emp.forecastMonths.find(fm => fm.month === monthName);
        if (monthData) {
          monthlySalary += monthData.userSalary; monthlyBonus += monthData.userBonus; monthlyBenefits += monthData.userBenefits;
        }
      });
      newTotals.monthlyBreakdown.push({ month: monthName, totalSalary: monthlySalary, totalBonus: monthlyBonus, totalBenefits: monthlyBenefits });
      newTotals.periodTotalSalary += monthlySalary; newTotals.periodTotalBonus += monthlyBonus; newTotals.periodTotalBenefits += monthlyBenefits;
    });
    newTotals.grandTotalPayroll = newTotals.periodTotalSalary + newTotals.periodTotalBonus + newTotals.periodTotalBenefits;
    return newTotals;
  }, [employees, monthsInPeriod]);
  
  const payrollChartData = useMemo(() => ({
    labels: payrollTotals.monthlyBreakdown.map(m => m.month),
    datasets: [
      { label: "Total Salary", data: payrollTotals.monthlyBreakdown.map(m => m.totalSalary), backgroundColor: "rgba(14, 165, 233, 0.6)"},
      { label: "Total Bonus", data: payrollTotals.monthlyBreakdown.map(m => m.totalBonus), backgroundColor: "rgba(16, 185, 129, 0.6)"},
      { label: "Total Benefits", data: payrollTotals.monthlyBreakdown.map(m => m.totalBenefits), backgroundColor: "rgba(245, 158, 11, 0.6)"},
    ],
  }), [payrollTotals]);

  const departmentHeadcountTotals = useMemo(() => {
    const totalsByMonth = {};
    monthsInPeriod.forEach(month => { totalsByMonth[month] = { ai: 0, user: 0 }; });
    departmentHeadcountForecast.forEach(dept => {
      dept.forecastMonths.forEach(fm => {
        if (totalsByMonth[fm.month]) {
          totalsByMonth[fm.month].ai += fm.aiHeadcount; totalsByMonth[fm.month].user += fm.userHeadcount;
        }
      });
    });
    return totalsByMonth;
  }, [departmentHeadcountForecast, monthsInPeriod]);

  const headcountGrowthChartData = useMemo(() => ({
    labels: monthsInPeriod,
    datasets: [
      { label: "Target Headcount", data: [60, 62, 65], borderColor: "rgba(14, 165, 233, 1)", backgroundColor: "rgba(14, 165, 233, 0.1)", tension: 0.3 },
      { label: "Projected Headcount (User)", data: monthsInPeriod.map(month => departmentHeadcountTotals[month]?.user || 0), borderColor: "rgba(16, 185, 129, 1)", backgroundColor: "rgba(16, 185, 129, 0.1)", tension: 0.3 },
    ],
  }), [monthsInPeriod, departmentHeadcountTotals]);
  
  const attritionChartData = useMemo(() => ({
    labels: monthsInPeriod,
    datasets: [
      { label: "Voluntary Attrition (%)", data: monthsInPeriod.map(() => projectedVoluntaryAttrition), borderColor: "rgba(245, 158, 11, 1)", backgroundColor: "rgba(245, 158, 11, 0.1)", yAxisID: 'yPercent', tension: 0.1 },
      { label: "Involuntary Attrition (#)", data: monthsInPeriod.map(() => projectedInvoluntaryAttrition), borderColor: "rgba(239, 68, 68, 1)", backgroundColor: "rgba(239, 68, 68, 0.1)", type: 'bar', yAxisID: 'yCount' },
    ],
  }), [monthsInPeriod, projectedVoluntaryAttrition, projectedInvoluntaryAttrition]);

  const handlePayrollAdjustmentChange = (employeeId, month, field, value) => {
    setEmployees(prevEmployees => prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          const updatedForecastMonths = emp.forecastMonths.map(fm => 
            fm.month === month ? { ...fm, [field]: parseFloat(value) || 0 } : fm
          );
          return { ...emp, forecastMonths: updatedForecastMonths };
        }
        return emp;
      })
    );
    setHasChanges(true);
  };

  const handleDepartmentHeadcountChange = (deptName, month, value) => {
    setDepartmentHeadcountForecast(prev => prev.map(dept => {
        if (dept.department === deptName) {
          const updatedForecastMonths = dept.forecastMonths.map(fm => 
              fm.month === month ? { ...fm, userHeadcount: parseInt(value) || 0 } : fm
          );
          return { ...dept, forecastMonths: updatedForecastMonths };
        }
        return dept;
      })
    );
    setHasChanges(true);
  };

  const handleUpdateAttritionModel = () => {
    alert("Attrition model assumptions updated for chart display. For full forecast impact, these would feed into AI models.");
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    setVersions(prev => [...prev, { 
        period, timestamp, 
        payrollData: JSON.parse(JSON.stringify(employees)), payrollTotals: JSON.parse(JSON.stringify(payrollTotals)),
        departmentHeadcountData: JSON.parse(JSON.stringify(departmentHeadcountForecast)), departmentHeadcountTotals: JSON.parse(JSON.stringify(departmentHeadcountTotals)),
        attritionAssumptions: { voluntary: projectedVoluntaryAttrition, involuntary: projectedInvoluntaryAttrition },
      },
    ]);
    setHasChanges(false);
    alert("Current forecast state saved as a new version!");
  };
  
  const handleExportPayroll = () => {
    const exportData = [];
    employees.forEach(emp => {
      const empRow = { 'Employee ID': emp.empId, 'Name': emp.name, 'Department': emp.department, 'Role': emp.role };
      emp.forecastMonths.forEach(fm => {
        empRow[`${fm.month} Salary (AI)`] = fm.aiSalary; empRow[`${fm.month} Salary (User)`] = fm.userSalary;
        empRow[`${fm.month} Bonus (AI)`] = fm.aiBonus; empRow[`${fm.month} Bonus (User)`] = fm.userBonus;
        empRow[`${fm.month} Benefits (AI)`] = fm.aiBenefits; empRow[`${fm.month} Benefits (User)`] = fm.userBenefits;
      });
      exportData.push(empRow);
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Forecast");
    XLSX.writeFile(workbook, `Payroll_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  const handleExportHeadcount = () => {
    const exportData = [];
    departmentHeadcountForecast.forEach(dept => {
        const row = { 'Department': dept.department };
        dept.forecastMonths.forEach(fm => {
            row[`${fm.month} AI Headcount`] = fm.aiHeadcount; row[`${fm.month} User Headcount`] = fm.userHeadcount;
        });
        exportData.push(row);
    });
    const totalsRow = { 'Department': 'Total' };
     monthsInPeriod.forEach(month => {
        totalsRow[`${month} AI Headcount`] = departmentHeadcountTotals[month]?.ai || 0;
        totalsRow[`${month} User Headcount`] = departmentHeadcountTotals[month]?.user || 0;
    });
    exportData.push(totalsRow);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Department Headcount");
    XLSX.writeFile(workbook, `Dept_Headcount_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  const handleImportPayroll = async (e) => { alert("Payroll Import: Placeholder."); e.target.value = ''; };
  const handleImportHeadcount = async (e) => { alert("Headcount Import: Placeholder."); e.target.value = ''; };

  const commonChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, title: { display: true, text: "Amount ($)" } },
      x: { grid: { display: false }, title: { display: true, text: "Month" } },
    },
  };
  const attritionChartOptions = {
    ...commonChartOptions,
    scales: {
      yPercent: { ...commonChartOptions.scales.y, position: 'left', title: { display: true, text: 'Rate (%)' } },
      yCount: { ...commonChartOptions.scales.y, position: 'right', title: { display: true, text: 'Count (#)' }, grid: { drawOnChartArea: false } },
      x: commonChartOptions.scales.x,
    },
  };
  const headcountChartOptions = {
    ...commonChartOptions, scales: { ...commonChartOptions.scales, y: { ...commonChartOptions.scales.y, title: {display: true, text: "Headcount (#)"}}}
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiUsers className="mr-2" />Headcount & Payroll Forecast</h1>
            <p className="text-sky-100 text-xs">Align hiring plans with budget, manage payroll, and model workforce scenarios.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-white font-medium mr-2">Period:</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-1.5 border bg-sky-50 text-sky-900 border-sky-200 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                <option>Q1 2025</option> <option>Q2 2025</option> <option>Q3 2025</option> <option>Q4 2025</option>
              </select>
            </div>
             <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50">
                <FiPrinter /> Print Page
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs - Styled like RevenueForecasting */}
      <div className="flex items-center gap-3 border-b border-gray-200 mb-6 pb-0"> {/* Removed pb-3 to align with bottom border of tabs */}
          {[
            { id: "payrollCosts", label: "Payroll Costs", icon: FiDollarSign },
            { id: "headcountGrowth", label: "Headcount Growth", icon: FiTrendingUp },
            { id: "attritionAnalysis", label: "Attrition Analysis", icon: FiUserMinus },
            { id: "workforceScenarios", label: "Workforce Scenarios", icon: BsDiagram3 },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center py-3 px-4 font-medium text-sm rounded-t-lg -mb-px  ${/* -mb-px to overlap container's border */ ''}
                          ${activeTab === tab.id 
                            ? "text-sky-50 border-b-2 border-sky-600 bg-sky-800" 
                            : "text-sky-700 hover:text-sky-500 hover:bg-sky-100 border-b-2 border-transparent"
                          }`}
            >
              <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
            </button>
          ))}
          <div className="relative ml-auto" ref={filtersRef}> {/* Filters button aligned to the far right */}
              <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm mb-px"> {/* mb-px to align with tabs baseline */}
                  <BsFilterIcon className="mr-1" /> Filters
              </button>
              {showFilters && (
                  <div className="absolute right-0 mt-1 w-60 bg-white rounded-lg shadow-xl z-20 border border-gray-200 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-sky-800">Filter Options</h4>
                  <div>
                      <label className="block text-xs text-gray-600 mb-1">Department</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                      <option>All Departments</option><option>Engineering</option><option>Product</option><option>Sales</option><option>Marketing</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs text-gray-600 mb-1">Role Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-sky-500 focus:border-sky-500">
                      <option>All Roles</option><option>Developer</option><option>Manager</option><option>Executive</option>
                      </select>
                  </div>
                  <button className="mt-3 w-full py-2 bg-sky-600 text-white rounded-md text-xs hover:bg-sky-700 transition-colors">Apply Filters</button>
                  </div>
              )}
          </div>
      </div>

      {/* Content for activeTab */}
      {activeTab === "payrollCosts" && (
        <>
          {/* Payroll Costs Summary & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Payroll Summary ({period})</h2>
              <div className="space-y-3">
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-xs font-medium text-sky-600">Active Employees (List)</p>
                  <p className="text-xl font-bold text-sky-800">{payrollTotals.totalActiveEmployees}</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-xs font-medium text-sky-600">Total Payroll (Period)</p>
                  <p className="text-xl font-bold text-sky-800">${payrollTotals.grandTotalPayroll.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-xs font-medium text-sky-600">Avg. Cost/Emp (Period)</p>
                  <p className="text-xl font-bold text-sky-800">
                    ${payrollTotals.totalActiveEmployees > 0 ? (payrollTotals.grandTotalPayroll / payrollTotals.totalActiveEmployees).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Payroll Cost Trend by Component</h2>
              <div className="h-[280px]"><Bar data={payrollChartData} options={commonChartOptions} /></div>
            </div>
          </div>
          {/* Employee Payroll Details Table */}
          <div className="bg-white rounded-xl shadow-lg mt-5 border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-900">Employee Payroll Details & Adjustments</h2>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button onClick={handleExportPayroll} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center"><FiUpload className="mr-1.5"/>Export</button>
                  {/* <label className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                    <FiUpload className="mr-1.5"/>Import
                    <input type="file" onChange={handleImportPayroll} accept=".xlsx,.xls,.csv" className="hidden"/>
                  </label> */}
                </div>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-200px)] relative">
                <table className="min-w-full divide-y divide-sky-100">
                    <thead className="bg-sky-50 sticky top-0 z-20">
                        <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-30 min-w-[200px]">Employee</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Department</th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Role</th>
                        {monthsInPeriod.map(month => (
                            <th key={month} className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[260px]" colSpan="3">{month}</th>
                        ))}
                        </tr>
                        <tr className="bg-sky-100 sticky top-[48px] z-20">
                        <th className="sticky left-0 bg-sky-100 z-30 text-left px-3 py-2 text-xs font-medium text-sky-800">(ID)</th>
                        <th className="px-3 py-2 text-xs font-medium text-sky-800 bg-sky-100"></th>
                        <th className="px-3 py-2 text-xs font-medium text-sky-800 bg-sky-100"></th>
                        {monthsInPeriod.map(month => (
                            <React.Fragment key={`${month}-sub`}>
                            <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center border-l border-sky-200 min-w-[80px]">Salary</th>
                            <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center min-w-[80px]">Bonus</th>
                            <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center min-w-[80px]">Benefits</th>
                            </React.Fragment>
                        ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                        {employees.map((emp, index) => {
                            const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                            return (
                            <tr key={emp.id} className={`${rowBgClass} hover:bg-sky-100/40`}>
                                <td className={`px-3 py-2.5 text-sm sticky left-0 z-[5] ${rowBgClass}`}>
                                    <div className="font-semibold text-sky-900">{emp.name}</div>
                                    <div className="text-xs text-sky-600">{emp.empId}</div>
                                </td>
                                <td className="px-3 py-2.5 text-sm text-sky-800 whitespace-nowrap">{emp.department}</td>
                                <td className="px-3 py-2.5 text-sm text-sky-800 whitespace-nowrap">{emp.role}</td>
                                {emp.forecastMonths.map(fm => (
                                <React.Fragment key={`${emp.id}-${fm.month}`}>
                                    {[ "Salary", "Bonus", "Benefits"].map(type => {
                                    const aiField = `ai${type}`; const userField = `user${type}`;
                                    return (
                                        <td key={type} className="px-2 py-2 text-sm text-sky-800 border-l border-sky-200">
                                        <div className="flex items-center justify-end text-xs text-gray-400 mb-0.5">
                                            <span className="mr-1">AI:</span><span>${fm[aiField].toLocaleString()}</span>
                                        </div>
                                        <input type="number" value={fm[userField]}
                                            onChange={(e) => handlePayrollAdjustmentChange(emp.id, fm.month, userField, e.target.value)}
                                            className="w-full p-1 border border-sky-300 rounded-md text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-right bg-white"/>
                                        </td>);
                                    })}
                                </React.Fragment>
                                ))}
                            </tr>
                            );
                        })}
                        <tr className="bg-sky-100 font-semibold sticky bottom-0 z-10">
                            <td className="px-3 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[15]">Total</td>
                            <td className="px-3 py-3 text-sm text-sky-900 bg-sky-100"></td>
                            <td className="px-3 py-3 text-sm text-sky-900 bg-sky-100"></td>
                            {payrollTotals.monthlyBreakdown.map(monthTotal => (
                                <React.Fragment key={`${monthTotal.month}-total`}>
                                <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center border-l border-sky-300">${monthTotal.totalSalary.toLocaleString()}</td>
                                <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center">${monthTotal.totalBonus.toLocaleString()}</td>
                                <td className="px-2 py-3 text-sm text-sky-900 bg-sky-200 text-center">${monthTotal.totalBenefits.toLocaleString()}</td>
                                </React.Fragment>
                            ))}
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-6 py-2.5 text-sm font-medium rounded-lg flex items-center transition-colors ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700 shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save All Changes</button>
            </div>
          </div>
        </>
      )}

      {activeTab === "headcountGrowth" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-sky-900 mb-4">Headcount Summary ({period})</h2>
                <div className="space-y-3">
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-200"><p className="text-xs font-medium text-sky-600">Target Headcount (End)</p><p className="text-xl font-bold text-sky-800">{headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 'N/A'}</p></div>
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-200"><p className="text-xs font-medium text-sky-600">Projected Headcount (End)</p><p className="text-xl font-bold text-green-600">{departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0}</p></div>
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-200"><p className="text-xs font-medium text-sky-600">Variance (Target vs Projected)</p><p className={`text-xl font-bold ${((departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0) - (headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{((departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0) - (headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 0))}</p></div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Overall Headcount Growth Trend</h2>
              <div className="h-[280px]"><Line data={headcountGrowthChartData} options={headcountChartOptions} /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg mt-5 border border-gray-200 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h2 className="text-xl font-semibold text-sky-900">Department Headcount Projections</h2>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                         <button onClick={handleExportHeadcount} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center"><FiUpload className="mr-1.5"/>Export</button>
                         {/* <label className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 cursor-pointer flex items-center"><FiUpload className="mr-1.5"/>Import<input type="file" onChange={handleImportHeadcount} accept=".xlsx,.xls,.csv" className="hidden"/></label> */}
                    </div>
                </div>
                <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
                    <table className="min-w-full divide-y divide-sky-100">
                        <thead className="bg-sky-50 sticky top-0 z-20">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-30 min-w-[180px]">Department</th>
                                {monthsInPeriod.map(month => (<React.Fragment key={month}><th className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[100px] border-l border-sky-200">{month} (AI)</th><th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 uppercase min-w-[120px]">{month} (User Adj.)</th></React.Fragment>))}
                                <th className="px-4 py-3 text-center text-xs font-semibold text-sky-900 uppercase min-w-[120px] border-l border-sky-200">Total User (Period)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                            {departmentHeadcountForecast.map((dept, index) => {
                                const totalUserForDept = dept.forecastMonths.reduce((sum, fm) => sum + fm.userHeadcount, 0);
                                const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                                return (
                                <tr key={dept.department} className={`${rowBgClass} hover:bg-sky-100/40`}>
                                    <td className={`px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${rowBgClass}`}>{dept.department}</td>
                                    {dept.forecastMonths.map(fm => (<React.Fragment key={`${dept.department}-${fm.month}`}><td className="px-3 py-3 text-sm text-sky-700 text-center border-l border-sky-200">{fm.aiHeadcount}</td><td className="px-3 py-3 text-sm"><input type="number" value={fm.userHeadcount} onChange={(e) => handleDepartmentHeadcountChange(dept.department, fm.month, e.target.value)} className="w-full p-1 border border-sky-300 rounded-md text-xs text-center focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"/></td></React.Fragment>))}
                                    <td className="px-4 py-3 text-sm font-semibold text-sky-800 text-center border-l border-sky-200">{totalUserForDept}</td>
                                </tr>);
                            })}
                             <tr className="bg-sky-100 font-semibold sticky bottom-0 z-10">
                                <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[15]">Total Projected</td>
                                {monthsInPeriod.map(month => (<React.Fragment key={`total-${month}`}><td className="px-3 py-3 text-sm text-sky-800 bg-sky-200 text-center border-l border-sky-300">{departmentHeadcountTotals[month]?.ai || 0}</td><td className="px-3 py-3 text-sm font-bold text-sky-900 bg-sky-200 text-center">{departmentHeadcountTotals[month]?.user || 0}</td></React.Fragment>))}
                                <td className="px-4 py-3 text-sm font-bold text-sky-900 bg-sky-200 text-center border-l border-sky-300">{Object.values(departmentHeadcountTotals).reduce((sum, monthTotals) => sum + monthTotals.user, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
             <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-6 py-2.5 text-sm font-medium rounded-lg flex items-center transition-colors ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700 shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save All Changes</button>
            </div>
          </div>
        </>
      )}

      {activeTab === "attritionAnalysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Rate Analysis & Trend</h2>
            <div className="h-[300px]"><Line data={attritionChartData} options={attritionChartOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Model Adjustments</h2>
            <p className="text-sky-700 mb-4 text-sm">Adjust assumptions to see their impact on attrition forecasts. This impacts the chart display; full integration into payroll/headcount AI would be the next step.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">Projected Voluntary Attrition (% monthly):</label>
                    <input type="number" value={projectedVoluntaryAttrition} onChange={(e)=> setProjectedVoluntaryAttrition(parseFloat(e.target.value) || 0)} step="0.1" className="w-full mt-1 p-2 border border-sky-300 rounded-md focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">Projected Involuntary Attrition (# monthly):</label>
                    <input type="number" value={projectedInvoluntaryAttrition} onChange={(e)=> setProjectedInvoluntaryAttrition(parseInt(e.target.value) || 0)} className="w-full mt-1 p-2 border border-sky-300 rounded-md focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <button onClick={handleUpdateAttritionModel} className="w-full px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium">Update Attrition Model</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "workforceScenarios" && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Scenario-Based Workforce Planning</h2>
          <p className="text-sky-700 mb-6 text-sm">Model the impact of strategic decisions (hiring freezes, salary increases, layoffs) on headcount and payroll. Compare potential outcomes to make informed choices.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workforceScenarios.map((scenario) => (
              <div key={scenario.id} className="bg-sky-50 border border-sky-200 rounded-lg p-5 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-sky-800 mb-2 flex items-center"><BsDiagram3 className="mr-2"/>{scenario.name}</h3>
                    <p className="text-sm text-sky-600 mb-4 h-20 overflow-y-auto">{scenario.description}</p>
                    <div className="space-y-1 pt-3 border-t border-sky-200">
                        <div className="flex justify-between text-xs"><span className="text-sky-700">Est. Annual Payroll:</span> <span className="font-semibold text-sky-900">${scenario.impact.payroll.toLocaleString()}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-sky-700">Est. End Headcount:</span> <span className="font-semibold text-sky-900">{scenario.impact.headcount}</span></div>
                    </div>
                </div>
                 {/* "View Scenario Details" or "Edit Scenario" button removed for simplification */}
              </div>
            ))}
          </div>
        </div>
      )}
      <ReactTooltip id="ai-tooltip" />
    </div>
  );
};

export default HeadcountPayroll;