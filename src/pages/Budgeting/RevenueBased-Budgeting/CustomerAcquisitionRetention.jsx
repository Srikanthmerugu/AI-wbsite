import React, { useState, useMemo } from 'react';
import { BsGraphUp, BsShieldCheck, BsSliders, BsStars, BsTable, BsGear, BsInfoCircle, BsBullseye, BsHeart, BsArrowRepeat } from "react-icons/bs";
import { Doughnut, Scatter } from 'react-chartjs-2';
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
const initialCampaignData = [
  { id: 'c1', name: "LinkedIn ABM", type: "Acquisition", channel: "LinkedIn", budget: 400000, costPerOutcome: 8200, roi: 3.4, recommendation: "Maintain budget. High LTV prospects." },
  { id: 'c2', name: "Google Search Ads", type: "Acquisition", channel: "Google", budget: 750000, costPerOutcome: 6100, roi: 4.1, recommendation: "Increase by 10%. High conversion rate." },
  { id: 'c3', name: "Startup FB Ads", type: "Acquisition", channel: "Facebook", budget: 300000, costPerOutcome: 9500, roi: 1.5, recommendation: "Reduce or shift budget. Low LTV/CAC." },
  { id: 'c4', name: "Loyalty Email Series", type: "Retention", channel: "Email", budget: 150000, costPerOutcome: 1200, roi: 8.2, recommendation: "High ROI. Consider expanding program." },
  { id: 'c5', name: "Enterprise Renewals Team", type: "Retention", channel: "Direct", budget: 500000, costPerOutcome: 3500, roi: 12.5, recommendation: "Fully fund. Critical for NRR." },
  { id: 'c6', name: "SMB Success Webinars", type: "Retention", channel: "Webinar", budget: 200000, costPerOutcome: 2800, roi: 5.5, recommendation: "Effective for reducing churn in SMB segment." },
];
const segmentData = [
    { name: 'SMB', churn: 15.2, avgRevenue: 32000, acquisitionCost: 6100, retentionCost: 2300 },
    { name: 'Mid-market', churn: 8.9, avgRevenue: 95000, acquisitionCost: 7200, retentionCost: 3100 },
    { name: 'Enterprise', churn: 4.8, avgRevenue: 360000, acquisitionCost: 12000, retentionCost: 5500 },
];
const totalGrowthBudget = 10000000;
const aiSuggestedSplit = 65; // 65% Acquisition

// --- Reusable Components ---
const KpiCard = ({ title, value, icon }) => (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center text-slate-500">
        <p className="font-medium text-sm truncate">{title}</p>
        <div className="text-xl">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const CustomerAcquisitionRetentionBudgeting = () => {
  const [acquisitionSplit, setAcquisitionSplit] = useState(65); // Acquisition %
  
  const retentionMatrixData = useMemo(() => ({
    datasets: [{
        label: 'Retention Campaigns',
        data: initialCampaignData.filter(c => c.type === 'Retention').map(c => ({ x: c.costPerOutcome, y: c.roi, label: c.name })),
        backgroundColor: '#3b82f6',
        pointRadius: 8,
        pointHoverRadius: 12
    }]
  }), []);

  const { kpis, budgetSplit, campaigns } = useMemo(() => {
    const acquisitionBudget = totalGrowthBudget * (acquisitionSplit / 100);
    const retentionBudget = totalGrowthBudget * (100 - acquisitionSplit) / 100;
    
    const acqBaseTotal = initialCampaignData.filter(c => c.type === 'Acquisition').reduce((sum, c) => sum + c.budget, 0);
    const retBaseTotal = initialCampaignData.filter(c => c.type === 'Retention').reduce((sum, c) => sum + c.budget, 0);

    const updatedCampaigns = initialCampaignData.map(c => {
        let newBudget = c.budget;
        if (c.type === 'Acquisition' && acqBaseTotal > 0) {
            newBudget = acquisitionBudget * (c.budget / acqBaseTotal);
        } else if (c.type === 'Retention' && retBaseTotal > 0) {
            newBudget = retentionBudget * (c.budget / retBaseTotal);
        }
        return { ...c, newBudget };
    });

    const acqCampaigns = updatedCampaigns.filter(c => c.type === 'Acquisition');
    const avgCAC = acqCampaigns.length > 0
        ? acqCampaigns.reduce((sum, c) => sum + c.costPerOutcome, 0) / acqCampaigns.length
        : 0;

    return {
        kpis: {
            avgCAC: formatCurrency(avgCAC),
            ltvCacRatio: '3.4x',
            churnRate: '7.8%',
            aiSuggestedSplit: `${aiSuggestedSplit}% / ${100-aiSuggestedSplit}%`
        },
        budgetSplit: { acquisition: acquisitionBudget, retention: retentionBudget },
        campaigns: updatedCampaigns,
    };
  }, [acquisitionSplit]);

  const budgetSplitChartData = {
    labels: ['Acquisition', 'Retention'],
    datasets: [{ data: [budgetSplit.acquisition, budgetSplit.retention], backgroundColor: ['#0ea5e9', '#6366f1'], borderColor: '#fff', borderWidth: 4 }],
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Customer Acquisition & Retention Budgeting</h1>
        <p className="text-slate-500">Intelligently balance spend across the customer lifecycle for maximum ROI.</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Avg. CAC (Last 12M)" value={kpis.avgCAC} icon={<BsBullseye className="text-red-500"/>} />
        <KpiCard title="LTV/CAC Ratio" value={kpis.ltvCacRatio} icon={<BsGraphUp className="text-green-500"/>} />
        <KpiCard title="Churn Rate" value={kpis.churnRate} icon={<BsArrowRepeat className="text-amber-500"/>} />
        <KpiCard title="AI Suggested Split (Acq/Ret)" value={kpis.aiSuggestedSplit} icon={<BsStars className="text-indigo-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Budget Split Simulator</h3>
            <p className="text-sm text-slate-500 mb-4">Drag the slider to model the impact of shifting budget between Acquisition and Retention.</p>
            <div className="h-48 mb-4">
                <Doughnut data={budgetSplitChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } }} />
            </div>
             <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-sky-700">Acquisition</span>
                    <span className="font-bold text-slate-800">{formatCurrency(budgetSplit.acquisition)}</span>
                </div>
                <input type="range" min="10" max="90" step="1" value={acquisitionSplit} onChange={e => setAcquisitionSplit(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-indigo-600">Retention</span>
                    <span className="font-bold text-slate-800">{formatCurrency(budgetSplit.retention)}</span>
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Retention Efficiency Matrix</h3>
            <p className="text-sm text-slate-500 mb-4">Identify high and low ROI retention efforts to optimize spend. (This chart is static for analysis)</p>
            {/* --- THE FIX IS HERE --- */}
            <div className="relative flex-grow h-80">
                 <Scatter options={{responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Cost per Retention' }}, y: { title: { display: true, text: 'Campaign ROI' }}}, plugins:{tooltip:{callbacks:{label: (ctx) => `${ctx.raw.label}: (${formatCurrency(ctx.raw.x)}, ${ctx.raw.y}x ROI)`}}}}} data={retentionMatrixData} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 p-4 border-b border-slate-200 flex items-center gap-2"><BsTable /> Granular Campaign Budget</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-4 py-2 text-left">Campaign Name</th><th className="px-4 py-2 text-left">Type</th><th className="px-4 py-2 text-right">Budget</th><th className="px-4 py-2 text-right">Cost/Outcome</th><th className="px-4 py-2 text-right">ROI</th><th className="px-4 py-2 text-left">AI Recommendation</th></tr></thead>
                    <tbody>
                    {campaigns.map(c => (
                        <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.type === 'Acquisition' ? 'bg-sky-100 text-sky-800' : 'bg-indigo-100 text-indigo-800'}`}>{c.type}</span></td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{formatCurrency(c.newBudget)}</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(c.costPerOutcome)}</td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-green-600">{c.roi.toFixed(1)}x</td>
                            <td className="px-4 py-3 text-xs text-slate-600">{c.recommendation}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Budget by Customer Segment</h3>
            <p className="text-sm text-slate-500 mb-4">Analyze how key metrics differ across customer types to refine targeting.</p>
            <table className="w-full text-sm">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-3 py-2 text-left">Segment</th><th className="px-3 py-2 text-right">CAC</th><th className="px-3 py-2 text-right">Retention Cost</th><th className="px-3 py-2 text-right">Churn %</th></tr></thead>
                <tbody>
                    {segmentData.map(s => (
                        <tr key={s.name} className="border-b border-slate-100">
                            <td className="px-3 py-2 font-medium text-slate-700">{s.name}</td>
                            <td className="px-3 py-2 text-right font-mono">{formatCurrency(s.acquisitionCost)}</td>
                            <td className="px-3 py-2 text-right font-mono">{formatCurrency(s.retentionCost)}</td>
                            <td className="px-3 py-2 text-right font-mono text-amber-600">{s.churn.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerAcquisitionRetentionBudgeting;