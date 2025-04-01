import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiDownload, FiPrinter, FiFilter } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState('core');
  const [expandedReports, setExpandedReports] = useState({});

  const toggleReport = (reportId) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  // Sample data for charts
  const pnlData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Actual',
        data: [12000, 19000, 15000, 18000, 22000],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Budget',
        data: [15000, 15000, 17000, 20000, 21000],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'Forecast',
        data: [13000, 17000, 16000, 19000, 23000],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }
    ],
  };

  const arAgingData = {
    labels: ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days'],
    datasets: [
      {
        data: [45000, 12000, 8000, 5000, 3000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
      }
    ],
  };

  const coreReports = [
    {
      id: 'pnl',
      title: 'Profit & Loss Statement',
      description: 'Actual vs Budget vs Forecast',
      content: (
        <div className="mt-4 animate-fade-in">
          <div className="h-80">
            <Bar 
              data={pnlData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                  x: { stacked: false },
                  y: { stacked: false }
                }
              }} 
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard title="Total Revenue" value="$125,000" change="+12%" isPositive />
            <ReportCard title="Gross Profit" value="$85,000" change="+8%" isPositive />
            <ReportCard title="Net Income" value="$42,000" change="+5%" isPositive />
          </div>
        </div>
      )
    },
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      description: 'Assets, Liabilities, and Equity Summary',
      content: (
        <div className="mt-4 animate-fade-in">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prior Period</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <TableRow label="Cash" current="45,000" previous="38,000" positive />
              <TableRow label="Accounts Receivable" current="32,000" previous="28,000" positive />
              <TableRow label="Inventory" current="28,000" previous="31,000" negative />
              <TableRow label="Total Assets" current="185,000" previous="172,000" positive />
              <TableRow label="Accounts Payable" current="22,000" previous="18,000" negative />
              <TableRow label="Total Liabilities" current="85,000" previous="78,000" negative />
              <TableRow label="Retained Earnings" current="100,000" previous="94,000" positive />
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'ar-aging',
      title: 'AR Aging Reports',
      description: 'Overdue receivables breakdown',
      content: (
        <div className="mt-4 animate-fade-in">
          <div className="h-64 w-64 mx-auto">
            <Pie 
              data={arAgingData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'right' }
                }
              }} 
            />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Receivables" value="$73,000" />
            <StatCard label="Current" value="$45,000" color="bg-sky-100 text-sky-800" />
            <StatCard label="1-30 days" value="$12,000" color="bg-teal-100 text-teal-800" />
            <StatCard label="31-60 days" value="$8,000" color="bg-yellow-100 text-yellow-800" />
            <StatCard label="61+ days" value="$8,000" color="bg-red-100 text-red-800" />
          </div>
        </div>
      )
    }
  ];

  const customReports = [
    {
      id: 'departmental',
      title: 'Departmental Performance',
      description: 'Cost Centers, P&L by Business Unit',
      content: (
        <div className="mt-4 animate-fade-in">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700">Select Departments:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Sales', 'Marketing', 'Operations', 'R&D', 'HR'].map(dept => (
                <span key={dept} className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ratio-analysis',
      title: 'Financial Ratio Analysis',
      description: 'Liquidity, Profitability, and Efficiency Ratios',
      content: (
        <div className="mt-4 animate-fade-in">
          <div className="space-y-4">
            <RatioCard 
              title="Current Ratio" 
              value="2.5" 
              benchmark="1.5" 
              description="Measures short-term liquidity" 
              goodAbove 
            />
            <RatioCard 
              title="Debt-to-Equity" 
              value="0.8" 
              benchmark="1.0" 
              description="Measures financial leverage" 
              goodBelow 
            />
            <RatioCard 
              title="ROE" 
              value="18%" 
              benchmark="15%" 
              description="Return on Equity" 
              goodAbove 
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-4  min-h-screen">
      <div className="max-w-7xl mx-auto">
       


        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
      <p className="text-sky-100 mt-2">Access and analyze all financial reports</p>
    </div>
    {/* <button 
      type="button" 
      className="py-2.5 px-5 shadow-2xl text-sm font-medium text-white bg-sky-900 rounded-lg border-2 border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
    >
      Add/Edit Widgets
    </button> */}
  </div>
</div>








        
        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('core')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'core'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Core Reports
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'custom'
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Custom Reports
            </button>
          </nav>
        </div>

        {/* Report List */}
        <div className="mt-6 space-y-4">
          {(activeTab === 'core' ? coreReports : customReports).map(report => (
            <div 
              key={report.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleReport(report.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    {report.id === 'pnl' ? 'Monthly' : 'Quarterly'}
                  </span>
                  {expandedReports[report.id] ? (
                    <FiChevronDown className="text-gray-500" />
                  ) : (
                    <FiChevronRight className="text-gray-500" />
                  )}
                </div>
              </button>

              {expandedReports[report.id] && (
                <div className="border-t border-gray-200 p-4">
                  {report.content}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                      <FiDownload className="mr-2" />
                      Export
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                      <FiPrinter className="mr-2" />
                      Print
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                      <FiFilter className="mr-2" />
                      Filter Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ReportCard = ({ title, value, change, isPositive }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
    <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {change} {isPositive ? '↑' : '↓'} vs last period
    </p>
  </div>
);

const TableRow = ({ label, current, previous, positive }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{label}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{current}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {previous}
      </span>
    </td>
  </tr>
);

const StatCard = ({ label, value, color = 'bg-gray-100 text-gray-800' }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
    <h4 className="text-xs font-medium text-gray-500">{label}</h4>
    <div className={`mt-1 px-2 py-1 inline-flex rounded-md ${color}`}>
      {value}
    </div>
  </div>
);

const RatioCard = ({ title, value, benchmark, description, goodAbove }) => {
  const isGood = goodAbove ? parseFloat(value) > parseFloat(benchmark) : parseFloat(value) < parseFloat(benchmark);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          isGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value} (Benchmark: {benchmark})
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            isGood ? 'bg-green-500' : 'bg-red-500'
          }`} 
          style={{ width: `${Math.min(100, (parseFloat(value) / parseFloat(benchmark)) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FinancialReports;