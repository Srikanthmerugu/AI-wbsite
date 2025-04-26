import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  FiFilter,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueForecasting = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [period, setPeriod] = useState('Q1 2025');
  const [revenueClients, setRevenueClients] = useState([
    { name: 'Client 1', industry: 'Tech', previous: 10000, month1: { ai: 11000, user: 11000 }, month2: { ai: 11500, user: 11500 }, month3: { ai: 12000, user: 12000 } },
    { name: 'Client 2', industry: 'Retail', previous: 8000, month1: { ai: 8500, user: 8500 }, month2: { ai: 8700, user: 8700 }, month3: { ai: 9000, user: 9000 } },
    { name: 'Client 3', industry: 'Finance', previous: 12000, month1: { ai: 12500, user: 12500 }, month2: { ai: 13000, user: 13000 }, month3: { ai: 13500, user: 13500 } },
    { name: 'Client 4', industry: 'Tech', previous: 9000, month1: { ai: 9500, user: 9500 }, month2: { ai: 9800, user: 9800 }, month3: { ai: 10000, user: 10000 } },
    { name: 'Client 5', industry: 'Retail', previous: 7000, month1: { ai: 7400, user: 7400 }, month2: { ai: 7600, user: 7600 }, month3: { ai: 7800, user: 7800 } },
    { name: 'Client 6', industry: 'Finance', previous: 11000, month1: { ai: 11500, user: 11500 }, month2: { ai: 11800, user: 11800 }, month3: { ai: 12000, user: 12000 } },
    { name: 'Client 7', industry: 'Tech', previous: 8500, month1: { ai: 9000, user: 9000 }, month2: { ai: 9200, user: 9200 }, month3: { ai: 9500, user: 9500 } },
    { name: 'Client 8', industry: 'Retail', previous: 9500, month1: { ai: 10000, user: 10000 }, month2: { ai: 10200, user: 10200 }, month3: { ai: 10500, user: 10500 } },
    { name: 'Client 9', industry: 'Finance', previous: 10500, month1: { ai: 11000, user: 11000 }, month2: { ai: 11300, user: 11300 }, month3: { ai: 11600, user: 11600 } },
    { name: 'Client 10', industry: 'Tech', previous: 8200, month1: { ai: 8600, user: 8600 }, month2: { ai: 8800, user: 8800 }, month3: { ai: 9000, user: 9000 } },
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    { name: 'Salaries', previous: 50000, month1: { ai: 52000, user: 52000 }, month2: { ai: 53000, user: 53000 }, month3: { ai: 54000, user: 54000 } },
    { name: 'Rent', previous: 10000, month1: { ai: 10000, user: 10000 }, month2: { ai: 10000, user: 10000 }, month3: { ai: 10000, user: 10000 } },
    { name: 'Utilities', previous: 2000, month1: { ai: 2100, user: 2100 }, month2: { ai: 2200, user: 2200 }, month3: { ai: 2300, user: 2300 } },
    { name: 'Marketing', previous: 15000, month1: { ai: 16000, user: 16000 }, month2: { ai: 16500, user: 16500 }, month3: { ai: 17000, user: 17000 } },
    { name: 'Travel', previous: 5000, month1: { ai: 5200, user: 5200 }, month2: { ai: 5300, user: 5300 }, month3: { ai: 5400, user: 5400 } },
  ]);
  const [revenueVersions, setRevenueVersions] = useState([]);
  const [expenseVersions, setExpenseVersions] = useState([]);
  const [revenueForecasts, setRevenueForecasts] = useState({});
  const [expenseForecasts, setExpenseForecasts] = useState({});

  // AI Suggestions for Revenue
  useEffect(() => {
    const generateRevenueAISuggestions = () => {
      return revenueClients.map((client) => {
        const trendFactor = client.previous * 0.05; // 5% growth
        const newClientFactor = client.industry === 'Tech' ? 1000 : 500; // New wins
        const seasonality = {
          Tech: 1.1, // +10%
          Retail: 0.95, // -5%
          Finance: 1.05, // +5%
        }[client.industry];

        return {
          ...client,
          month1: { ai: Math.round((client.previous + trendFactor + newClientFactor) * seasonality), user: client.month1.user },
          month2: { ai: Math.round((client.previous + trendFactor * 1.1 + newClientFactor) * seasonality), user: client.month2.user },
          month3: { ai: Math.round((client.previous + trendFactor * 1.2 + newClientFactor) * seasonality), user: client.month3.user },
        };
      });
    };
    setRevenueClients(generateRevenueAISuggestions());
  }, [period]);

  // AI Suggestions for Expenses
  useEffect(() => {
    const generateExpenseAISuggestions = () => {
      return expenseCategories.map((category) => {
        const trendFactor = category.previous * 0.03; // 3% growth
        const seasonality = category.name === 'Marketing' ? 1.1 : 1.0; // Marketing +10%
        return {
          ...category,
          month1: { ai: Math.round(category.previous + trendFactor * seasonality), user: category.month1.user },
          month2: { ai: Math.round(category.previous + trendFactor * 1.05 * seasonality), user: category.month2.user },
          month3: { ai: Math.round(category.previous + trendFactor * 1.1 * seasonality), user: category.month3.user },
        };
      });
    };
    setExpenseCategories(generateExpenseAISuggestions());
  }, [period]);

  // Auto-save for Revenue
  useEffect(() => {
    const saveRevenueForecast = () => {
      const timestamp = new Date().toISOString();
      setRevenueForecasts((prev) => ({
        ...prev,
        [period]: revenueClients,
      }));
      setRevenueVersions((prev) => [
        ...prev,
        { period, timestamp, data: revenueClients },
      ]);
    };
    const timer = setTimeout(saveRevenueForecast, 1000);
    return () => clearTimeout(timer);
  }, [revenueClients, period]);

  // Auto-save for Expenses
  useEffect(() => {
    const saveExpenseForecast = () => {
      const timestamp = new Date().toISOString();
      setExpenseForecasts((prev) => ({
        ...prev,
        [period]: expenseCategories,
      }));
      setExpenseVersions((prev) => [
        ...prev,
        { period, timestamp, data: expenseCategories },
      ]);
    };
    const timer = setTimeout(saveExpenseForecast, 1000);
    return () => clearTimeout(timer);
  }, [expenseCategories, period]);

  // Handle user adjustments
  const handleRevenueAdjustment = (index, month, value) => {
    const updatedClients = [...revenueClients];
    updatedClients[index][month].user = parseFloat(value) || 0;
    setRevenueClients(updatedClients);
  };

  const handleExpenseAdjustment = (index, month, value) => {
    const updatedCategories = [...expenseCategories];
    updatedCategories[index][month].user = parseFloat(value) || 0;
    setExpenseCategories(updatedCategories);
  };

  // Forecast Summaries
  const revenueAITotal = revenueClients.reduce(
    (sum, client) => sum + client.month1.ai + client.month2.ai + client.month3.ai,
    0
  );
  const revenueUserTotal = revenueClients.reduce(
    (sum, client) => sum + client.month1.user + client.month2.user + client.month3.user,
    0
  );
  const expenseAITotal = expenseCategories.reduce(
    (sum, cat) => sum + cat.month1.ai + cat.month2.ai + cat.month3.ai,
    0
  );
  const expenseUserTotal = expenseCategories.reduce(
    (sum, cat) => sum + cat.month1.user + cat.month2.user + cat.month3.user,
    0
  );

  // Revenue Trend Chart Data
  const revenueTrendData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [85000, 87000, 90000, null, null, null],
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'AI Forecast',
        data: [null, null, null, revenueAITotal / 3, revenueAITotal / 3, revenueAITotal / 3],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'User Forecast',
        data: [null, null, null, revenueUserTotal / 3, revenueUserTotal / 3, revenueUserTotal / 3],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Expense Trend Chart Data
  const expenseTrendData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Actual Expenses',
        data: [75000, 76000, 77000, null, null, null],
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'AI Forecast',
        data: [null, null, null, expenseAITotal / 3, expenseAITotal / 3, expenseAITotal / 3],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'User Forecast',
        data: [null, null, null, expenseUserTotal / 3, expenseUserTotal / 3, expenseUserTotal / 3],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="sspace-y-6 p-4 min-h-screen relative bg-sky-50">
    




        {/* Header */}
            <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-bold text-white">Revenue Forecast </h1>
                  <p className="text-sky-100 text-xs">Create and adjust revenue and expense forecasts with AI insights</p>
                </div>
                <div className="flex items-center space-x-4">
            <div className="flex space-x-1 rounded-lg">
              <NavLink
                to="#"
                onClick={() => setActiveTab('revenue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'revenue'
                    ? 'bg-sky-900 text-sky-50'
                    : 'text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50'
                }`}
              >
                Revenue Forecast
              </NavLink>
              <NavLink
                to="#"
                onClick={() => setActiveTab('expense')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'expense'
                    ? 'bg-sky-900 text-sky-50'
                    : 'text-sky-900 bg-sky-50 hover:bg-sky-700 hover:text-sky-50'
                }`}
              >
                Expense Forecast
              </NavLink>
            </div>
            <div className=''>
              <label className="text-sm  text-sky-800 font-bold mr-2">Forecast Period :</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="p-2 border-2 bg-sky-100 text-sky-900 border-sky-800 outline-0 rounded-lg text-sm"
              >
                <option>Q1 2025</option>
                <option>Q2 2025</option>
                <option>Q3 2025</option>
                <option>Q4 2025</option>
              </select>
            </div>
          </div>
              </div>
            </div>


      {activeTab === 'revenue' ? (
        <div>
          {/* Revenue Forecast Summary */}
          <div className="bg-white p-6 rounded-lg mt-5 shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Revenue Forecast Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">Total for Period</p>
                <p className="text-2xl font-bold text-sky-900">${revenueUserTotal.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">AI Suggested Forecast</p>
                <p className="text-2xl font-bold text-sky-900">${revenueAITotal.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">User Adjusted Forecast</p>
                <p className="text-2xl font-bold text-sky-900">${revenueUserTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-white mt-5 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Revenue Trend</h2>
            <div className="h-[300px]">
              <Line
                data={revenueTrendData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: { color: 'rgba(0, 0, 0, 0.05)' },
                      title: { display: true, text: 'Revenue ($)' },
                    },
                    x: {
                      grid: { display: false },
                      title: { display: true, text: 'Month' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Revenue Client Forecast Table */}
          <div className="bg-white rounded-lg mt-5 shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Revenue Forecast Editor</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sky-100">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Client Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Previous Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 3</th>
                    </tr>
                    <tr className="bg-sky-50">
                      <th></th>
                      <th></th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {revenueClients.map((client, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-sky-900">{client.name}</td>
                        <td className="px-4 py-3 text-sm text-sky-800">${client.previous.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-sky-800">${client.month1.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={client.month1.user}
                            onChange={(e) => handleRevenueAdjustment(index, 'month1', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">${client.month2.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={client.month2.user}
                            onChange={(e) => handleRevenueAdjustment(index, 'month2', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">${client.month3.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={client.month3.user}
                            onChange={(e) => handleRevenueAdjustment(index, 'month3', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-sky-100 font-semibold">
                      <td className="px-4 py-3 text-sm text-sky-900">Total</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.previous, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month1.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month1.user, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month2.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month2.user, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month3.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${revenueClients.reduce((sum, c) => sum + c.month3.user, 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revenue Version History */}
          <div className="bg-white p-6 mt-5 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Revenue Version History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {revenueVersions.map((version, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                      <td className="px-4 py-3 text-sm text-sky-800">{version.period}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{new Date(version.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setRevenueClients(version.data)}
                          className="text-sm text-sky-700 hover:text-sky-900"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Expense Forecast Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Expense Forecast Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">Total for Period</p>
                <p className="text-2xl font-bold text-sky-900">${expenseUserTotal.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">AI Suggested Forecast</p>
                <p className="text-2xl font-bold text-sky-900">${expenseAITotal.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-lg">
                <p className="text-sm font-medium text-sky-700">User Adjusted Forecast</p>
                <p className="text-2xl font-bold text-sky-900">${expenseUserTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Expense Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Expense Trend</h2>
            <div className="h-[300px]">
              <Line
                data={expenseTrendData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: { color: 'rgba(0, 0, 0, 0.05)' },
                      title: { display: true, text: 'Expenses ($)' },
                    },
                    x: {
                      grid: { display: false },
                      title: { display: true, text: 'Month' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Expense Category Forecast Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-sky-900 mb-4">Category Forecast Editor</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sky-100">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Category Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Previous Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase" colSpan="2">Month 3</th>
                    </tr>
                    <tr className="bg-sky-50">
                      <th></th>
                      <th></th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">AI Suggested</th>
                      <th className="px-4 py-2 text-xs font-medium text-sky-700">Adjustments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {expenseCategories.map((category, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-sky-900">{category.name}</td>
                        <td className="px-4 py-3 text-sm text-sky-800">${category.previous.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-sky-800">${category.month1.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={category.month1.user}
                            onChange={(e) => handleExpenseAdjustment(index, 'month1', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">${category.month2.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={category.month2.user}
                            onChange={(e) => handleExpenseAdjustment(index, 'month2', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-sky-800">${category.month3.ai.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={category.month3.user}
                            onChange={(e) => handleExpenseAdjustment(index, 'month3', e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-lg text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-sky-100 font-semibold">
                      <td className="px-4 py-3 text-sm text-sky-900">Total</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.previous, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month1.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month1.user, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month2.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month2.user, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month3.ai, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-sky-900">${expenseCategories.reduce((sum, c) => sum + c.month3.user, 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Expense Version History */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">Expense Version History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-100">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-sky-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {expenseVersions.map((version, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-sky-50'}>
                      <td className="px-4 py-3 text-sm text-sky-800">{version.period}</td>
                      <td className="px-4 py-3 text-sm text-sky-800">{new Date(version.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpenseCategories(version.data)}
                          className="text-sm text-sky-700 hover:text-sky-900"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueForecasting;