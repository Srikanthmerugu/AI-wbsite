import React, { useState, useMemo, useEffect } from 'react';
import { BsGraphUp, BsShieldCheck, BsSliders, BsStars, BsTable, BsPencil, BsCalculator, BsPieChart, BsInfoCircle } from "react-icons/bs";
import { FiDownload, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Tooltip as ReactTooltip } from 'react-tooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

// Enhanced Currency Formatter with more formatting options
const formatCurrency = (value, compact = true) => {
  if (value === 0) return '₹0';
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  let formattedValue;
  if (compact) {
    if (absValue >= 10000000) formattedValue = `₹${(absValue / 10000000).toFixed(2)} Cr`;
    else if (absValue >= 100000) formattedValue = `₹${(absValue / 100000).toFixed(2)} L`;
    else formattedValue = `₹${Math.round(absValue).toLocaleString('en-IN')}`;
  } else {
    formattedValue = `₹${Math.round(absValue).toLocaleString('en-IN')}`;
  }
  
  return isNegative ? `-${formattedValue}` : formattedValue;
};

// Expanded Mock Data
const initialRevenueForecast = [
  { id: 'p1', name: 'Enterprise Suite', confidence: 91, monthly_revenue: 32000000, growth: 12 },
  { id: 'p2', name: 'SaaS Platform', confidence: 85, monthly_revenue: 18000000, growth: 22 },
  { id: 'p3', name: 'Consulting Services', confidence: 78, monthly_revenue: 8500000, growth: 8 },
  { id: 'p4', name: 'API Services', confidence: 95, monthly_revenue: 11000000, growth: 35 },
  { id: 'p5', name: 'Training Programs', confidence: 70, monthly_revenue: 6000000, growth: 15 },
  { id: 'p6', name: 'Marketplace', confidence: 88, monthly_revenue: 4500000, growth: 42 },
  { id: 'p7', name: 'Licensing', confidence: 82, monthly_revenue: 7500000, growth: 5 },
  { id: 'p8', name: 'Support Contracts', confidence: 90, monthly_revenue: 5200000, growth: 18 },
];

const initialExpenseLinkage = [
  // Marketing
  { id: 'e1', department: 'Marketing', category: 'Digital Ads', type: 'Variable', sourceId: 'p1', baseBudget: 1920000, allocationPercent: 6, justification: 'Q3 campaign focus', aiInsight: 'Benchmark for Enterprise is 5-8%. Consider shifting 1% to performance channels.' },
  { id: 'e2', department: 'Marketing', category: 'Events', type: 'Variable', sourceId: 'p2', baseBudget: 900000, allocationPercent: 5, justification: 'Annual user conference', aiInsight: 'High ROI channel for SaaS. Recommend maintaining allocation.' },
  { id: 'e3', department: 'Marketing', category: 'Content', type: 'Fixed', sourceId: 'none', baseBudget: 500000, allocationPercent: 0, justification: 'Blog, whitepapers' },
  
  // Sales
  { id: 'e4', department: 'Sales', category: 'Commissions', type: 'Variable', sourceId: 'all', baseBudget: 4000000, allocationPercent: 7, justification: 'Standard rate', aiInsight: '7% is market competitive. Consider accelerator for >100% quota.' },
  { id: 'e5', department: 'Sales', category: 'Enablement', type: 'Variable', sourceId: 'p1', baseBudget: 800000, allocationPercent: 2.5, justification: 'Enterprise training', aiInsight: 'Critical for complex sales. Keep allocation.' },
  
  // Support
  { id: 'e6', department: 'Support', category: 'Salaries', type: 'Variable', sourceId: 'p1', baseBudget: 3200000, allocationPercent: 10, justification: 'Tier 2 team', aiInsight: 'High cost. Explore automation for Tier 1 queries.' },
  { id: 'e7', department: 'Support', category: 'Tools', type: 'Variable', sourceId: 'p2', baseBudget: 450000, allocationPercent: 2.5, justification: 'Zendesk license' },
  
  // Cloud Ops
  { id: 'e8', department: 'Cloud Ops', category: 'Hosting', type: 'Variable', sourceId: 'p2', baseBudget: 2160000, allocationPercent: 12, justification: 'AWS costs', aiInsight: 'Optimize reserved instances to save 15-20%.' },
  { id: 'e9', department: 'Cloud Ops', category: 'Infra', type: 'Fixed', sourceId: 'none', baseBudget: 1200000, allocationPercent: 0, justification: 'Monitoring tools' },
  
  // R&D
  { id: 'e10', department: 'R&D', category: 'Core Dev', type: 'Fixed', sourceId: 'none', baseBudget: 6000000, allocationPercent: 0, justification: 'Project Titan' },
  { id: 'e11', department: 'R&D', category: 'Innovation', type: 'Fixed', sourceId: 'none', baseBudget: 2000000, allocationPercent: 0, justification: 'Labs team' },
  
  // G&A
  { id: 'e12', department: 'G&A', category: 'Facilities', type: 'Fixed', sourceId: 'none', baseBudget: 2500000, allocationPercent: 0, justification: 'Office lease' },
  { id: 'e13', department: 'G&A', category: 'Legal', type: 'Fixed', sourceId: 'none', baseBudget: 1000000, allocationPercent: 0, justification: 'Compliance' },
];

const scenarioMultipliers = { 
  Base: 1.0, 
  Stretch: 1.15, 
  Conservative: 0.9,
  'Downside': 0.75 
};

const departmentColors = [
  '#3b82f6', // Marketing - blue
  '#8b5cf6', // Sales - purple
  '#10b981', // Support - emerald
  '#ef4444', // Cloud Ops - red
  '#f59e0b', // R&D - amber
  '#64748b', // G&A - slate
  '#ec4899', // Product - pink
  '#14b8a6'  // HR - teal
];

const RevenueDrivenExpenseAllocation = () => {
  const [scenario, setScenario] = useState('Base');
  const [revenueForecast, setRevenueForecast] = useState(initialRevenueForecast);
  const [expenseLinkage, setExpenseLinkage] = useState(initialExpenseLinkage);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [activeTab, setActiveTab] = useState('allocation');

  useEffect(() => {
    const initialDepts = initialExpenseLinkage.reduce((acc, exp) => ({...acc, [exp.department]: false}), {});
    setExpandedDepts(initialDepts);
  }, []);

  const handleRevenueChange = (id, value) => setRevenueForecast(prev => 
    prev.map(item => (item.id === id ? { ...item, monthly_revenue: parseFloat(value) * 100000 || 0 } : item))
  );
  
  const handleAllocationChange = (id, value) => setExpenseLinkage(prev => 
    prev.map(item => (item.id === id ? { ...item, allocationPercent: parseFloat(value) || 0 } : item))
  );
  
  const toggleDept = (dept) => setExpandedDepts(prev => ({...prev, [dept]: !prev[dept]}));

  // Enhanced Calculation Engine with Growth Rates
  const { kpis, charts, groupedExpenses } = useMemo(() => {
    const baseTotalBudget = initialExpenseLinkage.reduce((sum, e) => sum + e.baseBudget, 0);
    const totalForecastedRevenue = revenueForecast.reduce((sum, r) => sum + r.monthly_revenue, 0) * scenarioMultipliers[scenario];
    const revenueGrowth = revenueForecast.reduce((sum, r) => sum + (r.monthly_revenue * (r.growth/100)), 0) / revenueForecast.reduce((sum, r) => sum + r.monthly_revenue, 0);
    
    let newTotalAllocatedBudget = 0;

    const finalCalculatedExpenses = expenseLinkage.map(e => {
      let newAllocatedBudget = e.baseBudget;
      if (e.type === 'Variable') {
        const sourceRevenue = e.sourceId === 'all' ? 
          totalForecastedRevenue : 
          (revenueForecast.find(r => r.id === e.sourceId)?.monthly_revenue * scenarioMultipliers[scenario] || 0);
        newAllocatedBudget = sourceRevenue * (e.allocationPercent / 100);
      }
      newTotalAllocatedBudget += newAllocatedBudget;
      return { ...e, newAllocatedBudget, variance: newAllocatedBudget - e.baseBudget };
    });

    const varianceFromBase = newTotalAllocatedBudget - baseTotalBudget;
    const departmentTotals = finalCalculatedExpenses.reduce((acc, curr) => 
      ({...acc, [curr.department]: (acc[curr.department] || 0) + curr.newAllocatedBudget}), {});
      
    const finalGroupedExpenses = finalCalculatedExpenses.reduce((acc, expense) => 
      ({...acc, [expense.department]: [...(acc[expense.department] || []), expense]}), {});

    return {
      kpis: { 
        baseTotalBudget, 
        totalForecastedRevenue, 
        newTotalAllocatedBudget, 
        varianceFromBase,
        revenueGrowth: (revenueGrowth * 100).toFixed(1),
        expenseRatio: (newTotalAllocatedBudget / totalForecastedRevenue * 100).toFixed(1)
      },
      groupedExpenses: finalGroupedExpenses,
      charts: {
        revenueForecast: { 
          labels: revenueForecast.map(r => r.name), 
          datasets: [{ 
            label: 'Monthly Revenue', 
            data: revenueForecast.map(r => r.monthly_revenue * scenarioMultipliers[scenario]), 
            backgroundColor: 'rgba(14, 165, 233, 0.7)', 
            borderColor: 'rgb(14, 165, 233)', 
            borderWidth: 1 
          }] 
        },
        waterfall: { 
          labels: ['Base Budget', 'Adjustments', 'New Budget'], 
          datasets: [{ 
            data: [baseTotalBudget, varianceFromBase, newTotalAllocatedBudget], 
            backgroundColor: ['#64748b', varianceFromBase >= 0 ? '#ef4444' : '#22c55e', '#0369a1'], 
            stack: 'stack' 
          }, { 
            data: [0, baseTotalBudget, 0], 
            backgroundColor: 'rgba(0,0,0,0)', 
            stack: 'stack' 
          }] 
        },
        composition: { 
          labels: Object.keys(departmentTotals), 
          datasets: [{ 
            data: Object.values(departmentTotals), 
            backgroundColor: departmentColors, 
            borderColor: '#fff', 
            borderWidth: 2 
          }] 
        },
        growthRates: {
          labels: revenueForecast.map(r => r.name),
          datasets: [{
            label: 'Growth Rate',
            data: revenueForecast.map(r => r.growth),
            backgroundColor: 'rgba(74, 222, 128, 0.7)',
            borderColor: 'rgb(22, 163, 74)',
            borderWidth: 1
          }]
        }
      }
    };
  }, [scenario, revenueForecast, expenseLinkage]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-800 to-sky-600 p-5 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue-Driven Expense Allocation</h1>
            <p className="text-sky-100 text-sm mt-1">Dynamically align spending with revenue performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <div className="bg-white/10 p-2 rounded-lg">
              <label className="block text-xs font-medium text-sky-100 mb-1">Scenario Model</label>
              <select 
                value={scenario} 
                onChange={(e) => setScenario(e.target.value)} 
                className="w-full p-2 border border-sky-400 rounded-lg text-sm bg-white/20 text-white shadow-sm focus:ring-2 focus:ring-white"
              >
                <option value="Base" className="text-black">Base Case</option>
                <option value="Stretch" className="text-black">Stretch (+15%)</option>
                <option value="Conservative" className="text-black">Conservative (-10%)</option>
                <option value="Downside" className="text-black">Downside (-25%)</option>
              </select>
            </div>
            <button className="bg-white text-sky-700 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <FiDownload size={14} /> Export Plan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(kpis.totalForecastedRevenue)}</h3>
            </div>
            <BsGraphUp className="text-sky-500 mt-1" />
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${parseFloat(kpis.revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {kpis.revenueGrowth}% YoY
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(kpis.newTotalAllocatedBudget)}</h3>
            </div>
            <BsCalculator className="text-sky-500 mt-1" />
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${kpis.varianceFromBase >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {kpis.varianceFromBase >= 0 ? '+' : ''}{formatCurrency(kpis.varianceFromBase)} vs Base
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500">Expense Ratio</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpis.expenseRatio}%</h3>
            </div>
            <BsPieChart className="text-sky-500 mt-1" />
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-slate-500">of Revenue</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500">Variable Expenses</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {expenseLinkage.filter(e => e.type === 'Variable').length}
              </h3>
            </div>
            <BsSliders className="text-sky-500 mt-1" />
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-slate-500">Linked Drivers</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Forecast */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BsGraphUp className="text-sky-600" /> Revenue Forecast ({scenario} Scenario)
            </h3>
            <div className="flex items-center gap-2">
              <button 
                className={`text-xs px-3 py-1 rounded-full ${activeTab === 'revenue' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}
                onClick={() => setActiveTab('revenue')}
              >
                Revenue
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-full ${activeTab === 'growth' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}
                onClick={() => setActiveTab('growth')}
              >
                Growth Rates
              </button>
            </div>
          </div>
          <div className="h-64">
            {activeTab === 'revenue' ? (
              <Bar 
                options={{
                  responsive: true, 
                  maintainAspectRatio: false, 
                  indexAxis: 'y', 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { 
                      ticks: { callback: v => formatCurrency(v) },
                      grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                      grid: { display: false }
                    }
                  }
                }} 
                data={charts.revenueForecast} 
              />
            ) : (
              <Bar 
                options={{
                  responsive: true, 
                  maintainAspectRatio: false, 
                  indexAxis: 'y', 
                  plugins: { legend: { display: false } }, 
                  scales: { 
                    x: { 
                      max: 50,
                      ticks: { callback: v => `${v}%` },
                      grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                      grid: { display: false }
                    }
                  }
                }} 
                data={charts.growthRates} 
              />
            )}
          </div>
        </div>

        {/* Budget Waterfall */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BsCalculator className="text-sky-600" /> Budget Waterfall
          </h3>
          <div className="h-64">
            <Bar 
              options={{
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } }, 
                scales: { 
                  y: { 
                    ticks: { callback: v => formatCurrency(v) },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  },
                  x: {
                    grid: { display: false }
                  }
                }
              }} 
              data={charts.waterfall} 
            />
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-slate-500 mr-2"></div>
              <span>Base Budget</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
              <span>Adjustment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-blue-600 mr-2"></div>
              <span>New Budget</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Composition */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
      <BsPieChart className="text-sky-600" /> Expense Composition
    </h3>
    <div className="relative h-48 w-full mx-auto">
      <Doughnut 
        options={{
          responsive: true, 
          maintainAspectRatio: false, 
          cutout: '65%', 
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                }
              }
            }
          }
        }} 
        data={charts.composition} 
      />
    </div>
    
    {/* Detailed Explanation Section */}
    <div className="mt-4 space-y-3">
      <div className="flex items-start gap-2">
        <BsInfoCircle className="text-sky-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600">
          This breakdown shows how expenses are distributed across departments under the {scenario} scenario.
        </p>
      </div>
      
      <div className="border-t border-slate-100 pt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Total Expenses:</span>
          <span className="font-medium text-slate-700">{formatCurrency(kpis.newTotalAllocatedBudget)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Variable Ratio:</span>
          <span className="font-medium text-slate-700">
            {(
              expenseLinkage
                .filter(e => e.type === 'Variable')
                .reduce((sum, e) => sum + e.newAllocatedBudget, 0) / 
              kpis.newTotalAllocatedBudget * 100
            ).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-3">
        <h4 className="text-xs font-semibold text-slate-700 mb-1">Key Observations:</h4>
        <ul className="text-xs text-slate-600 space-y-1">
          <li className="flex items-start gap-1">
            <span>•</span>
            <span>R&D accounts for the largest fixed cost center</span>
          </li>
          <li className="flex items-start gap-1">
            <span>•</span>
            <span>Sales has the highest variable component (commissions)</span>
          </li>
          <li className="flex items-start gap-1">
            <span>•</span>
            <span>Cloud costs scale directly with SaaS revenue</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <BsTable className="text-sky-600" /> Department Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold w-1/4">Department</th>
                  <th className="px-4 py-2 text-right font-semibold">Budget</th>
                  <th className="px-4 py-2 text-right font-semibold">% of Total</th>
                  <th className="px-4 py-2 text-right font-semibold">Var/Fixed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedExpenses).map(([dept, expenses], i) => {
                  const deptTotal = expenses.reduce((sum, e) => sum + e.newAllocatedBudget, 0);
                  const variablePercent = (expenses.filter(e => e.type === 'Variable').reduce((sum, e) => sum + e.newAllocatedBudget, 0) / deptTotal * 100);
                  
                  return (
                    <tr key={dept} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: departmentColors[i] }}></div>
                          {dept}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">
                        {formatCurrency(deptTotal)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {(deptTotal / kpis.newTotalAllocatedBudget * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {variablePercent.toFixed(0)}% Variable
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Source Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BsPencil className="text-sky-600" /> Revenue Drivers
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {revenueForecast.length} Products
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Revenue Source</th>
                  <th className="px-4 py-2 text-right font-semibold">Forecast (₹L)</th>
                  <th className="px-4 py-2 text-right font-semibold">Growth</th>
                  <th className="px-4 py-2 text-right font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {revenueForecast.map((r, index) => (
                  <tr 
                    key={r.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} border-b border-slate-100 last:border-b-0 hover:bg-slate-100`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">{r.name}</td>
                    <td className="px-4 py-3">
                      <div className="relative flex justify-end items-center">
                        <input 
                          type="number" 
                          value={(r.monthly_revenue / 100000).toFixed(2)} 
                          onChange={e => handleRevenueChange(r.id, e.target.value)} 
                          className="w-24 text-right font-mono bg-slate-100 rounded-md p-1.5 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${r.growth >= 20 ? 'text-green-600' : r.growth >= 10 ? 'text-amber-600' : 'text-red-600'}`}>
                        {r.growth}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <div className="w-full max-w-[80px] bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${r.confidence >= 85 ? 'bg-green-500' : r.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${r.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Allocation Ledger */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BsPencil className="text-sky-600" /> Expense Drivers
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {expenseLinkage.length} Line Items
              </span>
            </div>
          </div>
          <div className="space-y-2 p-3">
            {Object.entries(groupedExpenses).map(([dept, expenses]) => {
              const deptTotal = expenses.reduce((sum, e) => sum + e.newAllocatedBudget, 0);
              const deptColor = departmentColors[Object.keys(groupedExpenses).indexOf(dept)];
              
              return (
                <div key={dept} className="border border-slate-200 rounded-lg bg-white shadow-xs overflow-hidden">
                  <div 
                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleDept(dept)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: deptColor }}></div>
                      <h4 className="font-semibold text-slate-700">{dept}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-800">{formatCurrency(deptTotal)}</span>
                      {expandedDepts[dept] ? (
                        <FiChevronDown className="text-slate-500 transition-transform" />
                      ) : (
                        <FiChevronRight className="text-slate-500 transition-transform" />
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedDepts[dept] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="overflow-x-auto bg-slate-50">
                          <table className="w-full text-sm">
                            <thead className="text-xs text-slate-500 bg-slate-100">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold w-1/4">Category</th>
                                <th className="px-4 py-2 text-left font-semibold w-1/3">Driver</th>
                                <th className="px-4 py-2 text-right font-semibold">Allocated</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenses.map((e, index) => (
                                <tr 
                                  key={e.id} 
                                  className={`border-t border-slate-100 ${index % 2 !== 0 ? 'bg-slate-50/70' : 'bg-white'}`}
                                >
                                  <td className="px-4 py-3 font-medium text-slate-700">{e.category}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 relative">
                                      {e.type === 'Variable' ? (
                                        <>
                                          <input 
                                            type="number" 
                                            value={e.allocationPercent} 
                                            onChange={evt => handleAllocationChange(e.id, evt.target.value)} 
                                            className="w-16 text-center font-mono bg-white rounded-md p-1.5 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                                          />
                                          <span className="text-slate-500 text-xs whitespace-nowrap">
                                            % of {e.sourceId === 'all' ? 'Total Rev' : revenueForecast.find(r => r.id === e.sourceId)?.name.split(' ')[0]}
                                          </span>
                                          {e.aiInsight && (
                                            <button 
                                              data-tooltip-id="ai-tooltip" 
                                              data-tooltip-content={e.aiInsight} 
                                              className="text-purple-500 hover:text-purple-700"
                                            >
                                              <BsStars size={14} />
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded-full">
                                          Fixed Amount
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex flex-col items-end">
                                      <span className="font-mono font-bold text-slate-800">
                                        {formatCurrency(e.newAllocatedBudget)}
                                      </span>
                                      {e.type === 'Variable' && (
                                        <span className={`text-xs ${e.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                          {e.variance >= 0 ? '+' : ''}{formatCurrency(e.variance)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ReactTooltip 
        id="ai-tooltip" 
        place="top" 
        effect="solid" 
        className="max-w-xs !bg-slate-800 !text-white !text-sm !py-2 !px-3 !rounded-lg !shadow-lg" 
      />
    </div>
  );
};

export default RevenueDrivenExpenseAllocation;