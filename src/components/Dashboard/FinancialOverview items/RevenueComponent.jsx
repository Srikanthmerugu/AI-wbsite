import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CSVLink } from 'react-csv';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaInfoCircle, FaChevronDown, FaChevronRight, FaHome } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const RevenueComponent = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedDataset, setSelectedDataset] = useState('both');
  const [selectedView, setSelectedView] = useState('trend'); // 'trend' or 'breakdown'
  const [expandedRows, setExpandedRows] = useState([]);

  // Enhanced sample data with breakdown
  const revenueData = {
    2023: {
      actual: [100000, 110000, 120000, 115000, 130000, 140000, 135000, 145000, 150000, 160000, 155000, 170000],
      forecasted: [105000, 115000, 125000, 120000, 135000, 145000, 140000, 150000, 155000, 165000, 160000, 175000],
      breakdown: [
        { product: 'Product A', q1: 25000, q2: 28000, q3: 30000, q4: 32000 },
        { product: 'Product B', q1: 30000, q2: 32000, q3: 35000, q4: 38000 },
        { product: 'Service C', q1: 20000, q2: 22000, q3: 25000, q4: 28000 },
        { product: 'Subscription D', q1: 25000, q2: 28000, q3: 30000, q4: 32000 },
      ],
    },
    2024: {
      actual: [120000, 130000, 140000, 135000, 150000, 160000, 155000, 165000, 170000, 180000, 175000, 190000],
      forecasted: [125000, 135000, 145000, 140000, 155000, 165000, 160000, 170000, 175000, 185000, 180000, 195000],
      breakdown: [
        { product: 'Product A', q1: 30000, q2: 33000, q3: 35000, q4: 38000 },
        { product: 'Product B', q1: 35000, q2: 38000, q3: 40000, q4: 42000 },
        { product: 'Service C', q1: 25000, q2: 28000, q3: 30000, q4: 32000 },
        { product: 'Subscription D', q1: 30000, q2: 33000, q3: 35000, q4: 38000 },
      ],
    },
    2025: {
      actual: [140000, 150000, 160000, 155000, 170000, 180000, 175000, 185000, 190000, 200000, 195000, 210000],
      forecasted: [145000, 155000, 165000, 160000, 175000, 185000, 180000, 190000, 195000, 205000, 200000, 215000],
      breakdown: [
        { product: 'Product A', q1: 35000, q2: 38000, q3: 40000, q4: 42000 },
        { product: 'Product B', q1: 40000, q2: 42000, q3: 45000, q4: 48000 },
        { product: 'Service C', q1: 30000, q2: 32000, q3: 35000, q4: 38000 },
        { product: 'Subscription D', q1: 35000, q2: 38000, q3: 40000, q4: 42000 },
      ],
    },
  };

  // Calculate KPIs
  const kpiMetrics = useMemo(() => {
    const data = revenueData[selectedYear][selectedDataset === 'both' ? 'actual' : selectedDataset];
    const breakdown = revenueData[selectedYear].breakdown;
    const totalRevenue = data.reduce((sum, value) => sum + value, 0);
    const incrementalRevenue = data[data.length - 1] - data[data.length - 2] || 0;
    const growthRate = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(2);

    // Calculate product contributions
    const productContributions = breakdown.map(item => ({
      product: item.product,
      contribution: ((item.q1 + item.q2 + item.q3 + item.q4) / totalRevenue * 100).toFixed(2),
    }));

    return {
      totalRevenue: totalRevenue.toLocaleString(),
      incrementalRevenue: incrementalRevenue.toLocaleString(),
      growthRate,
      productContributions,
      quarterlyBreakdown: breakdown,
    };
  }, [selectedYear, selectedDataset]);

  // Chart data for trend view
  const getTrendChartData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datasets = [];

    if (selectedDataset === 'actual' || selectedDataset === 'both') {
      datasets.push({
        label: `Actual Revenue (${selectedYear})`,
        data: revenueData[selectedYear].actual,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      });
    }

    if (selectedDataset === 'forecasted' || selectedDataset === 'both') {
      datasets.push({
        label: `Forecasted Revenue (${selectedYear})`,
        data: revenueData[selectedYear].forecasted,
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
    const breakdown = revenueData[selectedYear].breakdown;
    const products = breakdown.map(item => item.product);
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    return {
      labels: quarters,
      datasets: breakdown.map((item, index) => ({
        label: item.product,
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
        text: selectedView === 'trend' ? `Revenue Trend for ${selectedYear}` : `Revenue Breakdown by Product (${selectedYear})`,
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
          text: 'Revenue ($)',
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
      'Actual Revenue',
      'Forecasted Revenue',
      'Variance ($)',
      'Variance (%)',
      ...revenueData[selectedYear].breakdown.map(p => `${p.product} Contribution`),
    ];

    const rows = revenueData[selectedYear].actual.map((actual, index) => {
      const forecasted = revenueData[selectedYear].forecasted[index];
      const variance = forecasted - actual;
      const variancePct = (variance / actual * 100).toFixed(2);

      // Calculate product contributions for the month (simplified)
      const monthlyTotal = revenueData[selectedYear].actual.reduce((a, b) => a + b, 0);
      const productContributions = revenueData[selectedYear].breakdown.map(p => {
        const productAnnual = p.q1 + p.q2 + p.q3 + p.q4;
        const monthlyEstimate = (productAnnual / 12).toFixed(0);
        return monthlyEstimate;
      });

      return {
        Month: getTrendChartData().labels[index],
        'Actual Revenue': actual,
        'Forecasted Revenue': forecasted,
        'Variance ($)': variance,
        'Variance (%)': variancePct,
        ...revenueData[selectedYear].breakdown.reduce((acc, p, i) => {
          acc[`${p.product} Contribution`] = productContributions[i];
          return acc;
        }, {}),
      };
    });

    return [headers, ...rows.map(row => Object.values(row))];
  }, [selectedYear]);

  // Table data for trend view
  const trendTableData = useMemo(() => {
    return revenueData[selectedYear].actual.map((actual, index) => {
      const forecasted = revenueData[selectedYear].forecasted[index];
      const variance = forecasted - actual;
      const variancePct = (variance / actual * 100).toFixed(2);

      // Calculate product contributions for detail view
      const detailData = revenueData[selectedYear].breakdown.map(p => {
        const quarterly = [p.q1, p.q2, p.q3, p.q4];
        const monthlyEstimate = Math.round(quarterly.reduce((a, b) => a + b, 0) / 12);
        return {
          product: p.product,
          contribution: Math.round(monthlyEstimate),
          contributionPct: ((monthlyEstimate / actual) * 100).toFixed(2),
          q1: p.q1,
          q2: p.q2,
          q3: p.q3,
          q4: p.q4,
        };
      });

      return {
        month: getTrendChartData().labels[index],
        actual,
        forecasted,
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
      className="rounded-lg "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className=" rounded-md px-3 text-white bg-sky-900 py-2  outline-0 "
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className=" rounded-md px-3 py-2 text-sky-50 bg-sky-900  "
          >
            <option value="both">Actual & Forecasted</option>
            <option value="actual">Actual Only</option>
            <option value="forecasted">Forecasted Only</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className=" rounded-md px-3 py-2 text-sky-50  bg-sky-900  "
          >
            <option value="trend">Trend View</option>
            <option value="breakdown">Breakdown View</option>
          </select>
          <CSVLink
            data={csvData}
            filename={`revenue-analytics-${selectedYear}.csv`}
            className="flex items-center bg-sky-800 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition"
          >
            <FaDownload className="mr-2" /> Export
          </CSVLink>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Total Revenue ({selectedYear})
            <span className="ml-1 text-sky-500" title="Sum of all revenue for the selected year">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.totalRevenue}</p>
        </div>
        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
          <h3 className="text-sm font-semibold text-sky-700 flex items-center">
            Incremental Revenue (Last Month)
            <span className="ml-1 text-sky-500" title="Change from previous month">
              <FaInfoCircle size={14} />
            </span>
          </h3>
          <p className="text-2xl font-bold text-sky-900">${kpiMetrics.incrementalRevenue}</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Detailed Table */}
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-2">
            {selectedView === 'trend' ? 'Monthly Revenue Details' : 'Product Breakdown'}
          </h3>
          <div className="overflow-x-auto">
            {selectedView === 'trend' ? (
              <table className="min-w-full bg-white border border-sky-200">
                <thead>
                  <tr className="bg-sky-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Month</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Actual Revenue ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Forecasted Revenue ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Variance ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Variance (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {trendTableData.map((row, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className="hover:bg-sky-50 cursor-pointer"
                        onClick={() => toggleRow(index)}
                      >
                        <td className="py-2 px-4 border-b text-sm text-sky-700 flex items-center">
                          {expandedRows.includes(index) ? (
                            <FaChevronDown className="mr-2" />
                          ) : (
                            <FaChevronRight className="mr-2" />
                          )}
                          {row.month}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-sky-700">${row.actual.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-sm text-sky-700">${row.forecasted.toLocaleString()}</td>
                        <td className={`py-2 px-4 border-b text-sm ${row.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(row.variance).toLocaleString()} {row.variance >= 0 ? '▲' : '▼'}
                        </td>
                        <td className={`py-2 px-4 border-b text-sm ${row.variancePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(row.variancePct)}% {row.variancePct >= 0 ? '▲' : '▼'}
                        </td>
                      </tr>
                      {expandedRows.includes(index) && (
                        <tr>
                          <td colSpan="5" className="py-2 px-4 bg-sky-50">
                            <div className="pl-8">
                              <h4 className="text-sm font-semibold text-sky-700 mb-2">Product Breakdown</h4>
                              <table className="min-w-full bg-white border border-sky-200">
                                <thead>
                                  <tr className="bg-sky-100">
                                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Product</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Contribution ($)</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Contribution (%)</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Quarterly Trend</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.detailData.map((detail, i) => (
                                    <tr key={i}>
                                      <td className="py-2 px-4 border-b text-sm text-sky-700">{detail.product}</td>
                                      <td className="py-2 px-4 border-b text-sm text-sky-700">${detail.contribution.toLocaleString()}</td>
                                      <td className="py-2 px-4 border-b text-sm text-sky-700">{detail.contributionPct}%</td>
                                      <td className="py-2 px-4 border-b text-sm text-sky-700">
                                        <div className="flex items-center h-full">
                                          {[detail.q1, detail.q2, detail.q3, detail.q4].map((val, j) => (
                                            <div
                                              key={j}
                                              className="mx-0.5 bg-sky-500 rounded-sm"
                                              style={{
                                                width: '20px',
                                                height: `${(val / Math.max(detail.q1, detail.q2, detail.q3, detail.q4) * 50)}px`,
                                                alignSelf: 'flex-end',
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
              <table className="min-w-full bg-white border border-sky-200">
                <thead>
                  <tr className="bg-sky-100">
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Product</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Q1 ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Q2 ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Q3 ($)</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-sky-700">Q4 ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiMetrics.quarterlyBreakdown.map((product, index) => (
                    <tr key={index} className="hover:bg-sky-50">
                      <td className="py-2 px-4 border-b text-sm text-sky-700">{product.product}</td>
                      <td className="py-2 px-4 border-b text-sm text-sky-700">${product.q1.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b text-sm text-sky-700">${product.q2.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b text-sm text-sky-700">${product.q3.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b text-sm text-sky-700">${product.q4.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Product Contribution and Chart */}
        <div className="flex flex-col gap-6">
          {/* Product Contribution Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-sky-900 mb-2">Product Contribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpiMetrics.productContributions.map((product, index) => (
                <div key={index} className="p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <h4 className="text-sm font-medium text-sky-700">{product.product}</h4>
                  <p className="text-lg font-bold text-sky-900">{product.contribution}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart View */}
          <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <div className="h-96">
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
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <h3 className="text-lg font-semibold text-sky-900 mb-2 flex items-center">
          <FaInfoCircle className="mr-2 text-sky-500" />
          Revenue Insights
        </h3>
        <ul className="list-disc pl-5 text-sky-700 space-y-1">
          <li>
            <strong className="text-sky-800">Top Performing Product:</strong>{' '}
            {
              kpiMetrics.productContributions.reduce(
                (max, p) => (parseFloat(p.contribution) > parseFloat(max.contribution) ? p : max),
                kpiMetrics.productContributions[0]
              ).product
            }{' '}
            (
            {
              kpiMetrics.productContributions.reduce(
                (max, p) => (parseFloat(p.contribution) > parseFloat(max.contribution) ? p : max),
                kpiMetrics.productContributions[0]
              ).contribution
            }
            % contribution)
          </li>
          <li>
            <strong className="text-sky-800">Growth Trend:</strong>{' '}
            {parseFloat(kpiMetrics.growthRate) > 0 ? 'Positive' : 'Negative'} growth observed year-to-date
          </li>
          <li>
            <strong className="text-sky-800">Forecast Accuracy:</strong>{' '}
            {trendTableData.filter(r => Math.abs(r.variancePct) < 5).length} out of 12 months within 5% forecast variance
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default RevenueComponent;