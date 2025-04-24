import { BsStars, BsFilter } from "react-icons/bs";
import { Line, Doughnut } from "react-chartjs-2";

export const RevenueBudgeting = () => {
  // Revenue trend data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Actual Revenue",
        data: [450, 520, 480, 550, 600, 580],
        borderColor: "#4BC0C0",
        tension: 0.3,
        fill: false
      },
      {
        label: "Projected",
        data: [400, 450, 500, 550, 600, 650],
        borderColor: "#FFCE56",
        borderDash: [5,5],
        tension: 0.3,
        fill: false
      }
    ]
  };

  // Budget allocation data
  const allocationData = {
    labels: ["Sales", "Marketing", "CS", "Product"],
    datasets: [{
      data: [35, 25, 20, 20],
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="bg-sky-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-sky-900">
          Revenue-Based Budgeting
        </h2>
        <div className="flex gap-3">
          <select className="bg-white border border-sky-200 rounded px-3 py-1">
            <option>Last 6 Months</option>
            <option>YTD</option>
          </select>
          <button className="flex items-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-800 px-4 py-2 rounded-lg">
            <BsFilter /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
          <BsStars className="absolute top-4 right-4 text-sky-400" />
          <h3 className="text-lg font-semibold text-sky-800 mb-4">
            Revenue vs. Budget
          </h3>
          <div className="h-64">
            <Line 
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: {
                      callback: value => `$${value}k`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Allocation Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 relative">
          <BsStars className="absolute top-4 right-4 text-sky-400" />
          <h3 className="text-lg font-semibold text-sky-800 mb-4">
            Budget Allocation
          </h3>
          <div className="h-64">
            <Doughnut 
              data={allocationData}
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: ctx => `${ctx.label}: ${ctx.raw}%`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};