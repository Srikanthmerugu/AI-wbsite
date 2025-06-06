// src/pages/Budgeting/HeadcountPlanning.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiDollarSign, FiCalendar, FiDownload, FiPlus, FiChevronDown, FiFilter, FiCheckCircle, FiEye } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Data Model ---
const initialHeadcountData = {
  base: {
    version: '2.1', status: 'Draft',
    existingHeadcount: 150, existingMonthlyCost: 1500000,
    newHires: [
      { id: 1, role: 'Senior Software Engineer', department: 'Engineering', hireDate: '2024-02-15', salary: 150000, bonusPct: 15, aiBaselineSalary: 155000, status: 'Approved' },
      { id: 2, role: 'Product Manager', department: 'Product', hireDate: '2024-03-01', salary: 130000, bonusPct: 12, aiBaselineSalary: 125000, status: 'Approved' },
      { id: 3, role: 'Sales Development Rep', department: 'Sales', hireDate: '2024-05-10', salary: 65000, bonusPct: 25, aiBaselineSalary: 68000, status: 'Proposed' },
      { id: 4, role: 'Data Scientist', department: 'Engineering', hireDate: '2024-06-01', salary: 140000, bonusPct: 15, aiBaselineSalary: 145000, status: 'Proposed' },
      { id: 7, role: 'Marketing Associate', department: 'Marketing', hireDate: '2024-04-01', salary: 75000, bonusPct: 10, aiBaselineSalary: 72000, status: 'Proposed' },
    ]
  },
  growth: {
    version: '3.0', status: 'In Review',
    existingHeadcount: 150, existingMonthlyCost: 1500000,
    newHires: [
      { id: 1, role: 'Senior Software Engineer', department: 'Engineering', hireDate: '2024-01-20', salary: 155000, bonusPct: 15, aiBaselineSalary: 155000, status: 'Approved' },
      { id: 2, role: 'Product Manager', department: 'Product', hireDate: '2024-02-15', salary: 135000, bonusPct: 12, aiBaselineSalary: 125000, status: 'Approved' },
      { id: 3, role: 'Sales Development Rep', department: 'Sales', hireDate: '2024-03-01', salary: 70000, bonusPct: 25, aiBaselineSalary: 68000, status: 'Approved' },
      { id: 4, role: 'Data Scientist', department: 'Engineering', hireDate: '2024-04-01', salary: 145000, bonusPct: 15, aiBaselineSalary: 145000, status: 'Approved' },
      { id: 5, role: 'Lead DevOps Engineer', department: 'Engineering', hireDate: '2024-05-15', salary: 175000, bonusPct: 18, aiBaselineSalary: 170000, status: 'Proposed' },
      { id: 6, role: 'Marketing Manager', department: 'Marketing', hireDate: '2024-07-01', salary: 110000, bonusPct: 10, aiBaselineSalary: 115000, status: 'Proposed' },
      { id: 8, role: 'Sales Director', department: 'Sales', hireDate: '2024-02-01', salary: 180000, bonusPct: 30, aiBaselineSalary: 185000, status: 'Approved' },
    ]
  },
  conservative: {
    version: '1.5', status: 'Approved',
    existingHeadcount: 150, existingMonthlyCost: 1500000,
    newHires: [
      { id: 1, role: 'Senior Software Engineer', department: 'Engineering', hireDate: '2024-05-01', salary: 145000, bonusPct: 15, aiBaselineSalary: 155000, status: 'Approved' },
      { id: 3, role: 'Sales Development Rep', department: 'Sales', hireDate: '2024-08-01', salary: 65000, bonusPct: 25, aiBaselineSalary: 68000, status: 'Approved' },
    ]
  }
};

const BENEFITS_LOAD_RATE = 0.25;

const calculateFullyLoadedCost = (hire) => (hire.salary * (1 + hire.bonusPct / 100)) * (1 + BENEFITS_LOAD_RATE);

