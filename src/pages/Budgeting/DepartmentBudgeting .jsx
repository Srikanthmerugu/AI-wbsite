import { BsStars, BsFilter, BsCalendar, BsDownload, BsTable, BsBarChart } from "react-icons/bs";
import { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

export const DepartmentBudgeting = () => {
  const [viewMode, setViewMode] = useState("charts"); // 'charts', 'table', or 'hybrid'
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [timePeriod, setTimePeriod] = useState("Q2 2023");

  // Sample data
  const departments = [
    { name: "Marketing", budget: 120, actual: 115, variance: -4.2 },
    { name: "Sales", budget: 180, actual: 195, variance: +8.3 },
    { name: "Operations", budget: 220, actual: 210, variance: -4.5 },
    { name: "HR", budget: 80, actual: 85, variance: +6.2 },
    { name: "IT", budget: 150, actual: 145, variance: -3.3 },
    { name: "R&D", budget: 250, actual: 230, variance: -8.0 }
  ];

  const expenseCategories = ["Salaries", "Software", "Travel", "Supplies", "Other"];
  
  const detailedData = [
    { 
      department: "Marketing",
      salaries: 60,
      software: 25,
      travel: 20,
      supplies: 10,
      other: 5
    },
    {
      department: "Sales",
      salaries: 110,
      software: 15,
      travel: 35,
      supplies: 15,
      other: 5
    }
  ];

  // Chart data configurations
  const departmentData = {
    labels: departments.map(d => d.name),
    datasets: [{
      label: "Budget Allocation",
      data: departments.map(d => d.budget),
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", 
        "#4BC0C0", "#9966FF", "#FF9F40"
      ]
    }]
  };

  const comparisonData = {
    labels: departments.map(d => d.name),
    datasets: [
      {
        label: "Budgeted",
        data: departments.map(d => d.budget),
        backgroundColor: "#36A2EB"
      },
      {
        label: "Actual",
        data: departments.map(d => d.actual),
        backgroundColor: "#FFCE56"
      }
    ]
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
     
 {/* Header */}
      <div className="bg-gradient-to-r mb-5 from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white"> Department-Level Budgeting
            </h1>
            {/* <p className="text-sky-100 text-xs">{selectedCompany}</p> */}
          </div>
          <div className="flex space-x-2">
          <div className="flex flex-wrap gap-3">
          <div 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"> 
                           <BsCalendar className=" mr-2" />
            <select 
              className="bg-transparent  outline-0"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option>Q2 2023</option>
              <option>Q1 2023</option>
              <option>FY 2023</option>
            </select>
          </div>
          
          <select 
              className="flex items-center outline-0 py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept.name} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          
          <div className="flex bg-white border border-sky-200 rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-1 ${viewMode === "charts" ? "bg-sky-100 text-sky-800" : "text-sky-600"}`}
              onClick={() => setViewMode("charts")}
            >
              <BsBarChart />
            </button>
            <button 
              className={`px-3 py-1 ${viewMode === "table" ? "bg-sky-100 text-sky-800" : "text-sky-600"}`}
              onClick={() => setViewMode("table")}
            >
              <BsTable />
            </button>
            <button 
              className={`px-3 py-1 ${viewMode === "hybrid" ? "bg-sky-100 text-sky-800" : "text-sky-600"}`}
              onClick={() => setViewMode("hybrid")}
            >
              <div className="flex">
                <BsBarChart size={12} className="mt-1 mr-1" />
                <BsTable size={12} className="mt-1" />
              </div>
            </button>
          </div>
          
          <button className="flex items-center gap-2 bg-white hover:bg-sky-50 text-sky-800 px-4 py-2 rounded-lg border border-sky-200">
            <BsDownload /> Export
          </button>
        </div>
        </div>
        </div>
      </div>

























      {/* Conditional rendering based on view mode */}
      {viewMode === "table" ? (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Budget ($k)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Actual ($k)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Variance (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sky-200">
                {departments.map((dept) => (
                  <tr key={dept.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">${dept.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">${dept.actual}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      dept.variance < 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {dept.variance > 0 ? "+" : ""}{dept.variance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        Math.abs(dept.variance) < 5 ? "bg-green-100 text-green-800" :
                        Math.abs(dept.variance) < 10 ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {Math.abs(dept.variance) < 5 ? "On Track" :
                         Math.abs(dept.variance) < 10 ? "Watch" : "Alert"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-sky-50">
                <tr>
                  <td className="px-6 py-3 text-left text-sm font-bold text-sky-900">Total</td>
                  <td className="px-6 py-3 text-left text-sm font-bold text-sky-900">${departments.reduce((a,b) => a + b.budget, 0)}</td>
                  <td className="px-6 py-3 text-left text-sm font-bold text-sky-900">${departments.reduce((a,b) => a + b.actual, 0)}</td>
                  <td className="px-6 py-3 text-left text-sm font-bold text-sky-900">
                    {/* {((departments.reduce((a,b) => a + b.actual, 0) - departments.reduce((a,b) => a + b.budget, 0)) / 
                     departments.reduce((a,b) => a + b.budget, 0) * 100%)} */}
                  </td>
                  <td className="px-6 py-3 text-left text-sm font-bold text-sky-900"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Expense Breakdown</h3>
            <table className="min-w-full divide-y divide-sky-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Department</th>
                  {expenseCategories.map(cat => (
                    <th key={cat} className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">{cat} ($k)</th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sky-200">
                {detailedData.map((dept) => (
                  <tr key={dept.department}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{dept.department}</td>
                    {expenseCategories.map(cat => (
                      <td key={cat} className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">{dept[cat.toLowerCase()]}</td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">
                      {expenseCategories.reduce((sum, cat) => sum + dept[cat.toLowerCase()], 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === "charts" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Allocation Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
            <BsStars className="absolute top-4 right-4 text-sky-400" />
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Budget Allocation by Department
            </h3>
            <div className="h-64">
              <Line 
                data={departmentData}
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
          </div>

          {/* Budget vs Actual Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
            <BsStars className="absolute top-4 right-4 text-sky-400" />
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Budget vs. Actual Spending
            </h3>
            <div className="h-64">
              <Bar 
                data={comparisonData}
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
          </div>
        </div>
      ) : (
        /* Hybrid View */
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-sky-800 mb-4">
                  Budget Allocation
                </h3>
                <div className="h-64">
                  <Pie 
                    data={{
                      labels: departments.map(d => d.name),
                      datasets: [{
                        data: departments.map(d => d.budget),
                        backgroundColor: [
                          "#FF6384", "#36A2EB", "#FFCE56", 
                          "#4BC0C0", "#9966FF", "#FF9F40"
                        ]
                      }]
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-sky-800 mb-4">
                  Department Summary
                </h3>
                <div className="overflow-hidden shadow ring-1 ring-sky-200 rounded-lg">
                  <table className="min-w-full divide-y divide-sky-200">
                    <thead className="bg-sky-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-sky-800">Dept</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-sky-800">Budget</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-sky-800">Actual</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-sky-800">Var %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-200">
                      {departments.map(dept => (
                        <tr key={dept.name}>
                          <td className="px-4 py-2 text-sm text-sky-900">{dept.name}</td>
                          <td className="px-4 py-2 text-sm text-sky-700">${dept.budget}k</td>
                          <td className="px-4 py-2 text-sm text-sky-700">${dept.actual}k</td>
                          <td className={`px-4 py-2 text-sm ${
                            dept.variance < 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {dept.variance > 0 ? "+" : ""}{dept.variance}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              Detailed Expense Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sky-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-sky-800">Department</th>
                    {expenseCategories.map(cat => (
                      <th key={cat} className="px-6 py-3 text-left text-xs font-medium text-sky-800">{cat}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-200">
                  {detailedData.map(dept => (
                    <tr key={dept.department}>
                      <td className="px-6 py-4 text-sm font-medium text-sky-900">{dept.department}</td>
                      {expenseCategories.map(cat => (
                        <td key={cat} className="px-6 py-4 text-sm text-sky-700">
                          <div className="flex items-center">
                            <div className="w-3/4 bg-sky-100 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-sky-500 h-2.5 rounded-full" 
                                style={{ width: `${(dept[cat.toLowerCase()] / 150) * 100}%` }}
                              ></div>
                            </div>
                            <span>${dept[cat.toLowerCase()]}k</span>
                          </div>
                        </td>
                      ))}
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