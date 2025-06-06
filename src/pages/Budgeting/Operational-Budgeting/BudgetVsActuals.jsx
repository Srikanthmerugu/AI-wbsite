import React, { useState, useMemo } from 'react';
import { BsStars, BsFilter, BsCalendar, BsInfoCircle, BsArrowDownRight, BsArrowUpRight, BsGraphUp, BsExclamationTriangleFill } from "react-icons/bs";
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FiChevronRight
} from "react-icons/fi";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);


const BudgetVsActuals = () => {
  const [scenario, setScenario] = useState('Base Case');
  const [department, setDepartment] = useState('All');
  const [timePeriod, setTimePeriod] = useState('Monthly');

  // Comprehensive data with AI insights
  const varianceData = [
    { id: 1, category: 'Marketing', budget: 35000, actual: 41500, aiInsight: "Overspend driven by 25% higher-than-expected CPL in the new 'LaunchX' campaign.", status: 'Action Required' },
    { id: 2, category: 'Salaries & Wages', budget: 125500, actual: 125500, aiInsight: "Aligned with headcount plan. No significant deviation detected.", status: 'On Track' },
    { id: 3, category: 'Cloud Infrastructure', budget: 63000, actual: 59800, aiInsight: "Underspend due to successful implementation of cost-saving measures in Q2 (instance optimization).", status: 'On Track' },
    { id: 4, category: 'Software Subscriptions', budget: 50000, actual: 52100, aiInsight: "Slight overspend from unscheduled purchase of new design software. Impact is minimal.", status: 'Monitor' },
    { id: 5, category: 'Office Rent', budget: 81600, actual: 81600, aiInsight: "Fixed cost based on lease agreement. No variance expected.", status: 'On Track' },
    { id: 6, category: 'Business Travel', budget: 22000, actual: 25500, aiInsight: "Overspend due to increased client-facing travel for finalizing two major deals in Q3.", status: 'Monitor' },
    { id: 7, category: 'Office Supplies', budget: 15300, actual: 14900, aiInsight: "Slight underspend, consistent with historical trends.", status: 'On Track' },
  ];

  // Memoized calculations for performance
  const { totals, totalVariance, totalVariancePercent, alerts } = useMemo(() => {
    const calculatedTotals = varianceData.reduce((acc, item) => {
        acc.budget += item.budget;
        acc.actual += item.actual;
        return acc;
    }, { budget: 0, actual: 0 });
    const calculatedVariance = calculatedTotals.actual - calculatedTotals.budget;
    const calculatedVariancePercent = (calculatedVariance / calculatedTotals.budget) * 100;
    const filteredAlerts = varianceData.filter(item => item.status === 'Action Required' || item.status === 'Monitor');
    return { totals: calculatedTotals, totalVariance: calculatedVariance, totalVariancePercent: calculatedVariancePercent, alerts: filteredAlerts };
  }, [varianceData]);


  // Chart data - now more dynamic
  const chartData = {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      budget: [55000, 56000, 58000, 57000, 59000, 60000],
      actual: [54000, 57500, 57000, 59000, 61000, 60500],
      forecast: [55000, 57000, 57500, 58500, 60500, 61000],
      variance: [-1.8, 2.7, -1.7, 3.5, 3.4, 0.8],
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      budget: [169000, 176000, 180000, 185000],
      actual: [168500, 180500, 179000, 188000],
      forecast: [169500, 179000, 181000, 187000],
      variance: [-0.3, 2.6, -0.6, 1.6],
    },
     // Add half-yearly and yearly data similarly if needed
  };
  const activeChartData = chartData[timePeriod.toLowerCase()] || chartData.monthly;
  
  const comboChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { display: false } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Amount ($)' }, ticks: { callback: (value) => `$${(value / 1000)}k` }},
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Variance %' }, grid: { drawOnChartArea: false }, ticks: { callback: (value) => `${value}%` }},
    },
  };

  const comboChartData = {
    labels: activeChartData.labels,
    datasets: [
      { type: 'bar', label: 'Budget', data: activeChartData.budget, backgroundColor: '#a5f3fc', yAxisID: 'y' },
      { type: 'bar', label: 'Actual', data: activeChartData.actual, backgroundColor: '#0ea5e9', yAxisID: 'y' },
      { type: 'line', label: 'Forecast', data: activeChartData.forecast, borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.4, yAxisID: 'y', borderDash: [5, 5] },
      { type: 'bar', label: 'Variance %', data: activeChartData.variance, 
        backgroundColor: activeChartData.variance.map(v => v > 0 ? '#f43f5e' : '#22c55e'), // Red for over, Green for under
        yAxisID: 'y1', barPercentage: 0.7
      },
    ],
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Action Required': return 'bg-red-100 text-red-800 border border-red-200';
      case 'Monitor': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'On Track': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
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
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Budget vs Actuals Tracking</span>
                  </div>
                </li>
              </ol>
            </nav>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Budget vs. Actuals Tracking</h1>
            <p className="text-sky-100 text-xs">Automated variance analysis and spending control alerts</p>
          </div>
          <div className="flex space-x-2">
            <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Yearly</option>
            </select>
            <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <option>Base Case</option><option>Stretch</option><option>Worst Case</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"><div className="text-sky-800 font-medium">Total Budget</div><div className="text-2xl font-bold text-sky-900">${totals.budget.toLocaleString()}</div></div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"><div className="text-sky-800 font-medium">Total Actual</div><div className="text-2xl font-bold text-sky-900">${totals.actual.toLocaleString()}</div></div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"><div className="text-sky-800 font-medium">Variance ($)</div><div className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>{totalVariance > 0 ? '+' : ''}${totalVariance.toLocaleString()}</div></div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"><div className="text-sky-800 font-medium">Variance (%)</div><div className={`flex items-center text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>{totalVariance > 0 ? <BsArrowUpRight/> : <BsArrowDownRight/>}{totalVariancePercent.toFixed(2)}%</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-sky-100">
          <h2 className="text-xl font-semibold text-sky-800 mb-4">Performance vs. Budget & Forecast</h2>
          <div className="h-96"><Bar options={comboChartOptions} data={comboChartData} /></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-sky-100">
            <h2 className="text-xl font-semibold text-sky-800 mb-4">Spending Control Alerts</h2>
            <div className="space-y-4">
                {alerts.length > 0 ? alerts.map(alert => {
                    const variance = alert.actual - alert.budget;
                    const variancePercent = (variance / alert.budget) * 100;
                    return (
                        <div key={alert.id} className="p-3 rounded-lg border" style={{borderLeftWidth: '4px', borderLeftColor: alert.status === 'Action Required' ? '#ef4444' : '#f59e0b' }}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sky-900">{alert.category}</span>
                                <span className={`text-sm font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {variance > 0 ? '+' : ''}${variance.toLocaleString()} ({variancePercent.toFixed(1)}%)
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 group relative">
                                <BsStars className="inline mr-1 text-sky-500"/>{alert.aiInsight.substring(0, 40)}...
                                <span className="absolute bottom-full left-0 mb-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg">{alert.aiInsight}</span>
                            </p>
                             <button className="text-xs mt-2 text-sky-700 hover:text-sky-900 font-semibold">Review Details →</button>
                        </div>
                    );
                }) : (
                    <div className="text-center py-8">
                        <BsCheckCircle className="mx-auto text-green-500 text-4xl"/>
                        <p className="mt-2 text-lg font-medium text-sky-800">All Categories On Track</p>
                        <p className="text-sm text-gray-500">No spending alerts at this time.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Full Variance Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-sky-100">
        <h2 className="text-xl font-semibold text-sky-800 mb-4">Detailed Variance Analysis by Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-sky-800 uppercase bg-sky-100">
              <tr>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3 text-right">Budget</th><th scope="col" className="px-4 py-3 text-right">Actual</th>
                <th scope="col" className="px-4 py-3 text-right">Variance ($)</th><th scope="col" className="px-4 py-3 text-right">Variance (%)</th>
                <th scope="col" className="px-4 py-3 text-center">Status</th><th scope="col" className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {varianceData.map((item) => {
                const variance = item.actual - item.budget; const variancePercent = (variance / item.budget) * 100;
                const varianceColor = variance > 0 ? 'text-red-600' : 'text-green-600';
                return (
                  <tr key={item.id} className="bg-white border-b hover:bg-sky-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.actual.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${varianceColor}`}>{variance > 0 ? '+' : ''}{variance.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${varianceColor}`}>{variancePercent.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(item.status)}`}>{item.status}</span></td>
                    <td className="px-4 py-3 text-center"><button className="text-xs text-sky-700 hover:text-sky-900 font-medium">Drill Down</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetVsActuals;