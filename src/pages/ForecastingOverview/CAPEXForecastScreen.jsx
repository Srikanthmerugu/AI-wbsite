import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { BsStars, BsThreeDotsVertical, BsFilter, BsCheckCircle, BsClock, BsXCircle } from 'react-icons/bs';
import { FiSend, FiEdit2, FiSave, FiClock } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

const CAPEXForecastScreen = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const aiChatbotRef = useRef(null);
  const filtersRef = useRef(null);

  // Sample CAPEX data
  const capexCategories = [
    {
      category: 'PROPERTY',
      items: [
        { name: 'Land Acquisition', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 250000, month3Adj: 250000 },
        { name: 'Building Construction', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 150000, month2Adj: 150000, month3AI: 200000, month3Adj: 200000 },
        { name: 'Building Improvements', prevMonth: 50000, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
      ],
      total: {
        prevMonth: 50000,
        month1AI: 0,
        month1Adj: 0,
        month2AI: 150000,
        month2Adj: 150000,
        month3AI: 450000,
        month3Adj: 450000
      }
    },
    {
      category: 'EQUIPMENT',
      items: [
        { name: 'Manufacturing Equipment', prevMonth: 120000, month1AI: 80000, month1Adj: 80000, month2AI: 60000, month2Adj: 60000, month3AI: 40000, month3Adj: 40000 },
        { name: 'Office Equipment', prevMonth: 25000, month1AI: 10000, month1Adj: 10000, month2AI: 5000, month2Adj: 5000, month3AI: 5000, month3Adj: 5000 },
        { name: 'IT Infrastructure', prevMonth: 75000, month1AI: 30000, month1Adj: 30000, month2AI: 20000, month2Adj: 20000, month3AI: 15000, month3Adj: 15000 },
      ],
      total: {
        prevMonth: 220000,
        month1AI: 120000,
        month1Adj: 120000,
        month2AI: 85000,
        month2Adj: 85000,
        month3AI: 60000,
        month3Adj: 60000
      }
    },
    {
      category: 'VEHICLES',
      items: [
        { name: 'Company Cars', prevMonth: 0, month1AI: 40000, month1Adj: 40000, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
        { name: 'Delivery Vehicles', prevMonth: 0, month1AI: 60000, month1Adj: 60000, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
      ],
      total: {
        prevMonth: 0,
        month1AI: 100000,
        month1Adj: 100000,
        month2AI: 0,
        month2Adj: 0,
        month3AI: 0,
        month3Adj: 0
      }
    },
    {
      category: 'SOFTWARE',
      items: [
        { name: 'ERP System', prevMonth: 0, month1AI: 0, month1Adj: 0, month2AI: 120000, month2Adj: 120000, month3AI: 0, month3Adj: 0 },
        { name: 'CRM Software', prevMonth: 15000, month1AI: 0, month1Adj: 0, month2AI: 0, month2Adj: 0, month3AI: 0, month3Adj: 0 },
      ],
      total: {
        prevMonth: 15000,
        month1AI: 0,
        month1Adj: 0,
        month2AI: 120000,
        month2Adj: 120000,
        month3AI: 0,
        month3Adj: 0
      }
    }
  ];

  // Calculate grand total
  const grandTotal = {
    prevMonth: capexCategories.reduce((sum, category) => sum + category.total.prevMonth, 0),
    month1AI: capexCategories.reduce((sum, category) => sum + category.total.month1AI, 0),
    month1Adj: capexCategories.reduce((sum, category) => sum + category.total.month1Adj, 0),
    month2AI: capexCategories.reduce((sum, category) => sum + category.total.month2AI, 0),
    month2Adj: capexCategories.reduce((sum, category) => sum + category.total.month2Adj, 0),
    month3AI: capexCategories.reduce((sum, category) => sum + category.total.month3AI, 0),
    month3Adj: capexCategories.reduce((sum, category) => sum + category.total.month3Adj, 0)
  };

  // Chart data
  const chartData = {
    labels: ['Month -3', 'Month -2', 'Month -1', 'Month 1', 'Month 2', 'Month 3'],
    datasets: [
      {
        label: 'AI Suggested',
        data: [180000, 220000, grandTotal.prevMonth, grandTotal.month1AI, grandTotal.month2AI, grandTotal.month3AI],
        borderColor: '#0369a1',
        backgroundColor: 'rgba(3, 105, 161, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Adjusted',
        data: [180000, 220000, grandTotal.prevMonth, grandTotal.month1Adj, grandTotal.month2Adj, grandTotal.month3Adj],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiChatbotRef.current && !aiChatbotRef.current.contains(event.target)) {
        setShowAIDropdown(null);
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendAIQuery = (widgetId) => {
    console.log(`AI Query for ${widgetId}:`, aiInput);
    setAiInput('');
    setShowAIDropdown(null);
  };

  const startEditing = (categoryIndex, itemIndex, field, value) => {
    setEditingCell(`${categoryIndex}-${itemIndex}-${field}`);
    setEditValue(value);
  };

  const saveEdit = () => {
    // In a real app, you would update your state here
    setEditingCell(null);
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      



  {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">CAPEX Forecast</h1>
            <p className="text-sky-100 text-xs">Manage and adjust your capital expenditure forecasts</p>
          </div>
          <div className="flex space-x-2">
          <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
              <FiClock className="mr-1" /> View History
            </button>
            <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">              <FiSave className="mr-1" /> Save Changes
            </button>
          </div>
        </div>
      </div>



















        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-200 mb-6 mt-5 pb-3 ">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'create' ? 'text-sky-50 border-b-2 border--600 border-1 bg-sky-800 rounded-2xl  ' : 'text-sky-900 border-1 rounded-2xl  hover:text-sky-500 '}`}
            onClick={() => setActiveTab('create')}
          >
            Create Forecast
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'import' ? 'text-sky-50 border-b-2 border--600 bg-sky-800 border-1 rounded-2xl ' : 'text-sky-900 border-1 rounded-2xl  hover:text-sky-500'}`}
            onClick={() => setActiveTab('import')}
          >
            Import Forecast
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'compare' ? 'text-sky-50 border-b-2 border--600 bg-sky-800 border-1 rounded-2xl ' : 'text-sky-900 border-1 rounded-2xl  hover:text-sky-500'}`}
            onClick={() => setActiveTab('compare')}
          >
            Compare Scenarios
          </button>
          <div className="relative ml-auto" ref={filtersRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="py-2 px-3 text-gray-500 hover:text-blue-500 flex items-center text-sm"
            >
              <BsFilter className="mr-1" /> Filters
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
                <div className="py-1">
                  <label className="block text-xs text-gray-700 mb-1">Time Period</label>
                  <select className="w-full p-1 border border-gray-300 rounded text-xs">
                    <option>Next 3 Months</option>
                    <option>Next 6 Months</option>
                    <option>Next 12 Months</option>
                  </select>
                </div>
                <div className="py-1">
                  <label className="block text-xs text-gray-700 mb-1">Scenario</label>
                  <select className="w-full p-1 border border-gray-300 rounded text-xs">
                    <option>Baseline</option>
                    <option>Best Case</option>
                    <option>Worst Case</option>
                  </select>
                </div>
                <div className="py-1">
                  <label className="block text-xs text-gray-700 mb-1">Department</label>
                  <select className="w-full p-1 border border-gray-300 rounded text-xs">
                    <option>All Departments</option>
                    <option>Operations</option>
                    <option>IT</option>
                    <option>Facilities</option>
                  </select>
                </div>
                <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded text-xs">
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className='flex justify-between '>
        <div className="grid w-[30%] grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex  relative justify-between items-start">
              <div className=''>
                <h3 className="text-sm font-medium text-gray-500 mb-1">AI Suggested Forecast</h3>
                <p className="text-xl font-semibold text-gray-800">${grandTotal.month1AI.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowAIDropdown('Suggested')}
                className="p-1 rounded hover:bg-gray-100"
                data-tooltip-id="ai-tooltip"
                data-tooltip-content="Ask AI"
              >
                <BsStars className="text-blue-500" />
              </button>
              {showAIDropdown === 'Suggested' && (
  <div
    ref={aiChatbotRef}
    className="absolute right-0 top-5 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
  >
    <div className="flex flex-col items-center space-x-2">
      <h1 className="text-xs mb-2">Ask regarding the CAPEX Suggested</h1>
      <div className="flex justify-between gap-3 w-full">
        <input
          type="text"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Ask AI..."
          className="w-full p-1 border border-gray-300 rounded text-xs"
        />
        <button
          onClick={() => handleSendAIQuery('chart')}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!aiInput.trim()}
        >
          <FiSend />
        </button>
      </div>
    </div>
  </div>
)}
            </div>

          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">User Adjusted Forecast</h3>
                <p className="text-xl font-semibold text-gray-800">${grandTotal.month1Adj.toLocaleString()}</p>
              </div>
              <button className="p-1 text-blue-500 hover:text-blue-700">
                <FiEdit2 />
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Variance</h3>
                <p className="text-xl font-semibold text-gray-800">
                  ${(grandTotal.month1Adj - grandTotal.month1AI).toLocaleString()} (
                  {((grandTotal.month1Adj - grandTotal.month1AI) / grandTotal.month1AI * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {grandTotal.month1Adj > grandTotal.month1AI ? 'Over' : 'Under'} Forecast
              </div>
            </div>
          </div>
        </div>

        {/* CAPEX Trend Chart */}
        <div className="bg-white  w-[60%] p-4 rounded-lg shadow-sm border border-gray-200 mb-6 relative">
          <div className="flex relative justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800">CAPEX Trend</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAIDropdown('chart')}
                className="p-1 rounded hover:bg-gray-100"
                data-tooltip-id="ai-tooltip"
                data-tooltip-content="Ask AI"
              >
                <BsStars className="text-blue-500" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          {showAIDropdown === 'chart' && (
            <div
              ref={aiChatbotRef}
              className="absolute right-0 top-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
            >
              <div className="flex flex-col items-center space-x-2">
                <h1 className="text-xs mb-2">Ask regarding the CAPEX Trend</h1>   
                <div className="flex justify-between gap-3 w-full">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask AI..."
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                  />
                  <button
                    onClick={() => handleSendAIQuery('chart')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={!aiInput.trim()}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Approval Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Approval Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center mb-2">
                <BsCheckCircle className="text-green-500 mr-2" />
                <span className="text-sm font-medium">Finance</span>
              </div>
              <p className="text-xs text-gray-500">Approved on 15 May 2023</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center mb-2">
                <BsClock className="text-yellow-500 mr-2" />
                <span className="text-sm font-medium">Operations</span>
              </div>
              <p className="text-xs text-gray-500">Pending approval</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center mb-2">
                <BsXCircle className="text-red-500 mr-2" />
                <span className="text-sm font-medium">IT</span>
              </div>
              <p className="text-xs text-gray-500">Revisions requested</p>
            </div>
          </div>
        </div>

        {/* CAPEX Forecast Table */}
        <div className=" relative bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-800">CAPEX Forecast Details</h2>
            <button
              onClick={() => setShowAIDropdown('table')}
              className="p-1 rounded hover:bg-gray-100"
              data-tooltip-id="ai-tooltip"
              data-tooltip-content="Ask AI"
            >
              <BsStars className="text-blue-500" />
            </button>
            
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CAPEX Item
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Month
                </th>
                <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month 1
                </th>
                <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month 2
                </th>
                <th scope="col" colSpan="2" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month 3
                </th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Suggested</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Suggested</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Suggested</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjusted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {capexCategories.map((category, categoryIndex) => (
                <React.Fragment key={category.category}>
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="px-4 py-2 text-sm font-bold text-gray-900">
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={item.name} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 pl-6">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">${item.prevMonth.toLocaleString()}</td>
                      
                      {/* Month 1 Columns */}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        ${item.month1AI.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editingCell === `${categoryIndex}-${itemIndex}-month1Adj` ? (
                          <div className="flex">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 p-1 border border-gray-300 rounded text-xs"
                            />
                            <button onClick={saveEdit} className="ml-1 p-1 text-blue-500">
                              <FiSave size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            ${item.month1Adj.toLocaleString()}
                            <button 
                              onClick={() => startEditing(categoryIndex, itemIndex, 'month1Adj', item.month1Adj)}
                              className="ml-1 p-1 text-blue-500 hover:text-blue-700"
                            >
                              <FiEdit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                      
                      {/* Month 2 Columns */}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        ${item.month2AI.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editingCell === `${categoryIndex}-${itemIndex}-month2Adj` ? (
                          <div className="flex">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 p-1 border border-gray-300 rounded text-xs"
                            />
                            <button onClick={saveEdit} className="ml-1 p-1 text-blue-500">
                              <FiSave size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            ${item.month2Adj.toLocaleString()}
                            <button 
                              onClick={() => startEditing(categoryIndex, itemIndex, 'month2Adj', item.month2Adj)}
                              className="ml-1 p-1 text-blue-500 hover:text-blue-700"
                            >
                              <FiEdit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                      
                      {/* Month 3 Columns */}
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        ${item.month3AI.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {editingCell === `${categoryIndex}-${itemIndex}-month3Adj` ? (
                          <div className="flex">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 p-1 border border-gray-300 rounded text-xs"
                            />
                            <button onClick={saveEdit} className="ml-1 p-1 text-blue-500">
                              <FiSave size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            ${item.month3Adj.toLocaleString()}
                            <button 
                              onClick={() => startEditing(categoryIndex, itemIndex, 'month3Adj', item.month3Adj)}
                              className="ml-1 p-1 text-blue-500 hover:text-blue-700"
                            >
                              <FiEdit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">TOTAL {category.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.prevMonth.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month1AI.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month1Adj.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month2AI.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month2Adj.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month3AI.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">${category.total.month3Adj.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="8" className="h-4"></td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="bg-blue-100">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">TOTAL CAPEX</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.prevMonth.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month1AI.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month1Adj.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month2AI.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month2Adj.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month3AI.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${grandTotal.month3Adj.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          {showAIDropdown === 'table' && (
            <div
              ref={aiChatbotRef}
              className="absolute right-0 top-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
            >
              <div className="flex flex-col items-center space-x-2">
                <h1 className="text-xs mb-2">Ask regarding the CAPEX Details</h1>
                <div className="flex justify-between gap-3 w-full">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask AI..."
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                  />
                  <button
                    onClick={() => handleSendAIQuery('table')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={!aiInput.trim()}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Tooltip id="ai-tooltip" />
    </div>
  );
};

export default CAPEXForecastScreen;