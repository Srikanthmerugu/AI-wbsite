import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const BudgetVsActuals = () => {
  const [favorites, setFavorites] = useState({
    overview: true,
    spendingTrends: false,
    categoryAnalysis: true
  });

  const toggleFavorite = (key) => {
    setFavorites(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Overview chart data
  const overviewOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Amount ($)'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B82F6', '#10B981'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val.toLocaleString()
        }
      }
    }
  };

  const overviewSeries = [
    {
      name: 'Budget',
      data: [12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500]
    },
    {
      name: 'Actual',
      data: [11500, 12800, 12500, 14200, 13800, 15200, 14800, 16200, 15800, 17200, 16800, 18200]
    }
  ];

  // Spending trends chart data
  const trendsOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    stroke: {
      curve: 'smooth',
      width: [3, 3],
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Variance ($)'
      }
    },
    colors: ['#EF4444', '#10B981'],
    legend: {
      position: 'top',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val.toLocaleString()
        }
      }
    }
  };

  const trendsSeries = [
    {
      name: 'Variance',
      data: [-500, 300, -500, 700, -200, 700, -200, 700, -200, 700, -200, 700]
    },
    {
      name: 'Cumulative',
      data: [-500, -200, -700, 0, -200, 500, 300, 1000, 800, 1500, 1300, 2000]
    }
  ];

  // Category analysis chart data
  const categoryOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Salaries', 'Marketing', 'Office Supplies', 'Travel', 'Utilities', 'Software'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val.toLocaleString()
        }
      }
    }
  };

  const categorySeries = [45000, 25000, 15000, 12000, 8000, 5000];

  // Alert data
  const alerts = [
    { id: 1, category: 'Marketing', amount: 12500, budget: 10000, severity: 'high' },
    { id: 2, category: 'Travel', amount: 8500, budget: 7500, severity: 'medium' },
    { id: 3, category: 'Software', amount: 5200, budget: 5000, severity: 'low' }
  ];

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget vs. Actuals Tracking</h1> */}

       {/* Header */}
            <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-bold text-white">Budget vs. Actuals Tracking</h1>
                  {/* <p className="text-sky-100 text-xs">{selectedCompany}</p> */}
                </div>
                {/* <div className="flex space-x-2">
                  <button
                    type="button"
                    className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter className="mr-1" />
                    Filters
                  </button>
                  <button
                    type="button"
                    className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
                  >
                    <FiPlus className="mr-1" />
                    Add Widget
                  </button>
                </div> */}
              </div>
            </div>
      
      {/* Overview Card */}
      <div className="bg-white rounded-lg shadow-md mt-5 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            Budget vs. Actual Overview
            <button 
              onClick={() => toggleFavorite('overview')}
              className="ml-2 text-yellow-400"
            >
              {favorites.overview ? '★' : '☆'}
            </button>
          </h2>
          <span className="text-sm text-gray-500">Last updated: Today</span>
        </div>
        <Chart
          options={overviewOptions}
          series={overviewSeries}
          type="bar"
          height={350}
        />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-blue-600">$178,500</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Actual</p>
            <p className="text-2xl font-bold text-green-600">$183,500</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Variance</p>
            <p className="text-2xl font-bold text-red-600">+$5,000</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Spending Trends Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              Spending Trends
              <button 
                onClick={() => toggleFavorite('spendingTrends')}
                className="ml-2 text-yellow-400"
              >
                {favorites.spendingTrends ? '★' : '☆'}
              </button>
            </h2>
          </div>
          <Chart
            options={trendsOptions}
            series={trendsSeries}
            type="line"
            height={350}
          />
        </div>

        {/* Category Analysis Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              Category Analysis
              <button 
                onClick={() => toggleFavorite('categoryAnalysis')}
                className="ml-2 text-yellow-400"
              >
                {favorites.categoryAnalysis ? '★' : '☆'}
              </button>
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2">
              <Chart
                options={categoryOptions}
                series={categorySeries}
                type="donut"
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-4">
              <div className="space-y-3">
                {categoryOptions.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: categoryOptions.colors[index] }}
                      ></div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${categorySeries[index].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Alerts Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending Control Alerts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${alert.budget.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${alert.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(alert.amount - alert.budget).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {alert.severity === 'high' ? 'Over Budget' : 
                       alert.severity === 'medium' ? 'Approaching Limit' : 'Slightly Over'}
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

export default BudgetVsActuals;