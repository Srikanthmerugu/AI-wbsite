import React, { useState, useMemo } from 'react';
import { BsGraphUp, BsShieldCheck, BsSliders, BsStars, BsTable, BsGear, BsInfoCircle, BsArrowUp, BsArrowDown, BsPencil } from "react-icons/bs";
import { Line } from 'react-chartjs-2';
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
const initialSegmentData = [
  { id: 'seg1', segment: 'SMB SaaS', plan: 'Pro', mrr: 1250000, signups: 160, churn: 8.2, upsell: 12, contraction: 4, confidence: 91 },
  { id: 'seg2', segment: 'Enterprise', plan: 'Enterprise', mrr: 4420000, signups: 28, churn: 2.3, upsell: 18, contraction: 2, confidence: 95 },
  { id: 'seg3', segment: 'Mid-market', plan: 'Growth', mrr: 2820000, signups: 80, churn: 5.5, upsell: 15, contraction: 3, confidence: 88 },
];
const planMixData = [
    { name: 'Starter', mrr: 580000, customers: 890, acv: 7800, tenure: '9 mo', potential: 'Low', suggestion: 'Incentivize annual plans.' },
    { name: 'Growth', mrr: 2820000, customers: 460, acv: 73500, tenure: '13 mo', potential: 'Medium', suggestion: 'Promote upgrades to Pro.' },
    { name: 'Enterprise', mrr: 4420000, customers: 130, acv: 408000, tenure: '22 mo', potential: 'High', suggestion: 'Offer paid add-ons.' },
];
const expansionOpportunities = [
    { segment: 'Healthcare - SMB', product: 'Compliance Suite', potential: 320000, action: 'Allocate more CX success headcount for onboarding.' },
    { segment: 'Retail - Mid Market', product: 'Analytics Add-on', potential: 570000, action: 'Offer a bundle discount for Q3 to drive adoption.' },
];
const scenarioMultipliers = { Base: 1.0, 'High Churn': 0.9, 'Expansion Heavy': 1.1 };

// --- Reusable Components ---
const KpiCard = ({ title, value, change }) => (
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {change && <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</p>}
    </div>
);


const SubscriptionRevenueBudgeting = () => {
  const [scenario, setScenario] = useState('Base');
  const [segments, setSegments] = useState(initialSegmentData);

  const handleDriverChange = (id, field, value) => {
    const newValue = parseFloat(value) || 0;
    setSegments(prev => prev.map(item => (item.id === id ? { ...item, [field]: newValue } : item)));
  };

  const { kpis, calculatedSegments, lineChartData } = useMemo(() => {
    const scenarioMultiplier = scenarioMultipliers[scenario];
    let totalCurrentMrr = 0;
    let totalForecastedMrr = 0;
    let totalChurn = 0;
    let totalCustomers = 0;
    
    const finalCalculatedSegments = segments.map(s => {
      const avgRevenuePerSignup = s.mrr / (s.signups / (1 - s.churn / 100)); // Simplified logic
      const newMrr = s.mrr + ((s.signups * avgRevenuePerSignup) * (1 - s.churn / 100));
      const upsellMrr = s.mrr * (s.upsell / 100);
      const contractionMrr = s.mrr * (s.contraction / 100);
      const forecastedMrr = (newMrr + upsellMrr - contractionMrr) * scenarioMultiplier;
      
      totalCurrentMrr += s.mrr;
      totalForecastedMrr += forecastedMrr;
      totalChurn += s.churn * (s.mrr / totalCurrentMrr);
      totalCustomers += s.signups; // Simplified
      
      return { ...s, forecastedMrr };
    });

    const arrRunRate = totalForecastedMrr * 12;
    const nrr = (((totalCurrentMrr + (totalCurrentMrr * 0.15) - (totalCurrentMrr * 0.04)) / totalCurrentMrr) * 100) * scenarioMultiplier; // Simplified NRR Logic

    return {
      kpis: {
        currentMrr: formatCurrency(totalCurrentMrr),
        forecastedMrr: formatCurrency(totalForecastedMrr),
        arrRunRate: formatCurrency(arrRunRate),
        avgChurnRate: `${totalChurn.toFixed(1)}%`,
        nrr: `${nrr.toFixed(0)}%`,
      },
      calculatedSegments: finalCalculatedSegments,
      lineChartData: {
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            { label: 'Forecasted MRR', data: [84.6, 86.7, 89.5, 92.3, 95.1, 98.2].map(v => v*100000*scenarioMultiplier), type: 'line', borderColor: '#0ea5e9', tension: 0.3, fill: true, yAxisID: 'y', backgroundColor: 'rgba(14, 165, 233, 0.1)' },
            { label: 'NRR', data: [121, 120, 122, 123, 121, 124].map(v=>v*scenarioMultiplier), type: 'line', borderColor: '#6366f1', yAxisID: 'y1', borderDash: [5, 5] },
          ]
      }
    };
  }, [scenario, segments]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Subscription & Recurring Revenue Budgeting</h1><p className="text-slate-500">Align budgets with recurring income streams using AI-powered forecasting and scenario analysis.</p></div>
        <div className="flex items-center gap-2 text-sm"><span className="font-semibold text-slate-600">Scenario:</span><select value={scenario} onChange={(e) => setScenario(e.target.value)} className="bg-white border border-slate-300 rounded-md px-3 py-1.5 font-medium"><option>Base</option><option>High Churn</option><option>Expansion Heavy</option></select></div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard title="Current MRR" value={kpis.currentMrr} />
        <KpiCard title="Forecasted MRR (Next Q)" value={kpis.forecastedMrr} />
        <KpiCard title="ARR Run Rate" value={kpis.arrRunRate} />
        <KpiCard title="Avg. Churn Rate" value={kpis.avgChurnRate} />
        <KpiCard title="Net Revenue Retention" value={kpis.nrr} change={parseFloat(kpis.nrr) > 100 ? '+ Healthy Growth' : '- Contraction'} isPositive={parseFloat(kpis.nrr) > 100}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BsGraphUp/> Forecasting Timeline View</h3>
            <div className="h-80"><Line options={{responsive: true, maintainAspectRatio: false, scales: {y: {title:{display:true, text:'MRR Value'}, ticks: {callback: v => formatCurrency(v)}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title:{display:true, text:'NRR %'}, ticks:{callback:v=>`${v}%`}}}}} data={lineChartData} /></div>
        </div>
        <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-500 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><BsStars className="text-indigo-500"/> AI Budgeting Insights</h3>
            <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-2"><BsArrowUp className="text-green-500 mt-1"/><span><span className="font-bold">Upsell Opportunity:</span> Enterprise segment shows a high upsell % (18%). Recommend allocating <span className="font-semibold text-slate-800">+₹3L</span> to the CX team for targeted add-on campaigns.</span></li>
                <li className="flex items-start gap-2"><BsArrowDown className="text-red-500 mt-1"/><span><span className="font-bold">Churn Risk:</span> SMB SaaS churn (8.2%) is high. Suggest moving <span className="font-semibold text-slate-800">₹2L</span> from top-of-funnel marketing to retention programs for this segment.</span></li>
            </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 p-4 border-b border-slate-200 flex items-center gap-2"><BsPencil /> AI Forecast vs. Editable Driver Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-4 py-2 text-left w-[20%]">Segment</th><th className="px-4 py-2 text-right">Current MRR</th><th className="px-4 py-2 text-right">New Signups/mo</th><th className="px-4 py-2 text-right">Churn %</th><th className="px-4 py-2 text-right">Upsell %</th><th className="px-4 py-2 text-right">Contraction %</th><th className="px-4 py-2 text-right">Forecasted MRR</th><th className="px-4 py-2 text-center">AI Confidence</th></tr></thead>
            <tbody>
              {calculatedSegments.map(s => (
                <tr key={s.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{s.segment} ({s.plan})</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{formatCurrency(s.mrr)}</td>
                  <td className="px-4 py-3"><input type="number" value={s.signups} onChange={e => handleDriverChange(s.id, 'signups', e.target.value)} className="w-20 text-right font-mono bg-white rounded p-1 border border-slate-200"/></td>
                  <td className="px-4 py-3"><input type="number" step="0.1" value={s.churn} onChange={e => handleDriverChange(s.id, 'churn', e.target.value)} className="w-20 text-right font-mono bg-white rounded p-1 border border-slate-200"/></td>
                  <td className="px-4 py-3"><input type="number" step="0.1" value={s.upsell} onChange={e => handleDriverChange(s.id, 'upsell', e.target.value)} className="w-20 text-right font-mono bg-white rounded p-1 border border-slate-200"/></td>
                  <td className="px-4 py-3"><input type="number" step="0.1" value={s.contraction} onChange={e => handleDriverChange(s.id, 'contraction', e.target.value)} className="w-20 text-right font-mono bg-white rounded p-1 border border-slate-200"/></td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 bg-sky-50/50">{formatCurrency(s.forecastedMrr)}</td>
                  <td className="px-4 py-3 text-center font-semibold text-indigo-600">{s.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BsTable/> Customer Plan Mix Analysis</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50"><tr><th className="px-3 py-2 text-left">Plan Name</th><th className="px-3 py-2 text-right">MRR</th><th className="px-3 py-2 text-right">Customers</th><th className="px-3 py-2 text-left">AI Suggestion</th></tr></thead>
                    <tbody>{planMixData.map(p => (<tr key={p.name} className="border-b border-slate-100"><td className="px-3 py-2 font-medium text-slate-700">{p.name}</td><td className="px-3 py-2 text-right font-mono">{formatCurrency(p.mrr)}</td><td className="px-3 py-2 text-right font-mono">{p.customers}</td><td className="px-3 py-2 text-xs text-slate-600">{p.suggestion}</td></tr>))}</tbody>
                </table>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><BsShieldCheck/> Upsell & Expansion Opportunities</h3>
                <ul className="space-y-4">{expansionOpportunities.map((op, i) => (<div key={i}><p className="font-semibold text-slate-800">{op.segment} - {op.product}</p><div className="flex justify-between items-center"><p className="text-sm text-green-600 font-bold">~{formatCurrency(op.potential)} Potential</p><button className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded font-semibold">Assign Action</button></div><p className="text-xs text-slate-500 mt-1">{op.action}</p></div>))}</ul>
            </div>
       </div>
    </div>
  );
};

export default SubscriptionRevenueBudgeting;