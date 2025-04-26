import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiTrendingDown, FiSettings, FiFilter, FiDownload, FiShare2 } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const departments = [
  { id: 1, name: 'Marketing', budget: 150000, spent: 120000, variance: -30000 },
  { id: 2, name: 'Sales', budget: 200000, spent: 180000, variance: -20000 },
  { id: 3, name: 'Operations', budget: 250000, spent: 220000, variance: -30000 },
  { id: 4, name: 'HR', budget: 100000, spent: 95000, variance: -5000 },
  { id: 5, name: 'IT', budget: 180000, spent: 175000, variance: -5000 },
  { id: 6, name: 'R&D', budget: 220000, spent: 200000, variance: -20000 },
];

const skyColors = [
  'bg-sky-50', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-400',
  'bg-sky-500', 'bg-sky-600', 'bg-sky-700', 'bg-sky-800', 'bg-sky-900'
];

const textSkyColors = [
  'text-sky-50', 'text-sky-100', 'text-sky-200', 'text-sky-300', 'text-sky-400',
  'text-sky-500', 'text-sky-600', 'text-sky-700', 'text-sky-800', 'text-sky-900'
];

const borderSkyColors = [
  'border-sky-50', 'border-sky-100', 'border-sky-200', 'border-sky-300', 'border-sky-400',
  'border-sky-500', 'border-sky-600', 'border-sky-700', 'border-sky-800', 'border-sky-900'
];

const chartColors = [
  'rgba(56, 178, 172, 0.7)',  // Teal
  'rgba(49, 151, 149, 0.7)',  // Darker Teal
  'rgba(16, 185, 129, 0.7)',  // Emerald
  'rgba(5, 150, 105, 0.7)',   // Darker Emerald
  'rgba(6, 182, 212, 0.7)',    // Cyan
  'rgba(8, 145, 178, 0.7)',    // Darker Cyan
  'rgba(14, 165, 233, 0.7)',   // Sky
  'rgba(2, 132, 199, 0.7)',    // Darker Sky
  'rgba(59, 130, 246, 0.7)',   // Blue
  'rgba(37, 99, 235, 0.7)'     // Darker Blue
];

const OperationalBudgeting = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [timePeriod, setTimePeriod] = useState('Q1 2024');
  const [viewMode, setViewMode] = useState('chart');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bar chart data with multi-colors
  const barChartData = {
    labels: departments.map(dept => dept.name),
    datasets: [
      {
        label: 'Budget',
        data: departments.map(dept => dept.budget),
        backgroundColor: departments.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: departments.map((_, i) => chartColors[i % chartColors.length].replace('0.7', '1')),
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: departments.map(dept => dept.spent),
        backgroundColor: departments.map((_, i) => chartColors[(i + 5) % chartColors.length]),
        borderColor: departments.map((_, i) => chartColors[(i + 5) % chartColors.length].replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for selected department with multi-colors
  const pieChartData = {
    labels: ['Budget Remaining', 'Spent'],
    datasets: [
      {
        data: [selectedDepartment.budget - selectedDepartment.spent, selectedDepartment.spent],
        backgroundColor: [chartColors[0], chartColors[5]],
        borderColor: [chartColors[0].replace('0.7', '1'), chartColors[5].replace('0.7', '1')],
        borderWidth: 1,
        
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Department Budget vs Actual Spending',
        font: {
          size: 16,
          weight: 'bold',
          color: '#0c4a6e' // sky-900
        }
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedDepartment.name} Budget Utilization`,
        font: {
          size: 16,
          weight: 'bold',
          color: '#0c4a6e' // sky-900
        }
      },
    },
  };

  return (
    <div className={`space-y-6 p-4 min-h-screen relative bg-sky-50`}>
    


  {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Operational Budgeting</h1>
            {/* <p className="text-sky-100 text-xs">{selectedCompany}</p> */}
          </div>
          <div className="flex space-x-2">
          <button 
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200"
              >
            <FiDownload className='text-sky-50 hover:text-sky-900' />
            <span className="text-sky-50 hover:text-sky-900">Export</span>
          </button>
          <button
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-sky-700 bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200"
              >
            <FiShare2 className="text-sky-50 hover:text-sky-900" />
            <span className="text-sky-50 hover:text-sky-900">Share</span>
          </button>
        </div>
        </div>
      </div>























      <div className="grid mt-5 grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Department list */}
        <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-semibold text-lg ${textSkyColors[8]}`}>Departments</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`pl-8 pr-4 py-2 border ${borderSkyColors[2]} rounded-lg text-sm w-full focus:${borderSkyColors[4]} focus:ring-2 focus:ring-sky-300`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiFilter className={`absolute left-2 top-3 ${textSkyColors[4]}`} />
            </div>
          </div>

          <div className="space-y-2">
            {filteredDepartments.map((department) => (
              <div
                key={department.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedDepartment.id === department.id ? `${skyColors[1]} border ${borderSkyColors[3]}` : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedDepartment(department)}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${textSkyColors[7]}`}>{department.name}</span>
                  <span className={`text-sm ${department.variance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {department.variance < 0 ? '-' : '+'}${Math.abs(department.variance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Budget: ${department.budget.toLocaleString()}</span>
                  <span>Spent: ${department.spent.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Time period selector and view mode */}
          <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]}`}>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <select
                  className={`border ${borderSkyColors[2]} rounded-lg px-3 py-2 text-sm focus:${borderSkyColors[4]} focus:ring-2 focus:ring-sky-300 ${textSkyColors[7]}`}
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                >
                  <option>Q1 2024</option>
                  <option>Q2 2024</option>
                  <option>Q3 2024</option>
                  <option>Q4 2024</option>
                  <option>Full Year 2024</option>
                </select>
                {/* <button className={`px-3 py-2 ${skyColors[1]} rounded-lg text-sm flex items-center space-x-1 hover:${skyColors[2]}`}>
                  <FiSettings className={textSkyColors[6]} />
                  <span className={textSkyColors[7]}>Settings</span>
                </button> */}
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${viewMode === 'chart' ? `${skyColors[2]} ${textSkyColors[8]}` : `${skyColors[1]}`}`}
                  onClick={() => setViewMode('chart')}
                >
                  <FiPieChart />
                  <span>Charts</span>
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 ${viewMode === 'table' ? `${skyColors[2]} ${textSkyColors[8]}` : `${skyColors[1]}`}`}
                  onClick={() => setViewMode('table')}
                >
                  <FiDollarSign />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Department summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
              <div className="absolute top-2 right-2">
                <BsStars className={`${textSkyColors[5]}`} />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSkyColors[6]}`}>Budget</p>
                  <p className={`text-2xl font-bold ${textSkyColors[8]}`}>${selectedDepartment.budget.toLocaleString()}</p>
                </div>
                <div className={`${skyColors[1]} p-2 rounded-lg`}>
                  <FiDollarSign className={textSkyColors[6]} />
                </div>
              </div>
            </div>
            <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
              <div className="absolute top-2 right-2">
                <BsStars className={`${textSkyColors[5]}`} />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSkyColors[6]}`}>Spent</p>
                  <p className={`text-2xl font-bold ${textSkyColors[8]}`}>${selectedDepartment.spent.toLocaleString()}</p>
                </div>
                <div className={`${skyColors[1]} p-2 rounded-lg`}>
                  <FiTrendingDown className={textSkyColors[6]} />
                </div>
              </div>
            </div>
            <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
              <div className="absolute top-2 right-2">
                <BsStars className={`${textSkyColors[5]}`} />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${textSkyColors[6]}`}>Remaining</p>
                  <p className={`text-2xl font-bold ${selectedDepartment.variance < 0 ? 'text-red-500' : textSkyColors[7]}`}>
                    ${(selectedDepartment.budget - selectedDepartment.spent).toLocaleString()}
                  </p>
                </div>
                <div className={`${selectedDepartment.variance < 0 ? 'bg-red-50' : skyColors[1]} p-2 rounded-lg`}>
                  {selectedDepartment.variance < 0 ? (
                    <FiTrendingDown className="text-red-500" />
                  ) : (
                    <FiTrendingUp className={textSkyColors[6]} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Charts or table view */}
          {viewMode === 'chart' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
                <div className="absolute top-2 right-2">
                  <BsStars className={`${textSkyColors[5]}`} />
                </div>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
              <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
                <div className="absolute top-2 right-2">
                  <BsStars className={`${textSkyColors[5]}`} />
                </div>
                <Line data={pieChartData} options={pieChartOptions } />
              </div>
            </div>
          ) : (
            <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
              <div className="absolute top-2 right-2">
                <BsStars className={`${textSkyColors[5]}`} />
              </div>
              <h3 className={`font-semibold mb-4 ${textSkyColors[8]}`}>{selectedDepartment.name} Budget Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${skyColors[1]}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${textSkyColors[8]} uppercase tracking-wider`}>Category</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${textSkyColors[8]} uppercase tracking-wider`}>Budget</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${textSkyColors[8]} uppercase tracking-wider`}>Spent</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${textSkyColors[8]} uppercase tracking-wider`}>Remaining</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${textSkyColors[8]} uppercase tracking-wider`}>% Used</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { category: 'Salaries', budget: selectedDepartment.budget * 0.6, spent: selectedDepartment.spent * 0.55 },
                      { category: 'Software', budget: selectedDepartment.budget * 0.15, spent: selectedDepartment.spent * 0.2 },
                      { category: 'Marketing', budget: selectedDepartment.budget * 0.1, spent: selectedDepartment.spent * 0.1 },
                      { category: 'Travel', budget: selectedDepartment.budget * 0.08, spent: selectedDepartment.spent * 0.08 },
                      { category: 'Training', budget: selectedDepartment.budget * 0.07, spent: selectedDepartment.spent * 0.07 },
                    ].map((item, index) => {
                      const remaining = item.budget - item.spent;
                      const percentUsed = (item.spent / item.budget) * 100;
                      return (
                        <tr key={index}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textSkyColors[7]}`}>{item.category}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSkyColors[6]}`}>${Math.round(item.budget).toLocaleString()}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSkyColors[6]}`}>${Math.round(item.spent).toLocaleString()}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${textSkyColors[6]}`}>${Math.round(remaining).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${percentUsed}%` }}
                                ></div>
                              </div>
                              <span className={`ml-2 text-xs ${textSkyColors[6]}`}>{Math.round(percentUsed)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
  {/* AI Recommendations */}
  <div className={`bg-white p-4 rounded-lg shadow-sm border ${borderSkyColors[1]} relative`}>
            <div className="absolute top-2 right-2">
              <BsStars className={`${textSkyColors[5]}`} />
            </div>
            <h3 className={`font-semibold mb-4 ${textSkyColors[8]}`}>AI-Based Cost Optimization Suggestions</h3>
            <div className="space-y-3">
              <div className={`p-3 ${skyColors[1]} rounded-lg border ${borderSkyColors[2]}`}>
                <div className="flex items-start">
                  <div className={`${skyColors[2]} p-2 rounded-lg mr-3`}>
                    <FiDollarSign className={textSkyColors[7]} />
                  </div>
                  <div>
                    <p className={`font-medium ${textSkyColors[8]}`}>Reduce software subscriptions</p>
                    <p className={`text-sm ${textSkyColors[6]} mt-1`}>
                      AI detected 3 underutilized software licenses in {selectedDepartment.name} department that could save ~$12,000 annually.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-3 ${skyColors[1]} rounded-lg border ${borderSkyColors[2]}`}>
                <div className="flex items-start">
                  <div className={`${skyColors[2]} p-2 rounded-lg mr-3`}>
                    <FiTrendingUp className={textSkyColors[7]} />
                  </div>
                  <div>
                    <p className={`font-medium ${textSkyColors[8]}`}>Optimize travel expenses</p>
                    <p className={`text-sm ${textSkyColors[6]} mt-1`}>
                      Switching to virtual meetings for 30% of planned travel could save ~$8,500 this quarter without impacting productivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
       
        </div>
        
      </div>
       

      <ReactTooltip id="budget-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default OperationalBudgeting;