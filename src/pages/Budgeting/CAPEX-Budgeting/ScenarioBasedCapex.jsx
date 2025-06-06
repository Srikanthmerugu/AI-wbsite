// src/pages/Budgeting/ScenarioBasedCapexModeling.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiClock, FiDownload, FiBarChart2, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// --- Data Model ---
const initialProjectData = {
  base: [
    { id: 1, name: 'Next-Gen Server Fleet Upgrade', cost: 750000, usefulLife: 5, purchaseDate: '2024-04-15', status: 'Planned' },
    { id: 2, name: 'New York Office Expansion', cost: 2200000, usefulLife: 15, purchaseDate: '2024-07-01', status: 'Planned' },
    { id: 3, name: 'CNC Milling Machine', cost: 180000, usefulLife: 10, purchaseDate: '2024-09-20', status: 'Planned' },
  ],
  growth: [
    { id: 1, name: 'Next-Gen Server Fleet Upgrade', cost: 900000, usefulLife: 5, purchaseDate: '2024-02-10', status: 'Accelerated' },
    { id: 2, name: 'New York Office Expansion', cost: 2400000, usefulLife: 15, purchaseDate: '2024-06-01', status: 'Accelerated' },
    { id: 3, name: 'CNC Milling Machine', cost: 180000, usefulLife: 10, purchaseDate: '2024-08-15', status: 'Planned' },
    { id: 4, name: 'West Coast Satellite Office', cost: 3500000, usefulLife: 20, purchaseDate: '2024-10-05', status: 'New' },
  ],
  conservative: [
    { id: 1, name: 'Next-Gen Server Fleet Upgrade', cost: 700000, usefulLife: 5, purchaseDate: '2024-09-01', status: 'Delayed' },
    { id: 2, name: 'New York Office Expansion', cost: 2200000, usefulLife: 15, purchaseDate: '2025-02-01', status: 'Deferred' },
    { id: 3, name: 'CNC Milling Machine', cost: 0, usefulLife: 10, purchaseDate: '2024-09-20', status: 'Cancelled' },
  ]
};

const getQuarter = (date) => `Q${Math.floor(new Date(date).getMonth() / 3) + 1}`;

// --- Financial Impact Calculation Engine (No changes needed here) ---
const calculateFinancialImpact = (projects) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const impact = { cashFlow: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }, pnlImpact: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }, endingNBV: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 }};
    let cumulativeNBV = 0;
    quarters.forEach((q, qIndex) => {
        let pnlForQuarter = 0;
        projects.forEach(p => {
            const purchaseQuarterIndex = Math.floor(new Date(p.purchaseDate).getMonth() / 3);
            if (new Date(p.purchaseDate).getFullYear() === 2024) {
                 if (getQuarter(p.purchaseDate) === q) { impact.cashFlow[q] -= p.cost; cumulativeNBV += p.cost; }
                if (purchaseQuarterIndex <= qIndex) { const quarterlyDepreciation = p.cost / p.usefulLife / 4; pnlForQuarter += quarterlyDepreciation; }
            }
        });
        impact.pnlImpact[q] = pnlForQuarter;
        cumulativeNBV -= pnlForQuarter;
        impact.endingNBV[q] = cumulativeNBV;
    });
    return impact;
};

// --- Reusable UI Components (Upgraded) ---
const ImpactCard = ({ title, value, subValue, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-sky-100 text-sky-600">{icon}</div>
        <div>
            <div className="text-sm font-medium text-sky-700">{title}</div>
            <p className="text-2xl font-bold text-sky-900">{value}</p>
            <p className="text-xs text-gray-500">{subValue}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
      'Planned': 'bg-gray-100 text-gray-800 ring-gray-500/10',
      'Accelerated': 'bg-green-100 text-green-800 ring-green-600/20',
      'Delayed': 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
      'Deferred': 'bg-orange-100 text-orange-800 ring-orange-600/20',
      'Cancelled': 'bg-red-100 text-red-800 ring-red-600/20',
      'New': 'bg-blue-100 text-blue-800 ring-blue-600/20'
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${styles[status]}`}>{status}</span>;
  };

export const ScenarioBasedCapexModeling = () => {
  const [scenario, setScenario] = useState('base');
  const [projects, setProjects] = useState(initialProjectData.base);

  useEffect(() => { setProjects(initialProjectData[scenario]); }, [scenario]);

  const handleProjectChange = (id, field, value) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const financialImpact = useMemo(() => calculateFinancialImpact(projects), [projects]);
  const totalCapex = useMemo(() => projects.reduce((sum, p) => sum + Number(p.cost), 0), [projects]);
  const peakCashOutflow = Math.min(0, ...Object.values(financialImpact.cashFlow));
  const totalPnlImpact = Object.values(financialImpact.pnlImpact).reduce((sum, val) => sum + val, 0);

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const chartLabels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

  return (
    <div className="space-y-6 p-6 min-h-screen bg-sky-50/50">
      {/* Header */}
       <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-5 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Scenario-Based CAPEX Modeler</h1>
            <p className="text-sky-100 text-sm mt-1">Analyze the financial impact of accelerating or delaying investments.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select value={scenario} onChange={e => setScenario(e.target.value)} className="p-2 border border-sky-400 rounded-lg text-sm bg-white/20 text-white shadow-sm focus:ring-2 focus:ring-white">
              <option className="text-black" value="base">Base Scenario</option>
              <option className="text-black" value="growth">Growth Scenario</option>
              <option className="text-black" value="conservative">Conservative Case</option>
            </select>
            <button className="flex items-center py-2 px-4 text-xs font-medium text-white bg-sky-700 rounded-lg border border-sky-600 hover:bg-sky-600">
              <FiDownload className="mr-1.5" /> Export Analysis
            </button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ImpactCard title="Total CAPEX Spend" value={`$${(totalCapex/1000000).toFixed(1)}M`} subValue="Cash required for this scenario" icon={<FiDollarSign size={20}/>} />
        <ImpactCard title="Peak Quarterly Cash Outflow" value={`$${(peakCashOutflow/1000000).toFixed(1)}M`} subValue="Maximum cash needed in a quarter" icon={<FiAlertCircle size={20}/>} />
        <ImpactCard title="Total Year 1 P&L Impact" value={`$${(totalPnlImpact/1000).toFixed(0)}k`} subValue="Depreciation & Amortization" icon={<FiTrendingUp size={20}/>} />
      </div>

      {/* Project Modeling Cards */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live CAPEX Plan Modeler</h3>
        <div className="space-y-5">
            {projects.map(p => (
                <div key={p.id} className="flex flex-wrap md:flex-nowrap gap-4 items-center border-b border-gray-200 pb-5">
                    <div className="w-full md:w-1/4">
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <StatusBadge status={p.status} />
                    </div>
                     <div className="w-1/2 md:w-auto">
                        <label className="text-xs text-gray-500">Cost ($)</label>
                        <input type="number" value={p.cost} onChange={e => handleProjectChange(p.id, 'cost', Number(e.target.value))} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                     <div className="w-1/2 md:w-auto">
                        <label className="text-xs text-gray-500">Purchase Date</label>
                        <input type="date" value={p.purchaseDate} onChange={e => handleProjectChange(p.id, 'purchaseDate', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div className="w-full md:flex-grow bg-sky-50 p-3 rounded-lg border border-sky-200 text-xs text-sky-800 flex items-start">
                        <BsStars className="text-sky-600 mr-2.5 mt-0.5 flex-shrink-0" size={16}/>
                        <span>Delaying this to Q4 improves short-term cash flow by <span className="font-semibold">${(p.cost/1000).toFixed(0)}k</span> but defers potential ROI. Accelerating it does the reverse.</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Financial Impact Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><h3 className="text-md font-semibold text-gray-800 mb-4">Quarterly Cash Flow Impact</h3><div className="h-64"><Bar data={{ labels: chartLabels, datasets: [{ label: 'Cash Outflow', data: Object.values(financialImpact.cashFlow), backgroundColor: 'rgba(239, 68, 68, 0.8)' }]}} options={{...chartOptions, scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k`}}}}} /></div></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><h3 className="text-md font-semibold text-gray-800 mb-4">Quarterly P&L Impact (D&A)</h3><div className="h-64"><Bar data={{ labels: chartLabels, datasets: [{ label: 'P&L Expense', data: Object.values(financialImpact.pnlImpact), backgroundColor: 'rgba(139, 92, 246, 0.8)' }]}} options={{...chartOptions, scales: { y: { ticks: { callback: v => `$${(v/1000).toFixed(0)}k`}}}}} /></div></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><h3 className="text-md font-semibold text-gray-800 mb-4">Ending Net Book Value (NBV)</h3><div className="h-64"><Line data={{ labels: chartLabels, datasets: [{ label: 'NBV', data: Object.values(financialImpact.endingNBV), borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.2 }]}} options={{...chartOptions, scales: { y: { beginAtZero: true, ticks: { callback: v => `$${(v/1000000).toFixed(1)}M`}}}}} /></div></div>
      </div>

       {/* AI Summary Panel */}
       <div className="bg-gradient-to-r from-purple-50 to-sky-50 p-5 rounded-xl border border-purple-200">
             <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center"><BsStars className="mr-2"/>AI Scenario Analysis</h3>
             <AnimatePresence mode="wait">
             <motion.div key={scenario} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="bg-white/50 p-4 rounded-lg text-sm text-purple-900 leading-relaxed">
                {scenario === 'base' && 'The Base Scenario presents a balanced cash flow but concentrates spending in Q3. This is a moderate risk profile with steady P&L impact growth.'}
                {scenario === 'growth' && 'The Growth Scenario significantly accelerates cash burn, creating a large deficit in Q2 and Q4. This aggressive strategy builds the asset base faster but requires robust financing to manage the steep increase in D&A expense.'}
                {scenario === 'conservative' && 'The Conservative Case prioritizes cash preservation by deferring major projects. This minimizes 2024 cash outflow and P&L impact but risks falling behind on strategic initiatives and may incur higher costs later.'}
             </motion.div>
             </AnimatePresence>
        </div>
    </div>
  );
};

export default ScenarioBasedCapexModeling;