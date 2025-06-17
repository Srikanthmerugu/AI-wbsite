import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import FinancialHeader from "./FinancialHeader";
import FinancialFilters from "./FinancialFilters";
import FinancialMetrics from "./FinancialMetrics";
import FinancialCharts from "./FinancialCharts";
import FinancialDataTable from "./FinancialDataTable";
// import FinancialHeader from "./FinancialHeader";
// import FinancialMetrics from "./FinancialMetrics";
// import FinancialCharts from "./FinancialCharts";
// import FinancialFilters from "./FinancialFilters";
// import FinancialDataTable from "./FinancialDataTable";

// Sample headcount data
const sampleHeadcountData = {
  value: 126,
  change: "+1%",
  trend: {
    Jan: 120,
    Feb: 122,
    Mar: 124,
    Apr: 125,
    May: 126,
    Jun: 126,
    Jul: 127,
    Aug: 128,
    Sep: 130,
    Oct: 131,
    Nov: 132,
    Dec: 133,
  },
};

const FinancialOverview = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [showFilters, setShowFilters] = useState(false);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const [activeWidgets, setActiveWidgets] = useState([
    "revenueTrend",
    "expenseBreakdown",
    "profitAnalysis",
    "cashFlow",
    "headcount",
  ]);
  const [chartTypes, setChartTypes] = useState({
    revenueTrend: "line",
    expenseBreakdown: "pie",
    profitAnalysis: "bar",
    cashFlow: "line",
    headcount: "line",
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(
          `https://fpnainsightsapi.mavenerp.in/api/v1/company/financial/financial-overview?year=${2023}`
        );
        setFinancialData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [year]);

  const calculateChange = (current, previous) => {
    const change = ((current - previous) / Math.abs(previous)) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getKPIData = () => {
    if (!financialData) return {};

    return {
      revenue: {
        value: financialData.revenue,
        change: calculateChange(financialData.revenue, financialData.revenue * 0.95),
        componentPath: "/revenue-component",
      },
      gross_profit: {
        value: financialData.gross_profit,
        change: calculateChange(financialData.gross_profit, financialData.gross_profit * 0.93),
        componentPath: "/revenue-component",
      },
      expenses: {
        value: financialData.expenses,
        change: calculateChange(financialData.expenses, financialData.expenses * 0.97),
        componentPath: "/expense-component",
      },
      net_profit: {
        value: financialData.net_profit,
        change: calculateChange(financialData.net_profit, financialData.net_profit * 1.03),
        componentPath: "/revenue-component",
      },
      cash_flow: {
        value: financialData.cash_flow,
        change: calculateChange(financialData.cash_flow, financialData.cash_flow * 1.05),
        componentPath: "/cash-flow",
      },
      headcount: {
        value: sampleHeadcountData.value,
        change: sampleHeadcountData.change,
        componentPath: "/hr-component",
      },
    };
  };

  const getChartsData = () => {
    if (!financialData) return {};

    return {
      revenueTrend: {
        title: "Revenue Trend",
        componentPath: "/revenue-component",
        data: {
          labels: Object.keys(financialData.revenue_trend),
          datasets: [
            {
              label: "Revenue",
              data: Object.values(financialData.revenue_trend),
              backgroundColor: "rgba(14, 165, 233, 0.2)",
              borderColor: "rgba(14, 165, 233, 1)",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
        defaultType: "line",
      },
      expenseBreakdown: {
        title: "Expense Breakdown",
        componentPath: "/expense-component",
        data: {
          labels: Object.keys(financialData.expense_breakdown).map(key => 
            key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
          ),
          datasets: [
            {
              label: "Expenses",
              data: Object.values(financialData.expense_breakdown),
              backgroundColor: [
                "rgba(239, 68, 68, 0.7)",
                "rgba(59, 130, 246, 0.7)",
                "rgba(234, 179, 8, 0.7)",
                "rgba(16, 185, 129, 0.7)",
                "rgba(139, 92, 246, 0.7)",
                "rgba(20, 184, 166, 0.7)",
                "rgba(245, 158, 11, 0.7)",
                "rgba(236, 72, 153, 0.7)",
              ],
              borderColor: [
                "rgba(239, 68, 68, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(234, 179, 8, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(20, 184, 166, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(236, 72, 153, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
        defaultType: "pie",
      },
      profitAnalysis: {
        title: "Profit Analysis",
        componentPath: "/profit-analysis",
        data: {
          labels: Object.keys(financialData.profit_analysis),
          datasets: [
            {
              label: "Gross Profit",
              data: Object.values(financialData.profit_analysis).map(q => q.gross),
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
            },
            {
              label: "Net Profit",
              data: Object.values(financialData.profit_analysis).map(q => q.net),
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              borderColor: "rgba(139, 92, 246, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
        defaultType: "bar",
      },
      cashFlow: {
        title: "Cash Flow",
        componentPath: "/cash-flow",
        data: {
          labels: Object.keys(financialData.revenue_trend),
          datasets: [
            {
              label: "Cash Flow",
              data: Object.keys(financialData.revenue_trend).map(() => financialData.cash_flow),
              backgroundColor: "rgba(14, 165, 233, 0.2)",
              borderColor: "rgba(14, 165, 233, 1)",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
        defaultType: "line",
      },
      headcount: {
        title: "Headcount Trend",
        componentPath: "/hr-component",
        data: {
          labels: Object.keys(sampleHeadcountData.trend),
          datasets: [
            {
              label: "Employees",
              data: Object.values(sampleHeadcountData.trend),
              backgroundColor: "rgba(167, 139, 250, 0.2)",
              borderColor: "rgba(167, 139, 250, 1)",
              borderWidth: 2,
            },
            {
              label: "Target",
              data: Object.values(sampleHeadcountData.trend).map(val => val - 2),
              backgroundColor: "rgba(126, 99, 235, 0.2)",
              borderColor: "rgba(126, 99, 235, 1)",
              borderWidth: 2,
              borderDash: [5, 5],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
        defaultType: "line",
      },
    };
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActiveWidgets(items);
  };

  const handleChartTypeChange = (widgetId, type) => {
    setChartTypes((prev) => ({
      ...prev,
      [widgetId]: type,
    }));
  };

  const handleAIQuery = (widgetId, query) => {
    console.log(`AI Query for ${widgetId}:`, query);
    // Here you would typically call your AI API
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>No data available</div>
      </div>
    );
  }

  const kpiData = getKPIData();
  const chartsData = getChartsData();

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <FinancialHeader showFilters={showFilters} setShowFilters={setShowFilters} />
      
      <FinancialFilters showFilters={showFilters} setShowFilters={setShowFilters} />
      
      <FinancialMetrics kpiData={kpiData} />
      
      <FinancialCharts
        activeWidgets={activeWidgets}
        chartsData={chartsData}
        chartTypes={chartTypes}
        onDragEnd={onDragEnd}
        onChartTypeChange={handleChartTypeChange}
        onAIQuery={handleAIQuery}
      />
      
      <FinancialDataTable kpiData={kpiData} />
    </div>
  );
};

export default FinancialOverview;