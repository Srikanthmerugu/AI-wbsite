import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { FiDownload} from "react-icons/fi";

const CashFlowProjections = () => {
  // State for simulation controls
  const [paymentTerms, setPaymentTerms] = useState({
    receivables: 30,
    payables: 45
  });
  const [scenarios, setScenarios] = useState('baseline');

  // Sample data - in a real app, this would come from an API
  const cashFlowData = {
    baseline: {
      '30d': [12000, 15000, 18000],
      '60d': [25000, 28000, 32000],
      '90d': [40000, 45000, 50000]
    },
    optimistic: {
      '30d': [15000, 18000, 22000],
      '60d': [30000, 35000, 40000],
      '90d': [50000, 55000, 60000]
    },
    pessimistic: {
      '30d': [8000, 10000, 12000],
      '60d': [18000, 22000, 25000],
      '90d': [30000, 35000, 38000]
    }
  };

  // Bank balance forecast data
  const bankBalanceData = {
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false }
      },
      colors: ['#3B82F6', '#10B981', '#F59E0B'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: ['Current', '30 Days', '60 Days', '90 Days'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: { labels: { formatter: (val) => `$${val.toLocaleString()}` } },
      tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } },
      legend: { position: 'top' }
    },
    series: [
      {
        name: 'Minimum Balance',
        data: [25000, 22000, 28000, 35000]
      },
      {
        name: 'Projected Balance',
        data: [25000, 32000, 45000, 60000]
      },
      {
        name: 'Maximum Balance',
        data: [25000, 38000, 55000, 75000]
      }
    ]
  };

  // Debt repayment schedule
  const debtSchedule = [
    { name: 'Term Loan A', balance: 125000, nextPayment: '2025-04-15', amount: 4500, rate: '5.25%' },
    { name: 'Line of Credit', balance: 75000, nextPayment: '2025-03-30', amount: 1800, rate: '7.10%' },
    { name: 'Equipment Financing', balance: 62000, nextPayment: '2025-04-05', amount: 3200, rate: '6.50%' }
  ];

  // Handle payment term changes
  const handleTermChange = (type, days) => {
    setPaymentTerms(prev => ({ ...prev, [type]: parseInt(days) }));
  };

  return (
    <div className="sspace-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-lg font-bold text-white">Cash Flow Projections</h1>
      <p className="text-sky-100 text-xs">
        AI-driven liquidity predictions and scenario analysis
      </p>
    </div>

    <button
      onClick={() => window.print()}
      className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200"
    >
      <FiDownload className="text-sky-50" />
      <span className="text-sky-50">Export</span>
    </button>
  </div>
</div>




      {/* <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Expense Forecasting</h1>
            <p className="text-sky-100 mt-2">Predictive cost planning for fixed & variable expenses</p>
          </div>
    <div>
]    <div> */}
      

      {/* Scenario Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Scenario Simulation</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setScenarios('baseline')}
              className={`px-4 py-2 rounded-lg ${scenarios === 'baseline' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Baseline
            </button>
            <button
              onClick={() => setScenarios('optimistic')}
              className={`px-4 py-2 rounded-lg ${scenarios === 'optimistic' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Optimistic
            </button>
            <button
              onClick={() => setScenarios('pessimistic')}
              className={`px-4 py-2 rounded-lg ${scenarios === 'pessimistic' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Pessimistic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Payment Terms Adjustment</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Accounts Receivable (Days)</label>
              <input
                type="range"
                min="0"
                max="90"
                value={paymentTerms.receivables}
                onChange={(e) => handleTermChange('receivables', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>30</span>
                <span>60</span>
                <span>90</span>
              </div>
              <div className="mt-1 text-sm font-medium text-blue-600">
                Current: {paymentTerms.receivables} days
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Payment Terms Adjustment</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Accounts Payable (Days)</label>
              <input
                type="range"
                min="0"
                max="90"
                value={paymentTerms.payables}
                onChange={(e) => handleTermChange('payables', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>30</span>
                <span>60</span>
                <span>90</span>
              </div>
              <div className="mt-1 text-sm font-medium text-blue-600">
                Current: {paymentTerms.payables} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 30/60/90 Day Projections */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">30/60/90 Day Cash Flow Projections</h2>
          <Chart
            options={{
              chart: { type: 'bar', toolbar: { show: false } },
              colors: ['#3B82F6', '#10B981', '#F59E0B'],
              plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
              dataLabels: { enabled: false },
              xaxis: { categories: ['Minimum', 'Expected', 'Maximum'] },
              yaxis: { labels: { formatter: (val) => `$${val.toLocaleString()}` } },
              tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } }
            }}
            series={[
              { name: '30 Days', data: cashFlowData[scenarios]['30d'] },
              { name: '60 Days', data: cashFlowData[scenarios]['60d'] },
              { name: '90 Days', data: cashFlowData[scenarios]['90d'] }
            ]}
            type="bar"
            height={350}
          />
        </div>

        {/* Bank Balance Forecast */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bank Balance Forecasting</h2>
          <Chart
            options={bankBalanceData.options}
            series={bankBalanceData.series}
            type="area"
            height={350}
          />
        </div>
      </div>

      {/* Debt & Loan Repayment */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Debt & Loan Repayment Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {debtSchedule.map((debt, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${debt.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.nextPayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${debt.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      -${(debt.amount * 3).toLocaleString()}/90d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">30-Day Projected Cash Flow</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${cashFlowData[scenarios]['30d'][1].toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Range: ${cashFlowData[scenarios]['30d'][0].toLocaleString()} - ${cashFlowData[scenarios]['30d'][2].toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">60-Day Projected Cash Flow</h3>
          <p className="text-2xl font-bold text-green-600">
            ${cashFlowData[scenarios]['60d'][1].toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Range: ${cashFlowData[scenarios]['60d'][0].toLocaleString()} - ${cashFlowData[scenarios]['60d'][2].toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">90-Day Projected Cash Flow</h3>
          <p className="text-2xl font-bold text-amber-600">
            ${cashFlowData[scenarios]['90d'][1].toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Range: ${cashFlowData[scenarios]['90d'][0].toLocaleString()} - ${cashFlowData[scenarios]['90d'][2].toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowProjections;