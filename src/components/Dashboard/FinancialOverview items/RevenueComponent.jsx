import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from 'recharts';
import { FiRefreshCw, FiDownload, FiCalendar, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { FaInfoCircle, FaHome } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-bold text-gray-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="flex items-center" style={{ color: item.color }}>
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
            {item.name}: ₹{item.value.toLocaleString()}
            {item.payload.percentage && ` (${item.payload.percentage}%)`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueComponent = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2023);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState([]);
  const [expandedQuarters, setExpandedQuarters] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://fpnainsightsapi.mavenerp.in/api/v1/company/financial/analytics/revenue?year=${year}`,
        {
          headers: { accept: 'application/json' }
        }
      );
      setData(response.data);
      toast.success('Data loaded successfully');
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  // Transform data for charts
  const transformData = () => {
    if (!data) return {};

    // Monthly data
    const monthlyData = Object.entries(data.monthly_revenue).map(([month, revenue]) => {
      const monthName = new Date(month).toLocaleString('default', { month: 'short' });
      const categories = data.monthly_category_revenue[month] || {};
      const percentages = data.monthly_contribution_percentages[month] || {};
      
      return {
        name: monthName,
        monthKey: month,
        revenue,
        ...Object.entries(categories).reduce((acc, [category, value]) => {
          acc[`${category}_value`] = value;
          acc[`${category}_percentage`] = percentages[category] || 0;
          return acc;
        }, {})
      };
    });

    // Quarterly data
    const quarterlyData = Object.entries(data.quarterly_revenue).map(([quarter, revenue]) => {
      const categories = data.quarterly_category_revenue[quarter] || {};
      const percentages = data.quarterly_contribution_percentages[quarter] || {};
      
      return {
        name: quarter,
        quarterKey: quarter,
        revenue,
        ...Object.entries(categories).reduce((acc, [category, value]) => {
          acc[`${category}_value`] = value;
          acc[`${category}_percentage`] = percentages[category] || 0;
          return acc;
        }, {})
      };
    });

    // Category data
    const categoryData = Object.entries(data.yearly_category_revenue).map(([category, value]) => ({
      name: category,
      value,
      percentage: data.yearly_contribution_percentages[category] || 0,
      color: category === 'productrevenue' ? '#4BC0C0' : '#FF6384'
    }));

    return { monthlyData, quarterlyData, categoryData };
  };

  const { monthlyData = [], quarterlyData = [], categoryData = [] } = transformData();

  // Toggle month expansion
  const toggleMonth = (monthKey) => {
    setExpandedMonths(prev =>
      prev.includes(monthKey) ? prev.filter(m => m !== monthKey) : [...prev, monthKey]
    );
  };

  // Toggle quarter expansion
  const toggleQuarter = (quarterKey) => {
    setExpandedQuarters(prev =>
      prev.includes(quarterKey) ? prev.filter(q => q !== quarterKey) : [...prev, quarterKey]
    );
  };

  // Prepare CSV data
  const prepareCSVData = () => {
    const headers = [
      { label: 'Period', key: 'period' },
      { label: 'Total Revenue', key: 'total' },
      ...categoryData.map(cat => ({
        label: `${cat.name} (₹)`,
        key: `${cat.name}_value`
      })),
      ...categoryData.map(cat => ({
        label: `${cat.name} (%)`,
        key: `${cat.name}_percentage`
      }))
    ];

    const monthlyRows = monthlyData.map(month => ({
      period: month.name,
      total: month.revenue,
      ...categoryData.reduce((acc, cat) => {
        acc[`${cat.name}_value`] = month[`${cat.name}_value`] || 0;
        acc[`${cat.name}_percentage`] = month[`${cat.name}_percentage`] || 0;
        return acc;
      }, {})
    }));

    const quarterlyRows = quarterlyData.map(quarter => ({
      period: quarter.name,
      total: quarter.revenue,
      ...categoryData.reduce((acc, cat) => {
        acc[`${cat.name}_value`] = quarter[`${cat.name}_value`] || 0;
        acc[`${cat.name}_percentage`] = quarter[`${cat.name}_percentage`] || 0;
        return acc;
      }, {})
    }));

    return [...monthlyRows, ...quarterlyRows];
  };

  const csvData = prepareCSVData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/financial-overview')}
          className="flex items-center text-blue-800 hover:text-blue-600 transition-colors"
        >
          <FaHome className="mr-2" /> Dashboard |<span className='ml-2 text-gray-400'>Revenue Analytics</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm p-2 border border-gray-200">
            <FiCalendar className="text-gray-500 mr-2" />
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="bg-transparent border-none focus:outline-none"
            >
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <CSVLink
            data={csvData}
            filename={`revenue-analytics-${year}.csv`}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiDownload className="mr-2" /> Export
          </CSVLink>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? (
              <FiRefreshCw className="animate-spin mr-2" />
            ) : (
              <FiRefreshCw className="mr-2" />
            )}
            Refresh
          </button>
        </div>
      </div> */}








 <button
                 onClick={() => navigate('/financial-overview')}
                 className="flex items-center justify-between text-sky-800 mb-2"
               >
                 <FaHome className="mr-2" /> Dashboard |<span className='ml-2 text-gray-400'>Revenue Analytics</span>
               </button>
           <div className="flex bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm justify-between items-center mb-6">
        
        <div className="flex items-center space-x-4">
          
          <h2 className="text-2xl font-bold text-sky-50">Revenue Analytics</h2>
        </div>
        <div className="flex space-x-4 items-center">
         <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200"
            >
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          {/* <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className=" rounded-md px-3 py-2 text-sky-50 bg-sky-900  "
          >
            <option value="both">Actual & Forecasted</option>
            <option value="actual">Actual Only</option>
            <option value="forecasted">Forecasted Only</option>
          </select> */}
          <CSVLink
            data={csvData}
            filename={`revenue-analytics-${year}.csv`}
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 cursor-pointer transition-colors duration-200">          
            <FiDownload className="mr-2" /> Export
          </CSVLink>
          <button
            onClick={fetchData}
            disabled={loading}
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">

            {loading ? (
              <FiRefreshCw className="animate-spin mr-2" />
            ) : (
              <FiRefreshCw className="mr-2" />
            )}
            Refresh
          </button>
        </div>
      </div>


















      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white px-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 font-sm">Total Revenue</h3>
          <p className="text-xl font-bold text-gray-800 mt-2">
            ₹{data?.total_revenue?.toLocaleString() || '0'}
          </p>
          <p className="text-gray-500 mt-1">for {year}</p>
        </div>
        
        <div className="bg-white px-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 font-medium">Categories</h3>
          <p className="text-xl font-bold text-gray-800 mt-2">
            {categoryData.length}
          </p>
          <p className="text-gray-500 mt-1">revenue streams</p>
        </div>
        
        <div className="bg-white px-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <h3 className="text-gray-500 font-medium">Top Category</h3>
          <p className="text-xl font-bold text-gray-800 mt-2">
            {categoryData.length > 0 
              ? categoryData.reduce((a, b) => a.value > b.value ? a : b).name.replace('revenue', '')
              : 'N/A'}
          </p>
          <p className="text-gray-500 mt-1">
            {categoryData.length > 0 
              ? `${categoryData.reduce((a, b) => a.value > b.value ? a : b).percentage.toFixed(2)}% of total`
              : ''}
          </p>
        </div>
      </div>



































      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
          <div className="h-50">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    fill="#EFF6FF" 
                    stroke="#3B82F6" 
                    name="Total Revenue"
                  />
                  {categoryData.map((cat, index) => (
                    <Bar 
                      key={index}
                      dataKey={`${cat.name}_value`}
                      name={cat.name.replace('revenue', '')}
                      fill={cat.color}
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {loading ? 'Loading data...' : 'No monthly revenue data available'}
              </div>
            )}
          </div>
        </div>

        {/* Revenue by Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Category</h3>
          <div className="h-50">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name.replace('revenue', '')}: ${percentage.toFixed(2)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `₹${value.toLocaleString()}`,
                      `${name.replace('revenue', '')} (${props.payload.percentage.toFixed(2)}%)`
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {loading ? 'Loading data...' : 'No category revenue data available'}
              </div>
            )}
          </div>
        </div>


          {/* Quarterly Revenue */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quarterly Revenue</h3>
        <div className="h-50">
          {quarterlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  fill="#ECFDF5" 
                  stroke="#10B981" 
                  name="Total Revenue"
                />
                {categoryData.map((cat, index) => (
                  <Bar 
                    key={index}
                    dataKey={`${cat.name}_value`}
                    name={cat.name.replace('revenue', '')}
                    fill={cat.color}
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {loading ? 'Loading data...' : 'No quarterly revenue data available'}
            </div>
          )}
        </div>
      </div>
      </div>

    

      {/* Data Tables */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Revenue Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  {categoryData.map((cat, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {cat.name.replace('revenue', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.length > 0 ? (
                  monthlyData.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleMonth(item.monthKey)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                          {expandedMonths.includes(item.monthKey) ? (
                            <FiChevronDown className="mr-2" />
                          ) : (
                            <FiChevronRight className="mr-2" />
                          )}
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.revenue.toLocaleString()}
                        </td>
                        {categoryData.map((cat, catIndex) => (
                          <td key={catIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{(item[`${cat.name}_value`] || 0).toLocaleString()} ({item[`${cat.name}_percentage`]?.toFixed(2) || '0'}%)
                          </td>
                        ))}
                      </tr>
                      {expandedMonths.includes(item.monthKey) && (
                        <tr>
                          <td colSpan={categoryData.length + 2} className="px-6 py-4 bg-gray-50">
                            <div className="pl-8">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Daily Breakdown (Sample)</h4>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart
                                    data={[
                                      { day: 'Week 1', revenue: item.revenue * 0.3 },
                                      { day: 'Week 2', revenue: item.revenue * 0.2 },
                                      { day: 'Week 3', revenue: item.revenue * 0.25 },
                                      { day: 'Week 4', revenue: item.revenue * 0.25 },
                                    ]}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip 
                                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="revenue" 
                                      stroke="#3B82F6" 
                                      strokeWidth={2}
                                      dot={{ r: 4 }}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={categoryData.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                      {loading ? 'Loading data...' : 'No monthly revenue data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quarterly Revenue Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quarterly Revenue Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  {categoryData.map((cat, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {cat.name.replace('revenue', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quarterlyData.length > 0 ? (
                  quarterlyData.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleQuarter(item.quarterKey)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                          {expandedQuarters.includes(item.quarterKey) ? (
                            <FiChevronDown className="mr-2" />
                          ) : (
                            <FiChevronRight className="mr-2" />
                          )}
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.revenue.toLocaleString()}
                        </td>
                        {categoryData.map((cat, catIndex) => (
                          <td key={catIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{(item[`${cat.name}_value`] || 0).toLocaleString()} ({item[`${cat.name}_percentage`]?.toFixed(2) || '0'}%)
                          </td>
                        ))}
                      </tr>
                      {expandedQuarters.includes(item.quarterKey) && (
                        <tr>
                          <td colSpan={categoryData.length + 2} className="px-6 py-4 bg-gray-50">
                            <div className="pl-8">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Monthly Breakdown</h4>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={monthlyData.filter(m => {
                                      const quarter = Math.ceil(new Date(m.monthKey).getMonth() / 3 + 1);
                                      return `Q${quarter}` === item.name;
                                    })}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Legend />
                                    {categoryData.map((cat, catIndex) => (
                                      <Bar 
                                        key={catIndex}
                                        dataKey={`${cat.name}_value`}
                                        name={cat.name.replace('revenue', '')}
                                        stackId="a"
                                        fill={cat.color}
                                      />
                                    ))}
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={categoryData.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                      {loading ? 'Loading data...' : 'No quarterly revenue data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaInfoCircle className="mr-2 text-blue-500" />
          Revenue Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Top Performing Month</h4>
            {monthlyData.length > 0 ? (
              <p className="text-blue-900">
                {monthlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).name} with ₹
                {monthlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).revenue.toLocaleString()}
              </p>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Top Performing Quarter</h4>
            {quarterlyData.length > 0 ? (
              <p className="text-green-900">
                {quarterlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).name} with ₹
                {quarterlyData.reduce((a, b) => a.revenue > b.revenue ? a : b).revenue.toLocaleString()}
              </p>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Dominant Revenue Source</h4>
            {categoryData.length > 0 ? (
              <p className="text-purple-900">
                {categoryData.reduce((a, b) => a.value > b.value ? a : b).name.replace('revenue', '')} accounts for 
                {categoryData.reduce((a, b) => a.value > b.value ? a : b).percentage.toFixed(2)}% of total revenue
              </p>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Seasonal Trends</h4>
            {monthlyData.length > 0 ? (
              <p className="text-yellow-900">
                {monthlyData.slice(0, 3).reduce((a, b) => a.revenue > b.revenue ? a : b).name} tends to be the strongest month in Q1
              </p>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueComponent;