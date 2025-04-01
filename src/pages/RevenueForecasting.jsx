import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign,
  FiBarChart2,
  FiRefreshCw,
  FiSettings
} from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueForecasting = () => {
  // Historical trend data
  const historicalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [12000, 19000, 15000, 18000, 22000, 25000, 23000, 26000, 24000, 28000, 30000, 32000],
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Historical Avg',
        data: [11000, 15000, 14000, 16000, 19000, 21000, 22000, 23000, 22000, 25000, 27000, 29000],
        borderColor: 'rgba(100, 116, 139, 1)',
        backgroundColor: 'rgba(100, 116, 139, 0.05)',
        borderWidth: 1,
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      }
    ],
  };

  // AI Predictive model data
  const predictiveData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'AI Forecast',
        data: [23000, 26000, 24000, 28000, 30000, 32000, 31000, 33000, 35000],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Actual (to date)',
        data: [23000, 26000, 24000, null, null, null, null, null, null],
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }
    ],
  };

  // Scenario planning data
  const scenarioData = {
    labels: ['Q3', 'Q4', 'Q1', 'Q2'],
    datasets: [
      {
        label: 'Best Case',
        data: [90000, 110000, 120000, 130000],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: 'Baseline',
        data: [85000, 95000, 105000, 115000],
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: 'Worst Case',
        data: [75000, 80000, 85000, 90000],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.2
      }
    ],
  };

  // Revenue drivers data
  const drivers = [
    { name: 'Average Sale Price', current: '$125', projected: '$135', impact: '+8%' },
    { name: 'Sales Volume', current: '1,200/mo', projected: '1,350/mo', impact: '+12.5%' },
    { name: 'Customer Churn', current: '5.2%', projected: '4.5%', impact: '-0.7%' },
    { name: 'New Customers', current: '85/mo', projected: '95/mo', impact: '+11.8%' },
    { name: 'Upsell Rate', current: '22%', projected: '25%', impact: '+3%' }
  ];

  return (
    <div className="space-y-6 mb-10 p-4 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Revenue Forecasting</h1>
            <p className="text-sky-100 mt-2">Predictive models and scenario planning for future revenue</p>
          </div>
          <button 
            type="button" 
            className="py-2.5 px-5 shadow-2xl text-sm font-medium text-white bg-sky-900 rounded-lg border-2 border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Run New Forecast
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Next Quarter Forecast" 
          value="$105,000" 
          change="+12.3%" 
          isPositive={true} 
          icon={<FiTrendingUp className="text-green-500" size={24} />}
        />
        <KPICard 
          title="Forecast Accuracy" 
          value="92.4%" 
          change="+2.1%" 
          isPositive={true} 
          icon={<FiBarChart2 className="text-blue-500" size={24} />}
        />
        <KPICard 
          title="Seasonality Impact" 
          value="+8.5%" 
          change="+1.2%" 
          isPositive={true} 
          icon={<FiRefreshCw className="text-purple-500" size={24} />}
        />
        <KPICard 
          title="Risk Factor" 
          value="Medium" 
          change="-5.3%" 
          isPositive={true} 
          icon={<FiDollarSign className="text-sky-500" size={24} />}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Historical Trend Analysis">
          <Line 
            data={historicalData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
          <div className="mt-4 text-sm text-sky-700">
            <p>Analyzing 3 years of historical data with seasonal adjustments</p>
          </div>
        </ChartCard>
        
        <ChartCard title="AI-Powered Predictive Model">
          <Line 
            data={predictiveData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  grid: { display: false }
                }
              }
            }} 
          />
          <div className="mt-4 text-sm text-sky-700">
            <p>AI model confidence: 89% (incorporates market trends and pipeline data)</p>
          </div>
        </ChartCard>
        
        <ChartCard title="Scenario-Based Revenue Planning" fullWidth>
          <Line  
            data={scenarioData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  title: {
                    display: true,
                    text: 'Revenue ($)'
                  }
                },
                x: {
                  grid: { display: false },
                  title: {
                    display: true,
                    text: 'Quarter'
                  }
                }
              }
            }} 
          />
          {/* <div className="mt-4 text-sm text-sky-700">
            <p>Scenario modeling based on economic conditions and business drivers</p>
          </div> */}
        </ChartCard>
      </div>

      {/* Revenue Drivers Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-sky-900">Customizable Revenue Drivers</h2>
          <button className="flex items-center text-sm font-medium text-sky-700 hover:text-sky-900">
            <FiSettings className="mr-1" /> Adjust Parameters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Projected Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Revenue Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-100">
              {drivers.map((driver, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{driver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">{driver.current}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">{driver.projected}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      driver.impact.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.impact.startsWith('+') ? (
                        <FiTrendingUp className="mr-1" size={12} />
                      ) : (
                        <FiTrendingDown className="mr-1" size={12} />
                      )}
                      {driver.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button className="px-4 py-2 border border-sky-300 rounded-lg text-sky-700 bg-white hover:bg-sky-50 transition-colors">
          Save Scenario
        </button>
        <button className="px-4 py-2 border border-transparent rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition-colors">
          Export Forecast
        </button>
        <button className="px-4 py-2 border border-transparent rounded-lg text-white bg-sky-800 hover:bg-sky-900 transition-colors">
          Share With Team
        </button>
      </div>
    </div>
  );
};

// Reuse the same KPI and Chart Card components from FinancialOverview
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
              {change} {isPositive ? '↑' : '↓'} vs last forecast
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

const ChartCard = ({ title, children, fullWidth = false }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 ${
      fullWidth ? 'lg:col-span-2' : ''
    }`}>
      <h3 className="text-lg font-semibold text-sky-900 mb-4">{title}</h3>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default RevenueForecasting;