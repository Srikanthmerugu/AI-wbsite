import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  BsStars, 
  BsFilter, 
  BsDownload,
  BsInfoCircle,
  BsPieChart,
  BsBarChart,
  BsGraphUp,
  BsServer,
  BsShieldLock,
  BsCodeSquare
} from 'react-icons/bs';
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
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
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

export const ITSpendAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState('Last Quarter');
  const [department, setDepartment] = useState('All Departments');
  const [region, setRegion] = useState('All Regions');
  const [platformType, setPlatformType] = useState('All Platforms');

  // Mock data
  const departments = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];
  const regions = ['North America', 'Europe', 'Asia', 'Global'];
  const platformTypes = ['Cloud', 'On-Prem', 'Hybrid', 'SaaS'];

  // KPI data
  const kpis = [
    {
      id: 1,
      name: 'Total IT Spend',
      value: '$2.45M',
      change: '+8%',
      trend: 'up',
      forecast: '$2.6M next quarter',
      icon: <BsGraphUp size={20} />,
      color: 'text-amber-600'
    },
    {
      id: 2,
      name: 'Avg License Utilization',
      value: '68%',
      change: '+5%',
      trend: 'up',
      forecast: '72% next quarter',
      icon: <BsPieChart size={20} />,
      color: 'text-green-600'
    },
    {
      id: 3,
      name: 'Cloud vs On-Prem Ratio',
      value: '65% Cloud',
      change: '+12% Cloud',
      trend: 'up',
      forecast: '70% Cloud next quarter',
      icon: <BsServer size={20} />,
      color: 'text-blue-600'
    },
    {
      id: 4,
      name: 'Security Incidents',
      value: '8',
      change: '-3',
      trend: 'down',
      forecast: '6 next quarter',
      icon: <BsShieldLock size={20} />,
      color: 'text-red-600'
    },
    {
      id: 5,
      name: 'Tech Debt Score',
      value: '6.2/10',
      change: '-0.4',
      trend: 'down',
      forecast: '5.8 next quarter',
      icon: <BsCodeSquare size={20} />,
      color: 'text-purple-600'
    }
  ];


  const navItems = [
  { name: "IT Spend Breakdown", icon: <BsPieChart />, path: "/it-technology-spend" },
  { name: "License Utilization", icon: <BsBarChart />, path: "/it-technology-spend" },
  { name: "Infra Efficiency", icon: <BsServer />, path: "/it-technology-spend" },
  { name: "Budget vs Actuals", icon: <BsGraphUp />, path: "/it-technology-spend" },
  { name: "Security Analytics", icon: <BsShieldLock />, path: "/it-technology-spend" },
  { name: "Tech Debt Index", icon: <BsCodeSquare />, path: "/it-technology-spend" }
];

  // IT Spend by Category data
  const spendByCategoryData = {
    labels: ['Cloud Services', 'SaaS Subscriptions', 'Infrastructure', 'Security', 'Personnel', 'Other'],
    datasets: [
      {
        data: [850000, 650000, 420000, 280000, 200000, 50000],
        backgroundColor: [
          '#4BC0C0',
          '#FF6384',
          '#FFCE56',
          '#36A2EB',
          '#9966FF',
          '#FF9F40'
        ],
      }
    ]
  };

  // Budget vs Actuals data
  const budgetVsActualData = {
    labels: ['ERP Upgrade', 'Cloud Migration', 'Security Suite', 'HR System', 'Marketing Platform'],
    datasets: [
      {
        label: 'Budget',
        data: [500000, 750000, 300000, 250000, 200000],
        backgroundColor: '#4BC0C0',
      },
      {
        label: 'Actual',
        data: [550000, 800000, 280000, 270000, 220000],
        backgroundColor: '#FF6384',
      }
    ]
  };

  // Monthly IT Spend Trend
  const monthlySpendTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total IT Spend',
        data: [380000, 420000, 450000, 410000, 480000, 500000],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with filters */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">IT & Technology Spend Overview</h1>
            <p className="text-sky-100 text-xs">Budget utilization, risk, and modernization insights</p>
          </div>
          <div className="flex space-x-2">
            <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <BsDownload className="mr-1" /> Export Report
            </button>
          </div>
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sky-600 text-sm font-medium">{kpi.name}</div>
                <div className="text-xl font-bold mt-1">{kpi.value}</div>
              </div>
              <div className={`p-2 rounded-lg bg-sky-50 ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs">
                <span className={`${kpi.trend === 'up' ? kpi.color : 'text-red-600'}`}>
                  {kpi.change} {kpi.trend === 'up' ? '↑' : '↓'}
                </span>
                <span className="text-sky-600 ml-1">vs previous</span>
              </div>
              <div className="text-xs text-sky-500 flex items-center">
                <BsStars className="mr-1" /> {kpi.forecast}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IT Spend by Category */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800 flex items-center">
              <BsPieChart className="text-sky-600 mr-2" />
              IT Spend by Category
            </h3>
            <button className="text-xs p-1 text-sky-600">
              <BsInfoCircle />
            </button>
          </div>
          <div className="h-48">
            <Pie
              data={spendByCategoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw.toLocaleString()} (${Math.round(context.raw/2450000*100)}%)`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Budget vs Actuals */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800 flex items-center">
              <BsBarChart className="text-sky-600 mr-2" />
              Budget vs Actuals
            </h3>
            <select className="text-xs p-1 border border-sky-200 rounded">
              <option>Top 5 Projects</option>
              <option>All Projects</option>
            </select>
          </div>
          <div className="h-48">
            <Bar
              data={budgetVsActualData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw.toLocaleString()}`
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${value/1000}k`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Monthly IT Spend Trend */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-sky-800 flex items-center">
              <BsGraphUp className="text-sky-600 mr-2" />
              Monthly Spend Trend
            </h3>
            <button className="text-xs p-1 text-sky-600">
              <BsInfoCircle />
            </button>
          </div>
          <div className="h-48">
            <Line
              data={monthlySpendTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw.toLocaleString()}`
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${value/1000}k`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>


    {/* Quick Links to Sub-Pages */}
<div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 mt-6">
  <h3 className="text-md font-semibold text-sky-800 mb-4">Explore Detailed Analytics</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
    {navItems.map((item, index) => (
      <Link 
        to={item.path} 
        key={index} 
        className="bg-sky-50 hover:bg-sky-100 p-3 rounded-lg text-center text-sm font-medium text-sky-800 transition-colors"
      >
        <div className="mx-auto w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mb-2 text-sky-600">
          {item.icon}
        </div>
        {item.name}
      </Link>
    ))}
  </div>
</div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-5 rounded-xl shadow-sm border border-sky-200 mt-6">
        <h3 className="text-lg font-semibold text-sky-800 mb-3 flex items-center">
          <BsStars className="text-blue-500 mr-2" />
          AI IT Spend Insights
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Cloud Optimization Opportunity</div>
            <div className="text-sky-700">Right-sizing underutilized cloud resources could save ~$85,000 annually (17% of current cloud spend).</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">License Waste Alert</div>
            <div className="text-sky-700">32% of SaaS licenses are underutilized. Consolidating overlapping tools could save $120,000/year.</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Tech Debt Impact</div>
            <div className="text-sky-700">Legacy systems account for 28% of IT spend but only 15% of business value. Modernization could yield 23% ROI.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITSpendAnalytics;