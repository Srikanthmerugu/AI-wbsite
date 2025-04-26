import React, { useState } from 'react';
import { 
  BsStars, 
  BsCalendarRange, 
  BsCheckCircle, 
  BsExclamationTriangle, 
  BsFilter, 
  BsDownload,
  BsPlusCircle,
  BsUpload, 
  BsTable,
  BsInfoCircle
} from 'react-icons/bs';
import { 
  Line,
  Bar,
  Doughnut 
} from 'react-chartjs-2';
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

export const DepreciationForecast = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedMethod, setSelectedMethod] = useState('All Methods');
  const [selectedTimeframe, setSelectedTimeframe] = useState('5 Years');
  const [showNewAssetForm, setShowNewAssetForm] = useState(false);

  // Mock asset data
  const assets = [
    {
      id: 1,
      name: 'Manufacturing Equipment A',
      category: 'Machinery',
      purchaseDate: '2023-06-15',
      initialValue: 450000,
      usefulLife: 10,
      depreciationMethod: 'Straight Line',
      currentBookValue: 405000,
      yearlyDepreciation: 45000,
      remainingYears: 9,
      taxSavings: 9450,
      status: 'active',
      alerts: [],
    },
    {
      id: 2,
      name: 'Office Building East',
      category: 'Real Estate',
      purchaseDate: '2020-02-10',
      initialValue: 2500000,
      usefulLife: 39,
      depreciationMethod: 'Straight Line',
      currentBookValue: 2243590,
      yearlyDepreciation: 64103,
      remainingYears: 35,
      taxSavings: 13462,
      status: 'active',
      alerts: [],
    },
    {
      id: 3,
      name: 'Company Software License',
      category: 'Intangible',
      purchaseDate: '2022-11-30',
      initialValue: 180000,
      usefulLife: 3,
      depreciationMethod: 'Straight Line',
      currentBookValue: 120000,
      yearlyDepreciation: 60000,
      remainingYears: 2,
      taxSavings: 12600,
      status: 'warning',
      alerts: ['Nearing full amortization', 'Plan renewal needed'],
    },
    {
      id: 4,
      name: 'Delivery Trucks (5 units)',
      category: 'Vehicles',
      purchaseDate: '2021-08-20',
      initialValue: 320000,
      usefulLife: 7,
      depreciationMethod: 'Declining Balance',
      currentBookValue: 183040,
      yearlyDepreciation: 53760,
      remainingYears: 4,
      taxSavings: 11290,
      status: 'active',
      alerts: [],
    },
    {
      id: 5,
      name: 'Acquired Brand Name',
      category: 'Intangible',
      purchaseDate: '2019-05-12',
      initialValue: 750000,
      usefulLife: 10,
      depreciationMethod: 'Straight Line',
      currentBookValue: 375000,
      yearlyDepreciation: 75000,
      remainingYears: 5,
      taxSavings: 15750,
      status: 'active',
      alerts: [],
    },
    {
      id: 6,
      name: 'Server Hardware',
      category: 'IT Equipment',
      purchaseDate: '2022-03-15',
      initialValue: 210000,
      usefulLife: 5,
      depreciationMethod: 'Straight Line',
      currentBookValue: 147000,
      yearlyDepreciation: 42000,
      remainingYears: 3.5,
      taxSavings: 8820,
      status: 'warning',
      alerts: ['High maintenance costs detected'],
    },
  ];

  // Filter assets based on active tab and category
  const filteredAssets = assets.filter((asset) => {
    return (
      (activeTab === 'all' || 
       (activeTab === 'warnings' && asset.status === 'warning') ||
       (activeTab === 'expiring' && asset.remainingYears <= 1)) &&
      (selectedCategory === 'All Categories' || asset.category === selectedCategory) &&
      (selectedMethod === 'All Methods' || asset.depreciationMethod === selectedMethod)
    );
  });

  // Calculate summary data
  const totalInitialValue = assets.reduce((sum, asset) => sum + asset.initialValue, 0);
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.currentBookValue, 0);
  const totalYearlyDepreciation = assets.reduce((sum, asset) => sum + asset.yearlyDepreciation, 0);
  const totalTaxSavings = assets.reduce((sum, asset) => sum + asset.taxSavings, 0);

  // Forecast data for charts
  const years = Array.from({length: parseInt(selectedTimeframe)}, (_, i) => `Year ${i+1}`);
  
  // Depreciation by category data for stacked bar chart
  const categoryData = {
    labels: years,
    datasets: [
      {
        label: 'Machinery',
        data: [45000, 45000, 45000, 45000, 45000],
        backgroundColor: '#4BC0C0',
      },
      {
        label: 'Real Estate',
        data: [64103, 64103, 64103, 64103, 64103],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Intangible',
        data: [135000, 135000, 75000, 75000, 75000],
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Vehicles',
        data: [53760, 40320, 30240, 22680, 0],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'IT Equipment',
        data: [42000, 42000, 42000, 21000, 0],
        backgroundColor: '#9966FF',
      }
    ]
  };

  // Book value forecast line chart
  const bookValueData = {
    labels: ['Current', ...years],
    datasets: [
      {
        label: 'Total Book Value',
        data: [totalCurrentValue, 3133377, 2806954, 2550611, 2343828, 2159725],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Asset distribution by type
  const assetDistributionData = {
    labels: ['Machinery', 'Real Estate', 'Intangible', 'Vehicles', 'IT Equipment'],
    datasets: [
      {
        data: [450000, 2500000, 930000, 320000, 210000],
        backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB', '#9966FF'],
      },
    ],
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with controls */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Depreciation & Amortization Forecasting</h1>
            <p className="text-sky-100 text-xs">Understand financial impact and tax implications over time</p>
          </div>
          <div className="flex space-x-2">
            <select
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Machinery</option>
              <option>Real Estate</option>
              <option>Intangible</option>
              <option>Vehicles</option>
              <option>IT Equipment</option>
            </select>
            <select
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option>All Methods</option>
              <option>Straight Line</option>
              <option>Declining Balance</option>
              <option>Units of Production</option>
              <option>Sum of Years Digits</option>
            </select>
            <select
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option>3 Years</option>
              <option>5 Years</option>
              <option>10 Years</option>
              <option>15 Years</option>
            </select>
            <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <BsDownload className="mr-1" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 mt-5 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Total Asset Value</div>
          <div className="text-2xl font-bold text-sky-900">${totalInitialValue.toLocaleString()}</div>
          <div className="text-sm text-sky-600">Initial purchase cost</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Current Book Value</div>
          <div className="text-2xl font-bold text-sky-900">${totalCurrentValue.toLocaleString()}</div>
          <div className="text-sm text-sky-600">After depreciation</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Annual Depreciation</div>
          <div className="text-2xl font-bold text-sky-900">${totalYearlyDepreciation.toLocaleString()}</div>
          <div className="text-sm text-sky-600">Current year</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Tax Savings</div>
          <div className="text-2xl font-bold text-green-600">${totalTaxSavings.toLocaleString()}</div>
          <div className="text-sm text-sky-600">Estimated annual</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-200 mb-6">
        {['all', 'warnings', 'expiring'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab ? 'text-sky-800 border-b-2 border-sky-500' : 'text-sky-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all'
              ? 'All Assets'
              : tab === 'warnings'
              ? 'Assets with Warnings'
              : 'Expiring Soon'}
          </button>
        ))}
        
        <button
          className="ml-auto px-4 py-2 text-green-600 font-medium flex items-center"
          onClick={() => setShowNewAssetForm(!showNewAssetForm)}
        >
          <BsPlusCircle className="mr-1" /> Add New Asset
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets list - first 2/3 of the grid */}
        <div className="lg:col-span-2 space-y-4">
          {showNewAssetForm && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-green-200 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-sky-900">Add New Asset</h3>
                <button 
                  onClick={() => setShowNewAssetForm(false)}
                  className="text-sky-500 hover:text-sky-700">
                  Cancel
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Asset Name</label>
                  <input type="text" className="w-full p-2 border border-sky-200 rounded" placeholder="Enter asset name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Category</label>
                  <select className="w-full p-2 border border-sky-200 rounded">
                    <option>Machinery</option>
                    <option>Real Estate</option>
                    <option>Intangible</option>
                    <option>Vehicles</option>
                    <option>IT Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Purchase Date</label>
                  <input type="date" className="w-full p-2 border border-sky-200 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Initial Value ($)</label>
                  <input type="number" className="w-full p-2 border border-sky-200 rounded" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Useful Life (Years)</label>
                  <input type="number" className="w-full p-2 border border-sky-200 rounded" placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-1">Depreciation Method</label>
                  <select className="w-full p-2 border border-sky-200 rounded">
                    <option>Straight Line</option>
                    <option>Declining Balance</option>
                    <option>Units of Production</option>
                    <option>Sum of Years Digits</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center text-sky-600 text-sm">
                  <BsStars className="mr-1" />
                  <span>AI suggests Straight Line method for this asset type</span>
                </div>
                <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
                  Add Asset
                </button>
              </div>
            </div>
          )}
          
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`bg-white p-5 rounded-xl shadow-sm border ${
                  asset.status === 'warning' 
                    ? 'border-amber-300' 
                    : asset.remainingYears <= 1 
                      ? 'border-red-200' 
                      : 'border-sky-100'
                } hover:border-sky-300 transition-colors`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                    {asset.status === 'warning' && (
                      <BsExclamationTriangle className="text-amber-500" />
                    )}
                    {asset.remainingYears <= 1 && (
                      <BsCalendarRange className="text-red-500" />
                    )}
                    {asset.name}
                  </h3>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">
                    {asset.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-sky-600">Purchase Date</div>
                    <div className="font-medium">{asset.purchaseDate}</div>
                  </div>
                  <div>
                    <div className="text-sky-600">Initial Value</div>
                    <div className="font-medium">${asset.initialValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sky-600">Current Book Value</div>
                    <div className="font-medium">${asset.currentBookValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sky-600">Method</div>
                    <div className="font-medium">{asset.depreciationMethod}</div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-sky-700">
                      ${asset.yearlyDepreciation.toLocaleString()}
                    </span>
                    <span className="text-sm text-sky-600">annual depreciation</span>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-sky-600">Remaining Life</div>
                      <div className={`text-sm font-medium ${
                        asset.remainingYears <= 1 
                          ? 'text-red-600' 
                          : asset.remainingYears <= 3 
                            ? 'text-amber-600' 
                            : 'text-green-600'
                      }`}>
                        {asset.remainingYears} years
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-sky-600">Tax Savings</div>
                      <div className="text-sm font-medium text-green-600">
                        ${asset.taxSavings.toLocaleString()}/yr
                      </div>
                    </div>
                  </div>

                  <button className="text-sm bg-sky-100 hover:bg-sky-200 text-sky-800 px-3 py-1 rounded">
                    Forecast Details
                  </button>
                </div>
                
                {asset.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-100">
                    <div className="text-amber-600 flex items-center text-sm">
                      <BsExclamationTriangle className="mr-1" />
                      <span className="font-medium">Alerts: </span>
                      <span className="ml-1">{asset.alerts.join(' • ')}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-sky-100 text-center">
              <div className="text-sky-400 mb-2">
                <BsStars size={32} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-sky-800 mb-1">
                No assets match your filters
              </h3>
              <p className="text-sky-600">
                Try adjusting your filters or add new assets to track
              </p>
            </div>
          )}
          
          {/* Add bulk upload button */}
          <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 border-dashed text-center">
            <button className="flex items-center justify-center mx-auto text-sky-700 font-medium">
              <BsUpload className="mr-2" /> Bulk Import Assets from Excel/CSV
            </button>
          </div>
        </div>

        {/* Analytics sidebar - last 1/3 of the grid */}
        <div className="space-y-6">
          {/* Depreciation forecast chart */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Depreciation Forecast by Category
            </h3>
            <div className="h-64">
              <BsStars className="absolute top-4 right-4 text-sky-500" size={24} />
              <Bar
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toLocaleString()}`
                      }
                    }
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Book value forecast */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Book Value Forecast
            </h3>
            <div className="h-64">
              <BsStars className="absolute top-4 right-4 text-sky-500" size={24} />
              <Line
                data={bookValueData}
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
                        callback: (value) => `$${value.toLocaleString()}`
                      },
                      beginAtZero: false
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Asset distribution */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Asset Value Distribution
            </h3>
            <div className="h-64">
              <BsStars className="absolute top-4 right-4 text-sky-500" size={24} />
              <Doughnut
                data={assetDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `$${ctx.raw.toLocaleString()} (${Math.round(ctx.raw/totalInitialValue*100)}%)`
                      }
                    },
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* AI Insights panel */}
          <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-5 rounded-xl shadow-sm border border-sky-200">
            <h3 className="text-lg font-semibold text-sky-800 mb-3 flex items-center">
              <BsStars className="text-blue-500 mr-2" />
              AI Insights
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-medium text-sky-900">Tax Optimization Opportunity</div>
                <div className="text-sky-700">Consider accelerated depreciation for new machinery purchases to maximize tax benefits in the current fiscal year.</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-medium text-sky-900">Impending Transition</div>
                <div className="text-sky-700">Software licenses worth $120,000 will be fully amortized within 2 years. Budget for replacement.</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="font-medium text-sky-900">Method Analysis</div>
                <div className="text-sky-700">Declining Balance method for vehicles shows 21% higher tax savings in first 3 years compared to Straight Line.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* What-if scenario simulator (collapsible section) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-sky-800 flex items-center">
            <BsTable className="text-sky-600 mr-2" />
            What-If Scenario Simulator
          </h3>
          <button className="text-sm text-sky-600 flex items-center">
            <BsInfoCircle className="mr-1" /> How to use this tool
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">New Asset Purchase</label>
            <input type="number" className="w-full p-2 border border-sky-200 rounded" placeholder="$0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">Purchase Timing</label>
            <select className="w-full p-2 border border-sky-200 rounded">
              <option>Current Quarter</option>
              <option>Next Quarter</option>
              <option>Next Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">Tax Rate Change</label>
            <select className="w-full p-2 border border-sky-200 rounded">
              <option>No Change</option>
              <option>+1% (22%)</option>
              <option>+2% (23%)</option>
              <option>-1% (20%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-1">Depreciation Method</label>
            <select className="w-full p-2 border border-sky-200 rounded">
              <option>Default (Per Asset)</option>
              <option>All Straight Line</option>
              <option>All Declining Balance</option>
              <option>Accelerated (MACRS)</option>
            </select>
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded">
            Run Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepreciationForecast;