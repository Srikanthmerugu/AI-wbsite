import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiDownload, FiChevronRight, FiDollarSign, FiTrendingUp, FiUser, FiPieChart, FiFilter } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';

const SalesPerformanceTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kpis');
  const [aiInput, setAiInput] = useState('');
  const [aiResponses, setAiResponses] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(false);

  // KPI Data
  const kpiData = [
    { 
      title: 'Total Revenue', 
      value: '$2,546,000', 
      change: '-25%', 
      isPositive: false, 
      icon: <FiDollarSign />,
      forecast: '$2.8M predicted next quarter'
    },
    { 
      title: 'Revenue Per Segment', 
      value: '$152,000', 
      change: '+8%', 
      isPositive: true, 
      icon: <FiPieChart />,
      forecast: '$165K predicted next quarter'
    },
    { 
      title: 'Sales Team Cost', 
      value: '$485,000', 
      change: '+12%', 
      isPositive: false, 
      icon: <FiUser />,
      forecast: '$520K predicted next quarter'
    },
    { 
      title: 'Leads', 
      value: '12,500', 
      change: '+15%', 
      isPositive: true, 
      icon: <FiTrendingUp />,
      forecast: '13,500 predicted next quarter'
    },
    { 
      title: 'Opportunities', 
      value: '4,890', 
      change: '+10%', 
      isPositive: true, 
      icon: <FiFilter />,
      forecast: '5,200 predicted next quarter'
    },
    { 
      title: 'Wins', 
      value: '628', 
      change: '+5%', 
      isPositive: true, 
      icon: <FiTrendingUp />,
      forecast: '700 predicted next quarter'
    }
  ];

  // Chart Data in Tabular Form
  const revenueTrendData = [
    { week: 'Jun 1', opportunities: 320, wins: 40, revenue: '$150K' },
    { week: 'Jun 8', opportunities: 310, wins: 45, revenue: '$160K' },
    { week: 'Jun 15', opportunities: 290, wins: 50, revenue: '$170K' },
    { week: 'Jun 22', opportunities: 330, wins: 55, revenue: '$180K' },
    { week: 'Jun 29', opportunities: 340, wins: 60, revenue: '$190K' },
    { week: 'Jul 6', opportunities: 350, wins: 65, revenue: '$200K' },
    { week: 'Jul 13', opportunities: 360, wins: 70, revenue: '$210K' },
    { week: 'Jul 20', opportunities: 370, wins: 75, revenue: '$220K' },
    { week: 'Jul 27', opportunities: 380, wins: 80, revenue: '$230K' },
    { week: 'Aug 3', opportunities: 390, wins: 85, revenue: '$240K' },
    { week: 'Aug 10', opportunities: 400, wins: 90, revenue: '$250K' },
    { week: 'Aug 17', opportunities: 410, wins: 95, revenue: '$260K' },
    { week: 'Aug 24', opportunities: 420, wins: 100, revenue: '$270K' },
    { week: 'Aug 31', opportunities: 430, wins: 105, revenue: '$280K' }
  ];

  const leadSourceData = [
    { source: 'Web', opportunities: 1213, avgRevenue: '$152.8K' },
    { source: 'Social Media', opportunities: 1136, avgRevenue: '$119.3K' },
    { source: 'Phone', opportunities: 948, avgRevenue: '$227.4K' },
    { source: 'Others', opportunities: 635, avgRevenue: '$201.4K' },
    { source: 'Email', opportunities: 508, avgRevenue: '$137.6K' },
    { source: 'PPC', opportunities: 306, avgRevenue: '$94.8K' },
    { source: 'Event', opportunities: 153, avgRevenue: '$84.2K' }
  ];

  const productRevenueData = [
    { product: 'Data Science', revenue: '$1,650,000', percentage: '64.89%' },
    { product: 'Computer Science', revenue: '$480,000', percentage: '18.86%' },
    { product: 'Arts', revenue: '$210,000', percentage: '8.19%' },
    { product: 'Business', revenue: '$205,000', percentage: '8.07%' }
  ];

  const regionRevenueData = [
    { region: 'North America', revenue: '$1,500,000', percentage: '58.8%' },
    { region: 'Europe', revenue: '$600,000', percentage: '23.5%' },
    { region: 'Asia', revenue: '$300,000', percentage: '11.8%' },
    { region: 'South America', revenue: '$100,000', percentage: '3.9%' },
    { region: 'Africa', revenue: '$46,000', percentage: '1.8%' }
  ];

  const customerStageData = [
    { stage: 'Prospect', customers: 5000 },
    { stage: 'Qualify', customers: 4000 },
    { stage: 'Presentation/Demo', customers: 3000 },
    { stage: 'Proposal', customers: 2000 },
    { stage: 'Negotiation', customers: 1000 },
    { stage: 'Close', customers: 628 }
  ];

  const salesPersonData = [
    { name: 'Andree Repp', revenue: '$227,412' },
    { name: 'Salla Yes', revenue: '$201,384' },
    { name: 'Shannah Biden', revenue: '$119,267' },
    { name: 'Hanny Giraudoux', revenue: '$152,803' },
    { name: 'Thali Bour', revenue: '$94,763' }
  ];

  const salesTeamCostData = [
    { category: 'Salaries', cost: '$300,000', percentage: '61.9%' },
    { category: 'Commissions', cost: '$120,000', percentage: '24.7%' },
    { category: 'Training', cost: '$35,000', percentage: '7.2%' },
    { category: 'Travel', cost: '$20,000', percentage: '4.1%' },
    { category: 'Tools', cost: '$10,000', percentage: '2.1%' }
  ];

  const funnelMetricsData = [
    { stage: 'Leads', count: '12,500', conversion: '100%' },
    { stage: 'Opportunities', count: '4,890', conversion: '39.1%' },
    { stage: 'Wins', count: '628', conversion: '12.8%' }
  ];

  const aiSuggestions = {
    kpis: "Key metrics show mixed performance. Revenue is down but leads are up. Focus on improving conversion rates.",
    revenueTrend: "Revenue shows steady weekly growth. The last week of each month shows strongest performance.",
    leadSource: "Phone leads generate the highest average revenue. Consider increasing phone-based outreach.",
    productRevenue: "Data Science dominates revenue. Consider bundling with other products to increase their performance.",
    regionRevenue: "North America is the strongest market. Asia shows potential for growth with targeted campaigns.",
    customerStage: "Conversion drops significantly after Presentation stage. Improve demo-to-proposal transition.",
    salesPerson: "Andree Repp is the top performer. Shannah Biden may need additional training or support.",
    salesTeamCost: "Salaries make up majority of costs. Consider performance-based compensation to optimize spend.",
    funnelMetrics: "Opportunity-to-win conversion needs improvement. Review sales process for bottlenecks."
  };

  const handleSendAIQuery = () => {
    if (!aiInput.trim()) return;
    const mockResponse = `AI analysis for ${activeTab}: ${aiSuggestions[activeTab]}`;
    setAiResponses(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), { query: aiInput, response: mockResponse }]
    }));
    setAiInput('');
  };

  const exportToExcel = (data, sheetName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'kpis': return kpiData;
      case 'revenueTrend': return revenueTrendData;
      case 'leadSource': return leadSourceData;
      case 'productRevenue': return productRevenueData;
      case 'regionRevenue': return regionRevenueData;
      case 'customerStage': return customerStageData;
      case 'salesPerson': return salesPersonData;
      case 'salesTeamCost': return salesTeamCostData;
      case 'funnelMetrics': return funnelMetricsData;
      default: return kpiData;
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'kpis':
        return [
          { header: 'KPI', accessor: 'title' },
          { header: 'Value', accessor: 'value' },
          { header: 'Change', accessor: 'change' },
          { header: 'Trend', accessor: 'isPositive' },
          { header: 'Forecast', accessor: 'forecast' }
        ];
      case 'revenueTrend':
        return [
          { header: 'Week', accessor: 'week' },
          { header: 'Opportunities', accessor: 'opportunities' },
          { header: 'Wins', accessor: 'wins' },
          { header: 'Revenue', accessor: 'revenue' }
        ];
      case 'leadSource':
        return [
          { header: 'Lead Source', accessor: 'source' },
          { header: 'Opportunities', accessor: 'opportunities' },
          { header: 'Avg Revenue', accessor: 'avgRevenue' }
        ];
      case 'productRevenue':
        return [
          { header: 'Product', accessor: 'product' },
          { header: 'Revenue', accessor: 'revenue' },
          { header: 'Percentage', accessor: 'percentage' }
        ];
      case 'regionRevenue':
        return [
          { header: 'Region', accessor: 'region' },
          { header: 'Revenue', accessor: 'revenue' },
          { header: 'Percentage', accessor: 'percentage' }
        ];
      case 'customerStage':
        return [
          { header: 'Stage', accessor: 'stage' },
          { header: 'Customers', accessor: 'customers' }
        ];
      case 'salesPerson':
        return [
          { header: 'Sales Person', accessor: 'name' },
          { header: 'Revenue', accessor: 'revenue' }
        ];
      case 'salesTeamCost':
        return [
          { header: 'Category', accessor: 'category' },
          { header: 'Cost', accessor: 'cost' },
          { header: 'Percentage', accessor: 'percentage' }
        ];
      case 'funnelMetrics':
        return [
          { header: 'Stage', accessor: 'stage' },
          { header: 'Count', accessor: 'count' },
          { header: 'Conversion', accessor: 'conversion' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              <Link to="/sales-performance-dashboard" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                Sales Dashboard
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Detailed View</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Sales Performance Data</h1>
            <p className="text-sky-100 text-xs">Detailed tabular view of all sales metrics</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <FiChevronRight className="mr-1 transform rotate-180" /> Back to Dashboard
            </button>
            <button
              onClick={() => exportToExcel(getCurrentData(), activeTab)}
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <FiDownload className="mr-1" /> Export to Excel
            </button>
            <CSVLink
              data={getCurrentData()}
              filename={`sales_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`}
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <FiDownload className="mr-1" /> Export to CSV
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'kpis', label: 'Key Metrics' },
            { id: 'revenueTrend', label: 'Revenue Trend' },
            { id: 'leadSource', label: 'Lead Source' },
            { id: 'productRevenue', label: 'Product Revenue' },
            { id: 'regionRevenue', label: 'Regional Revenue' },
            { id: 'customerStage', label: 'Customer Stage' },
            { id: 'salesPerson', label: 'Sales Team' },
            { id: 'salesTeamCost', label: 'Cost Analysis' },
            { id: 'funnelMetrics', label: 'Sales Funnel' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab === 'kpis' && 'Key Performance Indicators'}
              {activeTab === 'revenueTrend' && 'Revenue Trend Data'}
              {activeTab === 'leadSource' && 'Lead Source Performance'}
              {activeTab === 'productRevenue' && 'Product Revenue Breakdown'}
              {activeTab === 'regionRevenue' && 'Regional Revenue Distribution'}
              {activeTab === 'customerStage' && 'Customer Stage Analysis'}
              {activeTab === 'salesPerson' && 'Sales Team Performance'}
              {activeTab === 'salesTeamCost' && 'Sales Team Cost Analysis'}
              {activeTab === 'funnelMetrics' && 'Sales Funnel Metrics'}
            </h2>
            <button
              onClick={() => setShowAIDropdown(!showAIDropdown)}
              className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
            >
              <BsStars className="mr-1" /> AI Insights
            </button>
          </div>

          {showAIDropdown && (
            <motion.div
              className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-semibold text-blue-800 mb-2">AI Suggestions</h3>
              <p className="text-sm text-blue-700 mb-3">{aiSuggestions[activeTab]}</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask about this data..."
                  className="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendAIQuery}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!aiInput.trim()}
                >
                  <FiSend />
                </button>
              </div>
              {aiResponses[activeTab]?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {aiResponses[activeTab].map((response, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border border-blue-100">
                      <strong>Q:</strong> {response.query}<br />
                      <strong>A:</strong> {response.response}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getCurrentColumns().map((column, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentData().map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {getCurrentColumns().map((column, colIndex) => {
                      if (column.accessor === 'isPositive') {
                        return (
                          <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center ${row.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {row.isPositive ? (
                                <>
                                  <FiTrendingUp className="mr-1" /> Positive
                                </>
                              ) : (
                                <>
                                  <FiTrendingUp className="mr-1 transform rotate-180" /> Negative
                                </>
                              )}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {row[column.accessor]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPerformanceTable;