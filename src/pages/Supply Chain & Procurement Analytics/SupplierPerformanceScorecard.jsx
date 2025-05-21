import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'react-apexcharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const SupplierPerformanceScorecard = () => {
  const [timePeriod, setTimePeriod] = useState('Last Quarter');
  const [businessUnit, setBusinessUnit] = useState('All Units');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Supplier data
  const suppliers = [
    { 
      id: 1,
      name: 'Acme Materials', 
      delivery: '98%', 
      deliveryTrend: [92, 94, 96, 95, 97, 98],
      contract: '95%', 
      contractTrend: [90, 92, 93, 94, 95, 95],
      cost: '4.8/5', 
      costTrend: [4.5, 4.6, 4.7, 4.7, 4.8, 4.8],
      risk: 'Low',
      spend: '$1.2M',
      relationship: 'Strategic Partner',
      since: '2018'
    },
    { 
      id: 2,
      name: 'Global Logistics', 
      delivery: '89%', 
      deliveryTrend: [85, 86, 88, 87, 89, 89],
      contract: '91%', 
      contractTrend: [88, 89, 90, 90, 91, 91],
      cost: '4.2/5', 
      costTrend: [4.0, 4.1, 4.1, 4.2, 4.2, 4.2],
      risk: 'Medium',
      spend: '$850K',
      relationship: 'Preferred Vendor',
      since: '2020'
    },
    { 
      id: 3,
      name: 'Tech Components Inc', 
      delivery: '93%', 
      deliveryTrend: [90, 91, 92, 92, 93, 93],
      contract: '97%', 
      contractTrend: [95, 96, 96, 96, 97, 97],
      cost: '4.6/5', 
      costTrend: [4.4, 4.5, 4.5, 4.5, 4.6, 4.6],
      risk: 'Low',
      spend: '$1.5M',
      relationship: 'Strategic Partner',
      since: '2019'
    },
  ];

  // Performance trend data for the selected supplier
  const performanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'On-Time Delivery',
        data: selectedSupplier ? selectedSupplier.deliveryTrend : [],
        borderColor: '#004a80',
        backgroundColor: 'rgba(0, 74, 128, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Contract Adherence',
        data: selectedSupplier ? selectedSupplier.contractTrend : [],
        borderColor: '#3a7ca5',
        backgroundColor: 'rgba(58, 124, 165, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Cost Competitiveness',
        data: selectedSupplier ? selectedSupplier.costTrend.map(x => x * 20) : [], // Scale to 100 for chart
        borderColor: '#7fb2d0',
        backgroundColor: 'rgba(127, 178, 208, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  // Supplier comparison radar chart data
  const comparisonData = {
    labels: ['Delivery', 'Contract', 'Cost', 'Risk', 'Spend'],
    datasets: suppliers.map((supplier, idx) => ({
      label: supplier.name,
      data: [
        parseFloat(supplier.delivery),
        parseFloat(supplier.contract),
        parseFloat(supplier.cost) * 20, // Scale to 100
        supplier.risk === 'Low' ? 90 : supplier.risk === 'Medium' ? 60 : 30,
        parseFloat(supplier.spend.replace(/[^0-9.]/g, '')) / 20 // Scale down for chart
      ],
      backgroundColor: `rgba(${idx === 0 ? '0, 74, 128' : idx === 1 ? '58, 124, 165' : '127, 178, 208'}, 0.2)`,
      borderColor: idx === 0 ? '#004a80' : idx === 1 ? '#3a7ca5' : '#7fb2d0',
      borderWidth: 2
    }))
  };

  // Spend distribution pie chart
  const spendDistributionData = {
    labels: suppliers.map(s => s.name),
    datasets: [{
      data: suppliers.map(s => parseFloat(s.spend.replace(/[^0-9.]/g, ''))),
      backgroundColor: ['#004a80', '#3a7ca5', '#7fb2d0'],
      borderWidth: 0
    }]
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Supplier Performance Scorecard</h1>
            <p className="text-sky-100 text-xs">Track and analyze supplier performance metrics including on-time delivery, contract adherence, and cost competitiveness</p>
          </div>
          <div className="flex space-x-2">
            <div className="flex justify-between items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <label className="block w-full text-sm font-medium text-blue-50">Time Period</label>
              <select 
                className="mt-1 p-2 outline-0 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-800"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option>Last Quarter</option>
                <option>Year to Date</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <label className="block w-full text-sm font-medium text-blue-50">Business Unit</label>
              <select 
                className="mt-1 p-2 block outline-0 w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-800"
                value={businessUnit}
                onChange={(e) => setBusinessUnit(e.target.value)}
              >
                <option>All Units</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia-Pacific</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Supplier Table */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Supplier Performance Metrics</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">On-Time Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Contract Adherence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Cost Competitiveness</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Annual Spend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {suppliers.map((supplier) => (
                  <tr 
                    key={supplier.id} 
                    className={`cursor-pointer ${selectedSupplier?.id === supplier.id ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-blue-800">{supplier.name}</div>
                      <div className="text-xs text-blue-500">{supplier.relationship}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.delivery > '95%' ? 'bg-green-100 text-green-800' : supplier.delivery > '90%' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {supplier.delivery}
                        </span>
                        <span className="ml-2 text-xs text-blue-500">+2% QoQ</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.contract > '95%' ? 'bg-green-100 text-green-800' : supplier.contract > '90%' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {supplier.contract}
                        </span>
                        <span className="ml-2 text-xs text-blue-500">+1% QoQ</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <div className="flex items-center">
                        <div className="w-16">
                          <Chart
                            options={{
                              chart: {
                                sparkline: {
                                  enabled: true
                                },
                              },
                              colors: ['#004a80'],
                              plotOptions: {
                                radialBar: {
                                  startAngle: -90,
                                  endAngle: 90,
                                  hollow: {
                                    margin: 0,
                                    size: '70%',
                                  },
                                  dataLabels: {
                                    name: {
                                      show: false
                                    },
                                    value: {
                                      offsetY: -2,
                                      fontSize: '12px',
                                      formatter: function(val) {
                                        return parseFloat(val/20).toFixed(1);
                                      }
                                    }
                                  }
                                }
                              },
                            }}
                            series={[parseFloat(supplier.cost) * 20]}
                            type="radialBar"
                            width="100%"
                            height="100%"
                          />
                        </div>
                        <span className="ml-2 text-xs text-blue-500">{supplier.cost}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.risk === 'Low' ? 'bg-green-100 text-green-800' : supplier.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">
                      {supplier.spend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Supplier Performance Trend */}
          {selectedSupplier && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">{selectedSupplier.name} Performance Trend</h3>
              <div className="h-64 bg-white rounded-lg p-4">
                <Bar 
                  data={performanceTrendData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          label: function(context) {
                            let label = context.dataset.label || '';
                            if (label === 'Cost Competitiveness') {
                              return `${label}: ${(context.raw / 20).toFixed(1)}/5`;
                            }
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += context.parsed.y + (label.includes('Delivery') || label.includes('Contract') ? '%' : '');
                            }
                            return label;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      },
                      y1: {
                        position: 'right',
                        min: 80,
                        max: 100,
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          callback: function(value) {
                            return (value / 20).toFixed(1);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Supplier Comparison */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Supplier Comparison</h2>
            <div className="h-64">
              <Chart
                options={{
                  chart: {
                    type: 'radar',
                    toolbar: {
                      show: false
                    }
                  },
                  colors: ['#004a80', '#3a7ca5', '#7fb2d0'],
                  xaxis: {
                    categories: comparisonData.labels
                  },
                  yaxis: {
                    show: false,
                    min: 0,
                    max: 100
                  },
                  tooltip: {
                    y: {
                      formatter: function(val, { seriesIndex }) {
                        if (seriesIndex === 2) {
                          return (val / 20).toFixed(1) + '/5'; // Cost
                        } else if (seriesIndex === 3) {
                          return val > 80 ? 'Low' : val > 50 ? 'Medium' : 'High'; // Risk
                        } else if (seriesIndex === 4) {
                          return '$' + (val * 20).toFixed(1) + 'K'; // Spend
                        }
                        return val + (seriesIndex < 2 ? '%' : '');
                      }
                    }
                  }
                }}
                series={comparisonData.datasets.map(d => ({
                  name: d.label,
                  data: d.data
                }))}
                type="radar"
                height="100%"
              />
            </div>
          </div>

          {/* Spend Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Spend Distribution</h2>
            <div className="h-48">
              <Pie
                data={spendDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: $${context.raw.toLocaleString()}`;
                        },
                        afterLabel: function(context) {
                          const supplier = suppliers.find(s => s.name === context.label);
                          return `Relationship: ${supplier.relationship}\nSince: ${supplier.since}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Performance Summary</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Best On-Time Delivery</p>
                <p className="text-xl font-bold text-blue-600">Acme Materials <span className="text-green-600">98%</span></p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Best Contract Adherence</p>
                <p className="text-xl font-bold text-blue-600">Tech Components <span className="text-green-600">97%</span></p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Most Cost Competitive</p>
                <p className="text-xl font-bold text-blue-600">Acme Materials <span className="text-green-600">4.8/5</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReactTooltip place="top" type="dark" effect="solid" />
    </div>
  );
};

export default SupplierPerformanceScorecard;