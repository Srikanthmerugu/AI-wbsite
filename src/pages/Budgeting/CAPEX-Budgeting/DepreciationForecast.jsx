// src/pages/Budgeting/DepreciationAmortizationForecast.jsx
import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCalendar, FiDownload, FiPlusCircle, FiBarChart2, FiTrendingDown, FiInfo, FiTag } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- Data Structure ---
const baseAssets = [
  { id: 1, name: 'Manufacturing Equipment A', category: 'Machinery', type: 'Tangible', purchaseDate: '2023-06-15', cost: 450000, usefulLife: 10 },
  { id: 2, name: 'Office Building East', category: 'Real Estate', type: 'Tangible', purchaseDate: '2020-02-10', cost: 2500000, usefulLife: 39 },
  { id: 3, name: 'Company Software License', category: 'Software', type: 'Intangible', purchaseDate: '2022-11-30', cost: 180000, usefulLife: 3 },
  { id: 4, name: 'Delivery Trucks (5 units)', category: 'Vehicles', type: 'Tangible', purchaseDate: '2021-08-20', cost: 320000, usefulLife: 7 },
  { id: 5, name: 'Acquired Brand Name', category: 'Goodwill', type: 'Intangible', purchaseDate: '2019-05-12', cost: 750000, usefulLife: 10 },
  { id: 6, name: 'Server Hardware', category: 'IT Equipment', type: 'Tangible', purchaseDate: '2022-03-15', cost: 210000, usefulLife: 5 },
];

const scenarioAssetData = {
  base: { assets: baseAssets },
  growth: {
    assets: [
      ...baseAssets,
      { id: 7, name: 'NEW: West Coast Sales Office', category: 'Real Estate', type: 'Tangible', purchaseDate: '2024-10-01', cost: 3500000, usefulLife: 20 },
      { id: 8, name: 'NEW: CRM Platform License', category: 'Software', type: 'Intangible', purchaseDate: '2024-07-01', cost: 850000, usefulLife: 5 },
    ]
  },
  conservative: { assets: baseAssets.filter(asset => [1, 2, 3, 6].includes(asset.id)) }
};

const currentYear = new Date().getFullYear();

// --- Main Forecast Calculation Engine ---
const calculateForecastData = (assets) => {
  const data = assets.map(asset => {
    const yearlyExpense = asset.cost / asset.usefulLife;
    const purchaseYear = new Date(asset.purchaseDate).getFullYear();
    const age = currentYear - purchaseYear;
    const accumulatedExpense = Math.max(0, Math.min(age * yearlyExpense, asset.cost));
    const currentBookValue = asset.cost - accumulatedExpense;
    const remainingLife = Math.max(0, asset.usefulLife - age);
    return { ...asset, yearlyExpense, currentBookValue, remainingLife };
  });
  return data;
};

// --- Reusable UI Components ---
const KpiCard = ({ title, value, icon, description }) => (
  <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
    <div className="flex items-center justify-between text-sky-800 mb-1">
      <span className="font-medium text-sm">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-sky-900">{value}</div>
    <div className="text-xs text-sky-600 mt-1">{description}</div>
  </div>
);

const AssetCard = ({ asset }) => {
  const isWarning = asset.remainingLife <= 2;
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border ${isWarning ? 'border-amber-300' : 'border-sky-100'} hover:border-sky-300 transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-sky-900">{asset.name}</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${asset.type === 'Intangible' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{asset.type}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><div className="text-sky-600">Initial Cost</div><div className="font-medium">${asset.cost.toLocaleString()}</div></div>
        <div><div className="text-sky-600">Current Value</div><div className="font-medium">${asset.currentBookValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
        <div><div className="text-sky-600">Annual Expense</div><div className="font-medium">${asset.yearlyExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
        <div><div className="text-sky-600">Remaining Life</div><div className={`font-medium ${isWarning ? 'text-amber-600' : 'text-green-600'}`}>{asset.remainingLife.toFixed(1)} yrs</div></div>
      </div>
      {isWarning && asset.remainingLife > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-100 text-amber-600 flex items-center text-xs">
              <FiInfo className="mr-1.5" /> This asset is nearing the end of its useful life. Plan for replacement or renewal.
          </div>
      )}
    </div>
  );
};

