
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { FiDownload, FiInfo, FiTrendingUp, FiEdit2, FiDollarSign, FiBarChart2 } from "react-icons/fi";

// Helper for currency formatting
const formatCurrency = (value) => `$${value.toLocaleString()}`;

const CashFlowProjections = () => {
  // State for simulation controls
  const [paymentTerms, setPaymentTerms] = useState({
    receivables: 30,
    payables: 45
  });
  const [activeScenario, setActiveScenario] = useState('baseline');

  // Enhanced sample data: AI projections and user-adjustable values
  // In a real app, AI projections would come from an API, user values might be initialized from AI or stored.
  const initialCashFlowData = {
    baseline: {
      '30d': { ai: { min: 11000, expected: 12000, max: 13000 }, user: 12000 },
      '60d': { ai: { min: 23000, expected: 25000, max: 27000 }, user: 25000 },
      '90d': { ai: { min: 38000, expected: 40000, max: 42000 }, user: 40000 }
    },
    optimistic: {
      '30d': { ai: { min: 14000, expected: 15000, max: 17000 }, user: 15000 },
      '60d': { ai: { min: 28000, expected: 30000, max: 33000 }, user: 30000 },
      '90d': { ai: { min: 48000, expected: 50000, max: 55000 }, user: 50000 }
    },
    pessimistic: {
      '30d': { ai: { min: 7000, expected: 8000, max: 9000 }, user: 8000 },
      '60d': { ai: { min: 15000, expected: 18000, max: 20000 }, user: 18000 },
      '90d': { ai: { min: 28000, expected: 30000, max: 33000 }, user: 30000 }
    }
  };

  const [cashFlowData, setCashFlowData] = useState(JSON.parse(JSON.stringify(initialCashFlowData)));

  // Reset user adjustments when scenario changes, to reflect the new scenario's AI baseline
  useEffect(() => {
    setCashFlowData(prevData => {
      const newData = JSON.parse(JSON.stringify(initialCashFlowData)); // Reset to initial
      // If you want to preserve user edits across scenario switches (less common for this model):
      // You'd need to merge previous user edits for the new activeScenario if they exist.
      // For now, resetting ensures user values are based on the selected scenario's AI.
      return newData;
    });
  }, [activeScenario]);


  // Bank balance forecast data - this could also become scenario-dependent
  // For now, it's static but implies it's influenced by the overall scenario
  const bankBalanceData = {
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false }
      },
      colors: ['#F59E0B', '#3B82F6', '#10B981'], // Max, Projected, Min (adjust to match legend)
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: ['Current', '30 Days', '60 Days', '90 Days'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: { labels: { formatter: (val) => formatCurrency(val) } },
      tooltip: { y: { formatter: (val) => formatCurrency(val) } },
      legend: { position: 'top' }
    },
    series: [ // Data could be adjusted based on activeScenario in a real app
      {
        name: 'Minimum Balance (AI)',
        data: activeScenario === 'pessimistic' ? [25000, 18000, 20000, 25000] : 
              activeScenario === 'optimistic' ? [25000, 28000, 40000, 55000] : 
                                               [25000, 22000, 28000, 35000] // Baseline
      },
      {
        name: 'Projected Balance (AI)',
        data: activeScenario === 'pessimistic' ? [25000, 25000, 30000, 38000] :
              activeScenario === 'optimistic' ? [25000, 38000, 55000, 70000] :
                                               [25000, 32000, 45000, 60000] // Baseline
      },
      {
        name: 'Maximum Balance (AI)',
        data: activeScenario === 'pessimistic' ? [25000, 30000, 38000, 45000] :
              activeScenario === 'optimistic' ? [25000, 45000, 65000, 85000] :
                                               [25000, 38000, 55000, 75000] // Baseline
      }
    ]
  };

  const debtSchedule = [
    { name: 'Term Loan A', balance: 125000, nextPayment: '2025-04-15', amount: 4500, rate: '5.25%' },
    { name: 'Line of Credit', balance: 75000, nextPayment: '2025-03-30', amount: 1800, rate: '7.10%' },
    { name: 'Equipment Financing', balance: 62000, nextPayment: '2025-04-05', amount: 3200, rate: '6.50%' }
  ];

  const handleTermChange = (type, days) => {
    setPaymentTerms(prev => ({ ...prev, [type]: parseInt(days) }));
    // In a real app, changing terms would trigger a recalculation of AI projections.
    // For now, we can add a note or simulate this by slightly adjusting cashFlowData if desired.
    // This is a placeholder for future API integration.
    console.log(`Payment term ${type} changed to ${days} days. Projections would be re-evaluated.`);
  };

  const handleUserAdjustmentChange = (period, value) => {
    const numericValue = parseFloat(value) || 0; // Ensure it's a number, default to 0 if NaN
    setCashFlowData(prev => ({
      ...prev,
      [activeScenario]: {
        ...prev[activeScenario],
        [period]: {
          ...prev[activeScenario][period],
          user: numericValue
        }
      }
    }));
  };

  const currentScenarioData = cashFlowData[activeScenario];

  // Chart data for AI vs User Projections
  const aiVsUserProjectionChartOptions = {
    chart: { type: 'bar', toolbar: { show: false }, height: 350 },
    colors: ['#3B82F6', '#10B981'], // Blue for AI, Green for User
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', dataLabels: { position: 'top' } } },
    dataLabels: { 
        enabled: true, 
        formatter: (val) => formatCurrency(val),
        offsetY: -20,
        style: { fontSize: '10px', colors: ["#304758"] }
    },
    xaxis: { 
        categories: ['30 Days', '60 Days', '90 Days'],
        labels: { style: { colors: '#6B7280', fontSize: '12px' } }
    },
    yaxis: { 
        labels: { formatter: (val) => formatCurrency(val) },
        title: { text: 'Cash Flow Amount', style: { color: '#6B7280', fontSize: '11px' }}
    },
    tooltip: { y: { formatter: (val) => formatCurrency(val) } },
    legend: { position: 'top', fontSize: '12px' }
  };

  const aiVsUserProjectionChartSeries = [
    { 
      name: 'AI Expected', 
      data: [
        currentScenarioData['30d'].ai.expected,
        currentScenarioData['60d'].ai.expected,
        currentScenarioData['90d'].ai.expected
      ] 
    },
    { 
      name: 'User Adjusted', 
      data: [
        currentScenarioData['30d'].user,
        currentScenarioData['60d'].user,
        currentScenarioData['90d'].user
      ] 
    }
  ];


  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Cash Flow Projections & Analysis</h1>
            <p className="text-sky-100 text-xs">
              AI-driven liquidity predictions, scenario modeling, and user adjustments.
            </p>
          </div>
          <button
            onClick={() => window.print()} // Consider a more robust export solution for real apps
            className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200"
          >
            <FiDownload className="text-sky-50" />
            <span className="text-sky-50">Export Page</span>
          </button>
        </div>
      </div>

      {/* Scenario Controls & Payment Terms */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Scenario Simulation & Assumptions</h2>
          <div className="flex space-x-3 mt-3 sm:mt-0">
            {['baseline', 'optimistic', 'pessimistic'].map(scen => (
              <button
                key={scen}
                onClick={() => setActiveScenario(scen)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-150 ${
                  activeScenario === scen
                    ? scen === 'baseline' ? 'bg-blue-600 text-white' 
                    : scen === 'optimistic' ? 'bg-green-600 text-white' 
                    : 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {scen.charAt(0).toUpperCase() + scen.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Payment Terms Adjustment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Accounts Receivable (Avg. Collection Days)</label>
                <input
                  type="range" min="0" max="90" step="5"
                  value={paymentTerms.receivables}
                  onChange={(e) => handleTermChange('receivables', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0d</span><span>30d</span><span>60d</span><span>90d</span>
                </div>
                <div className="mt-1 text-sm font-medium text-blue-600">
                  Current: {paymentTerms.receivables} days
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Accounts Payable (Avg. Payment Days)</label>
                <input
                  type="range" min="0" max="90" step="5"
                  value={paymentTerms.payables}
                  onChange={(e) => handleTermChange('payables', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0d</span><span>30d</span><span>60d</span><span>90d</span>
                </div>
                <div className="mt-1 text-sm font-medium text-amber-600">
                  Current: {paymentTerms.payables} days
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                <FiInfo className="inline mr-1 mb-0.5"/> Adjusting terms simulates early/late payments. In a full system, this would dynamically update AI projections.
              </p>
            </div>
          </div>
          <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <h3 className="font-medium text-sky-800 mb-2">Scenario Driver: {activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)}</h3>
            <p className="text-sm text-sky-700">
              {activeScenario === 'baseline' && "Assumes stable market conditions, consistent customer behavior, and predictable operational costs. Standard growth trajectory."}
              {activeScenario === 'optimistic' && "Factors in potential positive events like new major client acquisitions, successful marketing campaigns, or favorable economic shifts. Higher growth rate."}
              {activeScenario === 'pessimistic' && "Considers risks such as loss of a key client, increased competition, economic downturn, or unexpected operational disruptions. Conservative outlook."}
            </p>
            <p className="text-xs text-sky-600 mt-3 italic">
                <FiTrendingUp className="inline mr-1 mb-0.5"/> AI projections for cash flow and bank balance adapt based on these underlying scenario assumptions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Cash Flow Adjustment Inputs & Projections */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">30/60/90 Day Cash Flow: AI vs. User Adjustment</h2>
            <p className="text-sm text-gray-600 mt-1 sm:mt-0 flex items-center">
                <FiEdit2 className="mr-2 text-blue-500"/> Adjust your forecast below.
            </p>
        </div>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Min</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Expected</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Max</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Your Adjusted Expected ($)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {['30d', '60d', '90d'].map(period => {
                const data = currentScenarioData[period];
                const periodLabel = period.replace('d', ' Days');
                return (
                  <tr key={period}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{periodLabel}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.ai.min)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{formatCurrency(data.ai.expected)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.ai.max)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        value={data.user}
                        onChange={(e) => handleUserAdjustmentChange(period, e.target.value)}
                        className="w-full max-w-[150px] p-2 border border-sky-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Enter amount"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div>
            <h3 className="text-md font-semibold text-gray-700 mb-1 flex items-center"><FiBarChart2 className="mr-2 text-sky-600"/>Projection Chart</h3>
            <Chart
                options={aiVsUserProjectionChartOptions}
                series={aiVsUserProjectionChartSeries}
                type="bar"
                height={350}
            />
        </div>
      </div>


      {/* Bank Balance Forecast & Debt Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Bank Balance Forecast (AI-Powered)</h2>
          <p className="text-xs text-gray-500 mb-4">Reflects chosen scenario: <span className="font-semibold">{activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)}</span>. Influenced by cash flow & payment terms.</p>
          <Chart
            options={bankBalanceData.options}
            series={bankBalanceData.series} // Make sure series data updates if scenario changes
            type="area"
            height={310} // Adjusted height slightly
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Debt & Loan Repayment Impact</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Pmt</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">90d Impact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {debtSchedule.map((debt, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{debt.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(debt.balance)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{debt.nextPayment}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatCurrency(debt.amount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{debt.rate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        debt.amount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {debt.amount > 0 ? '-' : '+'}{formatCurrency(debt.amount * 3)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             <p className="text-xs text-gray-500 mt-3 italic">
                <FiDollarSign className="inline mr-1 mb-0.5"/> Shows estimated cash outflow from debt over 90 days.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {['30d', '60d', '90d'].map(period => {
          const data = currentScenarioData[period];
          const aiExpected = data.ai.expected;
          const userAdjusted = data.user;
          const variance = userAdjusted - aiExpected;
          const variancePercent = aiExpected !== 0 ? (variance / aiExpected * 100).toFixed(1) : 0;
          const periodLabel = period.replace('d', '-Day');

          let cardColorClass = 'text-blue-600';
          if (period === '60d') cardColorClass = 'text-green-600';
          if (period === '90d') cardColorClass = 'text-amber-600';
          
          return (
            <div key={period} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className={`text-sm font-medium text-gray-500 mb-2`}>{periodLabel} Projected Cash Flow</h3>
              
              <div className="mb-3">
                <p className="text-xs text-gray-400">AI Expected</p>
                <p className={`text-2xl font-bold ${cardColorClass}`}>
                  {formatCurrency(aiExpected)}
                </p>
                <p className="text-xs text-gray-500">
                  AI Range: {formatCurrency(data.ai.min)} - {formatCurrency(data.ai.max)}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400">Your Adjusted</p>
                <p className={`text-xl font-semibold ${userAdjusted >= aiExpected ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(userAdjusted)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Variance (User vs AI)</p>
                <p className={`text-sm font-medium ${variance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {variance >= 0 ? '+' : ''}{formatCurrency(variance)} ({variancePercent}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CashFlowProjections;
