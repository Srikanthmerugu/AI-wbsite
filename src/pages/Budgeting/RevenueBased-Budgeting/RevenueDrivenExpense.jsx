import React, { useState, useMemo } from 'react';
import { BsGraphUp, BsShieldCheck, BsSliders, BsStars, BsTable, BsPencil, BsCalculator, BsPieChart } from "react-icons/bs";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- Professional Currency Formatter (Indian Standard) ---
const formatCurrency = (value) => {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

// --- MOCK DATA & INITIAL STATE ---
const initialRevenueForecast = [
  { id: 'p1', name: 'Product A (Enterprise)', confidence: 91, monthly_revenue: 32000000 },
  { id: 'p2', name: 'Product B (SaaS)', confidence: 85, monthly_revenue: 18000000 },
  { id: 'p3', name: 'Services & Consulting', confidence: 78, monthly_revenue: 8500000 },
];
const initialExpenseLinkage = [
  { id: 'e1', department: 'Marketing', category: 'Digital Ads', type: 'Variable', sourceId: 'p1', baseBudget: 1920000, allocationPercent: 6, justification: '' },
  { id: 'e2', department: 'Support', category: 'Salaries', type: 'Variable', sourceId: 'p1', baseBudget: 3200000, allocationPercent: 10, justification: 'Tier 2 support team.' },
  { id: 'e3', department: 'Cloud Ops', category: 'Hosting Costs', type: 'Variable', sourceId: 'p2', baseBudget: 2160000, allocationPercent: 12, justification: '' },
  { id: 'e4', department: 'Sales', category: 'Commissions', type: 'Variable', sourceId: 'all', baseBudget: 4000000, allocationPercent: 7, justification: 'Standard rate.' },
  { id: 'e5', department: 'R&D', category: 'Core Development', type: 'Fixed', sourceId: 'none', baseBudget: 6000000, allocationPercent: 0, justification: 'Project Titan' },
  { id: 'e6', department: 'G&A', category: 'Admin & Facilities', type: 'Fixed', sourceId: 'none', baseBudget: 3500000, allocationPercent: 0, justification: '' },
];
const scenarioMultipliers = { Base: 1.0, Stretch: 1.15, Conservative: 0.9 };

// --- Reusable Components ---
const KpiCard = ({ title, value, change, isPositive }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <p className="text-slate-500 font-medium text-sm truncate">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {change && <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</p>}
    </div>
);

const RevenueDrivenExpenseAllocation = () => {
  const [scenario, setScenario] = useState('Base');
  const [revenueForecast, setRevenueForecast] = useState(initialRevenueForecast);
  const [expenseLinkage, setExpenseLinkage] = useState(initialExpenseLinkage);

  // --- Event Handlers for Interactivity ---
  const handleRevenueChange = (id, value) => {
    const newRevenue = parseFloat(value) * 100000 || 0; // Input is in Lakhs
    setRevenueForecast(prev => prev.map(item => (item.id === id ? { ...item, monthly_revenue: newRevenue } : item)));
  };

  const handleAllocationChange = (id, value) => {
    const newAllocation = parseFloat(value) || 0;
    setExpenseLinkage(prev => prev.map(item => (item.id === id ? { ...item, allocationPercent: newAllocation } : item)));
  };
  
  const handleJustificationChange = (id, value) => {
    setExpenseLinkage(prev => prev.map(item => (item.id === id ? { ...item, justification: value } : item)));
  };

  // --- Core Calculation Engine ---
  const { kpis, calculatedExpenses, charts } = useMemo(() => {
    const baseTotalBudget = initialExpenseLinkage.reduce((sum, e) => sum + e.baseBudget, 0);
    const totalForecastedRevenue = revenueForecast.reduce((sum, r) => sum + r.monthly_revenue, 0) * scenarioMultipliers[scenario];

    let newTotalAllocatedBudget = 0;
    const finalCalculatedExpenses = expenseLinkage.map(e => {
      let newAllocatedBudget = e.baseBudget;
      if (e.type === 'Variable') {
        const sourceRevenue = e.sourceId === 'all'
          ? totalForecastedRevenue
          : (revenueForecast.find(r => r.id === e.sourceId)?.monthly_revenue || 0) * scenarioMultipliers[scenario];
        newAllocatedBudget = sourceRevenue * (e.allocationPercent / 100);
      }
      newTotalAllocatedBudget += newAllocatedBudget;
      const variance = newAllocatedBudget - e.baseBudget;
      const productName = e.sourceId === 'all' ? 'Total Revenue' : revenueForecast.find(r => r.id === e.sourceId)?.name || '';
      const driver = e.type === 'Fixed' ? 'Fixed' : `${e.allocationPercent}% of ${productName}`;
      return { ...e, newAllocatedBudget, variance, driver };
    });

    const varianceFromBase = newTotalAllocatedBudget - baseTotalBudget;
    
    const departmentTotals = finalCalculatedExpenses.reduce((acc, curr) => {
        acc[curr.department] = (acc[curr.department] || 0) + curr.newAllocatedBudget;
        return acc;
    }, {});

    return {
      kpis: { baseTotalBudget, totalForecastedRevenue, newTotalAllocatedBudget, varianceFromBase },
      calculatedExpenses: finalCalculatedExpenses,
      charts: {
        revenueForecast: {
            labels: revenueForecast.map(r => r.name),
            datasets: [{ label: 'Monthly Revenue', data: revenueForecast.map(r => r.monthly_revenue * scenarioMultipliers[scenario]), backgroundColor: '#0ea5e9', barThickness: 40 }]
        },
        waterfall: {
            labels: ['Base Budget', 'Rev-Driven Change', 'New Allocated Budget'],
            datasets: [{ data: [baseTotalBudget, varianceFromBase, newTotalAllocatedBudget], backgroundColor: ['#3b82f6', varianceFromBase >= 0 ? '#ef4444' : '#22c55e', '#0369a1'], stack: 'stack' }, { data: [0, baseTotalBudget, 0], backgroundColor: 'rgba(0,0,0,0)', stack: 'stack' }]
        },
        composition: {
            labels: Object.keys(departmentTotals),
            datasets: [{ data: Object.values(departmentTotals), backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#64748b'] }]
        }
      }
    };
  }, [scenario, revenueForecast, expenseLinkage]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Revenue-Driven Expense Allocation</h1>
            <p className="text-slate-500">Align spending with income trends through driver-based, AI-assisted planning.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
             <span className="font-semibold text-slate-600">Scenario:</span>
             <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-1.5 font-medium"><option>Base</option><option>Stretch</option><option>Conservative</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KpiCard title="Total Forecasted Revenue" value={formatCurrency(kpis.totalForecastedRevenue)} />
          <KpiCard title="Base Expense Budget" value={formatCurrency(kpis.baseTotalBudget)} />
          <KpiCard title="New Allocated Budget" value={formatCurrency(kpis.newTotalAllocatedBudget)} />
          <KpiCard title="Variance from Base" value={formatCurrency(kpis.varianceFromBase)} isPositive={kpis.varianceFromBase <= 0} change={kpis.varianceFromBase >= 0 ? `+${(kpis.varianceFromBase/kpis.baseTotalBudget*100).toFixed(1)}%` : `${(kpis.varianceFromBase/kpis.baseTotalBudget*100).toFixed(1)}%`}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* --- Left Panel: The Cause --- */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2"><BsGraphUp/> Revenue Forecast Workbench</h3>
            <p className="text-sm text-slate-500 mb-4">Edit the monthly revenue forecast to see its immediate impact on expense allocations.</p>
            <div className="h-48 mb-4"><Bar options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: {y: {ticks: {callback: v => formatCurrency(v)}}}}} data={charts.revenueForecast} /></div>
             <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase"><tr><th className="px-3 py-2 text-left">Revenue Source</th><th className="px-3 py-2 text-right">Forecasted Revenue (Lakhs)</th></tr></thead>
              <tbody>{revenueForecast.map(r => (<tr key={r.id} className="border-b border-slate-100"><td className="px-3 py-2 font-medium text-slate-700">{r.name}</td><td className="px-3 py-2"><div className="relative flex justify-end items-center"><span className="font-mono text-slate-400 mr-1">₹</span><input type="number" value={(r.monthly_revenue / 100000).toFixed(2)} onChange={e => handleRevenueChange(r.id, e.target.value)} className="w-24 text-right font-mono bg-slate-100 rounded p-1 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-sky-500"/></div></td></tr>))}</tbody>
            </table>
        </div>
        {/* --- Right Panel: The Effect --- */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2"><BsCalculator/> Expense Impact Analysis</h3>
            <p className="text-sm text-slate-500 mb-4">Visualize how the revenue forecast changes the overall expense budget and its composition.</p>
             <div className="grid grid-cols-2 gap-4 h-full">
                <div className="h-64"><Bar options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: {y: {ticks: {callback: v => formatCurrency(v)}}}}} data={charts.waterfall} /></div>
                <div className="h-64"><Doughnut options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'right'}}}} data={charts.composition} /></div>
             </div>
        </div>
      </div>
      
      {/* Detailed Allocation Ledger */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 p-4 border-b border-slate-200 flex items-center gap-2"><BsPencil /> Detailed Allocation Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase"><tr><th className="px-4 py-2 text-left w-[25%]">Line Item</th><th className="px-4 py-2 text-left w-[20%]">Driver</th><th className="px-4 py-2 text-right">Base</th><th className="px-4 py-2 text-right">Allocated</th><th className="px-4 py-2 text-right">Variance</th><th className="px-4 py-2 text-left w-[25%]">Justification</th></tr></thead>
            <tbody>
              {calculatedExpenses.map(e => (
                <tr key={e.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{e.department}: {e.category}</td>
                  <td className="px-4 py-3 text-sky-700 font-medium">{e.type === 'Variable' ? <div className="flex items-center"><input type="number" value={e.allocationPercent} onChange={e => handleAllocationChange(e.id, e.target.value)} className="w-14 text-center font-mono bg-white rounded p-1 border border-slate-200" /><span className="font-mono text-slate-400 ml-1">% of {e.sourceId === 'all' ? 'Total' : `P${e.sourceId.slice(1)}`}</span></div> : <span className="text-slate-500">Fixed</span>}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{formatCurrency(e.baseBudget)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{formatCurrency(e.newAllocatedBudget)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${e.variance === 0 ? 'text-slate-500' : e.variance > 0 ? 'text-red-500' : 'text-green-500'}`}>{e.variance >= 0 ? '+' : ''}{formatCurrency(e.variance)}</td>
                  <td className="px-4 py-3"><input type="text" value={e.justification} onChange={e => handleJustificationChange(e.id, e.target.value)} placeholder="Add justification..." className="w-full text-xs p-1 bg-transparent border-b border-slate-200 focus:border-sky-500 focus:ring-0" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueDrivenExpenseAllocation;