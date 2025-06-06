import React, { useState, useMemo } from 'react';
import { BsGraphUp, BsShieldCheck, BsSliders, BsStars, BsTable, BsGear, BsInfoCircle, BsPencil, BsArrowRight } from "react-icons/bs";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Professional Currency Formatter (Indian Standard) ---
const formatCurrency = (value) => {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

// --- MOCK DATA & INITIAL STATE ---
const initialAdjustmentData = [
  { id: 'e1', department: 'Marketing', category: 'Digital Ads', baseBudget: 12000000, sensitivity: 10, justification: 'High correlation with lead gen.' },
  { id: 'e2', department: 'HR', category: 'Sales Ops Hiring', baseBudget: 8000000, sensitivity: 5, justification: 'Support for new sales reps.' },
  { id: 'e3', department: 'Sales', category: 'Travel & Events', baseBudget: 9000000, sensitivity: 8, justification: 'Client-facing activities.' },
  { id: 'e4', department: 'IT', category: 'SaaS Licenses (Sales)', baseBudget: 4500000, sensitivity: 3, justification: 'Per-seat license costs.' },
  { id: 'e5', department: 'R&D', category: 'Core Product', baseBudget: 25000000, sensitivity: 0, justification: 'Fixed roadmap spend.' },
];
const baseRevenueBudget = 250000000;
const aiRecommendations = [
    { title: "Optimize Digital Ads", text: "Current 10% sensitivity is aggressive. Recommend 8% to improve CAC while still capturing upside." },
    { title: "Accelerate Hiring", text: "If growth exceeds 15%, a 7% sensitivity for HR (vs. 5%) is needed to prevent support gaps." },
    { title: "Travel Budget Caution", text: "Monitor travel ROI closely. Current 8% sensitivity is at the higher end of historical efficiency." },
];
const adjustmentRules = [
    { name: 'Marketing Cap', condition: 'Sales Growth >10%', logic: 'Max 12% budget uplift', status: 'Compliant' },
    { name: 'Hiring Freeze', condition: 'Sales Growth <0%', logic: 'HR sensitivity -> 0%', status: 'Compliant' },
];

// --- Reusable Components ---
const KpiCard = ({ title, value, change }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {change && <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</p>}
    </div>
);


const SalesGrowthBudgetAdjustments = () => {
  const [salesGrowth, setSalesGrowth] = useState(14.2); // YoY Growth %
  const [adjustments, setAdjustments] = useState(initialAdjustmentData);

  const handleSensitivityChange = (id, value) => {
    const newSensitivity = parseFloat(value) || 0;
    setAdjustments(prev => prev.map(item => (item.id === id ? { ...item, sensitivity: newSensitivity } : item)));
  };
  
  const handleJustificationChange = (id, value) => {
    setAdjustments(prev => prev.map(item => (item.id === id ? { ...item, justification: value } : item)));
  };

  const { kpis, calculatedAdjustments, scenarioGridData } = useMemo(() => {
    const revenueVariance = baseRevenueBudget * (salesGrowth / 100);
    
    let responsiveBudgetPool = 0;
    let totalAdjustment = 0;

    const finalCalculatedAdjustments = adjustments.map(item => {
        responsiveBudgetPool += item.baseBudget;
        const adjustment = item.baseBudget * (item.sensitivity / 100) * (salesGrowth / 5); // Example logic: sensitivity % uplift per 5% sales growth
        const newBudget = item.baseBudget + adjustment;
        totalAdjustment += adjustment;
        return { ...item, adjustment, newBudget };
    });

    const scenarioData = adjustments.map(item => {
        const stretchAdj = item.baseBudget * (item.sensitivity / 100) * (20 / 5); // Simulating 20% growth
        const conservativeAdj = item.baseBudget * (item.sensitivity / 100) * (-5 / 5); // Simulating -5% growth
        return {
            category: item.category,
            baseBudget: item.baseBudget,
            stretchBudget: item.baseBudget + stretchAdj,
            conservativeBudget: item.baseBudget + conservativeAdj,
        }
    });

    return {
      kpis: { revenueVariance, responsiveBudgetPool, totalAdjustment },
      calculatedAdjustments: finalCalculatedAdjustments,
      scenarioGridData: scenarioData
    };
  }, [salesGrowth, adjustments]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sales Growth-Linked Budget Adjustments</h1>
        <p className="text-slate-500">Automate budget recalibration based on sales performance with AI-powered guardrails.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BsSliders/> Elastic Budget Simulator</h3>
          <div className="flex items-center gap-4">
              <label className="font-semibold text-slate-700 w-48">Current Sales Growth (YoY)</label>
              <input type="range" min="-10" max="30" step="0.1" value={salesGrowth} onChange={e => setSalesGrowth(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
              <span className="font-bold text-2xl text-sky-700 w-28 text-center">{salesGrowth.toFixed(1)}%</span>
          </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KpiCard title="Revenue Variance vs Budget" value={formatCurrency(kpis.revenueVariance)} change={kpis.revenueVariance >= 0 ? 'Above Plan' : 'Below Plan'}/>
          <KpiCard title="Responsive Budget Pool" value={formatCurrency(kpis.responsiveBudgetPool)} change="Sum of all elastic budgets"/>
          <KpiCard title="Calculated Adjustment" value={formatCurrency(kpis.totalAdjustment)} change={kpis.totalAdjustment >= 0 ? 'Upside Spend' : 'Budget Retraction'}/>
          <KpiCard title="AI Recommended Adj." value="~₹82L" change="Based on optimal ROI"/>
      </div>
      
      {/* Editable Allocation Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 p-4 border-b border-slate-200 flex items-center gap-2"><BsPencil /> Budget Adjustment Trigger Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-4 py-2 text-left w-[20%]">Expense Category</th><th className="px-4 py-2 text-center w-[15%]">Growth Sensitivity %</th><th className="px-4 py-2 text-right">Base Budget</th><th className="px-4 py-2 text-right">Calculated Adj.</th><th className="px-4 py-2 text-right">New Budget</th><th className="px-4 py-2 text-left w-[25%]">Justification</th></tr></thead>
            <tbody>
              {calculatedAdjustments.map(item => (
                <tr key={item.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.department}: {item.category}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="relative flex items-center justify-center">
                        <input type="number" value={item.sensitivity} onChange={e => handleSensitivityChange(item.id, e.target.value)} disabled={item.sensitivity === 0}
                            className="w-16 text-center font-mono bg-white rounded p-1 border border-slate-200 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed"/>
                        <span className="font-mono text-slate-400 ml-1">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{formatCurrency(item.baseBudget)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-semibold ${item.adjustment === 0 ? 'text-slate-500' : item.adjustment > 0 ? 'text-green-600' : 'text-red-500'}`}>{item.adjustment >= 0 ? '+' : ''}{formatCurrency(item.adjustment)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{formatCurrency(item.newBudget)}</td>
                  <td className="px-4 py-3"><input type="text" value={item.justification} onChange={e => handleJustificationChange(item.id, e.target.value)} placeholder="Add justification..." className="w-full text-xs p-1 bg-transparent border-b border-slate-200 focus:border-sky-500 focus:ring-0" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BsTable/> Scenario Impact Grid</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-3 py-2 text-left">Expense Category</th><th className="px-3 py-2 text-right">Base</th><th className="px-3 py-2 text-right">Stretch (+20%)</th><th className="px-3 py-2 text-right">Conservative (-5%)</th></tr></thead>
                    <tbody>
                        {scenarioGridData.map(item => (
                            <tr key={item.category} className="border-b border-slate-100">
                                <td className="px-3 py-2 font-medium text-slate-700">{item.category}</td>
                                <td className="px-3 py-2 text-right font-mono">{formatCurrency(item.baseBudget)}</td>
                                <td className="px-3 py-2 text-right font-mono text-green-600">{formatCurrency(item.stretchBudget)}</td>
                                <td className="px-3 py-2 text-right font-mono text-red-500">{formatCurrency(item.conservativeBudget)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><BsStars className="text-indigo-500"/> AI Recommendation Panel</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        {aiRecommendations.map(rec => <li key={rec.title}><p className="font-semibold text-slate-800">{rec.title}</p><p>{rec.text}</p></li>)}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><BsShieldCheck/> Adjustment Rules Status</h3>
                    <ul className="space-y-2 text-sm">
                        {adjustmentRules.map(r => <li key={r.name} className="flex justify-between items-center"><span className="text-slate-600">{r.name}: <span className="text-slate-800 font-medium">{r.condition}</span></span><span className={`font-bold px-2 py-0.5 rounded-full text-xs ${r.status === 'Compliant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span></li>)}
                    </ul>
                </div>
            </div>
       </div>
    </div>
  );
};

export default SalesGrowthBudgetAdjustments;