export const DepreciationAmortizationForecast = () => {
  const [scenario, setScenario] = useState('base');
  const [activeTab, setActiveTab] = useState('all');
  const [showNewAssetForm, setShowNewAssetForm] = useState(false);

  // --- Dynamic Data Calculation ---
  const allAssets = useMemo(() => calculateForecastData(scenarioAssetData[scenario].assets), [scenario]);
  
  const filteredAssets = useMemo(() => {
    if (activeTab === 'all') return allAssets;
    return allAssets.filter(asset => asset.type.toLowerCase() === activeTab);
  }, [allAssets, activeTab]);
  
  const { totalNBV, totalDepreciation, totalAmortization } = useMemo(() => {
    return allAssets.reduce((acc, asset) => {
        acc.totalNBV += asset.currentBookValue;
        if(asset.remainingLife > 0) {
          if (asset.type === 'Tangible') acc.totalDepreciation += asset.yearlyExpense;
          else acc.totalAmortization += asset.yearlyExpense;
        }
        return acc;
    }, { totalNBV: 0, totalDepreciation: 0, totalAmortization: 0 });
  }, [allAssets]);

  const forecastChartData = useMemo(() => {
    const labels = Array.from({ length: 5 }, (_, i) => currentYear + i);
    const datasets = { depreciation: Array(5).fill(0), amortization: Array(5).fill(0) };

    allAssets.forEach(asset => {
        for (let i = 0; i < 5; i++) {
            if (asset.remainingLife > i) {
                if (asset.type === 'Tangible') datasets.depreciation[i] += asset.yearlyExpense;
                else datasets.amortization[i] += asset.yearlyExpense;
            }
        }
    });
    return {
        labels: labels.map(String),
        datasets: [
            { label: 'Depreciation', data: datasets.depreciation, backgroundColor: 'rgb(59, 130, 246)', stack: 'a' },
            { label: 'Amortization', data: datasets.amortization, backgroundColor: 'rgb(139, 92, 246)', stack: 'a' },
        ]
    };
  }, [allAssets]);


  return (
    <div className="space-y-6 p-6 min-h-screen bg-sky-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">Depreciation & Amortization Forecast</h1>
            <p className="text-sm text-gray-500 mt-1">Modeling the P&L and Balance Sheet impact of your asset base.</p>
          </div>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <select value={scenario} onChange={e => setScenario(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm">
                <option value="base">Base Scenario</option>
                <option value="growth">Growth Scenario</option>
                <option value="conservative">Conservative Case</option>
            </select>
          </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Current Net Book Value" value={`$${totalNBV.toLocaleString(undefined,{maximumFractionDigits:0})}`} icon={<FiTrendingDown/>} description="Total value on balance sheet" />
        <KpiCard title="Y1 Depreciation" value={`$${totalDepreciation.toLocaleString(undefined,{maximumFractionDigits:0})}`} icon={<FiBarChart2 className="text-blue-500"/>} description="Expense from tangible assets" />
        <KpiCard title="Y1 Amortization" value={`$${totalAmortization.toLocaleString(undefined,{maximumFractionDigits:0})}`} icon={<FiBarChart2 className="text-purple-500"/>} description="Expense from intangible assets" />
        <KpiCard title="Assets Modeled" value={allAssets.length} icon={<FiTag/>} description={`For ${scenario} scenario`} />
      </div>
      
      {/* Tabs & Controls */}
      <div className="flex border-b border-sky-200">
        {['all', 'tangible', 'intangible'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold capitalize transition-colors ${activeTab === tab ? 'text-sky-700 border-b-2 border-sky-600' : 'text-gray-500 hover:text-sky-600'}`}>
                {tab} Assets
            </button>
        ))}
        <button onClick={() => setShowNewAssetForm(true)} className="ml-auto flex items-center text-sm font-medium text-green-600 hover:text-green-700"><FiPlusCircle className="mr-2"/>Add Asset</button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
            {showNewAssetForm && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bg-white p-5 rounded-xl shadow-sm border border-green-200 mb-4 overflow-hidden">
                    <h3 className="text-lg font-semibold text-sky-900 mb-4">Add New Asset to Scenario</h3>
                    {/* Simplified form UI */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <input placeholder="Asset Name" className="p-2 border rounded-md"/>
                        <select className="p-2 border rounded-md"><option>Tangible</option><option>Intangible</option></select>
                        <input placeholder="Cost ($)" type="number" className="p-2 border rounded-md"/>
                        <input placeholder="Useful Life (Yrs)" type="number" className="p-2 border rounded-md"/>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setShowNewAssetForm(false)} className="text-sm text-gray-600">Cancel</button>
                        <button className="text-sm bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700">Add Asset</button>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
            {filteredAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
            {filteredAssets.length === 0 && <div className="text-center p-8 bg-white rounded-xl border">No assets match this filter.</div>}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">5-Year Expense Forecast</h3>
            <div className="h-64"><Bar data={forecastChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => `$${(v/1000).toFixed(0)}k` } } }, plugins: { legend: { display: true, position: 'bottom' }} }} /></div>
          </div>
          <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
             <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center"><BsStars className="mr-2"/>AI-Powered Insights</h3>
             <AnimatePresence mode="wait">
             <motion.div key={scenario} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-3 text-sm">
                {scenario === 'base' && <div className="bg-white/70 p-3 rounded-lg"><p className="font-medium text-purple-900">Amortization Cliff</p><p className="text-gray-700">Your amortization expense will drop significantly after Y3 as intangible assets are fully amortized. Plan for renewals to avoid P&L volatility.</p></div>}
                {scenario === 'growth' && <div className="bg-white/70 p-3 rounded-lg"><p className="font-medium text-purple-900">Higher Expense Base</p><p className="text-gray-700">The Growth scenario adds substantial depreciation and amortization, increasing your non-cash expenses. Ensure revenue forecasts justify this change.</p></div>}
                {scenario === 'conservative' && <div className="bg-white/70 p-3 rounded-lg"><p className="font-medium text-purple-900">Predictable Outlook</p><p className="text-gray-700">This scenario offers a stable and predictable expense forecast, but defers investments that might be needed for future growth.</p></div>}
             </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepreciationAmortizationForecast;