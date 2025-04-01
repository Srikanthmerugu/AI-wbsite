import React from "react";
import Chart from "react-apexcharts";

const KeyFinancialKPIs = () => {
  // Chart data configurations
  const chartConfigs = {
    revenuePerEmployee: {
      title: "Revenue per Employee",
      type: "bar",
      series: [{ name: "Revenue/Employee", data: [50, 60, 70, 90, 100, 120] }],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          foreColor: "#0c4a6e" 
        },
        colors: ["#0369a1"],
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "60%"
          }
        }
      }
    },
    marketingROI: {
      title: "Marketing ROI",
      type: "line",
      series: [{ name: "ROI (%)", data: [30, 40, 45, 50, 49, 60] }],
      options: {
        chart: {
          type: "line",
          toolbar: { show: false },
          foreColor: "#0c4a6e" // sky-900
        },
        colors: ["#0284c7"], // sky-600
        stroke: { width: 3, curve: "smooth" },
        markers: { size: 5 },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }
      }
    },
    costPerLead: {
      title: "Cost per Lead",
      type: "area",
      series: [{ name: "Cost ($)", data: [20, 22, 24, 28, 30, 35] }],
      options: {
        chart: {
          type: "area",
          toolbar: { show: false },
          foreColor: "#0c4a6e" // sky-900
        },
        colors: ["#0ea5e9"], // sky-500
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 100]
          }
        },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] }
      }
    },
    profitability: {
      title: "Profitability by Segment",
      type: "bar",
      series: [
        { name: "Product", data: [10, 15, 20, 25, 30] },
        { name: "Region", data: [5, 10, 15, 20, 25] },
        { name: "Business Unit", data: [8, 12, 18, 22, 28] }
      ],
      options: {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
          foreColor: "#0c4a6e" // sky-900
        },
        colors: ["#0369a1", "#0284c7", "#0ea5e9"], // sky shades
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "70%"
          }
        },
        xaxis: { categories: ["Q1", "Q2", "Q3", "Q4", "Q5"] }
      }
    }
  };

  // Sample table data
  const kpiTableData = [
    { metric: "Current Revenue/Employee", value: "$120k", change: "+12%", trend: "up" },
    { metric: "Avg Marketing ROI", value: "52%", change: "+8%", trend: "up" },
    { metric: "Cost per Lead", value: "$28", change: "-5%", trend: "down" },
    { metric: "Overall Profitability", value: "24%", change: "+3%", trend: "up" }
  ];

  return (
    <div className="space-y-6 p-4  min-h-screen">
      {/* Header */}
     


      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-6 rounded-lg shadow-sm">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-white">Key Financial KPIs</h1>
      <p className="text-sky-100 mt-2">Performance metrics and financial indicators</p>
    </div>
    {/* <button 
      type="button" 
      className="py-2.5 px-5 shadow-2xl text-sm font-medium text-white bg-sky-900 rounded-lg border-2 border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
    >
      Add/Edit Widgets
    </button> */}
  </div>
</div>






      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiTableData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 hover:shadow-md transition-shadow">
            <h3 className="text-sky-800 font-medium mb-1">{item.metric}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-sky-900">{item.value}</span>
              <span className={`flex items-center text-sm font-medium ${
                item.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {item.change}
                {item.trend === "up" ? (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(chartConfigs).map(([key, config]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm p-6 border border-sky-100">
              <h3 className="text-xl font-semibold text-sky-900 mb-4">{config.title}</h3>
              <Chart
                options={config.options}
                series={config.series}
                type={config.type}
                height={300}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Data Table */}
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden border border-sky-100">
        <div className="p-6 border-b border-sky-100">
          <h3 className="text-xl font-semibold text-sky-900">Detailed KPI Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">QTD Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">YTD Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-100">
              {kpiTableData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-900">{item.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">{item.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {item.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-800">
                    {item.trend === "up" ? (
                      <span className="inline-flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Positive
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <svg className="h-4 w-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                        </svg>
                        Negative
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeyFinancialKPIs;