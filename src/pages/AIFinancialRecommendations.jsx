import { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiChevronDown, FiChevronRight, FiDownload, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

const AIFinancialRecommendations = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  // Chart data
  const costOptimizationData = {
    labels: ['Office Supplies', 'Software Subscriptions', 'Marketing', 'Utilities', 'Travel'],
    datasets: [{
      data: [25, 15, 30, 10, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ],
      borderWidth: 1
    }]
  };

  const revenueGrowthData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Projected Growth',
      data: [12, 19, 15, 25],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FiTrendingUp className="mr-2 text-blue-600" />
        AI-Powered Financial Recommendations
      </h2>

      {/* Cost Optimization */}
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('cost')}
        >
          <div className="flex items-center">
            <FiAlertTriangle className="text-red-500 mr-3" />
            <h3 className="text-lg font-semibold">Cost Optimization Opportunities</h3>
          </div>
          {expandedSection === 'cost' ? <FiChevronDown /> : <FiChevronRight />}
        </div>
        
        {expandedSection === 'cost' && (
          <div className="grid md:grid-cols-2 gap-6 p-4 border-t">
            <div className="h-64">
              <Doughnut 
                data={costOptimizationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Top Recommendations:</h4>
              <ul className="space-y-3">
                <li className="p-3 bg-blue-50 rounded-lg">
                  <strong>Reduce software subscriptions:</strong> 15% savings potential by consolidating redundant tools
                </li>
                <li className="p-3 bg-blue-50 rounded-lg">
                  <strong>Renegotiate vendor contracts:</strong> 8-12% savings on office supplies with bulk purchasing
                </li>
                <li className="p-3 bg-blue-50 rounded-lg">
                  <strong>Optimize marketing spend:</strong> Shift 30% of budget to higher-ROI digital channels
                </li>
              </ul>
              <button className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
                <FiDownload className="mr-2" />
                Download Full Cost Analysis Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Growth */}
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('revenue')}
        >
          <div className="flex items-center">
            <FiTrendingUp className="text-green-500 mr-3" />
            <h3 className="text-lg font-semibold">Revenue Growth Strategies</h3>
          </div>
          {expandedSection === 'revenue' ? <FiChevronDown /> : <FiChevronRight />}
        </div>
        
        {expandedSection === 'revenue' && (
          <div className="grid md:grid-cols-2 gap-6 p-4 border-t">
            <div className="h-64">
              <Bar 
                data={{
                  labels: ['Current', 'Q1', 'Q2', 'Q3', 'Q4'],
                  datasets: [{
                    label: 'Revenue ($K)',
                    data: [120, 135, 145, 155, 170],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Strategic Opportunities:</h4>
              <ul className="space-y-3">
                <li className="p-3 bg-green-50 rounded-lg">
                  <strong>Upsell premium services:</strong> 22% conversion potential among existing customers
                </li>
                <li className="p-3 bg-green-50 rounded-lg">
                  <strong>Expand to Southeast Asia:</strong> Projected $45K new revenue in first year
                </li>
                <li className="p-3 bg-green-50 rounded-lg">
                  <strong>Launch subscription model:</strong> 18% higher customer lifetime value projected
                </li>
              </ul>
              <div className="mt-4 flex space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create Growth Plan
                </button>
                <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                  Compare Scenarios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profitability Enhancement */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleSection('profit')}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold">Profitability Enhancement Plans</h3>
          </div>
          {expandedSection === 'profit' ? <FiChevronDown /> : <FiChevronRight />}
        </div>
        
        {expandedSection === 'profit' && (
          <div className="grid md:grid-cols-2 gap-6 p-4 border-t">
            <div className="h-64">
              <Doughnut 
                data={{
                  labels: ['Direct Costs', 'Operating Expenses', 'Taxes', 'Net Profit'],
                  datasets: [{
                    data: [45, 35, 10, 10],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Margin Improvement Actions:</h4>
              <ul className="space-y-3">
                <li className="p-3 bg-purple-50 rounded-lg">
                  <strong>Reduce COGS by 5%:</strong> Negotiate bulk discounts with 3 key suppliers
                </li>
                <li className="p-3 bg-purple-50 rounded-lg">
                  <strong>Automate invoicing:</strong> Save $8,500 annually in administrative costs
                </li>
                <li className="p-3 bg-purple-50 rounded-lg">
                  <strong>Shift to higher-margin products:</strong> 12% potential EBITDA improvement
                </li>
              </ul>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="w-24">Current Margin:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <span className="ml-2 w-12">15%</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-24">Target Margin:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{width: '22%'}}></div>
                  </div>
                  <span className="ml-2 w-12">22%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFinancialRecommendations;