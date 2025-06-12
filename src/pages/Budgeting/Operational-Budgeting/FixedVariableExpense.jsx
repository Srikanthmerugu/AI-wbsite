import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { FiSave, FiUpload, FiDownload, FiPrinter, FiInfo, FiChevronRight} from "react-icons/fi";
import { BsFilter } from 'react-icons/bs';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const SCENARIOS = {
  BASELINE: "Baseline",
  COST_CONTROL: "Cost-Control",
  GROWTH_STRATEGY: "Growth Strategy",
};

const EXPENSE_TYPE = {
  FIXED: "Fixed",
  VARIABLE: "Variable",
};

// Mock data for expense planning
const initialExpenseData = [
  {
    department: "Operations", expenseCategory: "Office Rent",
    [SCENARIOS.BASELINE]:      { m1: 25000, m2: 25000, m3: 25000, aiType: EXPENSE_TYPE.FIXED, userType: EXPENSE_TYPE.FIXED, confidence: 99, justification: "Lease agreement for HQ.", aiInsight: "Recurring payment with no variance detected in 24 months." },
    [SCENARIOS.COST_CONTROL]:  { m1: 25000, m2: 25000, m3: 25000, aiType: EXPENSE_TYPE.FIXED, userType: EXPENSE_TYPE.FIXED, confidence: 99, justification: "Lease locked in.", aiInsight: "Fixed cost." },
    [SCENARIOS.GROWTH_STRATEGY]: { m1: 25000, m2: 25000, m3: 35000, aiType: EXPENSE_TYPE.FIXED, userType: EXPENSE_TYPE.FIXED, confidence: 90, justification: "New office expansion in Q1.", aiInsight: "Step-up cost indicates a fixed change." },
  },
  {
    department: "Marketing", expenseCategory: "Campaign Spend",
    [SCENARIOS.BASELINE]:      { m1: 40000, m2: 45000, m3: 35000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 95, justification: "Quarterly ad budget based on demand.", aiInsight: "Highly variable based on channel performance and seasonality." },
    [SCENARIOS.COST_CONTROL]:  { m1: 30000, m2: 30000, m3: 30000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 95, justification: "Reduced to essential channels.", aiInsight: "Variable spend is the first target for cuts." },
    [SCENARIOS.GROWTH_STRATEGY]: { m1: 60000, m2: 75000, m3: 70000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 95, justification: "Aggressive push for market share.", aiInsight: "Scaling variable spend to drive growth." },
  },
  {
    department: "IT", expenseCategory: "SaaS Licenses",
    [SCENARIOS.BASELINE]:      { m1: 18000, m2: 18000, m3: 18000, aiType: EXPENSE_TYPE.FIXED, userType: EXPENSE_TYPE.FIXED, confidence: 85, justification: "Annual contracts for core software.", aiInsight: "Mostly fixed, but can have minor fluctuations from new hires." },
    [SCENARIOS.COST_CONTROL]:  { m1: 15000, m2: 15000, m3: 15000, aiType: EXPENSE_TYPE.FIXED, userType: EXPENSE_TYPE.FIXED, confidence: 85, justification: "Consolidated tools, removed unused seats.", aiInsight: "Can be made a fixed, lower cost." },
    [SCENARIOS.GROWTH_STRATEGY]: { m1: 22000, m2: 24000, m3: 25000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 70, justification: "Adding seats with new hires.", aiInsight: "Becomes variable during high-growth phases." },
  },
  {
    department: "HR", expenseCategory: "Contractor Fees",
    [SCENARIOS.BASELINE]:      { m1: 10000, m2: 5000, m3: 12000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 98, justification: "Project-based contractors for recruitment.", aiInsight: "Highly variable and project-dependent." },
    [SCENARIOS.COST_CONTROL]:  { m1: 0, m2: 0, m3: 0, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 98, justification: "Hiring freeze, no contractors.", aiInsight: "Variable spend eliminated." },
    [SCENARIOS.GROWTH_STRATEGY]: { m1: 20000, m2: 25000, m3: 22000, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 98, justification: "Scaling team with temporary contractors.", aiInsight: "Flexibility through variable spend." },
  },
];

