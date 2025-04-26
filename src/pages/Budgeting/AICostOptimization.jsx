import React, { useState } from 'react';
import { BsStars, BsLightning, BsCheckCircle, BsClock, BsFilter, BsDownload } from 'react-icons/bs';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export const AICostOptimization = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // AI suggestions data
  const suggestions = [
    {
      id: 1,
      title: 'Cloud Service Consolidation',
      category: 'IT',
      savings: 18400,
      effort: 'Medium',
      impact: 'Low',
      status: 'pending',
      description: 'Combine AWS and Azure services to reduce redundant cloud storage costs',
      details: 'Analysis shows 23% of cloud resources are underutilized. Consolidating could save $18.4k annually.',
    },
    {
      id: 2,
      title: 'Vendor Contract Renegotiation',
      category: 'Procurement',
      savings: 32500,
      effort: 'Low',
      impact: 'None',
      status: 'approved',
      description: 'Renegotiate office supply vendor contracts based on benchmark data',
      details: 'Current pricing is 12% above market average. AI identified 3 alternative vendors with better rates.',
    },
    {
      id: 3,
      title: 'Energy Efficiency Program',
      category: 'Facilities',
      savings: 15700,
      effort: 'High',
      impact: 'Positive',
      status: 'implemented',
      description: 'Implement smart lighting and HVAC controls in office spaces',
      details: 'Could reduce energy costs by 18% with 2-year payback period. Qualifies for green energy tax credits.',
    },
    {
      id: 4,
      title: 'Travel Policy Adjustment',
      category: 'Operations',
      savings: 28600,
      effort: 'Low',
      impact: 'Medium',
      status: 'pending',
      description: 'Implement virtual meeting requirements for internal team meetings',
      details: 'Analysis shows 45% of domestic travel is for internal meetings that could be virtual.',
    },
    {
      id: 5,
      title: 'Software License Optimization',
      category: 'IT',
      savings: 42200,
      effort: 'Medium',
      impact: 'None',
      status: 'in-progress',
      description: 'Reclaim unused licenses and adjust tier levels',
      details: '32% of SaaS licenses are unused or underutilized. Could save $42.2k annually.',
    },
  ];

  // Filter suggestions based on active tab and category
  const filteredSuggestions = suggestions.filter((suggestion) => {
    return (
      (activeTab === 'all' || suggestion.status === activeTab) &&
      (selectedCategory === 'All Categories' || suggestion.category === selectedCategory)
    );
  });

  // Savings by category data
  const savingsData = {
    labels: ['IT', 'Procurement', 'Facilities', 'Operations'],
    datasets: [
      {
        label: 'Potential Annual Savings',
        data: [60600, 32500, 15700, 28600],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Savings by effort level
  const effortData = {
    labels: ['Low Effort', 'Medium Effort', 'High Effort'],
    datasets: [
      {
        data: [61100, 60600, 15700],
        backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with controls */}
      




      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white"> AI-Based Cost Optimization            </h1>
            <p className="text-sky-100 text-xs">Smart suggestions to reduce spending without operational impact
            </p>
          </div>
          <div className="flex space-x-2">
          





            <select
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>IT</option>
            <option>Procurement</option>
            <option>Facilities</option>
            <option>Operations</option>
          </select>
          <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                              <BsFilter /> Advanced Filters
          </button>
          <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                              <BsDownload /> Export Report
          </button>










          </div>
        </div>
      </div>






      

      {/* Stats summary */}
      <div className="grid grid-cols-1 mt-5 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Total Potential Savings</div>
          <div className="text-2xl font-bold text-sky-900">$137,400</div>
          <div className="text-sm text-sky-600">Annual recurring</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Quick Wins</div>
          <div className="text-2xl font-bold text-sky-900">$93,600</div>
          <div className="text-sm text-sky-600">Low effort suggestions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Implemented Savings</div>
          <div className="text-2xl font-bold text-sky-900">$15,700</div>
          <div className="text-sm text-sky-600">YTD realized</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Avg. Implementation</div>
          <div className="text-2xl font-bold text-sky-900">23 days</div>
          <div className="text-sm text-sky-600">Time to savings</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-200 mb-6">
        {['all', 'pending', 'approved', 'in-progress', 'implemented'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab ? 'text-sky-800 border-b-2 border-sky-500' : 'text-sky-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all'
              ? 'All Suggestions'
              : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggestions list */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 hover:border-sky-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                    {suggestion.status === 'implemented' && (
                      <BsCheckCircle className="text-green-500" />
                    )}
                    {suggestion.status === 'in-progress' && (
                      <BsClock className="text-amber-500" />
                    )}
                    {suggestion.title}
                  </h3>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">
                    {suggestion.category}
                  </span>
                </div>

                <p className="text-sky-700 mb-4">{suggestion.description}</p>

                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">
                      ${suggestion.savings.toLocaleString()}
                    </span>
                    <span className="text-sm text-sky-600">annual savings</span>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-sky-600">Effort</div>
                      <div
                        className={`text-sm font-medium ${
                          suggestion.effort === 'Low'
                            ? 'text-green-600'
                            : suggestion.effort === 'Medium'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {suggestion.effort}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-sky-600">Impact</div>
                      <div
                        className={`text-sm font-medium ${
                          suggestion.impact === 'None'
                            ? 'text-green-600'
                            : suggestion.impact === 'Low'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {suggestion.impact}
                      </div>
                    </div>
                  </div>

                  <button className="text-sm bg-sky-100 hover:bg-sky-200 text-sky-800 px-3 py-1 rounded">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-sky-100 text-center">
              <div className="text-sky-400 mb-2">
                <BsStars size={32} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-sky-800 mb-1">
                No suggestions match your filters
              </h3>
              <p className="text-sky-600">
                Try adjusting your filters to see more cost optimization opportunities
              </p>
            </div>
          )}
        </div>

        {/* Insights sidebar */}
        <div className="space-y-6">
          {/* Savings by category */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Potential Savings by Category
            </h3>
            <div className="h-64">
              <BsStars className="absolute top-4 right-4 text-sky-500" size={24} />
              <Bar
                data={savingsData}
                options={{
                  indexAxis: 'y', // Makes it horizontal
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Savings by effort */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Savings by Implementation Effort
            </h3>
            <div className="h-64">
              <BsStars className="absolute top-4 right-4 text-sky-500" size={24} />
              <Doughnut
                data={effortData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `$${ctx.raw.toLocaleString()} potential savings`,
                      },
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 mr-1 rounded-full"></div>
                <span>Low Effort</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1 rounded-full"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-400 mr-1 rounded-full"></div>
                <span>High Effort</span>
              </div>
            </div>
          </div>

          {/* Implementation guide */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-3">
              Implementation Roadmap
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full p-1 mt-1">
                  <BsCheckCircle size={14} />
                </div>
                <div>
                  <div className="font-medium text-sky-900">Quick Wins (0-2 weeks)</div>
                  <div className="text-sm text-sky-600">$61.1k potential savings</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-1">
                  <BsClock size={14} />
                </div>
                <div>
                  <div className="font-medium text-sky-900">Medium-Term (2-8 weeks)</div>
                  <div className="text-sm text-sky-600">$60.6k potential savings</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 text-amber-800 rounded-full p-1 mt-1">
                  <BsStars size={14} />
                </div>
                <div>
                  <div className="font-medium text-sky-900">Strategic Projects (8+ weeks)</div>
                  <div className="text-sm text-sky-600">$15.7k potential savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICostOptimization;