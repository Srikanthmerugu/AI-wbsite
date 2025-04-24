import { BsStars, BsFilter, BsCalendar, BsDownload } from "react-icons/bs";
import { Pie, Bar } from "react-chartjs-2";

 const FixedVariableExpense = () => {
  // Main expense data
  const expenseData = {
    labels: ["Fixed", "Variable"],
    datasets: [{
      data: [65, 35],
      backgroundColor: ["#36A2EB", "#FFCE56"],
      borderWidth: 1
    }]
  };

  // Trend data
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

  // Detailed breakdown
  const breakdownData = {
    labels: ["Salaries", "Rent", "Software", "Marketing", "Travel", "Supplies"],
    datasets: [{
      label: "Amount ($k)",
      data: [120, 80, 45, 60, 25, 15],
      backgroundColor: [
        "#36A2EB", "#36A2EB", "#36A2EB", 
        "#FFCE56", "#FFCE56", "#FFCE56"
      ]
    }]
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
   


 {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Fixed vs. Variable Expenses</h1>
            <p className="text-sky-100 text-xs">Recurring vs. project-based expense analysis</p>
          </div>
          <div className="flex space-x-2">
          <div
              className="flex items-center text-sky-50 hover:text-sky-900 py-2 px-3 text-xs font-medium  bg-sky-900 rounded-lg border border-sky-200 hover:bg-white transition-colors duration-200">              <BsCalendar className="text-sky-500 mr-2" />
            <select
             className="bg-transparent  hover:text-sky-900">
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
                    <div 
                      className="bg-sky-500 h-2.5 rounded-full" 
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-800 font-medium">Variable Costs</span>
                    <span className="text-amber-900 font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2.5">
                    <div 
                      className="bg-amber-400 h-2.5 rounded-full" 
                      style={{ width: '35%' }}
                    ></div>
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
                scales: {
                  y: {
                    stacked: true,
                    ticks: {
                      callback: value => `${value}%`
                    }
                  },
                  x: {
                    stacked: true
                  }
                }
              }}
            />
          </div>
          <p className="text-sm text-sky-600 mt-2">
            Fixed costs remain stable while variable costs fluctuate with business activity
          </p>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="lg:col-span-2 bg-white w-[500px] p-5 rounded-xl shadow-sm border border-sky-100 relative">
          <BsStars className="absolute top-4 right-4 text-sky-400" />
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-sky-800">
              Detailed Expense Breakdown
            </h3>
            <select className="text-sm border border-sky-200 rounded px-2 mr-5 py-1">
              <option>All Departments</option>
              <option>Marketing</option>
              <option>Operations</option>
            </select>
          </div>
          <div className="h-80">
            <Bar 
              data={breakdownData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: value => `$${value}k`
                    }
                  }
                }
              }}
            />
          </div>
          <div className="flex justify-between mt-4 text-sm text-sky-700">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <span>Fixed Expenses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-400 mr-1"></div>
              <span>Variable Expenses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FixedVariableExpense;