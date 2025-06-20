import React, { useState, useRef, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { 
  FiDownload, 
  FiPrinter, 
  FiSend, 
  FiFilter, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiAlertCircle, 
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
  FiMap,
  FiUsers
} from 'react-icons/fi';
import { BsStars, BsThreeDotsVertical } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const RevenueReportDashboard = () => {
  // Sample revenue data
  const revenueData = {
    byProduct: [
      { id: 'Product A', product: 'Product A', Q1: 25000, Q2: 28000, Q3: 30000, Q4: 32000, Total: 115000, growth: 28.0 },
      { id: 'Product B', product: 'Product B', Q1: 20000, Q2: 22000, Q3: 24000, Q4: 26000, Total: 92000, growth: 30.0 },
      { id: 'Product C', product: 'Product C', Q1: 15000, Q2: 18000, Q3: 20000, Q4: 22000, Total: 75000, growth: 46.7 },
      { id: 'Product D', product: 'Product D', Q1: 10000, Q2: 12000, Q3: 15000, Q4: 18000, Total: 55000, growth: 80.0 },
    ],
    byRegion: [
      { id: 'North America', region: 'North America', Q1: 40000, Q2: 45000, Q3: 50000, Q4: 55000, Total: 190000, growth: 37.5 },
      { id: 'Europe', region: 'Europe', Q1: 30000, Q2: 32000, Q3: 35000, Q4: 38000, Total: 135000, growth: 26.7 },
      { id: 'Asia', region: 'Asia', Q1: 20000, Q2: 25000, Q3: 28000, Q4: 30000, Total: 103000, growth: 50.0 },
      { id: 'Other', region: 'Other', Q1: 5000, Q2: 6000, Q3: 7000, Q4: 8000, Total: 26000, growth: 60.0 },
    ],
    bySegment: [
      { id: 'Enterprise', segment: 'Enterprise', Q1: 45000, Q2: 48000, Q3: 52000, Q4: 55000, Total: 200000, growth: 22.2 },
      { id: 'SMB', segment: 'SMB', Q1: 35000, Q2: 38000, Q3: 40000, Q4: 43000, Total: 156000, growth: 22.9 },
      { id: 'Education', segment: 'Education', Q1: 10000, Q2: 12000, Q3: 15000, Q4: 18000, Total: 55000, growth: 80.0 },
      { id: 'Government', segment: 'Government', Q1: 5000, Q2: 7000, Q3: 8000, Q4: 9000, Total: 29000, growth: 80.0 },
    ],
    metrics: {
      totalRevenue: 440000,
      qoqGrowth: 12.5,
      yoyGrowth: 32.8,
      bestPerformer: 'Product D',
      worstPerformer: 'Product A',
      highestGrowthRegion: 'Asia',
      insights: [
        'Product D shows highest growth potential at 80% YoY',
        'Asia region growing fastest at 50% YoY',
        'Education sector showing strong adoption with 80% growth',
        'Q4 consistently strongest quarter across all segments'
      ]
    }
  };

  // View options
  const views = [
    { id: 'product', name: 'By Product', icon: <FiPieChart /> },
    { id: 'region', name: 'By Region', icon: <FiMap /> },
    { id: 'segment', name: 'By Segment', icon: <FiUsers /> }
  ];

  // Time periods
  const periods = ['Q1', 'Q2', 'Q3', 'Q4', 'Total'];

  // Filter options
  const growthFilters = [
    { id: 'all', name: 'All Growth Rates' },
    { id: 'high', name: 'High Growth (>30%)' },
    { id: 'medium', name: 'Medium Growth (10-30%)' },
    { id: 'low', name: 'Low Growth (<10%)' }
  ];

  // State management
  const [currentView, setCurrentView] = useState('product');
  const [currentPeriod, setCurrentPeriod] = useState('Total');
  const [growthFilter, setGrowthFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiHistory, setAiHistory] = useState([]);
  const [activeInsight, setActiveInsight] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null);

  // Get current data based on view
  const getCurrentData = () => {
    switch(currentView) {
      case 'product': return revenueData.byProduct;
      case 'region': return revenueData.byRegion;
      case 'segment': return revenueData.bySegment;
      default: return revenueData.byProduct;
    }
  };

  // Filter data based on growth filter
  const filteredData = getCurrentData().filter(item => {
    if (growthFilter === 'all') return true;
    if (growthFilter === 'high') return item.growth > 30;
    if (growthFilter === 'medium') return item.growth >= 10 && item.growth <= 30;
    if (growthFilter === 'low') return item.growth < 10;
    return true;
  });

  // Prepare data for charts
  const prepareChartData = () => {
    const key = currentView === 'product' ? 'product' : 
                currentView === 'region' ? 'region' : 'segment';
    
    return filteredData.map(item => ({
      id: item.id,
      label: item[key],
      value: item[currentPeriod],
      growth: item.growth
    }));
  };

  // Rotate insights every 5 seconds
  useEffect(() => {
    if (revenueData.metrics.insights.length > 1) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => (prev + 1) % revenueData.metrics.insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle AI query submission
  const handleSendAIQuery = () => {
    if (aiInput.trim()) {
      const response = `AI analysis for revenue report: ${aiInput} (This is a mock response. In a real app, this would connect to an AI service.)`;
      setAiHistory([...aiHistory, { query: aiInput, response }]);
      setAiInput('');
    }
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare CSV data
  const prepareCSVData = () => {
    const headers = [currentView.charAt(0).toUpperCase() + currentView.slice(1), ...periods, 'Growth'];
    const dataRows = filteredData.map(item => [
      item[currentView === 'product' ? 'product' : 
          currentView === 'region' ? 'region' : 'segment'],
      ...periods.map(p => item[p]),
      `${item.growth}%`
    ]);
    return [headers, ...dataRows];
  };

  const csvData = prepareCSVData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Revenue Analysis Report</h1>
            <p className="text-sky-100 text-xs">Identify performance drivers across products, regions, and segments</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 transition-colors duration-200"
          >
            <FiDownload className="text-sky-50" />
            <span className="text-sky-50">Export</span>
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-sky-900 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <Link to="/financial-reports" className="ms-1 text-sm font-medium text-sky-900 hover:text-blue-600 md:ms-2">
                Financial Reports
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Revenue Analysis</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Report Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-1">
              {views.map(view => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    currentView === view.id 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{view.icon}</span>
                  {view.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Period:</label>
                <select
                  value={currentPeriod}
                  onChange={(e) => setCurrentPeriod(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-sm"
                >
                  {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>

              <div className="relative" ref={filtersRef}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiFilter className="text-gray-500" />
                  Filters
                </button>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 right-0"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Growth Rate</label>
                        <select
                          value={growthFilter}
                          onChange={(e) => setGrowthFilter(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        >
                          {growthFilters.map(filter => (
                            <option key={filter.id} value={filter.id}>{filter.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-md ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <FiBarChart2 />
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-2 rounded-md ${chartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <FiPieChart />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <CSVLink
                  data={csvData}
                  filename={`revenue-report-${currentView}.csv`}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiDownload className="text-gray-500" />
                  CSV
                </CSVLink>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiPrinter className="text-gray-500" />
                  Print
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowAIDropdown(!showAIDropdown)}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <BsStars className="text-gray-500" />
                  Ask AI
                </button>

                {showAIDropdown && (
                  <motion.div
                    ref={aiChatbotRef}
                    className="absolute z-10 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 right-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Ask about Revenue Data</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask AI about this report..."
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendAIQuery}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!aiInput.trim()}
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                    {aiHistory.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto text-xs text-gray-700">
                        {aiHistory.map((entry, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded">
                            <strong>Q:</strong> {entry.query}
                            <br />
                            <strong>A:</strong> {entry.response}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <FiDollarSign className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {formatCurrency(revenueData.metrics.totalRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">YoY Growth</h3>
              <div className={`p-1 rounded-full ${revenueData.metrics.yoyGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {revenueData.metrics.yoyGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              </div>
            </div>
            <p className={`text-2xl font-bold mt-1 ${revenueData.metrics.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(revenueData.metrics.yoyGrowth)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Best Performer</h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                #1
              </span>
            </div>
            <p className="text-lg font-semibold mt-1 text-gray-800 truncate">
              {revenueData.metrics.bestPerformer}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Highest Growth</h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                <FiTrendingUp />
              </span>
            </div>
            <p className="text-lg font-semibold mt-1 text-gray-800 truncate">
              {revenueData.metrics.highestGrowthRegion}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <FiAlertCircle className="mr-2 text-blue-500" /> Key Insights
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeInsight}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-sm text-gray-700">{revenueData.metrics.insights[activeInsight]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chart Visualization */}
        <div className="p-6" style={{ height: '400px' }}>
          {chartType === 'pie' ? (
            <ResponsivePie
              data={prepareChartData()}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              colors={{ scheme: 'nivo' }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [{ on: 'hover', style: { itemTextColor: '#000' } }],
                },
              ]}
              tooltip={({ datum }) => (
                <div className="bg-white p-2 rounded shadow-md border border-gray-200">
                  <div className="font-bold">{datum.label}</div>
                  <div>{formatCurrency(datum.value)}</div>
                  <div className="text-sm">Growth: {datum.data.growth}%</div>
                </div>
              )}
            />
          ) : (
            <ResponsiveBar
              data={prepareChartData()}
              keys={['value']}
              indexBy="id"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: currentView === 'product' ? 'Products' : 
                       currentView === 'region' ? 'Regions' : 'Segments',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Revenue',
                legendPosition: 'middle',
                legendOffset: -40,
                format: value => formatCurrency(value).replace('$', '')
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              tooltip={({ value, indexValue }) => (
                <div className="bg-white p-2 rounded shadow-md border border-gray-200">
                  <div className="font-bold">{indexValue}</div>
                  <div>{currentPeriod}: {formatCurrency(value)}</div>
                </div>
              )}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
                }
              ]}
            />
          )}
        </div>

        {/* Data Table */}
        <div className="p-6 border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {currentView === 'product' ? 'Product' : 
                     currentView === 'region' ? 'Region' : 'Segment'}
                  </th>
                  {periods.map(period => (
                    <th key={period} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {period}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => {
                  const key = currentView === 'product' ? 'product' : 
                             currentView === 'region' ? 'region' : 'segment';
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item[key]}
                      </td>
                      {periods.map(period => (
                        <td key={period} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {formatCurrency(item[period])}
                        </td>
                      ))}
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                        item.growth >= 30 ? 'text-green-600' :
                        item.growth >= 10 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {formatPercentage(item.growth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportDashboard;