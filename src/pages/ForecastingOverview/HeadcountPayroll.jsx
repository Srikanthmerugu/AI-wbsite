
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
import { FiFilter, FiDollarSign, FiTrendingUp, FiUserMinus, FiSave, FiUpload, FiDownload, FiUsers, FiGitMerge, FiEdit2 } from "react-icons/fi";
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
  const [activeTab, setActiveTab] = useState("payrollCosts");
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const DUMMY_MONTHS = ["Jan 2025", "Feb 2025", "Mar 2025"];

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
    },
     {
      id: 4, empId: "E004", name: "Diana Prince", department: "Engineering", role: "Software Engineer",
      forecastMonths: [
        { month: "Jan 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
        { month: "Feb 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
        { month: "Mar 2025", aiSalary: 9000, aiBonus: 1000, aiBenefits: 1800, userSalary: 9000, userBonus: 1000, userBenefits: 1800 },
      ]
    }
  ];
  const [employees, setEmployees] = useState(JSON.parse(JSON.stringify(initialEmployees)));

  // Departmental Headcount Forecast
  const initialDepartmentHeadcount = [
    { 
      department: "Engineering", 
      forecastMonths: [
        { month: "Jan 2025", aiHeadcount: 25, userHeadcount: 25 },
        { month: "Feb 2025", aiHeadcount: 26, userHeadcount: 26 },
        { month: "Mar 2025", aiHeadcount: 27, userHeadcount: 27 },
      ]
    },
    { 
      department: "Product", 
      forecastMonths: [
        { month: "Jan 2025", aiHeadcount: 10, userHeadcount: 10 },
        { month: "Feb 2025", aiHeadcount: 10, userHeadcount: 10 },
        { month: "Mar 2025", aiHeadcount: 11, userHeadcount: 11 },
      ]
    },
    { 
      department: "Sales", 
      forecastMonths: [
        { month: "Jan 2025", aiHeadcount: 15, userHeadcount: 15 },
        { month: "Feb 2025", aiHeadcount: 16, userHeadcount: 16 },
        { month: "Mar 2025", aiHeadcount: 17, userHeadcount: 17 },
      ]
    },
    { 
      department: "Marketing", 
      forecastMonths: [
        { month: "Jan 2025", aiHeadcount: 8, userHeadcount: 8 },
        { month: "Feb 2025", aiHeadcount: 8, userHeadcount: 8 },
        { month: "Mar 2025", aiHeadcount: 9, userHeadcount: 9 },
      ]
    },
  ];
  const [departmentHeadcountForecast, setDepartmentHeadcountForecast] = useState(JSON.parse(JSON.stringify(initialDepartmentHeadcount)));


  const [attritionData, setAttritionData] = useState({
    labels: DUMMY_MONTHS,
    datasets: [
      { label: "Voluntary Attrition (%)", data: [1.5, 1.2, 1.4], borderColor: "rgba(245, 158, 11, 1)", backgroundColor: "rgba(245, 158, 11, 0.1)", yAxisID: 'yPercent' },
      { label: "Involuntary Attrition (#)", data: [2, 1, 1], borderColor: "rgba(239, 68, 68, 1)", backgroundColor: "rgba(239, 68, 68, 0.1)", type: 'bar', yAxisID: 'yCount' },
    ],
  });

  const [workforceScenarios, setWorkforceScenarios] = useState([
    { id: 1, name: "Baseline", description: "Current hiring plan and cost structure.", impact: { payroll: 81500 * 4, headcount: 64 } },
    { id: 2, name: "Hiring Freeze Q2", description: "Freeze all new hires starting Q2.", impact: { payroll: 78000 * 4, headcount: 60 } },
    { id: 3, name: "5% Salary Increase", description: "Across the board 5% salary increase.", impact: { payroll: 85575 * 4, headcount: 64 } },
  ]);

  const [versions, setVersions] = useState([]);

  const monthsInPeriod = employees.length > 0 ? employees[0].forecastMonths.map(fm => fm.month) : DUMMY_MONTHS;

  const calculatePayrollTotals = () => {
    const newTotals = {
      totalActiveEmployees: employees.length, // Current employees in detail list
      periodTotalSalary: 0,
      periodTotalBonus: 0,
      periodTotalBenefits: 0,
      grandTotalPayroll: 0,
      monthlyBreakdown: [],
    };

    monthsInPeriod.forEach(monthName => {
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

  const [payrollTotals, setPayrollTotals] = useState(calculatePayrollTotals());

  useEffect(() => {
    setPayrollTotals(calculatePayrollTotals());
  }, [employees, monthsInPeriod]);


  const calculateDepartmentHeadcountTotals = () => {
    const totalsByMonth = {};
    monthsInPeriod.forEach(month => {
        totalsByMonth[month] = { ai: 0, user: 0 };
    });

    departmentHeadcountForecast.forEach(dept => {
        dept.forecastMonths.forEach(fm => {
            if (totalsByMonth[fm.month]) {
                totalsByMonth[fm.month].ai += fm.aiHeadcount;
                totalsByMonth[fm.month].user += fm.userHeadcount;
            }
        });
    });
    return totalsByMonth;
  };
  
  const [departmentHeadcountTotals, setDepartmentHeadcountTotals] = useState(calculateDepartmentHeadcountTotals());

  useEffect(() => {
    setDepartmentHeadcountTotals(calculateDepartmentHeadcountTotals());
  }, [departmentHeadcountForecast, monthsInPeriod]);


  // Dynamic Headcount Growth Chart Data
  const [headcountGrowthChartData, setHeadcountGrowthChartData] = useState({
    labels: monthsInPeriod,
    datasets: [
      { label: "Target Headcount", data: [60, 62, 65], borderColor: "rgba(14, 165, 233, 1)", backgroundColor: "rgba(14, 165, 233, 0.1)", tension: 0.3 }, // Example static target
      { label: "Projected Headcount (User Adjusted)", data: [], borderColor: "rgba(16, 185, 129, 1)", backgroundColor: "rgba(16, 185, 129, 0.1)", tension: 0.3 },
    ],
  });

  useEffect(() => {
    const projectedData = monthsInPeriod.map(month => departmentHeadcountTotals[month]?.user || 0);
    setHeadcountGrowthChartData(prev => ({
        ...prev,
        labels: monthsInPeriod,
        datasets: [
            prev.datasets[0], // Keep target
            { ...prev.datasets[1], data: projectedData }
        ]
    }));
  }, [departmentHeadcountTotals, monthsInPeriod]);


  const handlePayrollAdjustmentChange = (employeeId, month, field, value) => {
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

  const handleDepartmentHeadcountChange = (deptName, month, value) => {
    setDepartmentHeadcountForecast(prev => 
        prev.map(dept => {
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

  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    setVersions(prev => [
      ...prev,
      { 
        period, 
        timestamp, 
        payrollData: JSON.parse(JSON.stringify(employees)), 
        payrollTotals: JSON.parse(JSON.stringify(payrollTotals)),
        departmentHeadcountData: JSON.parse(JSON.stringify(departmentHeadcountForecast)),
        departmentHeadcountTotals: JSON.parse(JSON.stringify(departmentHeadcountTotals))
      },
    ]);
    setHasChanges(false);
    alert("Changes saved as a new version!");
  };

  const handleExportPayroll = () => {
    const exportData = [];
    employees.forEach(emp => {
      const empRow = {
        'Employee ID': emp.empId, 'Name': emp.name, 'Department': emp.department, 'Role': emp.role,
      };
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
            row[`${fm.month} AI Headcount`] = fm.aiHeadcount;
            row[`${fm.month} User Headcount`] = fm.userHeadcount;
        });
        exportData.push(row);
    });
    // Add totals row
    const totalsRow = { 'Department': 'Total' };
     monthsInPeriod.forEach(month => {
        totalsRow[`${month} AI Headcount`] = departmentHeadcountTotals[month]?.ai || 0;
        totalsRow[`${month} User Headcount`] = departmentHeadcountTotals[month]?.user || 0;
    });
    exportData.push(totalsRow);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Department Headcount");
    XLSX.writeFile(workbook, `Department_Headcount_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  const handleImportPayroll = async (e) => {
    alert("Payroll Import functionality placeholder.");
    e.target.value = '';
  };

  const handleImportHeadcount = async (e) => {
    alert("Department Headcount Import functionality placeholder.");
    e.target.value = '';
  };


  const payrollChartData = {
    labels: payrollTotals.monthlyBreakdown.map(m => m.month),
    datasets: [
      { label: "Total Salary", data: payrollTotals.monthlyBreakdown.map(m => m.totalSalary), backgroundColor: "rgba(14, 165, 233, 0.6)"},
      { label: "Total Bonus", data: payrollTotals.monthlyBreakdown.map(m => m.totalBonus), backgroundColor: "rgba(16, 185, 129, 0.6)"},
      { label: "Total Benefits", data: payrollTotals.monthlyBreakdown.map(m => m.totalBenefits), backgroundColor: "rgba(245, 158, 11, 0.6)"},
    ],
  };

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
    ...commonChartOptions,
    scales: {
        ...commonChartOptions.scales,
        y: { ...commonChartOptions.scales.y, title: {display: true, text: "Headcount (#)"}}
    }
  };


  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center"><FiUsers className="mr-2" />Headcount & Payroll Forecast</h1>
            <p className="text-sky-100 text-xs">
              Align hiring plans with budget, manage payroll, and model workforce scenarios.
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
                <span className="text-sky-50">Export Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
            <div className="flex space-x-1 bg-sky-100 p-1 rounded-lg">
              {[
                { id: "payrollCosts", label: "Payroll Costs", icon: FiDollarSign },
                { id: "headcountGrowth", label: "Headcount Growth", icon: FiTrendingUp },
                { id: "attritionAnalysis", label: "Attrition", icon: FiUserMinus },
                { id: "workforceScenarios", label: "Scenarios", icon: BsDiagram3 },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                                    ${activeTab === tab.id ? "bg-sky-700 text-white shadow-md" : "text-sky-800 hover:bg-sky-200"}`}>
                  <tab.icon className="mr-2" /> {tab.label}
                </button>
              ))}
            </div>
            <div className="relative" ref={filtersRef}>
                <button onClick={() => setShowFilters(!showFilters)} className="py-2 px-4 text-sm text-sky-700 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 flex items-center">
                    <BsFilter className="mr-2" /> Filters
                </button>
                {showFilters && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl z-20 border border-gray-200 p-4 space-y-3">
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


      {activeTab === "payrollCosts" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Payroll Summary ({period})</h2>
              <div className="space-y-3">
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-sm font-medium text-sky-700">Active Employees (Payroll List)</p>
                  <p className="text-2xl font-bold text-sky-900">{payrollTotals.totalActiveEmployees}</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-sm font-medium text-sky-700">Total Payroll Cost (Period)</p>
                  <p className="text-2xl font-bold text-sky-900">${payrollTotals.grandTotalPayroll.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-sm font-medium text-sky-700">Avg. Cost per Employee (Period)</p>
                  <p className="text-2xl font-bold text-sky-900">
                    ${payrollTotals.totalActiveEmployees > 0 ? (payrollTotals.grandTotalPayroll / payrollTotals.totalActiveEmployees).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Payroll Cost Trend by Component</h2>
              <div className="h-[300px]"><Bar data={payrollChartData} options={commonChartOptions} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg mt-5 border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-900">Employee Payroll Details & Adjustments</h2>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button onClick={handleExportPayroll} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-2"/>Export Payroll</button>
                  <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                    <FiUpload className="mr-2"/>Import Payroll
                    <input type="file" onChange={handleImportPayroll} accept=".xlsx,.xls,.csv" className="hidden"/>
                  </label>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-250px)] relative"> {/* Adjusted max-h */}
                <table className="min-w-full divide-y divide-sky-100">
                  <thead className="bg-sky-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[200px]">Employee</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Department</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Role</th>
                      {monthsInPeriod.map(month => (
                        <th key={month} className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[240px]" colSpan="3">{month}</th>
                      ))}
                    </tr>
                    <tr className="bg-sky-100 sticky top-[48px] z-10"> {/* Adjusted top if needed */}
                      <th className="sticky left-0 bg-sky-100 z-20 text-left px-3 py-2 text-xs font-medium text-sky-800"> (ID) </th>
                      <th className="px-3 py-2 text-xs font-medium text-sky-800"></th>
                      <th className="px-3 py-2 text-xs font-medium text-sky-800"></th>
                      {monthsInPeriod.map(month => (
                        <React.Fragment key={`${month}-sub`}>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center border-l border-sky-200">Salary ($)</th>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center">Bonus ($)</th>
                          <th className="px-2 py-2 text-xs font-medium text-sky-700 bg-sky-100 text-center">Benefits ($)</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {employees.map((emp, index) => (
                      <tr key={emp.id} className={index % 2 === 0 ? "bg-white" : "bg-sky-50/70 hover:bg-sky-100"}>
                        <td className={`px-3 py-2.5 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}`}>
                          <div className="font-semibold">{emp.name}</div>
                          <div className="text-xs text-sky-600">{emp.empId}</div>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-sky-800 whitespace-nowrap">{emp.department}</td>
                        <td className="px-3 py-2.5 text-sm text-sky-800 whitespace-nowrap">{emp.role}</td>
                        {emp.forecastMonths.map(fm => (
                          <React.Fragment key={`${emp.id}-${fm.month}`}>
                            {[ "Salary", "Bonus", "Benefits"].map(type => {
                              const aiField = `ai${type}`;
                              const userField = `user${type}`;
                              return (
                                <td key={type} className="px-2 py-2 text-sm text-sky-800 border-l border-sky-200">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 mr-1">AI:</span>
                                    <span className="text-xs text-gray-500">${fm[aiField].toLocaleString()}</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={fm[userField]}
                                    onChange={(e) => handlePayrollAdjustmentChange(emp.id, fm.month, userField, e.target.value)}
                                    className="w-full mt-1 p-1.5 border border-sky-300 rounded-md text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="Adjust"
                                  />
                                </td>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-sky-100 font-semibold sticky bottom-0 z-[5]">
                      <td className="px-3 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[6]">Total</td>
                      <td className="px-3 py-3 text-sm text-sky-900"></td>
                      <td className="px-3 py-3 text-sm text-sky-900"></td>
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
             <div className="p-6 border-t border-gray-200 flex justify-end">
                <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-6 py-2.5 text-sm font-medium rounded-lg flex items-center transition-colors ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700 shadow-md" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save Payroll Changes</button>
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
                    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                        <p className="text-sm font-medium text-sky-700">Target Headcount (End of Period)</p>
                        <p className="text-2xl font-bold text-sky-900">{headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                        <p className="text-sm font-medium text-sky-700">Projected Headcount (User Adjusted, End of Period)</p>
                        <p className="text-2xl font-bold text-green-600">{departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0}</p>
                    </div>
                    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                        <p className="text-sm font-medium text-sky-700">Variance (Target vs Projected)</p>
                        <p className={`text-2xl font-bold ${((departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0) - (headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((departmentHeadcountTotals[monthsInPeriod.slice(-1)[0]]?.user || 0) - (headcountGrowthChartData.datasets[0].data.slice(-1)[0] || 0))}
                        </p>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Overall Headcount Growth Trend</h2>
              <div className="h-[300px]"><Line data={headcountGrowthChartData} options={headcountChartOptions} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg mt-5 border border-gray-200 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h2 className="text-xl font-semibold text-sky-900">Department Headcount Projections</h2>
                    <p className="text-sm text-gray-600 mt-1 sm:mt-0 flex items-center">
                        <FiEdit2 className="mr-2 text-blue-500"/> Adjust planned headcount per department.
                    </p>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                         <button onClick={handleExportHeadcount} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-2"/>Export Headcount</button>
                         <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                            <FiUpload className="mr-2"/>Import Headcount
                            <input type="file" onChange={handleImportHeadcount} accept=".xlsx,.xls,.csv" className="hidden"/>
                        </label>
                    </div>
                </div>
                <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
                    <table className="min-w-full divide-y divide-sky-100">
                        <thead className="bg-sky-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[180px]">Department</th>
                                {monthsInPeriod.map(month => (
                                    <React.Fragment key={month}>
                                        <th className="px-3 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[100px] border-l border-sky-200">{month} (AI)</th>
                                        <th className="px-3 py-3 text-center text-xs font-semibold text-blue-600 uppercase min-w-[120px]">{month} (User Adj.)</th>
                                    </React.Fragment>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-semibold text-sky-900 uppercase min-w-[120px] border-l border-sky-200">Total User (Period)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                            {departmentHeadcountForecast.map((dept, index) => {
                                const totalUserForDept = dept.forecastMonths.reduce((sum, fm) => sum + fm.userHeadcount, 0);
                                return (
                                <tr key={dept.department} className={index % 2 === 0 ? "bg-white" : "bg-sky-50/70 hover:bg-sky-100"}>
                                    <td className={`px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}`}>{dept.department}</td>
                                    {dept.forecastMonths.map(fm => (
                                        <React.Fragment key={`${dept.department}-${fm.month}`}>
                                            <td className="px-3 py-3 text-sm text-sky-700 text-center border-l border-sky-200">{fm.aiHeadcount}</td>
                                            <td className="px-3 py-3 text-sm">
                                                <input 
                                                    type="number"
                                                    value={fm.userHeadcount}
                                                    onChange={(e) => handleDepartmentHeadcountChange(dept.department, fm.month, e.target.value)}
                                                    className="w-full p-1.5 border border-sky-300 rounded-md text-xs text-center focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                                                />
                                            </td>
                                        </React.Fragment>
                                    ))}
                                    <td className="px-4 py-3 text-sm font-semibold text-sky-800 text-center border-l border-sky-200">{totalUserForDept}</td>
                                </tr>
                            )})}
                             <tr className="bg-sky-100 font-semibold sticky bottom-0 z-[5]">
                                <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-[6]">Total Projected</td>
                                {monthsInPeriod.map(month => (
                                    <React.Fragment key={`total-${month}`}>
                                        <td className="px-3 py-3 text-sm text-sky-800 bg-sky-200 text-center border-l border-sky-300">{departmentHeadcountTotals[month]?.ai || 0}</td>
                                        <td className="px-3 py-3 text-sm font-bold text-sky-900 bg-sky-200 text-center">{departmentHeadcountTotals[month]?.user || 0}</td>
                                    </React.Fragment>
                                ))}
                                <td className="px-4 py-3 text-sm font-bold text-sky-900 bg-sky-200 text-center border-l border-sky-300">
                                    {Object.values(departmentHeadcountTotals).reduce((sum, monthTotals) => sum + monthTotals.user, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
                <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-6 py-2.5 text-sm font-medium rounded-lg flex items-center transition-colors ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700 shadow-md" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2"/>Save Headcount Changes</button>
            </div>
          </div>
        </>
      )}

      {activeTab === "attritionAnalysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Rate Analysis & Trend</h2>
            <div className="h-[300px]"><Line data={attritionData} options={attritionChartOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Attrition Model Adjustments</h2>
            <p className="text-sky-700 mb-4">Adjust attrition rate assumptions to see their potential impact on overall headcount and payroll forecasts. (Note: Dynamic impact not fully implemented in this UI mock).</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">Projected Voluntary Attrition Rate (% per month):</label>
                    <input type="number" defaultValue="1.3" step="0.1" className="w-full mt-1 p-2 border border-sky-300 rounded-md focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-sky-700 mb-1">Projected Involuntary Attrition (# per month):</label>
                    <input type="number" defaultValue="1" className="w-full mt-1 p-2 border border-sky-300 rounded-md focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <button className="w-full px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium">Update Attrition Model</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "workforceScenarios" && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Workforce Planning Scenarios</h2>
          <p className="text-sky-700 mb-6">Model the impact of different strategic decisions on your headcount and payroll. Compare potential outcomes to make informed choices.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workforceScenarios.map((scenario) => (
              <div key={scenario.id} className="bg-sky-50 border border-sky-200 rounded-lg p-5 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-sky-800 mb-2 flex items-center"><BsDiagram3 className="mr-2"/>{scenario.name}</h3>
                <p className="text-sm text-sky-600 mb-4 h-16 overflow-y-auto">{scenario.description}</p>
                <div className="space-y-2 pt-3 border-t border-sky-200">
                  <div className="flex justify-between text-sm"><span className="text-sky-700">Est. Annual Payroll:</span> <span className="font-semibold text-sky-900">${scenario.impact.payroll.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-sky-700">Est. End Headcount:</span> <span className="font-semibold text-sky-900">{scenario.impact.headcount}</span></div>
                </div>
                 <button className="mt-4 w-full text-xs py-2 px-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">View Scenario Details</button>
              </div>
            ))}
          </div>
          <button className="mt-8 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center">
            <BsStars className="mr-2"/>Create New Scenario
          </button>
        </div>
      )}
      
      {/* Placeholder for Create, Import, Compare tabs if needed as main sections */}
    </div>
  );
};

export default HeadcountPayroll;

