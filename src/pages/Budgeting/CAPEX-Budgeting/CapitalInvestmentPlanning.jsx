// src/pages/Budgeting/CapitalInvestmentPlanning/CapitalInvestmentPlanning.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiDownload,
  FiMessageSquare,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiInfo,
  FiChevronDown,
  FiChevronRight,
  FiClipboard,
  FiUser
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

// --- Helper Hook for Outside Click ---
const useOutsideClick = (callback) => {
  const ref = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback, ref]);
  return ref;
};

// --- Enhanced Data Model with Financial & AI Insights ---
const initialCapexData = {
  base: [
    { 
      id: 1, 
      assetDescription: 'Next-Gen Server Fleet Upgrade',
      owner: 'IT Department',
      priority: 'High', // High, Medium, Low
      status: 'Approved', // Draft, Pending Review, Approved, Deferred
      oneTimeCost: 750000, 
      usefulLife: 5, 
      purchaseMonth: 4, 
      roi: 22, // %
      risk: 'Medium', // Low, Medium, High
      justification: 'Critical upgrade to support projected 50% user growth and prevent system outages. Existing hardware is reaching end-of-life.', 
      comments: [{ user: 'Sarah (IT)', text: 'Initial quote from Dell is competitive. Awaiting final numbers from HP.' }],
      aiInsight: {
          baselineCost: 720000,
          suggestion: "Consider a 3-month lease-to-own pilot for 20% of the fleet to validate performance before full commitment.",
          reasoning: "Similar tech rollouts in the SaaS industry show a 15% risk of compatibility issues with legacy software."
      }
    },
    { 
      id: 2, 
      assetDescription: 'New York Office Expansion (Floors 3-4)',
      owner: 'Facilities',
      priority: 'High',
      status: 'Pending Review',
      oneTimeCost: 2200000, 
      usefulLife: 15, 
      purchaseMonth: 7, 
      roi: 15,
      risk: 'Medium',
      justification: 'Required to accommodate new sales and marketing hires as per the approved headcount plan. Supports revenue growth targets.', 
      comments: [],
      aiInsight: {
          baselineCost: 2500000,
          suggestion: "AI model predicts a 12% probability of project delays due to Q3 construction labor shortages in the NYC area.",
          reasoning: "Analysis of regional construction data and permit approval timelines."
      }
    },
    { 
      id: 3, 
      assetDescription: 'Quantum Computing Research Lab Setup',
      owner: 'R&D',
      priority: 'Medium',
      status: 'Draft',
      oneTimeCost: 1500000, 
      usefulLife: 7, 
      purchaseMonth: 2, 
      roi: 8, // Lower ROI for strategic/research projects is common
      risk: 'High',
      justification: 'Strategic R&D investment to build long-term competitive advantage. No immediate revenue impact expected.', 
      comments: [],
      aiInsight: {
          baselineCost: 1450000,
          suggestion: "Partnering with a university could reduce initial outlay by 30% through shared facility costs.",
          reasoning: "Benchmarking against 5 other corporate R&D lab setups in the last 2 years shows a trend towards academic partnerships."
      }
    },
  ],
  // ... other scenarios can be defined here with the same rich structure
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'bg-green-100 text-green-800 ring-green-600/20',
    'Pending Review': 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    'Draft': 'bg-gray-100 text-gray-700 ring-gray-500/10',
    'Deferred': 'bg-red-100 text-red-800 ring-red-600/10',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${styles[status]}`}>{status}</span>;
};

const PriorityFlag = ({ priority }) => {
    const colors = {
        'High': 'text-red-500',
        'Medium': 'text-yellow-500',
        'Low': 'text-gray-400'
    }
    return <span className={`${colors[priority]} font-bold`} data-tooltip-id="finance-tooltip" data-tooltip-content={`${priority} Priority`}>!</span>
}

const CapitalInvestmentPlanning = () => {
  const [activeTab, setActiveTab] = useState("CapEx");
  const [scenario, setScenario] = useState("base");
  const [capexData, setCapexData] = useState(initialCapexData.base);
  const [expandedRows, setExpandedRows] = useState({});

  const handleToggleExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDataChange = (id, field, value) => {
    setCapexData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const totalCapex = useMemo(() => capexData.reduce((sum, item) => sum + Number(item.oneTimeCost), 0), [capexData]);
  const pnlImpactY1 = useMemo(() => capexData.reduce((sum, item) => {
      const monthlyDepreciation = item.oneTimeCost / (item.usefulLife * 12);
      const monthsInService = 12 - item.purchaseMonth;
      return sum + (monthlyDepreciation * (monthsInService > 0 ? monthsInService : 0));
  }, 0), [capexData]);

  return (
    <div className="space-y-6 p-6 min-h-screen bg-sky-50/50">
      {/* --- Page Header & Versioning --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">Capital Investment Plan</h1>
          <p className="text-sm text-gray-500 mt-1">Strategic asset planning for {scenario.replace('_',' ')} Scenario</p>
        </div>
        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <div className="text-xs text-right text-gray-500">
            {/* <div className="font-mono">Last Saved: {new Date().toLocaleTimeString()}</div> */}
          </div>
          {/* <button className="flex items-center py-2 px-4 text-xs font-medium text-white bg-sky-600 rounded-lg shadow-sm hover:bg-sky-700 transition-colors">
            <FiCheckCircle className="mr-2" /> Submit for Approval
          </button> */}
        </div>
      </div>
      
      {/* --- Navigation & High-Level Controls --- */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
          {/* {['Revenue', 'COGS', 'Opex', 'CapEx', 'Headcount'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${activeTab === tab ? 'bg-white text-sky-700 shadow-sm ring-1 ring-inset ring-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}>{tab}</button>
          ))} */}
        </div>
        <div className="flex items-center space-x-4">
            <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-white">
                <option value="base">Base Scenario</option>
                <option value="stretch">Growth Scenario</option>
                <option value="worst_case">Conservative Case</option>
            </select>
            <button className="flex items-center text-gray-600 hover:text-sky-700"><FiDownload className="mr-1.5" /> Export</button>
        </div>
      </div>

      {/* --- Financial Summary KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100"><div className="flex items-center text-sm font-semibold text-sky-800 mb-2"><FiDollarSign className="mr-2"/>Total Capital Outlay</div><p className="text-3xl font-bold text-sky-900">${totalCapex.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">Total planned spend for this scenario.</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100"><div className="flex items-center text-sm font-semibold text-sky-800 mb-2"><FiTrendingUp className="mr-2"/>Est. P&L Impact (Y1)</div><p className="text-3xl font-bold text-sky-900">${pnlImpactY1.toLocaleString(undefined, {maximumFractionDigits: 0})}</p><p className="text-xs text-gray-500 mt-1">Depreciation expense hitting the income statement in year one.</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100"><div className="flex items-center text-sm font-semibold text-sky-800 mb-2"><FiClipboard className="mr-2"/>Total Projects</div><p className="text-3xl font-bold text-sky-900">{capexData.length}</p><p className="text-xs text-gray-500 mt-1">{capexData.filter(i => i.status === 'Approved').length} Approved, {capexData.filter(i => i.status === 'Pending Review').length} Pending.</p></div>
      </div>
      
      {/* --- Main CAPEX Table with Expandable Rows --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50/70 border-b border-gray-200">
            <tr>
              <th scope="col" className="w-10"></th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset / Project</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Cost</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center justify-end"><BsStars className="text-purple-500 mr-1.5"/>AI Projected ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {capexData.map(item => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-sky-50 cursor-pointer" onClick={() => handleToggleExpand(item.id)}>
                  <td className="pl-4"><PriorityFlag priority={item.priority} /></td>
                  <td className="px-4 py-4"><div className="font-semibold text-sm text-gray-800">{item.assetDescription}</div></td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.owner}</td>
                  <td className="px-4 py-4 text-center"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4 text-right font-mono text-sm">${Number(item.oneTimeCost).toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono text-sm text-purple-700 font-semibold">{item.roi}%</td>
                </tr>
                <AnimatePresence>
                  {expandedRows[item.id] && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan="6" className="p-0">
                        <div className="bg-sky-50/50 p-5 grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-sky-200">
                           {/* Column 1: Financial Inputs */}
                           <div className="space-y-4">
                               <h4 className="font-semibold text-sm text-sky-800">Financial Details</h4>
                               <div><label className="text-xs text-gray-500">One-Time Cost ($)</label><input type="number" value={item.oneTimeCost} onChange={e => handleDataChange(item.id, 'oneTimeCost', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"/></div>
                               <div><label className="text-xs text-gray-500">Useful Life (Years)</label><input type="number" value={item.usefulLife} onChange={e => handleDataChange(item.id, 'usefulLife', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"/></div>
                               <div><label className="text-xs text-gray-500">Purchase Month</label><input type="month" defaultValue={`2024-${String(item.purchaseMonth).padStart(2,'0')}`} onChange={e => handleDataChange(item.id, 'purchaseMonth', new Date(e.target.value).getMonth() + 1)} className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"/></div>
                               <div className="bg-white p-3 rounded-md border border-gray-200"><h5 className="text-xs text-gray-500">Calculated Monthly Depreciation</h5><p className="font-semibold text-sky-900 mt-1">${(item.oneTimeCost / (item.usefulLife * 12)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p></div>
                           </div>
                           {/* Column 2: AI Insights */}
                           <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                               <h4 className="font-semibold text-sm text-purple-800 flex items-center mb-3"><BsStars className="mr-2"/>AI Insights & Analysis</h4>
                               <div className="text-sm space-y-3">
                                   <div className="flex justify-between items-baseline">
                                       <span className="text-xs text-purple-700">AI Cost Baseline:</span>
                                       <span className="font-semibold">${item.aiInsight.baselineCost.toLocaleString()}</span>
                                   </div>
                                    <div className="flex justify-between items-baseline">
                                       <span className="text-xs text-purple-700">Variance:</span>
                                       <span className={`font-semibold ${item.oneTimeCost > item.aiInsight.baselineCost ? 'text-red-600' : 'text-green-600'}`}>${(item.oneTimeCost - item.aiInsight.baselineCost).toLocaleString()}</span>
                                   </div>
                                   <div className="bg-white/70 p-3 rounded-md mt-2">
                                        <p className="text-xs font-semibold text-purple-900 flex items-center"><FiInfo className="mr-2"/>Suggestion:</p>
                                        <p className="text-xs text-gray-700 mt-1">{item.aiInsight.suggestion}</p>
                                   </div>
                               </div>
                           </div>
                           {/* Column 3: Justification & Comments */}
                           <div className="space-y-4">
                                <h4 className="font-semibold text-sm text-sky-800">Justification & Collaboration</h4>
                                <div className="bg-white p-3 rounded-md border border-gray-200 text-xs text-gray-700 h-24 overflow-y-auto">{item.justification}</div>
                                <div>
                                    <h5 className="text-xs text-gray-500 mb-2">Comments ({item.comments.length})</h5>
                                    <div className="space-y-2 max-h-24 overflow-y-auto">
                                        {item.comments.map((c, i) => <div key={i} className="text-xs bg-gray-100 p-2 rounded-md"><span className="font-semibold text-gray-800">{c.user}:</span> {c.text}</div>)}
                                    </div>
                                </div>
                           </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50/70 border-t border-gray-200">
            <button className="flex items-center text-sm text-sky-600 font-medium hover:text-sky-800"><FiPlus className="mr-1.5" /> Add New Investment</button>
        </div>
      </div>
      
      <ReactTooltip id="finance-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default CapitalInvestmentPlanning;