import { useState } from "react";
import { BsStars, BsFilter, BsCalendar, BsDownload, BsInfoCircle, BsGraphUp, BsPencil } from "react-icons/bs";
import { Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  FiChevronRight
} from "react-icons/fi";

const FixedVariableExpense = () => {
  // Main expense data (for Pie chart)
  const expenseData = {
    labels: ["Fixed", "Variable"],
    datasets: [{
      data: [65, 35],
      backgroundColor: ["#36A2EB", "#FFCE56"],
      borderWidth: 1
    }]
  };

  // Trend data (for Bar chart)
  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Fixed",
        data: [62, 63, 65, 64, 66, 65],
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 2
      },
      {
        label: "Variable",
        data: [38, 37, 35, 36, 34, 35],
        backgroundColor: "#FFCE56",
        borderColor: "#FFCE56",
        borderWidth: 2
      }
    ]
  };
  
  // New, expanded, and state-managed data for the editable table
  const initialDetailedExpenses = [
    {
      id: 1,
      category: "Salaries & Wages",
      type: "Fixed",
      aiForecast: 125500,
      budgetedAmount: 125500,
      confidence: "High",
      aiInsight: "Projected based on current headcount, planned new hires in Q3, and standard 3.5% merit increase.",
      justification: ""
    },
    {
      id: 2,
      category: "Office Rent",
      type: "Fixed",
      aiForecast: 81600,
      budgetedAmount: 81600,
      confidence: "High",
      aiInsight: "Based on existing 5-year lease agreement with a 2% annual escalator clause effective in January.",
      justification: ""
    },
    {
      id: 3,
      category: "Software Subscriptions (CRM, ERP)",
      type: "Fixed",
      aiForecast: 46200,
      budgetedAmount: 50000,
      confidence: "Medium",
      aiInsight: "Forecast includes known contract renewals. A 10% buffer is added for potential new tools.",
      justification: "Allocating extra budget for new project management software requested by the Ops team."
    },
    {
      id: 4,
      category: "Cloud Infrastructure (AWS/Azure)",
      type: "Variable",
      aiForecast: 63000,
      budgetedAmount: 63000,
      confidence: "Medium",
      aiInsight: "Forecast based on a 15% YoY usage growth trend, aligned with product roadmap scaling.",
      justification: ""
    },
    {
      id: 5,
      category: "Marketing Campaigns",
      type: "Variable",
      aiForecast: 58000,
      budgetedAmount: 65000,
      confidence: "Low",
      aiInsight: "Historical data suggests Q4 spike. Forecast is conservative due to market volatility.",
      justification: "Increasing spend for a new product launch campaign in Q4."
    },
    {
      id: 6,
      category: "Business Travel",
      type: "Variable",
      aiForecast: 25000,
      budgetedAmount: 22000,
      confidence: "Medium",
      aiInsight: "Projected based on post-pandemic travel rebound, but lower than pre-2020 levels.",
      justification: "Reducing travel budget by encouraging more virtual client meetings."
    },
    {
      id: 7,
      category: "Office Supplies & Utilities",
      type: "Variable",
      aiForecast: 15300,
      budgetedAmount: 15300,
      confidence: "High",
      aiInsight: "Stable trend with minor seasonal fluctuation in utility costs.",
      justification: ""
    },
     {
      id: 8,
      category: "Contingency / Miscellaneous",
      type: "Variable",
      aiForecast: 10000,
      budgetedAmount: 15000,
      confidence: "Low",
      aiInsight: "Standard 2% of total variable cost allocated as a buffer for unforeseen expenses.",
      justification: "Increased contingency for supply chain risk mitigation."
    }
  ];

  const [detailedExpenses, setDetailedExpenses] = useState(initialDetailedExpenses);

  const handleExpenseChange = (id, field, value) => {
    const updatedExpenses = detailedExpenses.map(exp => {
      if (exp.id === id) {
        // Ensure budgetedAmount is stored as a number
        const newValue = field === 'budgetedAmount' ? Number(value) || 0 : value;
        return { ...exp, [field]: newValue };
      }
      return exp;
    });
    setDetailedExpenses(updatedExpenses);
  };

  // Calculate totals for the table footer
  const totals = detailedExpenses.reduce((acc, exp) => {
    acc.aiForecast += exp.aiForecast;
    acc.budgetedAmount += exp.budgetedAmount;
    return acc;
  }, { aiForecast: 0, budgetedAmount: 0 });

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
                    <Link to="/operational-budgeting" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                      Operational Budgeting
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Budget vs Actuals Tracking</span>
                  </div>
                </li>
              </ol>
            </nav>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Fixed vs. Variable Expense Planning</h1>
            <p className="text-sky-100 text-xs">Recurring vs. project-based expense analysis</p>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center text-sky-50 hover:text-sky-900 py-2 px-3 text-xs font-medium  bg-sky-900 rounded-lg border border-sky-200 hover:bg-white transition-colors duration-200">
              <BsCalendar className="text-sky-500 mr-2" />
              <select className="bg-transparent  hover:text-sky-900">
                <option>Last 6 Months</option>
                <option>YTD</option>
                <option>Last Year</option>
              </select>
            </div>
            <button  className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-50 hover:text-sky-900 transition-colors duration-200">
              <BsFilter /> Filter Categories
            </button>
            <button  className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-50 hover:text-sky-900 transition-colors duration-200">            
              <BsDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-6">
        {/* Overview Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
          <BsStars className="absolute top-4 right-4 text-sky-400" />
          <h3 className="text-lg font-semibold text-sky-800 mb-4">
            Expense Composition
          </h3>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-64">
              <Pie 
                data={expenseData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw}% of total`
                      }
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
            <div className="w-full md:w-1/2 pl-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sky-800 font-medium">Fixed Costs</span>
                    <span className="text-sky-900 font-semibold">65%</span>
                  </div>
                  <div className="w-full bg-sky-100 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-800 font-medium">Variable Costs</span>
                    <span className="text-amber-900 font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2.5">
                    <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-sky-100">
                  <p className="text-sky-700 text-sm">
                    <span className="font-semibold">Fixed:</span> Recurring, predictable expenses (salaries, rent, subscriptions)
                  </p>
                  <p className="text-amber-700 text-sm mt-2">
                    <span className="font-semibold">Variable:</span> Fluctuating, project-based costs (marketing, travel, supplies)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
          <BsStars className="absolute top-4 right-4 text-sky-400" />
          <h3 className="text-lg font-semibold text-sky-800 mb-4">
            Monthly Trend
          </h3>
          <div className="h-64">
            <Bar 
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { stacked: true, ticks: { callback: value => `${value}%` }}, x: { stacked: true } }
              }}
            />
          </div>
          <p className="text-sm text-sky-600 mt-2">
            Fixed costs remain stable while variable costs fluctuate with business activity.
          </p>
        </div>
      </div>
      
      {/* New Editable Budget Table */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-sky-800">
            Line-Item Expense Budgeting
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-sky-700">Budget Scenario:</span>
            <select className="text-sm border border-sky-200 rounded px-2 py-1 bg-sky-50">
              <option>Base Case</option>
              <option>Growth Scenario</option>
              <option>Conservative Case</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-sky-800 uppercase bg-sky-100">
              <tr>
                <th scope="col" className="px-4 py-3">Expense Category</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3 text-right">AI Forecast</th>
                <th scope="col" className="px-4 py-3">AI Insight</th>
                <th scope="col" className="px-4 py-3 text-right">Budgeted Amount</th>
                <th scope="col" className="px-4 py-3 text-right">Variance</th>
                <th scope="col" className="px-4 py-3">Justification / Notes</th>
              </tr>
            </thead>
            <tbody>
              {detailedExpenses.map(expense => {
                const variance = expense.budgetedAmount - expense.aiForecast;
                const varianceColor = variance < 0 ? 'text-red-600' : 'text-green-600';
                return (
                  <tr key={expense.id} className="bg-white border-b hover:bg-sky-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{expense.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expense.type === 'Fixed' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                      }`}>
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">${expense.aiForecast.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 group relative">
                        <BsGraphUp className="text-sky-500" />
                        <span className="text-xs">{expense.confidence} Confidence</span>
                        <div className="absolute left-0 bottom-full mb-2 w-72 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg">
                          {expense.aiInsight}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input
                            type="number"
                            value={expense.budgetedAmount}
                            onChange={(e) => handleExpenseChange(expense.id, 'budgetedAmount', e.target.value)}
                            className="w-32 bg-sky-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2 text-right font-mono"
                          />
                        </div>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-semibold ${varianceColor}`}>
                      {variance === 0 ? '-' : `${variance > 0 ? '+' : ''}${variance.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={expense.justification}
                        placeholder="Add note..."
                        onChange={(e) => handleExpenseChange(expense.id, 'justification', e.target.value)}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-sky-500 p-1 text-xs"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="text-sm text-sky-900 font-bold bg-sky-200">
                <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right font-mono">${totals.aiForecast.toLocaleString()}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right font-mono">${totals.budgetedAmount.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-mono ${totals.budgetedAmount - totals.aiForecast < 0 ? 'text-red-700' : 'text-green-700'}`}>
                        ${(totals.budgetedAmount - totals.aiForecast).toLocaleString()}
                    </td>
                    <td className="px-4 py-3"></td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FixedVariableExpense;