// ** THE FIX IS HERE **
// --- Reusable UI Helper Component ---
const StatusBadge = ({ status }) => {
    const styles = {
      'Proposed': 'bg-blue-100 text-blue-800 ring-blue-600/20',
      'Approved': 'bg-green-100 text-green-800 ring-green-600/20',
      'Hired': 'bg-purple-100 text-purple-800 ring-purple-600/20',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${styles[status]}`}>{status}</span>;
};


// --- Main Component ---
export const HeadcountPlanning = () => {
  const [scenario, setScenario] = useState('base');
  const [headcountPlan, setHeadcountPlan] = useState(initialHeadcountData.base.newHires);
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    setHeadcountPlan(initialHeadcountData[scenario].newHires);
    const initialDepts = initialHeadcountData[scenario].newHires.reduce((acc, hire) => ({ ...acc, [hire.department]: true }), {});
    setExpandedDepts(initialDepts);
  }, [scenario]);

  const handlePlanChange = (id, field, value) => setHeadcountPlan(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  const toggleDept = (dept) => setExpandedDepts(prev => ({...prev, [dept]: !prev[dept]}));

  const groupedByDept = useMemo(() => headcountPlan.reduce((acc, hire) => {
    (acc[hire.department] = acc[hire.department] || []).push(hire);
    return acc;
  }, {}), [headcountPlan]);

  const calculations = useMemo(() => {
    const { existingHeadcount, existingMonthlyCost } = initialHeadcountData[scenario];
    const totalNewHires = headcountPlan.length;
    const monthlyForecast = { existing: Array(12).fill(existingMonthlyCost), newHires: Array(12).fill(0) };
    let totalNewHireAnnualCost = 0;

    headcountPlan.forEach(hire => {
      const fullyLoadedCost = calculateFullyLoadedCost(hire);
      const hireMonth = new Date(hire.hireDate).getMonth();
      for (let i = hireMonth; i < 12; i++) monthlyForecast.newHires[i] += fullyLoadedCost / 12;
      totalNewHireAnnualCost += (fullyLoadedCost / 12) * (12 - hireMonth);
    });
    
    const totalAnnualPayroll = (existingMonthlyCost * 12) + totalNewHireAnnualCost;
    return { totalHeadcount: existingHeadcount + totalNewHires, totalNewHires, totalAnnualPayroll, monthlyForecast };
  }, [headcountPlan, scenario]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        { label: 'Existing Payroll', data: calculations.monthlyForecast.existing, backgroundColor: 'rgba(100, 116, 139, 0.6)', stack: 'a' },
        { label: 'New Hire Impact', data: calculations.monthlyForecast.newHires, backgroundColor: 'rgba(59, 130, 246, 0.8)', stack: 'a' }
    ]
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-sky-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-5 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Headcount & Cost Planning</h1>
              <p className="text-sky-100 text-sm mt-1">Align hiring plans with financial targets.</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <select value={scenario} onChange={e => setScenario(e.target.value)} className="p-2 border border-sky-400 rounded-lg text-sm bg-white/20 text-white shadow-sm focus:ring-2 focus:ring-white">
                  <option className="text-black" value="base">Base Plan</option><option className="text-black" value="growth">Growth Plan</option><option className="text-black" value="conservative">Conservative Plan</option>
                </select>
                <div className="bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg">Version: {initialHeadcountData[scenario].version}</div>
                <button className="flex items-center py-2 px-4 text-xs font-medium text-white bg-sky-700 rounded-lg border border-sky-600 hover:bg-sky-600"><FiCheckCircle className="mr-1.5" /> Submit for Approval</button>
            </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm font-semibold text-sky-800">Total Headcount (EOY)</p><p className="text-3xl font-bold text-sky-900 mt-1">{calculations.totalHeadcount}</p><p className="text-xs text-green-600 font-medium">+{calculations.totalNewHires} New Hires</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm font-semibold text-sky-800">Total Payroll Forecast</p><p className="text-3xl font-bold text-sky-900 mt-1">${(calculations.totalAnnualPayroll / 1000000).toFixed(2)}M</p><p className="text-xs text-gray-500">Fully loaded annual cost</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm font-semibold text-sky-800">New Hire Investment</p><p className="text-3xl font-bold text-sky-900 mt-1">${((calculations.totalAnnualPayroll - initialHeadcountData[scenario].existingMonthlyCost*12) / 1000).toFixed(0)}k</p><p className="text-xs text-gray-500">Incremental cost in Year 1</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm font-semibold text-sky-800">Plan Status</p><p className="text-3xl font-bold text-sky-900 mt-1">{initialHeadcountData[scenario].status}</p><p className="text-xs text-gray-500">Current approval state</p></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
            {Object.entries(groupedByDept).map(([dept, hires]) => {
                const deptTotalCost = hires.reduce((sum, hire) => sum + calculateFullyLoadedCost(hire), 0);
                return(
                <div key={dept} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/50" onClick={() => toggleDept(dept)}>
                        <div>
                            <h4 className="font-semibold text-lg text-gray-800">{dept}</h4>
                            <p className="text-xs text-gray-500">{hires.length} New Hires Planned</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-gray-800">${(deptTotalCost/1000).toFixed(0)}k</p>
                           <p className="text-xs text-gray-500">Annual Cost Impact</p>
                        </div>
                        <FiChevronDown className={`ml-4 text-gray-500 transition-transform ${expandedDepts[dept] ? 'rotate-180' : ''}`}/>
                    </div>
                    <AnimatePresence>
                    {expandedDepts[dept] && <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden">
                        <div className="p-4 border-t border-gray-200">
                           <div className="grid grid-cols-12 gap-x-4 text-xs text-gray-500 font-semibold mb-2 px-2">
                                <div className="col-span-4">Role</div><div className="col-span-2">Hire Date</div><div className="col-span-2">Base Salary</div><div className="col-span-2">AI Baseline</div><div className="col-span-2 text-right">Status</div>
                           </div>
                           <div className="space-y-2">
                            {hires.map(hire => (
                                <div key={hire.id} className="grid grid-cols-12 gap-x-4 items-center text-sm p-2 rounded-lg hover:bg-sky-50">
                                    <div className="col-span-4 font-medium text-gray-800">{hire.role}</div>
                                    <div className="col-span-2"><input type="date" value={hire.hireDate} onChange={e => handlePlanChange(hire.id, 'hireDate', e.target.value)} className="p-1 w-full border-gray-300 border rounded-md"/></div>
                                    <div className="col-span-2 flex items-center"><span className="text-gray-400 mr-1">$</span><input type="number" step="1000" value={hire.salary} onChange={e => handlePlanChange(hire.id, 'salary', Number(e.target.value))} className="p-1 w-full border-gray-300 border rounded-md"/></div>
                                    <div className="col-span-2 text-purple-700 flex items-center font-mono text-xs"><BsStars className="mr-1.5 text-purple-500"/>${hire.aiBaselineSalary.toLocaleString()}</div>
                                    <div className="col-span-2 text-right"><StatusBadge status={hire.status}/></div>
                                </div>
                            ))}
                           </div>
                           <button className="text-xs flex items-center text-sky-600 font-medium mt-3 hover:text-sky-800"><FiPlus className="mr-1"/>Add Hire to {dept}</button>
                        </div>
                    </motion.div>}
                    </AnimatePresence>
                </div>
            )})}
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Payroll Forecast</h3>
                <div className="h-64">
                    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: {stacked: true}, y: {stacked: true, ticks: { callback: v => `$${(v/1000).toFixed(0)}k`}} }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } }}}} />
                </div>
            </div>
             <div className="bg-gradient-to-br from-purple-50 to-sky-50 p-5 rounded-xl border border-purple-200">
                 <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center"><BsStars className="mr-2"/>AI Strategic Analysis</h3>
                 <AnimatePresence mode="wait">
                 <motion.div key={scenario} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-3 text-sm">
                    {scenario === 'base' && <div className="bg-white/60 p-3 rounded-lg"><p className="font-medium text-purple-900">Balanced Growth</p><p className="text-gray-700">This plan shows steady investment in Engineering and Sales. Cost ramps up moderately in Q2, aligning with typical revenue growth.</p></div>}
                    {scenario === 'growth' && <div className="bg-white/60 p-3 rounded-lg"><p className="font-medium text-purple-900">Aggressive Expansion</p><p className="text-gray-700">This plan heavily front-loads hiring costs in H1. This will significantly impact profitability and cash flow early in the year, requiring strong revenue performance to justify.</p></div>}
                    {scenario === 'conservative' && <div className="bg-white/60 p-3 rounded-lg"><p className="font-medium text-purple-900">Critical Hires Only</p><p className="text-gray-700">This plan minimizes new payroll costs, preserving cash. However, it may starve growth-oriented departments like Sales and Marketing, potentially impacting future revenue.</p></div>}
                 </motion.div>
                 </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeadcountPlanning;