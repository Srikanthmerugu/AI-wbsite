import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  BsStars, 
  BsFilter, 
  BsDownload,
  BsInfoCircle,
  BsGraphUp,
  BsPeople,
  BsCashStack,
  BsClock,
  BsPieChart,
  BsBarChart,
  BsServer,
  BsShieldLock,
  BsCodeSquare,
  BsChatSquareText
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
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

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

export const HRworkForce = () => {
  const [timePeriod, setTimePeriod] = useState('Last Quarter');
  const [department, setDepartment] = useState('All Departments');
  const [jobLevel, setJobLevel] = useState('All Levels');
  const [location, setLocation] = useState('All Locations');
  const [employmentType, setEmploymentType] = useState('All Types');

  
  // Mock data
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const jobLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
  const locations = ['North America', 'Europe', 'Asia', 'Remote'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];

  // KPI data
  const kpis = [
    {
      id: 1,
      name: 'Revenue per Employee',
      value: '$245,000',
      change: '+12%',
      trend: 'up',
      forecast: '$255,000 next quarter',
      icon: <BsCashStack size={20} />,
      color: 'text-green-600'
    },
    {
      id: 2,
      name: 'Utilization Rate',
      value: '78%',
      change: '-3%',
      trend: 'down',
      forecast: '75% next quarter',
      icon: <BsGraphUp size={20} />,
      color: 'text-amber-600'
    },
    {
      id: 3,
      name: 'Turnover Rate',
      value: '8.2%',
      change: '+1.5%',
      trend: 'up',
      forecast: '7.8% next quarter',
      icon: <BsPeople size={20} />,
      color: 'text-red-600'
    },
    {
      id: 4,
      name: 'Time to Hire',
      value: '32 days',
      change: '-4 days',
      trend: 'down',
      forecast: '30 days next quarter',
      icon: <BsClock size={20} />,
      color: 'text-green-600'
    }
  ];

  const navItems = [
    { name: "Employee Productivity Report", icon: <BsPieChart />, path: "/hr-workforce" },
    { name: "Utilization Rate Report", icon: <BsBarChart />, path: "/hr-workforce" },
    { name: "Retention & Attrition Rate Analysis", icon: <BsServer />, path: "/hr-workforce" },
    { name: "Hiring Funnel Metrics", icon: <BsGraphUp />, path: "/hr-workforce" },
    { name: "Diversity & Inclusion Metrics", icon: <BsShieldLock />, path: "/hr-workforce" },
    { name: "Compensation & Benefit Analysis", icon: <BsCodeSquare />, path: "/hr-workforce" }
  ];

  // Productivity data
  const productivityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Engineering',
        data: [210, 225, 230, 240, 235, 245],
        backgroundColor: '#4BC0C0',
      },
      {
        label: 'Marketing',
        data: [180, 185, 190, 195, 200, 205],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Sales',
        data: [250, 260, 270, 280, 290, 300],
        backgroundColor: '#FFCE56',
      }
    ]
  };

  // Utilization data
  const utilizationData = {
    labels: departments,
    datasets: [
      {
        label: 'Billable Hours',
        data: [75, 65, 80, 70, 60, 72],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Non-Billable Hours',
        data: [25, 35, 20, 30, 40, 28],
        backgroundColor: '#FF9F40',
      }
    ]
  };

  // Retention data
  const retentionData = {
    labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023'],
    datasets: [
      {
        label: 'Retention Rate',
        data: [92, 91, 90, 89, 88],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Hiring funnel data
  const funnelData = {
    labels: ['Applicants', 'Screened', 'Interviews', 'Offers', 'Hires'],
    datasets: [
      {
        data: [1000, 400, 150, 75, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }
    ]
  };

  // Diversity data
  const diversityData = {
    labels: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    datasets: [
      {
        data: [62, 35, 2, 1],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      }
    ]
  };

  // Compensation data
  const compensationData = {
    labels: jobLevels,
    datasets: [
      {
        label: 'Median Salary',
        data: [65000, 95000, 135000, 175000, 250000],
        backgroundColor: '#9966FF',
      }
    ]
  };

  // Retention table data
  const retentionTableData = departments.map(dept => ({
    department: dept,
    retentionRate: `${85 + Math.floor(Math.random() * 10)}%`,
    tenure: `${2 + Math.random() * 3 | 0}.${Math.random() * 10 | 0} yrs`,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));

  // Compensation table data
  const compensationTableData = jobLevels.map(level => ({
    level,
    medianSalary: `$${(60000 + (Math.random() * 200000)).toLocaleString(undefined, {maximumFractionDigits: 0})}`,
    equity: `${Math.random() * 30 | 0}%`,
    bonus: `${Math.random() * 25 | 0}%`
  }));

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with filters */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">HR & Workforce Analytics</h1>
            <p className="text-sky-100 text-xs">Employee Productivity & Engagement Metrics</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sky-600 text-sm font-medium">{kpi.name}</div>
                <div className="text-2xl font-bold mt-1">{kpi.value}</div>
              </div>
              <div className={`p-2 rounded-lg bg-sky-50 ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm">
                <span className={`${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} {kpi.trend === 'up' ? '↑' : '↓'}
                </span>
                <span className="text-sky-600 ml-2">vs previous</span>
              </div>
              <div className="text-xs text-sky-500 flex items-center">
                <BsStars className="mr-1" /> {kpi.forecast}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <BsGraphUp className="text-sky-600 mr-2" />
              Revenue per Employee
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={productivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw.toLocaleString()}K`
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${value}K`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Utilization */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <BsPieChart className="text-sky-600 mr-2" />
              Utilization Rate
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={utilizationData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw}%`
                    }
                  }
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Retention */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <BsPeople className="text-sky-600 mr-2" />
              Retention Trends
            </h3>
          </div>
          <div className="h-64">
            <Line
              data={retentionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw}%`
                    }
                  }
                },
                scales: {
                  y: {
                    max: 100,
                    min: 80,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Hiring Funnel */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <BsBarChart className="text-sky-600 mr-2" />
              Hiring Funnel
            </h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={funnelData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <h3 className="text-lg font-semibold text-sky-800 mb-4">Retention by Department</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Retention %</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Avg Tenure</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {retentionTableData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-sky-900">{row.department}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-900">{row.retentionRate}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-900">{row.tenure}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`${row.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {row.trend === 'up' ? '↑ Improving' : '↓ Declining'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compensation Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <h3 className="text-lg font-semibold text-sky-800 mb-4">Compensation by Level</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Job Level</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Median Salary</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Equity %</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-sky-500 uppercase tracking-wider">Bonus %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {compensationTableData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-sky-900">{row.level}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-900">{row.medianSalary}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-900">{row.equity}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-900">{row.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          AI Workforce Insights
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Turnover Risk</div>
            <div className="text-sky-700">Engineering department shows 15% higher turnover risk than company average. Top factors: competitive market, promotion wait time.</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Hiring Bottleneck</div>
            <div className="text-sky-700">Time-to-hire increased by 8 days for Senior roles. Screening-to-interview conversion dropped to 28% (from 35% last quarter).</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Compensation Insight</div>
            <div className="text-sky-700">Mid-level salaries are 7% below market in Engineering. Equity grants are competitive but cash compensation lags peers.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRworkForce;