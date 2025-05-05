import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from 'react-csv';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaInfoCircle, FaChevronDown, FaChevronRight } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ExpenseComponent = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedDataset, setSelectedDataset] = useState('both');
  const [selectedView, setSelectedView] = useState('trend'); // 'trend' or 'breakdown'
  const [expandedRows, setExpandedRows] = useState([]);

  // Sample expense data with breakdown
  const expenseData = {
    2023: {
      actual: [80000, 85000, 90000, 87000, 92000, 95000, 91000, 93000, 94000, 96000, 95000, 98000],
      budgeted: [82000, 86000, 91000, 88000, 93000, 96000, 92000, 94000, 95000, 97000, 96000, 99000],
      breakdown: [
        { category: 'Salaries', q1: 30000, q2: 31000, q3: 32000, q4: 33000 },
        { category: 'Rent', q1: 15000, q2: 15000, q3: 15000, q4: 15000 },
        { category: 'Utilities', q1: 10000, q2: 11000, q3: 12000, q4: 13000 },
        { category: 'Marketing', q1: 20000, q2: 21000, q3: 22000, q4: 23000 },
      ],
    },
    2024: {
      actual: [90000, 92000, 95000, 93000, 97000, 100000, 96000, 98000, 99000, 101000, 100000, 103000],
      budgeted: [91000, 93000, 96000, 94000, 98000, 101000, 97000, 99000, 100000, 102000, 101000, 104000],
      breakdown: [
        { category: 'Salaries', q1: 32000, q2: 33000, q3: 34000, q4: 35000 },
        { category: 'Rent', q1: 16000, q2: 16000, q3: 16000, q4: 16000 },
        { category: 'Utilities', q1: 11000, q2: 12000, q3: 13000, q4: 14000 },
        { category: 'Marketing', q1: 21000, q2: 22000, q3: 23000, q4: 24000 },
      ],
    },
    2025: {
      actual: [95000, 97000, 100000, 98000, 102000, 105000, 101000, 103000, 104000, 106000, 105000, 108000],
      budgeted: [96000, 98000, 101000, 99000, 103000, 106000, 102000, 104000, 105000, 107000, 106000, 109000],
      breakdown: [
        { category: 'Salaries', q1: 34000, q2: 35000, q3: 36000, q4: 37000 },
        { category: 'Rent', q1: 17000, q2: 17000, q3: 17000, q4: 17000 },
        { category: 'Utilities', q1: 12000, q2: 13000, q3: 14000, q4: 15000 },
        { category: 'Marketing', q1: 22000, q2: 23000, q3: 24000, q4: 25000 },
      ],
    },
  };

  // Calculate KPIs
  const kpiMetrics = useMemo(() => {
    const data = expenseData[selectedYear][selectedDataset === 'both' ? 'actual' : selectedDataset];
    const breakdown = expenseData[selectedYear].breakdown;
    const totalExpenses = data.reduce((sum, value) => sum + value, 0);
    const incrementalExpenses = data[data.length - 1] - data[data.length - 2] || 0;
    const growthRate = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(2);

    // Calculate category contributions
    const categoryContributions = breakdown.map(item => ({
      category: item.category,
      contribution: ((item.q1 + item.q2 + item.q3 + item.q4) / totalExpenses * 100).toFixed(2),
    }));

    return {
      totalExpenses: totalExpenses.toLocaleString(),
      incrementalExpenses: incrementalExpenses.toLocaleString(),
      growthRate,
      categoryContributions,
      quarterlyBreakdown: breakdown,
    };
  }, [selectedYear, selectedDataset]);

  // Chart data for trend view
  const getTrendChartData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datasets = [];

    if (selectedDataset === 'actual' || selectedDataset === 'both') {
      datasets.push({
        label: `Actual Expenses (${selectedYear})`,
        data: expenseData[selectedYear].actual,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      });
    }

    if (selectedDataset === 'budgeted' || selectedDataset === 'both') {
      datasets.push({
        label: `Budgeted Expenses (${selectedYear})`,
        data: expenseData[selectedYear].budgeted,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        borderDash: [5, 5],
        tension: 0.3,
      });
    }

    return { labels, datasets };
  };

  // Chart data for breakdown view
  const getBreakdownChartData = () => {
    const breakdown = expenseData[selectedYear].breakdown;
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    return {
      labels: quarters,
      datasets: breakdown.map((item, index) => ({
        label: item.category,
        data: [item.q1, item.q2, item.q3, item.q4],
        backgroundColor: [`rgba(${75 + index * 50}, ${192 - index * 30}, ${192 - index * 20}, 0.7)`],
        borderColor: [`rgba(${75 + index * 50}, ${192 - index * 30}, ${192 - index * 20}, 1)`],
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
        color: '#083344', // text-sky-900
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
          color: '#075985', // text-sky-700
        },
        title: { 
          display: true, 
          text: 'Expenses ($)', 
          color: '#075985', // text-sky-700
        },
      },
      x: {
        ticks: {
          color: '#075985', // text-sky-700
        },
      },
    },
  };

  // CSV data
  const csvData = useMemo(() => {
    const headers = [
      'Month',
      'Actual Expenses',
      'Budgeted Expenses',
      'Variance ($)',
      'Variance (%)',
      ...expenseData[selectedYear].breakdown.map(c => `${c.category} Contribution`),
    ];

    const rows = expenseData[selectedYear].actual.map((actual, index) => {
      const budgeted = expenseData[selectedYear].budgeted[index];
      const variance = budgeted - actual;
      const variancePct = actual !== 0 ? (variance / actual * 100).toFixed(2) : 0;

      // Calculate category contributions for the month (simplified)
      const monthlyTotal = expenseData[selectedYear].actual.reduce((a, b) => a + b, 0);
      const categoryContributions = expenseData[selectedYear].breakdown.map(c => {
        const categoryAnnual = c.q1 + c.q2 + c.q3 + c.q4;
        const monthlyEstimate = (categoryAnnual / 12).toFixed(0);
        return monthlyEstimate;
      });

      return {
        Month: getTrendChartData().labels[index],
        'Actual Expenses': actual,
        'Budgeted Expenses': budgeted,
        'Variance ($)': variance,
        'Variance (%)': variancePct,
        ...expenseData[selectedYear].breakdown.reduce((acc, c, i) => {
          acc[`${c.category} Contribution`] = categoryContributions[i];
          return acc;
        }, {}),
      };
    });

    return [headers, ...rows.map(row => Object.values(row))];
  }, [selectedYear]);

  // Table data for trend view
  const trendTableData = useMemo(() => {
    return expenseData[selectedYear].actual.map((actual, index) => {
      const budgeted = expenseData[selectedYear].budgeted[index];
      const variance = budgeted - actual;
      const variancePct = actual !== 0 ? (variance / actual * 100).toFixed(2) : 0;

      // Calculate category contributions for detail view
      const detailData = expenseData[selectedYear].breakdown.map(c => {
        const quarterly = [c.q1, c.q2, c.q3, c.q4];
        const monthlyEstimate = Math.round(quarterly.reduce((a, b) => a + b, 0) / 12);
        return {
          category: c.category,
          contribution: Math.round(monthlyEstimate),
          contributionPct: actual !== 0 ? ((monthlyEstimate / actual) * 100).toFixed(2) : 0,
          q1: c.q1,
          q2: c.q2,
          q3: c.q3,
          q4: c.q4,
        };
      });

      return {
        month: getTrendChartData().labels[index],
        actual,
        budgeted,
        variance,
        variancePct,
        detailData,
      };
    });
  }, [selectedYear]);

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

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center bg-gray-200 text-sky-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-sky-900">Expense Breakdown</h2>
        </div>
        <div className="flex space-x-4 items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-md px-3 py-2 text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="border rounded-md px-3 py-2 text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="both">Actual & Budgeted</option>
            <option value="actual">Actual Only</option>
            <option value="budgeted">Budgeted Only</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="border rounded-md px-3 py-2 text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Total Expenses ({selectedYear})
            <span className="ml-1 text-sky-500" title="Sum of all expenses for the selected year">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.totalExpenses}</p>
        </div>
        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Incremental Expenses (Last Month)
            <span className="ml-1 text-sky-500" title="Change from previous month">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.incrementalExpenses}</p>
        </div>
        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
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
      <div className="flex gap-2 mb-6">
        {/* Left: Table and Insights */}
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Table */}
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
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Actual Expenses ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Budgeted Expenses ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Variance ($)</th>
                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Variance (%)</th>
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
                          <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${row.actual.toLocaleString()}</td>
                          <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${row.budgeted.toLocaleString()}</td>
                          <td className={`py-3 px-6 border-b text-base font-medium min-w-[120px] whitespace-nowrap text-right ${row.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="flex items-center justify-end">
                              ${Math.abs(row.variance).toLocaleString()} {row.variance >= 0 ? '▲' : '▼'}
                            </span>
                          </td>
                          <td className={`py-3 px-6 border-b text-base font-medium min-w-[120px] whitespace-nowrap text-right ${row.variancePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="flex items-center justify-end">
                              {Math.abs(row.variancePct)}% {row.variancePct >= 0 ? '▲' : '▼'}
                            </span>
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="5" className="py-3 px-6 bg-sky-50">
                              <div>
                                <h4 className="text-base font-semibold text-sky-700 mb-2">Category Breakdown</h4>
                                <table className="w-full bg-white border border-sky-200">
                                  <thead>
                                    <tr className="bg-sky-100">
                                      <th className="py-3 px-6 border-b text-left text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Category</th>
                                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Contribution ($)</th>
                                      <th className="py-3 px-6 border-b text-right text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Contribution (%)</th>
                                      <th className="py-3 px-6 border-b text-center text-base font-semibold text-sky-700 min-w-[120px] whitespace-nowrap">Quarterly Trend</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.detailData.map((detail, i) => (
                                      <tr key={i}>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap">{detail.category}</td>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">${detail.contribution.toLocaleString()}</td>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap text-right">{detail.contributionPct}%</td>
                                        <td className="py-3 px-6 border-b text-base text-sky-700 min-w-[120px] whitespace-nowrap">
                                          <div className="flex justify-center items-end h-12 max-w-[120px] mx-auto">
                                            {[detail.q1, detail.q2, detail.q3, detail.q4].map((val, j) => (
                                              <div
                                                key={j}
                                                className="mx-0.5 bg-sky-500 rounded-sm"
                                                style={{
                                                  width: '20px',
                                                  height: `${(val / Math.max(detail.q1, detail.q2, detail.q3, detail.q4) * 40)}px`,
                                                }}
                                                title={`Q${j + 1}: $${val.toLocaleString()}`}
                                              ></div>
                                            ))}
                                          </div>
                                        </td>
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
          {/* Expense Insights */}
        
        </div>

        {/* Right: Category Contribution and Chart */}
        <div className="flex flex-col gap-6">
          {/* Category Contribution Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-sky-900 mb-3">Category Contribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpiMetrics.categoryContributions.map((category, index) => (
                <div key={index} className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                  <h4 className="text-base font-medium text-sky-700">{category.category}</h4>
                  <p className="text-xl font-bold text-sky-900">{category.contribution}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart View */}
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
          <div className=" p-4 bg-sky-50 rounded-lg border border-sky-200">
            <h4 className="text-base font-semibold text-sky-900 mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-sky-500" />
              Expense Insights
            </h4>
            <ul className="list-disc flex items-center justify-between pl-5 text-sky-700 text-base space-y-1">
              <li>
                <strong className="text-sky-800">Highest Expense Category:</strong>{' '}
                {
                  kpiMetrics.categoryContributions.reduce(
                    (max, c) => (parseFloat(c.contribution) > parseFloat(max.contribution) ? c : max),
                    kpiMetrics.categoryContributions[0]
                  ).category
                }{' '}
                (
                {
                  kpiMetrics.categoryContributions.reduce(
                    (max, c) => (parseFloat(c.contribution) > parseFloat(max.contribution) ? c : max),
                    kpiMetrics.categoryContributions[0]
                  ).contribution
                }
                % contribution)
              </li>
              <li>
                <strong className="text-sky-800">Expense Trend:</strong>{' '}
                {parseFloat(kpiMetrics.growthRate) > 0 ? 'Increasing' : 'Decreasing'} expenses observed year-to-date
              </li>
              <li>
                <strong className="text-sky-800">Budget Accuracy:</strong>{' '}
                {trendTableData.filter(r => Math.abs(r.variancePct) < 5).length} out of 12 months within 5% budget variance
              </li>
            </ul>
          </div>
        </div> 
        
      </div>
    </motion.div>
  );
};

export default ExpenseComponent;