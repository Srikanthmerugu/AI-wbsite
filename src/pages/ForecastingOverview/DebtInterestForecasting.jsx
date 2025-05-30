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
import { FiFilter, FiDollarSign, FiClock, FiCheckCircle, FiSave, FiUpload, FiDownload } from "react-icons/fi";
import { BsStars, BsThreeDotsVertical, BsFilter, BsCheckCircle, BsClock, BsXCircle } from 'react-icons/bs';
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

const DebtInterestForecasting = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [period, setPeriod] = useState("Q1 2025");
  const filtersRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Sample data for loan repayment schedules
  const [loans, setLoans] = useState([
    {
      id: 1,
      name: "Term Loan A",
      type: "Term Loan",
      principal: 500000,
      interestRate: 5.2,
      term: 60,
      startDate: "2023-01-01",
      remainingBalance: 420000,
      repaymentSchedule: [
        { month: "Jan 2025", principal: 15000, interest: 1820, remaining: 405000 },
        { month: "Feb 2025", principal: 15100, interest: 1800, remaining: 389900 },
        { month: "Mar 2025", principal: 15200, interest: 1780, remaining: 374700 },
      ],
      aiAdjustments: [
        { month: "Jan 2025", principal: 15000, interest: 1820 },
        { month: "Feb 2025", principal: 15100, interest: 1800 },
        { month: "Mar 2025", principal: 15200, interest: 1780 },
      ],
      userAdjustments: [
        { month: "Jan 2025", principal: 0, interest: 0 },
        { month: "Feb 2025", principal: 0, interest: 0 },
        { month: "Mar 2025", principal: 0, interest: 0 },
      ]
    },
    {
      id: 2,
      name: "Revolving Credit",
      type: "Line of Credit",
      principal: 1000000,
      interestRate: 6.5,
      term: 36,
      startDate: "2023-06-01",
      remainingBalance: 750000,
      repaymentSchedule: [
        { month: "Jan 2025", principal: 25000, interest: 4062, remaining: 725000 },
        { month: "Feb 2025", principal: 25500, interest: 3928, remaining: 699500 },
        { month: "Mar 2025", principal: 26000, interest: 3789, remaining: 673500 },
      ],
      aiAdjustments: [
        { month: "Jan 2025", principal: 25000, interest: 4062 },
        { month: "Feb 2025", principal: 25500, interest: 3928 },
        { month: "Mar 2025", principal: 26000, interest: 3789 },
      ],
      userAdjustments: [
        { month: "Jan 2025", principal: 0, interest: 0 },
        { month: "Feb 2025", principal: 0, interest: 0 },
        { month: "Mar 2025", principal: 0, interest: 0 },
      ]
    },
    {
      id: 3,
      name: "Equipment Financing",
      type: "Lease",
      principal: 300000,
      interestRate: 4.8,
      term: 48,
      startDate: "2024-01-01",
      remainingBalance: 280000,
      repaymentSchedule: [
        { month: "Jan 2025", principal: 6250, interest: 1120, remaining: 273750 },
        { month: "Feb 2025", principal: 6270, interest: 1105, remaining: 267480 },
        { month: "Mar 2025", principal: 6290, interest: 1090, remaining: 261190 },
      ],
      aiAdjustments: [
        { month: "Jan 2025", principal: 6250, interest: 1120 },
        { month: "Feb 2025", principal: 6270, interest: 1105 },
        { month: "Mar 2025", principal: 6290, interest: 1090 },
      ],
      userAdjustments: [
        { month: "Jan 2025", principal: 0, interest: 0 },
        { month: "Feb 2025", principal: 0, interest: 0 },
        { month: "Mar 2025", principal: 0, interest: 0 },
      ]
    }
  ]);

  // Refinancing scenarios
  const [refinancingScenarios, setRefinancingScenarios] = useState([
    {
      id: 1,
      name: "Current Terms",
      interestRate: 5.2,
      termExtension: 0,
      fees: 0,
      monthlyPayment: 9480,
      totalInterest: 68800,
      savings: 0
    },
    {
      id: 2,
      name: "Bank Refinance Offer",
      interestRate: 4.5,
      termExtension: 12,
      fees: 5000,
      monthlyPayment: 8650,
      totalInterest: 59000,
      savings: 9800
    },
    {
      id: 3,
      name: "Alternative Lender",
      interestRate: 4.8,
      termExtension: 6,
      fees: 3000,
      monthlyPayment: 8920,
      totalInterest: 63200,
      savings: 5600
    }
  ]);

  // Credit line utilization
  const [creditUtilization, setCreditUtilization] = useState([
    { month: "Jan 2025", available: 500000, utilized: 250000, utilizationRate: 50 },
    { month: "Feb 2025", available: 500000, utilized: 275000, utilizationRate: 55 },
    { month: "Mar 2025", available: 500000, utilized: 300000, utilizationRate: 60 }
  ]);

  // Financial ratios
  const [financialRatios, setFinancialRatios] = useState([
    { month: "Jan 2025", leverageRatio: 2.5, interestCoverage: 4.2, dscr: 1.8 },
    { month: "Feb 2025", leverageRatio: 2.4, interestCoverage: 4.5, dscr: 1.9 },
    { month: "Mar 2025", leverageRatio: 2.3, interestCoverage: 4.8, dscr: 2.0 }
  ]);

  const [versions, setVersions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      principal: 0,
      interest: 0,
      aiPrincipal: 0,
      aiInterest: 0,
      userPrincipal: 0,
      userInterest: 0,
      remainingBalance: 0
    };

    loans.forEach(loan => {
      loan.repaymentSchedule.forEach(payment => {
        totals.principal += payment.principal;
        totals.interest += payment.interest;
      });
      loan.aiAdjustments.forEach(payment => {
        totals.aiPrincipal += payment.principal;
        totals.aiInterest += payment.interest;
      });
      loan.userAdjustments.forEach(payment => {
        totals.userPrincipal += payment.principal;
        totals.userInterest += payment.interest;
      });
      totals.remainingBalance += loan.remainingBalance;
    });

    return totals;
  };

  const [totals, setTotals] = useState(calculateTotals());

  // Update totals when loans change
  useEffect(() => {
    setTotals(calculateTotals());
  }, [loans]);

  // Handle input changes for user adjustments
  const handleAdjustmentChange = (loanId, month, field, value) => {
    setLoans(prevLoans => {
      return prevLoans.map(loan => {
        if (loan.id === loanId) {
          const updatedAdjustments = loan.userAdjustments.map(adj => {
            if (adj.month === month) {
              return { ...adj, [field]: parseFloat(value) || 0 };
            }
            return adj;
          });
          return { ...loan, userAdjustments: updatedAdjustments };
        }
        return loan;
      });
    });
    setHasChanges(true);
  };

  // Save all changes
  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    setVersions(prev => [
      ...prev,
      { 
        period, 
        timestamp, 
        data: [...loans], 
        totals: {...totals} 
      },
    ]);
    setHasChanges(false);
  };

  // Export data to Excel
  const handleExport = () => {
    const exportData = loans.map(loan => ({
      'Loan Name': loan.name,
      'Loan Type': loan.type,
      'Principal': loan.principal,
      'Remaining Balance': loan.remainingBalance,
      'Interest Rate': loan.interestRate,
      'Jan Principal (AI)': loan.aiAdjustments[0].principal,
      'Jan Principal (User)': loan.userAdjustments[0].principal,
      'Jan Interest (AI)': loan.aiAdjustments[0].interest,
      'Jan Interest (User)': loan.userAdjustments[0].interest,
      'Feb Principal (AI)': loan.aiAdjustments[1].principal,
      'Feb Principal (User)': loan.userAdjustments[1].principal,
      'Feb Interest (AI)': loan.aiAdjustments[1].interest,
      'Feb Interest (User)': loan.userAdjustments[1].interest,
      'Mar Principal (AI)': loan.aiAdjustments[2].principal,
      'Mar Principal (User)': loan.userAdjustments[2].principal,
      'Mar Interest (AI)': loan.aiAdjustments[2].interest,
      'Mar Interest (User)': loan.userAdjustments[2].interest,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debt Forecast");
    
    const fileName = `Debt_Forecast_${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Import data from Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process imported data (simplified for example)
      alert("Import functionality would be implemented here based on your Excel structure");
      e.target.value = '';
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing file. Please check the file format and try again.");
    }
  };

  // Chart data for repayment schedule
  const repaymentChartData = {
    labels: loans[0].repaymentSchedule.map(p => p.month),
    datasets: [
      {
        label: "Principal Payments (AI)",
        data: loans[0].aiAdjustments.map(p => p.principal),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Principal Payments (User)",
        data: loans[0].userAdjustments.map(p => p.principal),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
      {
        label: "Interest Payments (AI)",
        data: loans[0].aiAdjustments.map(p => p.interest),
        backgroundColor: "rgba(14, 165, 233, 0.6)",
        borderColor: "rgba(14, 165, 233, 1)",
        borderWidth: 1,
      },
      {
        label: "Interest Payments (User)",
        data: loans[0].userAdjustments.map(p => p.interest),
        backgroundColor: "rgba(245, 158, 11, 0.6)",
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart data for credit utilization
  const utilizationChartData = {
    labels: creditUtilization.map(u => u.month),
    datasets: [
      {
        label: "Available Credit",
        data: creditUtilization.map(u => u.available),
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Utilized Credit",
        data: creditUtilization.map(u => u.utilized),
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Chart data for financial ratios
  const ratiosChartData = {
    labels: financialRatios.map(r => r.month),
    datasets: [
      {
        label: "Leverage Ratio",
        data: financialRatios.map(r => r.leverageRatio),
        borderColor: "rgba(14, 165, 233, 1)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "Interest Coverage",
        data: financialRatios.map(r => r.interestCoverage),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: "DSCR",
        data: financialRatios.map(r => r.dscr),
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Debt & Interest Forecasting</h1>
            <p className="text-sky-100 text-xs">
              Manage liabilities, debt structuring, and interest payments
            </p>
          </div>
          <div className="flex items-center space-x-4">
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
            <button
                                                    onClick={() => window.print()}
                                                    className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
                                                    <FiDownload className="text-sky-50" />
                                                    <span className="text-sky-50">Export</span>
                                                </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 border-b mt-5 py-3 border-gray-200 mb-6">
        <div className="flex space-x-1 rounded-lg">
              <NavLink
                to="#"
                onClick={() => setActiveTab("schedule")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "schedule"
                    ? "bg-sky-900 text-sky-50"
                    : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"
                }`}>
                Repayment Schedule
              </NavLink>
              <NavLink
                to="#"
                onClick={() => setActiveTab("refinancing")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "refinancing"
                    ? "bg-sky-900 text-sky-50"
                    : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"
                }`}>
                Refinancing Scenarios
              </NavLink>
              <NavLink
                to="#"
                onClick={() => setActiveTab("utilization")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "utilization"
                    ? "bg-sky-900 text-sky-50"
                    : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"
                }`}>
                Credit Utilization
              </NavLink>
              <NavLink
                to="#"
                onClick={() => setActiveTab("ratios")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === "ratios"
                    ? "bg-sky-900 text-sky-50"
                    : "text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50"
                }`}>
                Financial Ratios
              </NavLink>
            </div>
        {/* <button
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
        </button> */}
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
                <label className="block text-xs text-gray-700 mb-1">Loan Type</label>
                <select className="w-full p-1 border border-gray-300 rounded text-xs">
                  <option>All Loans</option>
                  <option>Term Loans</option>
                  <option>Lines of Credit</option>
                  <option>Leases</option>
                </select>
              </div>
              <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "schedule" && (
        <>
          <div className="flex flex-col mt-5 md:flex-row gap-4">
            {/* Debt Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
              <h2 className="text-lg font-semibold text-sky-900 mb-3">
                Debt Summary
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">
                    Total Debt Outstanding
                  </p>
                  <p className="text-xl font-bold text-sky-900">
                    ${totals.remainingBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">
                    Total Principal Payments (Period)
                  </p>
                  <p className="text-xl font-bold text-sky-900">
                    ${totals.principal.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-medium text-sky-700">
                    Total Interest Payments (Period)
                  </p>
                  <p className="text-xl font-bold text-sky-900">
                    ${totals.interest.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Repayment Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex-2">
              <h2 className="text-lg font-semibold text-sky-900 mb-3">
                Repayment Trend
              </h2>
              <div className="h-[250px]">
                <Bar
                  data={repaymentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { mode: "index", intersect: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                        title: { display: true, text: "Amount ($)" },
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

          {/* Loan Repayment Schedule Table */}
          <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-sky-900">Loan Repayment Schedule</h2>
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
                        Loan Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[120px]">
                        Remaining Balance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                        Jan 2025
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                        Feb 2025
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase" colSpan="2">
                        Mar 2025
                      </th>
                    </tr>
                    <tr className="bg-sky-50 sticky top-[48px] z-10">
                      <th className="sticky left-0 bg-sky-50 z-20"></th>
                      <th></th>
                      <th></th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Principal
                      </th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Interest
                      </th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Principal
                      </th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Interest
                      </th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Principal
                      </th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700 bg-sky-100">
                        Interest
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {loans.map((loan, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                        <td className="px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 bg-white z-10">
                          <div className="font-semibold">{loan.name}</div>
                          <div className="text-xs text-sky-600">Rate: {loan.interestRate}%</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">
                          {loan.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">
                          ${loan.remainingBalance.toLocaleString()}
                        </td>
                        
                        {/* Jan 2025 */}
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[0].principal.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[0].principal}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Jan 2025", "principal", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[0].interest.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[0].interest}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Jan 2025", "interest", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                        
                        {/* Feb 2025 */}
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[1].principal.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[1].principal}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Feb 2025", "principal", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[1].interest.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[1].interest}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Feb 2025", "interest", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                        
                        {/* Mar 2025 */}
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[2].principal.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[2].principal}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Mar 2025", "principal", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800 bg-sky-50">
                          ${loan.aiAdjustments[2].interest.toLocaleString()}
                          <input
                            type="number"
                            value={loan.userAdjustments[2].interest}
                            onChange={(e) => handleAdjustmentChange(loan.id, "Mar 2025", "interest", e.target.value)}
                            className="w-full mt-1 p-1 border border-sky-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-sky-100 font-semibold sticky bottom-0">
                      <td className="px-4 py-3 text-sm text-sky-900 sticky left-0 bg-sky-100 z-10">Total</td>
                      <td className="px-4 py-3 text-sm text-sky-900"></td>
                      <td className="px-4 py-3 text-sm text-sky-900">
                        ${totals.remainingBalance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                        ${totals.aiPrincipal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                        ${totals.aiInterest.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                        ${totals.userPrincipal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200">
                        ${totals.userInterest.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200"></td>
                      <td className="px-4 py-3 text-sm text-sky-900 bg-sky-200"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "refinancing" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Refinancing Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {refinancingScenarios.map((scenario, index) => (
              <div key={index} className="border border-sky-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">{scenario.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Interest Rate:</span>
                    <span className="text-sm font-medium">{scenario.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Term Extension:</span>
                    <span className="text-sm font-medium">{scenario.termExtension} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Fees:</span>
                    <span className="text-sm font-medium">${scenario.fees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Monthly Payment:</span>
                    <span className="text-sm font-medium">${scenario.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Total Interest:</span>                    
                    <span className="text-sm font-medium">${scenario.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-sky-700">Potential Savings:</span>
                    <span className={`text-sm font-medium ${scenario.savings > 0 ? 'text-green-600' : scenario.savings < 0 ? 'text-red-600' : 'text-sky-800'}`}>
                      ${scenario.savings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "utilization" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Credit Utilization Trend</h2>
            <div className="h-[300px]">
              <Line 
                data={utilizationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Amount ($)" },
                      grid: { color: "rgba(0, 0, 0, 0.05)" },
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    },
                    x: {
                      title: { display: true, text: "Month" },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Utilization Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase">Month</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Available Credit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Utilized Credit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Utilization Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 bg-white">
                  {creditUtilization.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.month}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">${item.available.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">${item.utilized.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.utilizationRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ratios" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Key Financial Ratios</h2>
             <div className="h-[300px]">
              <Line 
                data={ratiosChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: "Month" },
                      grid: { display: false },
                    },
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: { display: true, text: 'Ratio Value (Leverage)' },
                      grid: { color: "rgba(0, 0, 0, 0.05)" },
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: { display: true, text: 'Ratio Value (Coverage/DSCR)' },
                      grid: { drawOnChartArea: false }, // only show grid for the first y-axis
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Ratio Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase">Month</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Leverage Ratio</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">Interest Coverage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase">DSCR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 bg-white">
                  {financialRatios.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.month}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.leverageRatio.toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.interestCoverage.toFixed(1)}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{item.dscr.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Create New Forecast</h2>
          <p className="text-sky-700">
            This section would contain tools and forms to create a new debt forecast from scratch.
            You could input loan details, market assumptions, and other parameters.
          </p>
          {/* Placeholder for form elements: e.g., button to add new loan, scenario setup */}
          <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
            Add New Loan
          </button>
        </div>
      )}

      {activeTab === "import" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Forecast Data</h2>
          <p className="text-sky-700 mb-4">
            Use this section to import forecast data from external sources, such as Excel or CSV files.
            The "Import" button in the Repayment Schedule table provides specific import functionality for that table.
          </p>
          <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center w-max">
            <FiUpload className="mr-2" /> Import Master Forecast File
            <input 
              type="file" 
              onChange={handleImport} // Reusing the existing import handler
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
          </label>
          <p className="mt-4 text-xs text-sky-600">
            Note: The import functionality is a placeholder. For a real application, define the expected Excel/CSV structure.
          </p>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Compare Forecast Scenarios</h2>
          <p className="text-sky-700 mb-2">
            This section allows you to compare different saved forecast versions or scenarios side-by-side.
          </p>
          {versions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-sky-800 mb-2">Saved Forecast Versions:</h3>
              <ul className="list-disc pl-5 text-sky-700 space-y-1">
                {versions.map((version, index) => (
                  <li key={index} className="text-sm">
                    Forecast for {version.period}, saved on {new Date(version.timestamp).toLocaleString()}
                    {/* TODO: Add buttons to select versions for comparison */}
                    <button className="ml-3 px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600">
                      Load
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-sky-600">
                Future enhancements: Select two versions to see a detailed comparison table or chart.
              </p>
            </div>
          ) : (
            <p className="text-sky-600">No saved versions to compare yet. Make changes in the 'Repayment Schedule' tab and click 'Save All Changes' to create a version.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DebtInterestForecasting;