const FixedVariableExpensePlanning = () => {
  const [activeTab, setActiveTab] = useState("classify");
  const [period, setPeriod] = useState("Q1 2025");
  const [hasChanges, setHasChanges] = useState(false);
  
  const [expenseData, setExpenseData] = useState(JSON.parse(JSON.stringify(initialExpenseData)));
  const [activeScenario, setActiveScenario] = useState(SCENARIOS.BASELINE);
  const [scenarioAssumptions, setScenarioAssumptions] = useState({
    [SCENARIOS.BASELINE]: "Standard operating model. Expenses classified based on historical patterns. Variable spend tied to revenue.",
    [SCENARIOS.COST_CONTROL]: "Focus on reducing variable spend and converting some variable costs to fixed, lower-cost contracts where possible.",
    [SCENARIOS.GROWTH_STRATEGY]: "Increased variable spend to fuel growth. Some fixed costs may rise due to infrastructure expansion.",
  });

  const [expenseVersions, setExpenseVersions] = useState([]);
  const [expenseTotals, setExpenseTotals] = useState({});
  const filtersRef = useRef(null);

  const getScenarioDataItem = (item, scenarioKey) => {
    return item[scenarioKey] || { m1: 0, m2: 0, m3: 0, aiType: EXPENSE_TYPE.VARIABLE, userType: EXPENSE_TYPE.VARIABLE, confidence: 0, justification: "", aiInsight: "N/A" };
  };
  
  const calculateTotalsForScenario = (data, scenarioKey) => {
    const totals = { fixed: 0, variable: 0, total: 0, monthly: { m1: {fixed: 0, variable: 0}, m2: {fixed: 0, variable: 0}, m3: {fixed: 0, variable: 0} } };
    if (!data || data.length === 0) return totals;

    data.forEach(item => {
      const scenarioData = getScenarioDataItem(item, scenarioKey);
      const monthlyData = [scenarioData.m1, scenarioData.m2, scenarioData.m3];
      
      monthlyData.forEach((monthValue, i) => {
        const key = `m${i+1}`;
        if (scenarioData.userType === EXPENSE_TYPE.FIXED) {
            totals.monthly[key].fixed += monthValue;
            totals.fixed += monthValue;
        } else {
            totals.monthly[key].variable += monthValue;
            totals.variable += monthValue;
        }
      });
    });
    totals.total = totals.fixed + totals.variable;
    return totals;
  };

  useEffect(() => {
    setExpenseTotals(calculateTotalsForScenario(expenseData, activeScenario));
  }, [expenseData, activeScenario]);

  const handleInputChange = (index, field, value, month = null) => {
    setExpenseData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const scenarioItem = newData[index][activeScenario];
      if (month) {
        scenarioItem[month] = parseFloat(value) || 0;
      } else {
        scenarioItem[field] = value;
      }
      return newData;
    });
    setHasChanges(true);
  };
  
  const handleSaveAll = () => {
    const timestamp = new Date().toISOString();
    const totalsByScenario = {};
    Object.values(SCENARIOS).forEach(scen => {
      totalsByScenario[scen] = calculateTotalsForScenario(expenseData, scen);
    });
    setExpenseVersions(prev => [...prev, { period, timestamp, data: JSON.parse(JSON.stringify(expenseData)), totalsByScenario, assumptions: JSON.parse(JSON.stringify(scenarioAssumptions))}]);
    setHasChanges(false);
    alert("Expense plan version saved successfully!");
  };

  const handleExport = () => {
    const dataForExport = expenseData.map(item => {
      const scenarioData = getScenarioDataItem(item, activeScenario);
      return {
        'Department': item.department, 'Expense Category': item.expenseCategory,
        'M1 Budget': scenarioData.m1, 'M2 Budget': scenarioData.m2, 'M3 Budget': scenarioData.m3,
        'Type (User)': scenarioData.userType, 'Justification': scenarioData.justification,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Expense Plan`);
    XLSX.writeFile(workbook, `Fixed_Variable_Plan_${activeScenario.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      
      const dataMap = new Map(expenseData.map(d => [`${d.department}-${d.expenseCategory}`, JSON.parse(JSON.stringify(d))]));
      jsonData.forEach(row => {
        const key = `${row['Department']}-${row['Expense Category']}`;
        if (dataMap.has(key)) {
          const itemToUpdate = dataMap.get(key);
          const scenarioItem = getScenarioDataItem(itemToUpdate, activeScenario);
          scenarioItem.m1 = row['M1'] ?? scenarioItem.m1;
          scenarioItem.m2 = row['M2'] ?? scenarioItem.m2;
          scenarioItem.m3 = row['M3'] ?? scenarioItem.m3;
          scenarioItem.userType = row['Type (User)'] ?? scenarioItem.userType;
          scenarioItem.justification = row['Justification'] ?? scenarioItem.justification;
          dataMap.set(key, itemToUpdate);
        }
      });
      setExpenseData(Array.from(dataMap.values()));
      setHasChanges(true);
      alert(`Data for ${activeScenario} imported. Review changes.`);
      e.target.value = '';
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing file.");
    }
  };
  
  const handleRestoreVersion = (version) => {
    setExpenseData(JSON.parse(JSON.stringify(version.data)));
    setScenarioAssumptions(JSON.parse(JSON.stringify(version.assumptions)));
    setHasChanges(false);
    alert(`Version from ${new Date(version.timestamp).toLocaleString()} restored.`);
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } };
  const pieChartData = {
    labels: ['Fixed', 'Variable'],
    datasets: [{ data: [expenseTotals.fixed || 0, expenseTotals.variable || 0], backgroundColor: ['#3b82f6', '#f97316'], hoverOffset: 4 }],
  };
  const barChartData = {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    datasets: [
        { label: 'Fixed Expenses', data: Object.values(expenseTotals.monthly || {}).map(m => m.fixed), backgroundColor: 'rgba(59, 130, 246, 0.7)', stack: 'Stack 0' },
        { label: 'Variable Expenses', data: Object.values(expenseTotals.monthly || {}).map(m => m.variable), backgroundColor: 'rgba(249, 115, 22, 0.7)', stack: 'Stack 0' },
    ]
  };
  const barChartOptions = { ...chartOptions, scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: 'Spend ($)' } } } };

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
                                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Fixed vs. Variable Expenses</span>
                                </div>
                              </li>
                            </ol>
                          </nav>
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div><h1 className="text-lg font-bold text-white">Fixed vs. Variable Expense Planning</h1><p className="text-sky-100 text-xs">Recurring vs. project-based expenses.</p></div>
          <div className="flex items-center space-x-4">
             <div><label className="text-sm text-white font-medium mr-2">Forecast Period:</label><select value={period} onChange={(e) => setPeriod(e.target.value)} className="p-1.5 border bg-sky-50 text-sky-900 border-sky-200 rounded-md text-xs"><option>Q1 2025</option><option>Q2 2025</option></select></div>
             <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 transition-colors"><FiPrinter className="text-sky-50" /><span className="text-sky-50">Print</span></button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b mt-5 py-3 border-gray-200 mb-6">
        {[{id: 'classify', label: 'Expense Classification'}, {id: 'import', label: 'Import Categories'}, {id: 'compare', label: 'Compare Scenarios'}].map(tab => (
          <button key={tab.id} className={`py-2 px-4 font-medium text-sm ${activeTab === tab.id ? 'text-sky-50 border-b-2 border-sky-600 bg-sky-800 rounded-t-lg' : 'text-sky-900 hover:text-sky-500 hover:bg-sky-100 rounded-t-lg'}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
        <div className="ml-4">
            <label className="text-sm font-medium text-sky-800 mr-2">Active Scenario:</label>
            <select value={activeScenario} onChange={(e) => { if(hasChanges && !window.confirm("Unsaved changes. Switch anyway?")) return; setActiveScenario(e.target.value); setHasChanges(false); }} className="p-1.5 border border-sky-300 bg-white text-sky-900 rounded-md text-xs">
                {Object.values(SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
        </div>
        <div className="relative ml-auto" ref={filtersRef}><button className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm"><BsFilter className="mr-1" /> Filters</button></div>
      </div>
      
      <div>
        {activeTab === 'classify' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-xs font-medium text-sky-700">Total Fixed Expenses</p><p className="text-2xl font-bold text-sky-900">${(expenseTotals?.fixed || 0).toLocaleString()}</p></div>
              <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-xs font-medium text-sky-700">Total Variable Expenses</p><p className="text-2xl font-bold text-sky-900">${(expenseTotals?.variable || 0).toLocaleString()}</p></div>
              <div className="p-4 bg-white rounded-lg shadow-sm border"><p className="text-xs font-medium text-sky-700">% Variable vs Total</p><p className="text-2xl font-bold text-sky-900">{expenseTotals.total > 0 ? ((expenseTotals.variable / expenseTotals.total) * 100).toFixed(1) : 0}%</p></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm flex-1 border"><h2 className="text-lg font-semibold text-sky-900 mb-3">Fixed vs. Variable Expense Share</h2><div className="h-[250px]"><Pie data={pieChartData} options={{...chartOptions, plugins: { legend: { position: 'right' } }}}/></div></div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex-1 border"><h2 className="text-lg font-semibold text-sky-900 mb-3">Monthly Spend Split by Type</h2><div className="h-[250px]"><Bar data={barChartData} options={barChartOptions} /></div></div>
            </div>

            <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-sky-900">Expense Planning Editor ({activeScenario})</h2>
                  <div className="flex space-x-2">
                    <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"><FiDownload className="mr-2" /> Export</button>
                    <button onClick={handleSaveAll} disabled={!hasChanges} className={`px-4 py-2 text-sm rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2" /> Save Plan</button>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[calc(100vh-250px)] relative">
                  <table className="min-w-full divide-y divide-sky-100">
                    <thead className="bg-sky-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-900 uppercase sticky left-0 bg-sky-50 z-20 min-w-[200px]">Department / Category</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Month 1</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Month 2</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[120px]">Month 3</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-sky-700 uppercase min-w-[200px]">Classification (AI vs User)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase min-w-[250px]">Justification / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {expenseData.map((item, index) => {
                        const scenarioData = getScenarioDataItem(item, activeScenario);
                        const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-sky-50/70";
                        return (
                          <tr key={index} className={`${rowBgClass} hover:bg-sky-100/50`}>
                            <td className={`px-4 py-3 text-sm font-medium text-sky-900 sticky left-0 z-[5] ${rowBgClass}`}>
                                <div className="font-semibold">{item.department}</div><div className="text-xs text-sky-600">{item.expenseCategory}</div>
                            </td>
                            {['m1', 'm2', 'm3'].map(month => (
                                <td key={month} className="px-2 py-1"><input type="number" value={scenarioData[month]} onChange={(e) => handleInputChange(index, null, e.target.value, month)} className="w-full p-1.5 border border-sky-300 rounded-md text-sm text-center bg-white"/></td>
                            ))}
                            <td className="px-2 py-1">
                                <div className="text-xs text-gray-500 text-center relative group">AI: {scenarioData.aiType} ({scenarioData.confidence}%) <FiInfo className="inline-block ml-1 text-gray-400" /><span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max p-1.5 text-xs text-white bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 z-30 pointer-events-none">{scenarioData.aiInsight}</span></div>
                                <select value={scenarioData.userType} onChange={(e) => handleInputChange(index, 'userType', e.target.value)} className="w-full p-1.5 border border-sky-300 rounded-md text-sm bg-white mt-1">{Object.values(EXPENSE_TYPE).map(t=><option key={t}>{t}</option>)}</select>
                            </td>
                            <td className="px-2 py-1"><textarea value={scenarioData.justification} onChange={(e) => handleInputChange(index, 'justification', e.target.value)} rows="1" className="w-full p-1.5 border border-sky-300 rounded-md text-sm bg-white"/></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mb-6 mt-6 p-4 bg-sky-100/70 rounded-lg shadow-sm border">
                <label className="block text-md font-semibold text-sky-800 mb-2">Assumptions for {activeScenario}:</label>
                <textarea value={scenarioAssumptions[activeScenario] || ''} onChange={(e) => { setScenarioAssumptions(prev => ({...prev, [activeScenario]: e.target.value})); setHasChanges(true); }} rows="3" className="w-full p-2 border border-sky-300 rounded-lg text-sm bg-white" placeholder={`e.g., Classification logic, contract terms...`} />
            </div>
          </>
        )}
        
        {activeTab === 'import' && (
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Import Expense Categories</h2>
            <p className="text-sm text-gray-600 mb-4">Upload an Excel (.xlsx) or CSV (.csv) file with your expense data. Match by 'Department' and 'Expense Category'.</p>
            <div className="border-2 border-dashed border-sky-300 rounded-lg p-8 text-center">
              <FiUpload className="mx-auto text-4xl text-sky-500 mb-3" />
              <label htmlFor="importFile" className="px-6 py-3 bg-blue-600 text-white text-md font-medium rounded-lg hover:bg-blue-700 cursor-pointer">Choose File to Import</label>
              <input id="importFile" type="file" onChange={handleImport} accept=".xlsx,.xls,.csv" className="hidden"/>
              <p className="text-xs text-gray-500 mt-3">File must contain 'Department', 'Expense Category', 'M1', 'M2', 'M3', 'Type', and 'Justification' columns.</p>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Compare Fixed vs. Variable Scenarios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase">Metric</th>
                    {Object.values(SCENARIOS).map(name => <th key={name} className="px-5 py-3 text-left text-xs font-semibold text-sky-800 uppercase">{name}</th>)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sky-100">
                  {['Total Budget', 'Total Fixed', 'Total Variable', '% Variable', 'Assumptions'].map(metric => (
                    <tr key={metric} className={metric === 'Assumptions' ? 'align-top' : ''}>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{metric}</td>
                      {Object.values(SCENARIOS).map(scenarioName => {
                        const totals = calculateTotalsForScenario(expenseData, scenarioName);
                        let value, className = "text-sm text-sky-700";
                        if (metric === 'Total Budget') { value = `$${(totals.total || 0).toLocaleString()}`; className = "text-sm font-semibold text-sky-800"; }
                        else if (metric === 'Total Fixed') { value = `$${(totals.fixed || 0).toLocaleString()}`; }
                        else if (metric === 'Total Variable') { value = `$${(totals.variable || 0).toLocaleString()}`; }
                        else if (metric === '% Variable') { value = totals.total > 0 ? `${((totals.variable / totals.total) * 100).toFixed(1)}%` : '0%'; }
                        else if (metric === 'Assumptions') { value = scenarioAssumptions[scenarioName] || 'N/A'; className = "text-xs text-gray-600 whitespace-pre-wrap max-w-xs"; }
                        return <td key={`${metric}-${scenarioName}`} className={`px-5 py-4 ${className}`}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white p-6 mt-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Plan Version History</h2>
          {expenseVersions.length === 0 ? <p className="text-sm text-gray-500">No versions saved yet.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Timestamp</th>
                    {Object.values(SCENARIOS).map(scen => <th key={scen} className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">{scen} Total</th>)}
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {expenseVersions.map((version, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50/70"}>
                      <td className="px-4 py-3 text-sm text-sky-800">{new Date(version.timestamp).toLocaleString()}</td>
                      {Object.values(SCENARIOS).map(scen => {
                        const total = version.totalsByScenario?.[scen] || { total: 0 };
                        return <td key={`${index}-${scen}`} className="px-4 py-3 text-sm font-semibold text-sky-800">${total.total.toLocaleString()}</td>
                      })}
                      <td className="px-4 py-3"><button onClick={() => handleRestoreVersion(version)} className="text-sm text-sky-700 hover:text-sky-900 hover:underline">Restore</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedVariableExpensePlanning;