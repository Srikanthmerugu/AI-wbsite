import React, { useState } from 'react';

const SupplyChainAnalytics = () => {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [expandedCard, setExpandedCard] = useState(null);

  // Mock data
  const suppliers = [
    { name: 'Acme Materials', delivery: '98%', contract: '95%', cost: '4.8/5', risk: 'Low' },
    { name: 'Global Logistics', delivery: '89%', contract: '91%', cost: '4.2/5', risk: 'Medium' },
    { name: 'Tech Components Inc', delivery: '93%', contract: '97%', cost: '4.6/5', risk: 'Low' },
  ];

  const inventoryData = [
    { category: 'Electronics', turnover: '5.2x', stockLevel: '45 days', carryingCost: '$12,500' },
    { category: 'Raw Materials', turnover: '3.8x', stockLevel: '68 days', carryingCost: '$8,200' },
    { category: 'Packaging', turnover: '7.1x', stockLevel: '32 days', carryingCost: '$3,100' },
  ];

  const costSavings = [
    "Renegotiate contract with Global Logistics - potential 12% savings ($45K/year)",
    "Consolidate electronics suppliers to reduce administrative costs by 18%",
    "Switch to regional packaging supplier to reduce freight costs by 22%",
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Supply Chain & Procurement Analytics</h1>
        <p className="text-blue-600 mt-2">Optimize vendor performance and cost efficiency across your supply chain</p>
        
        {/* Time Period Selector */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-blue-700">Time Period</label>
            <select className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-800">
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
          
          {/* Business Unit Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-blue-700">Business Unit</label>
            <select className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50 text-blue-800">
              <option>All Units</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia-Pacific</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto mb-6 bg-white rounded-xl shadow-sm">
        {[
          { id: 'scorecard', label: 'Supplier Scorecard' },
          { id: 'inventory', label: 'Inventory Analysis' },
          { id: 'spend', label: 'Spend Breakdown' },
          { id: 'logistics', label: 'Freight Optimization' },
          { id: 'risk', label: 'Risk Assessment' },
          { id: 'savings', label: 'Cost Savings' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 whitespace-nowrap font-medium text-sm ${activeTab === tab.id ? 'text-blue-800 border-b-2 border-blue-600' : 'text-blue-600 hover:text-blue-800'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Supplier Scorecard (Left Column) */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Supplier Performance Scorecard</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">On-Time Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Contract Adherence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Cost Competitiveness</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {suppliers.map((supplier, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">{supplier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.delivery > '95%' ? 'bg-green-100 text-green-800' : supplier.delivery > '90%' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.delivery}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{supplier.contract}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{supplier.cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.risk === 'Low' ? 'bg-green-100 text-green-800' : supplier.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 h-64 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            [Supplier Performance Trend Chart]
          </div>
        </div>

        {/* Inventory Analysis (Right Column) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Inventory Turnover Analysis</h2>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Turnover</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Stock Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {inventoryData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.turnover}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.stockLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            [Inventory Turnover Visualization]
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Total Carrying Cost</p>
              <p className="text-2xl font-bold text-blue-600">$23,800</p>
              <p className="text-xs text-blue-500">+8% vs last quarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings Opportunities */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-800">AI-Identified Cost Savings Opportunities</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Generate Savings Plan
          </button>
        </div>
        
        <div className="space-y-3">
          {costSavings.map((saving, index) => (
            <div 
              key={index} 
              className="p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm font-medium text-blue-800">
                  {saving}
                </p>
              </div>
              
              {expandedCard === index && (
                <div className="mt-3 pl-8 flex items-center space-x-3">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    View Detailed Analysis
                  </button>
                  <button className="px-3 py-1 border border-blue-300 text-blue-700 text-sm rounded-md hover:bg-blue-50 transition-colors">
                    Assign to Team
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Procurement Spend</h3>
          <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            [Spend by Category Pie Chart]
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Freight Costs</h3>
          <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            [Shipping Cost Trend]
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Supplier Risk</h3>
          <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            [Risk Heatmap]
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainAnalytics;