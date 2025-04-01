import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPieChart,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import AIChatBot from '../../pages/AIChatBot';
import SmallAIChatBot from '../../pages/SmallAIChatBot';
import { BsStars } from 'react-icons/bs';
import Loader from '../Loading/Loading';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinancialOverview = () => {
  

  // Chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 18000, 22000, 25000],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const expenseData = {
    labels: ['Salaries', 'Marketing', 'Operations', 'R&D', 'IT'],
    datasets: [
      {
        label: 'Expenses',
        data: [50000, 20000, 15000, 10000, 5000],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
      },
    ],
  };

  const profitData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4','Q5', 'Q6', 'Q7', 'Q8','Q5', 'Q6', 'Q7', 'Q8'],
    datasets: [
      {
        label: 'Gross Profit',
        data: [45000, 48000, 52000, 55000, 45000, 48000, 52000, 55000, 45000, 48000, 52000, 55000],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Table data
  const financialTableData = [
    { 
      metric: 'Revenue Growth', 
      current: '$250,000', 
      previous: '$220,000', 
      change: '+13.6%',
      trend: 'up'
    },
    { 
      metric: 'Operating Expenses', 
      current: '$85,000', 
      previous: '$80,000', 
      change: '+6.2%',
      trend: 'down'
    },
    { 
      metric: 'EBITDA Margin', 
      current: '25.6%', 
      previous: '23.2%', 
      change: '+2.4%',
      trend: 'up'
    },
    { 
      metric: 'Cash Flow', 
      current: '$42,000', 
      previous: '$38,000', 
      change: '+10.5%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* <Loader /> */}
      {/* Button to toggle drawer */}
       

      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
            <p className="text-sky-100 mt-2">Key metrics and performance indicators</p>
          </div>
          <button 
            type="button" 
            className="py-2.5 px-5 shadow-2xl text-sm font-medium text-white bg-sky-900 rounded-lg border-2 border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Add/Edit Widgets
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value="$250,000" 
          change="+13.6%" 
          isPositive={true} 
          icon={<FiTrendingUp className="text-green-500" size={24} />}
        />
        <KPICard 
          title="Total Expenses" 
          value="$85,000" 
          change="+6.2%" 
          isPositive={false} 
          icon={<FiTrendingDown className="text-red-500" size={24} />}
        />
        <KPICard 
          title="Gross Profit" 
          value="$165,000" 
          change="+18.9%" 
          isPositive={true} 
          icon={<FiDollarSign className="text-blue-500" size={24} />}
        />
        <KPICard 
          title="EBITDA" 
          value="$64,000" 
          change="+15.3%" 
          isPositive={true} 
          icon={<FiPieChart className="text-purple-500" size={24} />}
        />
      </div>
      
      {/* Charts Section */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        






        <ChartCard title="Revenue Trend">
          <Line 
            data={revenueData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
        </ChartCard>
        
        <ChartCard title="Expense Breakdown">
          <Pie 
            data={expenseData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }} 
          />
        </ChartCard>
        
        <ChartCard title="Quarterly Profit" >
          <Bar  
            data={profitData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
        </ChartCard>
      </div>

      {/* Financial Performance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100">
          <h2 className="text-xl font-semibold text-sky-900">Financial Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Current Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Previous Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-100">
              {financialTableData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{row.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">{row.current}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">{row.previous}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.trend === 'up' ? (
                        <FiArrowUp className="mr-1" size={12} />
                      ) : (
                        <FiArrowDown className="mr-1" size={12} />
                      )}
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group border border-sky-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-sky-700">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-sky-900">{value}</h3>
          <div className={`flex items-center mt-2 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-sm font-medium">
              {change} {isPositive ? '↑' : '↓'} vs last period
            </span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-sky-100 group-hover:bg-sky-200 transition-colors duration-200">
          <div className="text-sky-600 group-hover:text-sky-800 transition-colors duration-200">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children, fullWidth = false }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 ${
      fullWidth ? 'w-full' : 'w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
    }`}>
      <h3 className="text-lg font-semibold text-sky-900 mb-4">{title}</h3>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default FinancialOverview;