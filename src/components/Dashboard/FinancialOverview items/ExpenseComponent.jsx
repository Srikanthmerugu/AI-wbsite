import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from 'react-csv';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaInfoCircle, FaChevronDown, FaChevronRight, FaHome } from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../config/config';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ExpenseComponent = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedView, setSelectedView] = useState('trend');
  const [expandedRows, setExpandedRows] = useState([]);
  const [expenseData, setExpenseData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expense data from API
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/analytics/expenses?year=${selectedYear}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expense data');
        }

        const data = await response.json();
        // console.log(data, 'expensign data comming fro the api');
        setExpenseData(data);
        setAvailableYears([2023]); // You might want to get this from API if available
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [selectedYear, token]);

  // Process data for display
  const processedData = useMemo(() => {
    if (!expenseData) return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthKeys = Object.keys(expenseData.monthly_expenses).sort();
    
    // Get all unique categories from the data
    const allCategories = new Set();
    Object.values(expenseData.monthly_category_expenses).forEach(monthData => {
      Object.keys(monthData).forEach(category => allCategories.add(category));
    });
    
    const categories = Array.from(allCategories);

    return {
      months,
      monthKeys,
      categories,
      monthlyExpenses: monthKeys.map(key => expenseData.monthly_expenses[key]),
      monthlyCategoryExpenses: categories.map(category => ({
        category,
        data: monthKeys.map(key => expenseData.monthly_category_expenses[key]?.[category] || 0)
      })),
      quarterlyCategoryExpenses: categories.map(category => ({
        category,
        q1: expenseData.quarterly_category_expenses.Q1?.[category] || 0,
        q2: expenseData.quarterly_category_expenses.Q2?.[category] || 0,
        q3: expenseData.quarterly_category_expenses.Q3?.[category] || 0,
        q4: expenseData.quarterly_category_expenses.Q4?.[category] || 0
      })),
      yearlyCategoryExpenses: categories.map(category => ({
        category,
        amount: expenseData.yearly_category_expenses[category] || 0,
        percentage: expenseData.yearly_contribution_percentages[category] || 0
      }))
    };
  }, [expenseData]);

  // Calculate KPIs
  const kpiMetrics = useMemo(() => {
    if (!processedData) {
      return {
        totalExpenses: '0',
        incrementalExpenses: '0',
        growthRate: '0.00',
        categoryContributions: [],
        quarterlyBreakdown: [],
      };
    }

    const monthlyExpenses = processedData.monthlyExpenses;
    const totalExpenses = expenseData.total_expense;
    const incrementalExpenses = monthlyExpenses.length > 1 
      ? monthlyExpenses[monthlyExpenses.length - 1] - monthlyExpenses[monthlyExpenses.length - 2] 
      : 0;
    const growthRate = monthlyExpenses.length > 1 
      ? ((monthlyExpenses[monthlyExpenses.length - 1] - monthlyExpenses[0]) / monthlyExpenses[0] * 100) : (0);

    return {
      totalExpenses: totalExpenses.toLocaleString(),
      incrementalExpenses: incrementalExpenses.toLocaleString(),
      growthRate: growthRate.toFixed(2),
      categoryContributions: processedData.yearlyCategoryExpenses.map(item => ({
        category: item.category,
        contribution: item.percentage.toFixed(2),
      })),
      quarterlyBreakdown: processedData.quarterlyCategoryExpenses,
    };
  }, [processedData, expenseData]);

  // Chart data for trend view
  const getTrendChartData = () => {
    if (!processedData) return { labels: [], datasets: [] };

    return {
      labels: processedData.months.slice(0, processedData.monthKeys.length),
      datasets: [
        {
          label: `Monthly Expenses (${selectedYear})`,
          data: processedData.monthlyExpenses,
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3,
        },
        ...processedData.monthlyCategoryExpenses.map((categoryData, index) => ({
          label: categoryData.category,
          data: categoryData.data,
          borderColor: `hsl(${index * 360 / processedData.categories.length}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 360 / processedData.categories.length}, 70%, 50%, 0.2)`,
          hidden: true,
          tension: 0.3,
        }))
      ]
    };
  };

  // Chart data for breakdown view
  const getBreakdownChartData = () => {
    if (!processedData) return { labels: [], datasets: [] };

    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: processedData.quarterlyCategoryExpenses.map((category, index) => ({
        label: category.category,
        data: [category.q1, category.q2, category.q3, category.q4],
        backgroundColor: `hsla(${index * 360 / processedData.categories.length}, 70%, 50%, 0.7)`,
        borderColor: `hsl(${index * 360 / processedData.categories.length}, 70%, 50%)`,
        borderWidth: 1,
      })),
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: selectedView === 'trend' ? `Expense Trend for ${selectedYear}` : `Expense Breakdown by Category (${selectedYear})`,
        color: '#083344',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          callback: (value) => `$${value / 1000}k`,
          color: '#075985',
        },
        title: { 
          display: true, 
          text: 'Expenses ($)', 
          color: '#075985',
        },
      },
      x: {
        ticks: {
          color: '#075985',
        },
      },
    },
  };

  // CSV data
  const csvData = useMemo(() => {
    if (!processedData) return [];

    const headers = [
      'Month',
      'Total Expenses',
      ...processedData.categories.map(c => `${c} Expenses`),
      ...processedData.categories.map(c => `${c} Contribution (%)`)
    ];

    const rows = processedData.monthKeys.map((key, index) => {
      const month = processedData.months[index];
      const total = processedData.monthlyExpenses[index];
      const rowData = {
        Month: month,
        'Total Expenses': total,
      };

      processedData.categories.forEach(category => {
        const categoryExpense = processedData.monthlyCategoryExpenses
          .find(c => c.category === category)?.data[index] || 0;
        const percentage = total > 0 ? (categoryExpense / total * 100).toFixed(2) : 0;
        
        rowData[`${category} Expenses`] = categoryExpense;
        rowData[`${category} Contribution (%)`] = percentage;
      });

      return rowData;
    });

    return [headers, ...rows.map(row => Object.values(row))];
  }, [processedData]);

  // Table data for trend view
  const trendTableData = useMemo(() => {
    if (!processedData) return [];

    return processedData.monthKeys.map((key, index) => {
      const month = processedData.months[index];
      const total = processedData.monthlyExpenses[index];
      
      const detailData = processedData.categories.map(category => {
        const categoryExpense = processedData.monthlyCategoryExpenses
          .find(c => c.category === category)?.data[index] || 0;
        const percentage = total > 0 ? (categoryExpense / total * 100).toFixed(2) : 0;
        
        return {
          category,
          contribution: categoryExpense,
          contributionPct: percentage,
        };
      });

      return {
        month,
        total,
        detailData,
      };
    });
  }, [processedData]);

  // Toggle row expansion
  const toggleRow = (index) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return <div className="text-sky-700">Loading expense data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!expenseData) {
    return <div className="text-sky-700">No expense data available</div>;
  }

  return (
    <motion.div
      className="rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <button
        onClick={() => navigate('/financial-overview')}
        className="flex items-center justify-between text-sky-800 mb-2"
      >
        <FaHome className="mr-2" /> Dashboard | <span className='ml-2 text-gray-400'> Expense Breakdown</span>
      </button>
      <div className="flex bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-sky-50">Expense Breakdown</h2>
        </div>
        <div className="flex space-x-4 items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-md px-3 py-2 text-white bg-sky-900 outline-0"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="rounded-md px-3 py-2 text-white bg-sky-900 outline-0"
          >
            <option value="trend">Trend View</option>
            <option value="breakdown">Breakdown View</option>
          </select>
          <CSVLink
            data={csvData}
            filename={`expense-analytics-${selectedYear}.csv`}
            className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition"
          >
            <FaDownload className="mr-2" /> Export
          </CSVLink>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Total Expenses ({selectedYear})
            <span className="ml-1 text-sky-500" title="Sum of all expenses for the selected year">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.totalExpenses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Incremental Expenses (Last Month)
            <span className="ml-1 text-sky-500" title="Change from previous month">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.incrementalExpenses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Annual Growth Rate
            <span className="ml-1 text-sky-500" title="Percentage growth from start to end of year">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">{kpiMetrics.growthRate}%</p>
        </div>
      </div>

      {/* Chart and Table Layout */}
      <div className="flex gap-2 mb-6 ">
        <div className="flex flex-col w-[70%] lg:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-sky-900 mb-3">
              {selectedView === 'trend' ? 'Monthly Expense Details' : 'Category Breakdown'}
            </h3>
            <div className="overflow-x-auto">
              {selectedView === 'trend' ? (
                <table className="w-full bg-white border border-sky-200">
                  <thead>
                    <tr className="bg-sky-100">
                      <th className="py-3 px-6 border-b text-left text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Month</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Total Expenses ($)</th>
                      <th className="py-3 px-6 border-b text-left text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendTableData.map((row, index) => (
                      <React.Fragment key={index}>
                        <tr
                          className="hover:bg-sky-50 cursor-pointer"
                          onClick={() => toggleRow(index)}
                        >
                          <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap flex items-center">
                            {expandedRows.includes(index) ? (
                              <FaChevronDown className="mr-2" />
                            ) : (
                              <FaChevronRight className="mr-2" />
                            )}
                            {row.month}
                          </td>
                          <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${row.total.toLocaleString()}</td>
                          <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap">
                            <button 
                              className="text-sky-600 hover:text-sky-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(index);
                              }}
                            >
                              View breakdown
                            </button>
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="3" className="py-3 px-6 bg-sky-50">
                              <div>
                                <h4 className="text-base font-semibold text-sky-700 mb-2">Category Breakdown</h4>
                                <table className="w-full bg-white border border-sky-200">
                                  <thead>
                                    <tr className="bg-sky-100">
                                      <th className="py-3 px-6 border-b text-left text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Category</th>
                                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Amount ($)</th>
                                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Contribution (%)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.detailData.map((detail, i) => (
                                      <tr key={i}>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap">{detail.category}</td>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${detail.contribution.toLocaleString()}</td>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">{detail.contributionPct}%</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full bg-white border border-sky-200">
                  <thead>
                    <tr className="bg-sky-100">
                      <th className="py-3 px-6 border-b text-left text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Category</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Q1 ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Q2 ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Q3 ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Q4 ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiMetrics.quarterlyBreakdown.map((category, index) => (
                      <tr key={index} className="hover:bg-sky-50">
                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap">{category.category}</td>
                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${category.q1.toLocaleString()}</td>
                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${category.q2.toLocaleString()}</td>
                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${category.q3.toLocaleString()}</td>
                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${category.q4.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-semibold text-sky-900 mb-3">Category Contribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {kpiMetrics.categoryContributions.map((category, index) => (
                <div key={index} className="p-4 bg-sky-50 rounded-lg  border border-sky-200">
                  <h4 className="text-base font-medium text-sky-700 ">{category.category}</h4>
                  <p className="text-xl font-bold text-sky-900">{category.contribution}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <div className="h-64">
              {selectedView === 'trend' ? (
                <Line data={getTrendChartData()} options={chartOptions} />
              ) : (
                <Bar
                  data={getBreakdownChartData()}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { stacked: true },
                      y: { ...chartOptions.scales.y, stacked: false },
                    },
                  }}
                />
              )}
            </div>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
            <h4 className="text-base font-semibold text-sky-900 mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-sky-500" />
              Expense Insights
            </h4>
            <ul className="list-disc pl-5 text-sky-700 text-base space-y-1">
              <li>
                <strong className="text-sky-800">Highest Expense Category:</strong>{' '}
                {
                  kpiMetrics.categoryContributions.reduce(
                    (max, c) => (parseFloat(c.contribution) > parseFloat(max.contribution) ? c : max,
                    kpiMetrics.categoryContributions[0] || { category: 'N/A', contribution: '0' }
                  ).category)
                }
                
                {/* {
                  kpiMetrics.categoryContributions.reduce(
                    (max, c) => (parseFloat(c.contribution) > parseFloat(max.contribution) ? c : max,
                    kpiMetrics.categoryContributions[0] || { category: 'N/A', contribution: '0' }
                  ).contribution
                
                % contribution)} */}
              </li>
              <li>
                <strong className="text-sky-800">Expense Trend:</strong>{' '}
                {parseFloat(kpiMetrics.growthRate) > 0 ? 'Increasing' : 'Decreasing'} expenses observed year-to-date
              </li>
              <li>
                <strong className="text-sky-800">Average Monthly Expense:</strong>{' '}
                ${(expenseData.total_expense / processedData.monthKeys.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseComponent;