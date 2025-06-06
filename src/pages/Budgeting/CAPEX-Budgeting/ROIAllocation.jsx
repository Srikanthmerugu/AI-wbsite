// src/pages/Budgeting/ROIBasedCapexAllocation/ROIBasedCapexAllocation.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiFilter,
  FiDownload,
  FiInfo,
  FiCheck,
  FiX
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// --- Data Model reflecting financial rigor ---
// FIX 1: Added 'growth' and 'conservative' scenarios to the data object.
const initialProjectsData = {
  base: {
    availableCapital: 5000000,
    projects: [
      { id: 1, name: 'Automated Warehouse Logistics System', cost: 1200000, annualReturn: 350000, usefulLife: 7, status: 'Funded', aiConfidence: 90, aiInsight: "High confidence based on 12 similar logistics rollouts in the industry. ROI is stable." },
      { id: 2, name: 'CRM Platform Overhaul (Project Salesforce)', cost: 850000, annualReturn: 280000, usefulLife: 5, status: 'Funded', aiConfidence: 85, aiInsight: "Adoption rate is the key variable. AI models 20% variance in return based on training effectiveness." },
      { id: 3, name: 'R&D Initiative: Graphene Batteries', cost: 2500000, annualReturn: 600000, usefulLife: 10, status: 'Funded', aiConfidence: 65, aiInsight: "High-risk, high-reward. Payback period is long, but breakthrough potential is significant. Market data is sparse." },
      { id: 4, name: 'Employee Wellness & Training Platform', cost: 400000, annualReturn: 90000, usefulLife: 3, status: 'Proposed', aiConfidence: 75, aiInsight: "ROI based on projected reduction in employee turnover. Data shows a strong correlation." },
      { id: 5, name: 'Manufacturing Line Upgrade - Plant B', cost: 1800000, annualReturn: 400000, usefulLife: 10, status: 'Proposed', aiConfidence: 95, aiInsight: "Proven technology with predictable efficiency gains. Very low risk profile." },
      { id: 6, name: 'Company-wide Laptop Refresh', cost: 750000, annualReturn: 150000, usefulLife: 4, status: 'Deferred', aiConfidence: 80, aiInsight: "Return based on productivity gains. Can be deferred if budget is constrained." },
    ]
  },
  growth: {
    availableCapital: 7500000,
    projects: [
      // All base projects are funded in growth scenario
      { id: 1, name: 'Automated Warehouse Logistics System', cost: 1200000, annualReturn: 350000, usefulLife: 7, status: 'Funded', aiConfidence: 90, aiInsight: "High confidence based on 12 similar logistics rollouts in the industry. ROI is stable." },
      { id: 2, name: 'CRM Platform Overhaul (Project Salesforce)', cost: 850000, annualReturn: 280000, usefulLife: 5, status: 'Funded', aiConfidence: 85, aiInsight: "Adoption rate is the key variable. AI models 20% variance in return based on training effectiveness." },
      { id: 3, name: 'R&D Initiative: Graphene Batteries', cost: 2500000, annualReturn: 600000, usefulLife: 10, status: 'Funded', aiConfidence: 65, aiInsight: "High-risk, high-reward. Payback period is long, but breakthrough potential is significant. Market data is sparse." },
      { id: 4, name: 'Employee Wellness & Training Platform', cost: 400000, annualReturn: 90000, usefulLife: 3, status: 'Funded', aiConfidence: 75, aiInsight: "ROI based on projected reduction in employee turnover. Data shows a strong correlation." },
      { id: 5, name: 'Manufacturing Line Upgrade - Plant B', cost: 1800000, annualReturn: 400000, usefulLife: 10, status: 'Funded', aiConfidence: 95, aiInsight: "Proven technology with predictable efficiency gains. Very low risk profile." },
      { id: 7, name: 'New EU Sales Office', cost: 1500000, annualReturn: 450000, usefulLife: 10, status: 'Proposed', aiConfidence: 70, aiInsight: "Market entry risk is high, but TAM is significant."}
    ]
  },
  conservative: {
    availableCapital: 3000000,
    projects: [
        { id: 1, name: 'Automated Warehouse Logistics System', cost: 1200000, annualReturn: 350000, usefulLife: 7, status: 'Funded', aiConfidence: 90, aiInsight: "High confidence based on 12 similar logistics rollouts in the industry. ROI is stable." },
        { id: 2, name: 'CRM Platform Overhaul (Project Salesforce)', cost: 850000, annualReturn: 280000, usefulLife: 5, status: 'Funded', aiConfidence: 85, aiInsight: "Adoption rate is the key variable. AI models 20% variance in return based on training effectiveness." },
        { id: 3, name: 'R&D Initiative: Graphene Batteries', cost: 2500000, annualReturn: 600000, usefulLife: 10, status: 'Deferred', aiConfidence: 65, aiInsight: "High-risk, high-reward. Payback period is long, but breakthrough potential is significant. Market data is sparse." },
        { id: 5, name: 'Manufacturing Line Upgrade - Plant B', cost: 1800000, annualReturn: 400000, usefulLife: 10, status: 'Proposed', aiConfidence: 95, aiInsight: "Proven technology with predictable efficiency gains. Very low risk profile." },
        { id: 6, name: 'Company-wide Laptop Refresh', cost: 750000, annualReturn: 150000, usefulLife: 4, status: 'Deferred', aiConfidence: 80, aiInsight: "Return based on productivity gains. Can be deferred if budget is constrained." },
    ]
  }
};


// --- Financial Calculation Utilities ---
const calculateMetrics = (project) => {
  const roi = (project.annualReturn / project.cost) * 100;
  const paybackPeriod = project.cost / project.annualReturn;
  const discountRate = 0.08;
  const npv = Array.from({ length: project.usefulLife }).reduce((acc, _, i) => {
    return acc + (project.annualReturn / Math.pow(1 + discountRate, i + 1));
  }, 0) - project.cost;
  return { ...project, roi, paybackPeriod, npv };
};

const ConfidenceMeter = ({ value }) => {
    const getBarColor = () => {
        if (value >= 85) return "bg-green-500";
        if (value >= 70) return "bg-yellow-500";
        return "bg-red-500";
    };
    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5" data-tooltip-id="details-tooltip" data-tooltip-content={`AI Confidence: ${value}%`}>
            <div className={`${getBarColor()} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    );
};


const ROIBasedCapexAllocation = () => {
  const [scenario, setScenario] = useState("base");
  
  // FIX 2: Initialize projects state, but it will be updated by useEffect.
  const [projects, setProjects] = useState([]);
  
  // FIX 3: Use useEffect to update projects when the scenario changes.
  useEffect(() => {
    // Provide a fallback to prevent errors if a scenario is ever missing
    const currentScenarioData = initialProjectsData[scenario] || { projects: [] };
    setProjects(currentScenarioData.projects.map(calculateMetrics));
  }, [scenario]); // This hook re-runs whenever 'scenario' changes

  // Use a fallback here as well for robustness
  const { availableCapital } = initialProjectsData[scenario] || { availableCapital: 0 };

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.roi - a.roi);
  }, [projects]);
  
  const fundedProjects = useMemo(() => projects.filter(p => p.status === 'Funded'), [projects]);
  const allocatedCapital = useMemo(() => fundedProjects.reduce((sum, p) => sum + p.cost, 0), [fundedProjects]);
  const remainingCapital = useMemo(() => availableCapital - allocatedCapital, [availableCapital, allocatedCapital]);

  const blendedROI = useMemo(() => {
    if (allocatedCapital === 0) return 0;
    const totalAnnualReturn = fundedProjects.reduce((sum, p) => sum + p.annualReturn, 0);
    return (totalAnnualReturn / allocatedCapital) * 100;
  }, [fundedProjects, allocatedCapital]);

  const handleStatusChange = (id, newStatus) => {
    setProjects(prevProjects => prevProjects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };
  
  const chartData = {
    datasets: projects.map(p => ({
      label: p.name,
      data: [{ x: p.cost, y: p.roi, r: Math.sqrt(p.npv > 0 ? p.npv : 0) / 1000 }], // Bubble size by NPV
      backgroundColor: p.status === 'Funded' ? 'rgba(59, 130, 246, 0.7)' : p.status === 'Proposed' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(239, 68, 68, 0.7)',
      borderColor: p.status === 'Funded' ? 'rgba(59, 130, 246, 1)' : p.status === 'Proposed' ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)',
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'One-Time Cost ($)' }, ticks: { callback: value => `$${(value/1000000).toFixed(1)}M` } }, y: { title: { display: true, text: 'Projected ROI (%)' }, ticks: { callback: value => `${value.toFixed(0)}%` } } },
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => {
      const project = projects.find(p => p.name === context.dataset.label);
      if (!project) return '';
      return `${project.name}: ROI ${project.roi.toFixed(1)}%, Cost $${project.cost.toLocaleString()}`;
    }}}}
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50">
      {/* --- Page Header & Controls --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ROI-Based Capital Allocation</h1>
          <p className="text-sm text-gray-500 mt-1">Prioritize capital projects to maximize portfolio return.</p>
        </div>
        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <select value={scenario} onChange={e => setScenario(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm">
            <option value="base">Base Scenario</option>
            <option value="growth">Growth Scenario</option>
            <option value="conservative">Conservative Case</option>
          </select>
          <button className="flex items-center text-gray-600 hover:text-sky-700"><FiDownload className="mr-1.5" /> Export View</button>
        </div>
      </div>

      {/* --- Financial Summary KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><div className="flex items-center text-sm font-semibold text-gray-700 mb-2"><FiTarget className="mr-2 text-blue-500"/>Available Capital</div><p className="text-3xl font-bold text-gray-800">${availableCapital.toLocaleString()}</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><div className="flex items-center text-sm font-semibold text-gray-700 mb-2"><FiDollarSign className="mr-2 text-green-500"/>Allocated Capital</div><p className="text-3xl font-bold text-green-700">${allocatedCapital.toLocaleString()}</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><div className="flex items-center text-sm font-semibold text-gray-700 mb-2"><FiTrendingUp className="mr-2 text-purple-500"/>Blended Portfolio ROI</div><p className="text-3xl font-bold text-purple-700">{blendedROI.toFixed(1)}%</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><div className="flex items-center text-sm font-semibold text-gray-700 mb-2"><FiInfo className="mr-2 text-yellow-500"/>Remaining Capital</div><p className={`text-3xl font-bold ${remainingCapital < 0 ? 'text-red-600' : 'text-yellow-700'}`}>${remainingCapital.toLocaleString()}</p></div>
      </div>
      
      {/* --- Main Content: Chart and Table --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Project Prioritization List */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border overflow-hidden">
          <h3 className="p-4 text-lg font-semibold text-gray-800 border-b">Project Ranking by ROI</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">ROI</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">AI Confidence</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProjects.map(p => (
                  <tr key={p.id} className={p.status === 'Funded' ? 'bg-green-50/50' : p.status === 'Deferred' ? 'bg-red-50/50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-4"><div className="font-medium text-sm text-gray-900">{p.name}</div><div className="text-xs text-gray-500">Payback: {p.paybackPeriod.toFixed(1)} yrs / NPV: ${p.npv.toLocaleString(undefined, {maximumFractionDigits:0})}</div></td>
                    <td className="px-4 py-4 text-right font-semibold text-sm text-green-600">{p.roi.toFixed(1)}%</td>
                    <td className="px-4 py-4 text-right text-sm font-mono">${p.cost.toLocaleString()}</td>
                    <td className="px-4 py-4"><ConfidenceMeter value={p.aiConfidence} /></td>
                    <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handleStatusChange(p.id, 'Funded')} className={`p-1.5 rounded-full ${p.status === 'Funded' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-green-200'}`} data-tooltip-id="details-tooltip" data-tooltip-content="Fund Project"><FiCheck/></button>
                          <button onClick={() => handleStatusChange(p.id, 'Deferred')} className={`p-1.5 rounded-full ${p.status === 'Deferred' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-red-200'}`} data-tooltip-id="details-tooltip" data-tooltip-content="Defer Project"><FiX/></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Visual Portfolio Analysis */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Portfolio Visualization</h3>
          <p className="text-xs text-gray-500 mb-4">Size of bubble indicates Net Present Value (NPV). Colors indicate status (Blue: Funded, Yellow: Proposed, Red: Deferred).</p>
          <div className="h-96">
            <Bubble data={chartData} options={chartOptions} />
          </div>
           <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-sm text-purple-800 flex items-center mb-2"><BsStars className="mr-2"/>AI Strategic Insight</h4>
                <p className="text-xs text-purple-900">
                    Your current 'Funded' portfolio has a strong blended ROI of {blendedROI.toFixed(1)}%. Consider swapping the 'R&D Initiative' for the 'Manufacturing Line Upgrade' to increase short-term payback and reduce overall risk, while maintaining a similar capital outlay.
                </p>
           </div>
        </div>
      </div>
      
      <ReactTooltip id="details-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default ROIBasedCapexAllocation;