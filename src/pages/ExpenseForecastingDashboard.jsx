import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiDollarSign, 
  FiLayers,
  FiBarChart2,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ExpenseForecastingDashboard = () => {
  const [timeframe, setTimeframe] = useState('12M');
  const [scenario, setScenario] = useState('baseline');
  const [activeTab, setActiveTab] = useState(0);

  // Sample data
  const fixedVsVariableData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fixed Costs',
        data: [32000, 32000, 32000, 32000, 32000, 32000],
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
      },
      {
        label: 'Variable Costs',
        data: [18000, 22000, 19000, 25000, 21000, 28000],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ]
  };

  const departmentData = {
    labels: ['Marketing', 'Operations', 'HR', 'IT', 'R&D'],
    datasets: [{
      data: [25000, 45000, 18000, 32000, 15000],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(139, 92, 246, 0.7)'
      ]
    }]
  };

  const scenarioData = [
    {
      name: 'Baseline',
      expenses: 500000,
      profit: 1200000,
      margin: '19.2%'
    },
    {
      name: '10% Cost Reduction',
      expenses: 450000,
      profit: 1250000,
      margin: '21.7%'
    },
    {
      name: '5% Inflation Impact',
      expenses: 525000,
      profit: 1175000,
      margin: '18.3%'
    },
    {
      name: 'Vendor Price Hike',
      expenses: 550000,
      profit: 1150000,
      margin: '17.3%'
    }
  ];

  return (
    <div className="space-y-6 p-4 min-h-screen">

<div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Expense Forecasting</h1>
            <p className="text-sky-100 mt-2">Predictive cost planning for fixed & variable expenses</p>
          </div>
    <div>
    <div className="flex space-x-4 ">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white text-sky-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
          >
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="12M">12 Months</option>
            <option value="24M">24 Months</option>
          </select>
          <button className="py-2.5 px-5 shadow-2xl text-sm font-medium text-white bg-sky-900 rounded-lg   hover:bg-white hover:text-sky-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
            <span className='flex items-center'><FiRefreshCw className="mr-2" /> Refresh Forecast</span>
          </button>
        </div>
    </div>

         
        </div>
      </div>
      {/* Header */}
    
      {/* Main Dashboard */}
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex border-b border-gray-200 mb-6">
          <Tab className="px-4 py-2 cursor-pointer font-medium text-gray-600 hover:text-blue-600 focus:outline-none">
            <FiLayers className="inline mr-2" /> Fixed vs Variable
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer font-medium text-gray-600 hover:text-blue-600 focus:outline-none">
            <FiPieChart className="inline mr-2" /> Department View
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer font-medium text-gray-600 hover:text-blue-600 focus:outline-none">
            <FiBarChart2 className="inline mr-2" /> Scenario Planning
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer font-medium text-gray-600 hover:text-blue-600 focus:outline-none">
            <FiSettings className="inline mr-2" /> Adjustments
          </Tab>
        </TabList>

        <TabPanel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-blue-500" /> Fixed vs Variable Expense Projection
              </h2>
              <div className="h-80">
                <Bar 
                  data={fixedVsVariableData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: true,
                        grid: { display: false }
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Fixed Costs (Rent, Salaries)
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full ml-4 mr-1"></span> Variable Costs (Utilities, Supplies)
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiDollarSign className="mr-2 text-purple-500" /> AI-Categorized Expenses
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Fixed Costs</span>
                    <span>$192,000</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">(62% of total)</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Variable Costs</span>
                    <span>$118,000</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">(38% of total)</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">One-Time Costs</span>
                    <span>$24,500</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">(8% of variable)</div>
                </div>
                <div className="text-xs text-gray-400 mt-4">
                  * AI automatically categorizes expenses based on historical patterns
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Department Breakdown</h2>
              <div className="h-64">
                <Pie 
                  data={departmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Department-Level Cost Analysis</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Drivers</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Marketing</td>
                      <td className="px-6 py-4 whitespace-nowrap">$25,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">$27,500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+10%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ad spend increase, new campaigns</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Operations</td>
                      <td className="px-6 py-4 whitespace-nowrap">$45,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">$42,300</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600">-6%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Process optimization savings</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">HR</td>
                      <td className="px-6 py-4 whitespace-nowrap">$18,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">$19,800</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+10%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Annual raises, new hires</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Scenario-Based Expense Planning</h2>
              <div className="flex space-x-4 mb-6">
                {['baseline', '10% reduction', '5% inflation', 'vendor hike'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setScenario(item)}
                    className={`px-4 py-2 rounded-lg ${scenario === item ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioData.map((item) => (
                      <tr key={item.name} className={item.name.toLowerCase().includes(scenario) ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${item.expenses.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${item.profit.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.margin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Profit Impact</h3>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${scenario === 'baseline' ? '100%' : scenario === '10% reduction' ? '120%' : scenario === '5% inflation' ? '90%' : '85%'}` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>-20%</span>
                    <span>Baseline</span>
                    <span>+20%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Key Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                      {scenario === '10% reduction' 
                        ? 'Implement process automation to maintain savings' 
                        : 'Identify 2-3 departments for cost optimization'}
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                      {scenario === '5% inflation' 
                        ? 'Renegotiate vendor contracts to offset inflation' 
                        : 'Review vendor contracts for potential savings'}
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                      'Maintain 3-6 months emergency operating funds'
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Automated Cost Adjustments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <FiTrendingUp className="mr-2 text-orange-500" /> Inflation Adjustments
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Inflation Rate</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-Adjust Enabled</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Expenses automatically adjusted quarterly based on CPI data
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-purple-500" /> Vendor Price Changes
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Vendor Contracts</span>
                    <span className="font-medium">12 tracked</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upcoming Changes</span>
                    <span className="font-medium">3 in next 90 days</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    AI monitors contract terms and price change notifications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ExpenseForecastingDashboard;