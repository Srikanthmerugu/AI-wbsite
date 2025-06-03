
import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FiTrendingUp, FiDownload, FiTrendingDown, FiUsers, FiDollarSign, FiTarget, FiAlertTriangle, FiBarChart2, FiSettings, FiCheckCircle, FiXCircle, FiMaximize2 } from "react-icons/fi";
import { BsLightningFill, BsShieldFillCheck, BsGraphDown, BsTable } from 'react-icons/bs';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

const formatCurrency = (value, minimumFractionDigits = 0) => {
  if (typeof value !== 'number' || isNaN(value)) { // Added check for non-numeric values
    return "N/A";
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: 2,
  }).format(value);
};

const initialBaselineMetrics = {
  // Revenue
  salesVolume: 10000, // units per period
  averageSellingPrice: 100, // $ per unit
  customerAcquisitionRate: 50, // new customers per period
  customerChurnRate: 2, // % per period
  // COGS
  directMaterialCostPerUnit: 30,
  laborCostPerUnit: 15,
  manufacturingOverheadPerUnit: 10,
  // OPEX
  headcount: 50,
  averageSalaryPerEmployee: 70000, // annual
  marketingSpend: 50000, // per period
  technologySpend: 20000, // per period
  gaSpend: 30000, // per period
  // Cashflow (simplified for this example)
  dso: 45, // days
  dpo: 30, // days
  dio: 60, // days
  capexSpend: 10000, // per period
};

const ScenarioModeling = () => {
  const [activeScenarioPreset, setActiveScenarioPreset] = useState('custom'); // 'base', 'best', 'worst', 'custom'
  const [simulationPeriodMonths, setSimulationPeriodMonths] = useState(12);

  // --- DRIVERS STATE ---
  const [drivers, setDrivers] = useState({
    // Revenue Drivers
    salesVolumeGrowthRate: 0, // % change from baseline growth
    aspChange: 0, // % change
    customerAcquisitionRateChange: 0, // % change
    customerChurnRateChange: 0, // absolute % change (e.g., +1 means churn increases by 1%)
    discountImpact: 0, // % reduction on revenue
    // COGS Drivers
    directMaterialCostChange: 0, // % change
    laborCostPerUnitChange: 0, // % change
    manufacturingOverheadChange: 0, // % change
    // OPEX Drivers
    headcountChange: 0, // % change
    salaryInflation: 2, // % base salary inflation
    marketingSpendChange: 0, // % change
    technologySpendChange: 0, // % change
    gaSpendChange: 0, // % change
    // Cashflow Drivers (simplified)
    dsoChange: 0, // days change
    dpoChange: 0, // days change
    capexSpendChange: 0, // % change
  });

  // --- RESULTS STATE ---
  const [baselineResults, setBaselineResults] = useState([]); // Initialize as empty array
  const [scenarioResults, setScenarioResults] = useState([]); // Initialize as empty array
  const [chartsData, setChartsData] = useState({ labels: [], datasets: [] });


  const calculateFinancials = (currentDrivers, baseMetrics, periodMonths) => {
    const results = [];
    let cumulativeNetProfit = 0;
    let currentHeadcount = baseMetrics.headcount * (1 + currentDrivers.headcountChange / 100);

    for (let month = 1; month <= periodMonths; month++) {
      // Revenue Calculation
      const periodSalesVolume = baseMetrics.salesVolume * (1 + (currentDrivers.salesVolumeGrowthRate / 100) * (month / 12)); 
      const periodASP = baseMetrics.averageSellingPrice * (1 + currentDrivers.aspChange / 100);
      let grossRevenue = periodSalesVolume * periodASP;
      grossRevenue *= (1 - currentDrivers.discountImpact / 100);

      // COGS Calculation
      const periodDirectMaterialCost = baseMetrics.directMaterialCostPerUnit * (1 + currentDrivers.directMaterialCostChange / 100);
      const periodLaborCost = baseMetrics.laborCostPerUnit * (1 + currentDrivers.laborCostPerUnitChange / 100);
      const periodManufacturingOverhead = baseMetrics.manufacturingOverheadPerUnit * (1 + currentDrivers.manufacturingOverheadChange / 100);
      const totalCOGS = periodSalesVolume * (periodDirectMaterialCost + periodLaborCost + periodManufacturingOverhead);
      const grossProfit = grossRevenue - totalCOGS;

      // OPEX Calculation
      // Applying salary inflation for the current month based on annual rate
      const monthlySalaryInflationFactor = Math.pow(1 + currentDrivers.salaryInflation / 100, 1/12);
      // Assume base salary grows each month by this factor for simplicity of period cost
      // A more accurate model would adjust actual salaries at review periods
      const currentPeriodAvgSalary = baseMetrics.averageSalaryPerEmployee * Math.pow(monthlySalaryInflationFactor, month -1);

      const monthlySalaryCost = (currentHeadcount * (currentPeriodAvgSalary / 12));
      const periodMarketingSpend = baseMetrics.marketingSpend * (1 + currentDrivers.marketingSpendChange / 100);
      const periodTechnologySpend = baseMetrics.technologySpend * (1 + currentDrivers.technologySpendChange / 100);
      const periodGaSpend = baseMetrics.gaSpend * (1 + currentDrivers.gaSpendChange / 100);
      const totalOPEX = monthlySalaryCost + periodMarketingSpend + periodTechnologySpend + periodGaSpend;

      const netOperatingProfit = grossProfit - totalOPEX;
      const netProfit = netOperatingProfit;
      cumulativeNetProfit += netProfit;

      const revenueCollected = grossRevenue; 
      const cashCapex = baseMetrics.capexSpend * (1 + currentDrivers.capexSpendChange / 100);
      const freeCashFlow = netProfit - cashCapex; 

      results.push({
        month: `Month ${month}`,
        revenue: grossRevenue,
        cogs: totalCOGS,
        grossProfit: grossProfit,
        opex_salaries: monthlySalaryCost,
        opex_marketing: periodMarketingSpend,
        opex_technology: periodTechnologySpend,
        opex_ga: periodGaSpend,
        totalOpex: totalOPEX,
        netOperatingProfit: netOperatingProfit,
        netProfit: netProfit,
        cumulativeNetProfit: cumulativeNetProfit,
        cash_revenueCollected: revenueCollected,
        cash_capex: cashCapex,
        freeCashFlow: freeCashFlow,
        headcount: Math.round(currentHeadcount),
      });
    }
    return results;
  };

  useEffect(() => {
    const baseScenarioDrivers = { ...Object.fromEntries(Object.keys(drivers).map(key => [key, 0])) }; 
    baseScenarioDrivers.salaryInflation = drivers.salaryInflation; // Use current salary inflation for base too, or a fixed one e.g., 2
    
    const calculatedBaseline = calculateFinancials(baseScenarioDrivers, initialBaselineMetrics, simulationPeriodMonths);
    setBaselineResults(calculatedBaseline);

    const calculatedScenario = calculateFinancials(drivers, initialBaselineMetrics, simulationPeriodMonths);
    setScenarioResults(calculatedScenario);
  }, [drivers, simulationPeriodMonths]);


  useEffect(() => {
    if (!scenarioResults || scenarioResults.length === 0) { // Added check for scenarioResults being null/undefined
      setChartsData({ labels: [], datasets: [] });
      return;
    }
    const labels = scenarioResults.map(r => r.month);
    setChartsData({
      labels,
      datasets: [
        {
          label: 'Scenario Revenue', data: scenarioResults.map(r => r.revenue),
          borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.2)', tension: 0.1, yAxisID: 'y',
        },
        {
          label: 'Scenario Net Profit', data: scenarioResults.map(r => r.netProfit),
          borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.1, yAxisID: 'y',
        },
         {
          label: 'Baseline Revenue', data: baselineResults && baselineResults.length > 0 ? baselineResults.map(r => r.revenue) : [], // Guard against baselineResults not ready
          borderColor: 'rgba(75, 192, 192, 0.5)', borderDash: [5, 5], backgroundColor: 'rgba(75, 192, 192, 0.1)', tension: 0.1, yAxisID: 'y',
        },
        {
          label: 'Baseline Net Profit', data: baselineResults && baselineResults.length > 0 ? baselineResults.map(r => r.netProfit) : [], // Guard against baselineResults not ready
          borderColor: 'rgba(54, 162, 235, 0.5)', borderDash: [5, 5], backgroundColor: 'rgba(54, 162, 235, 0.1)', tension: 0.1, yAxisID: 'y',
        },
      ],
    });
  }, [scenarioResults, baselineResults]);


  const handleDriverChange = (field, value) => {
    setActiveScenarioPreset('custom'); 
    setDrivers(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const applyPreset = (presetName) => {
    setActiveScenarioPreset(presetName);
    let newDrivers = { ...Object.fromEntries(Object.keys(drivers).map(key => [key, 0])) }; 
    newDrivers.salaryInflation = 2; 

    switch (presetName) {
      case 'base':
        // Salary inflation might be the only thing different from zero-impact
        // newDrivers.salaryInflation = 2; // Example base inflation
        break;
      case 'best':
        newDrivers.salesVolumeGrowthRate = 5;
        newDrivers.aspChange = 2;
        newDrivers.customerChurnRateChange = -0.5; 
        newDrivers.directMaterialCostChange = -1;
        newDrivers.marketingSpendChange = 10; 
        newDrivers.salaryInflation = 1.5; // Lower salary inflation in best case
        break;
      case 'worst':
        newDrivers.salesVolumeGrowthRate = -2;
        newDrivers.aspChange = -1;
        newDrivers.customerChurnRateChange = 1; 
        newDrivers.directMaterialCostChange = 3;
        newDrivers.salaryInflation = 3.5; // Higher salary inflation
        newDrivers.marketingSpendChange = -5;
        newDrivers.gaSpendChange = 2;
        newDrivers.dsoChange = 5; 
        break;
      default: 
        return; 
    }
    setDrivers(newDrivers);
  };

  const driverInputsConfig = [
    {
      category: "Revenue Drivers", icon: FiTrendingUp, color: "text-green-600",
      fields: [
        { label: "Sales Volume Growth Rate (% Ann.)", field: "salesVolumeGrowthRate" },
        { label: "Avg. Selling Price (ASP) Change (%)", field: "aspChange" },
        { label: "Customer Acq. Rate Change (%)", field: "customerAcquisitionRateChange" },
        { label: "Customer Churn Rate Change (abs. %)", field: "customerChurnRateChange" },
        { label: "Discounting / Promotions Impact (%)", field: "discountImpact" },
      ]
    },
    {
      category: "COGS Drivers", icon: FiTrendingDown, color: "text-red-600",
      fields: [
        { label: "Direct Material Cost Change (%)", field: "directMaterialCostChange" },
        { label: "Labor Cost per Unit Change (%)", field: "laborCostPerUnitChange" },
        { label: "Manuf. Overhead Change (%)", field: "manufacturingOverheadChange" },
      ]
    },
    {
      category: "OPEX Drivers", icon: FiUsers, color: "text-blue-600",
      fields: [
        { label: "Headcount Change (%)", field: "headcountChange" },
        { label: "Salary Inflation / Merit Increases (%)", field: "salaryInflation" },
        { label: "Marketing Spend Change (%)", field: "marketingSpendChange" },
        { label: "Technology/Infra. Spend Change (%)", field: "technologySpendChange" },
        { label: "G&A Spend Change (%)", field: "gaSpendChange" },
      ]
    },
    {
      category: "Cash Flow Drivers", icon: FiDollarSign, color: "text-yellow-600",
      fields: [
        { label: "Days Sales Outstanding (DSO) Change (days)", field: "dsoChange" },
        { label: "Days Payables Outstanding (DPO) Change (days)", field: "dpoChange" },
        { label: "CapEx Spend Change (%)", field: "capexSpendChange" },
      ]
    }
  ];
  
  const summaryMetrics = [
    { label: "Total Revenue", key: "revenue", format: formatCurrency },
    { label: "Total COGS", key: "cogs", format: formatCurrency },
    { label: "Total Gross Profit", key: "grossProfit", format: formatCurrency },
    { label: "Total OPEX", key: "totalOpex", format: formatCurrency },
    { label: "Net Operating Profit", key: "netOperatingProfit", format: formatCurrency },
    { label: "Net Profit", key: "netProfit", format: formatCurrency },
    { label: "Cumulative Net Profit (EOP)", key: "cumulativeNetProfit", isEOP: true, format: formatCurrency },
    { label: "Avg. Headcount", key: "headcount", isAverage: true, format: (v) => typeof v === 'number' ? v.toFixed(0) : "N/A"},
    { label: "Avg. Gross Margin (%)", key: "grossProfit", baseKey: "revenue", isPercentage: true, isAverage: true, format: (v)=> typeof v === 'number' ? `${v.toFixed(1)}%` : "N/A" },
    { label: "Avg. Net Margin (%)", key: "netProfit", baseKey: "revenue", isPercentage: true, isAverage: true, format: (v)=> typeof v === 'number' ? `${v.toFixed(1)}%` : "N/A" },
    { label: "Total FCF (Simplified)", key: "freeCashFlow", format: formatCurrency },
  ];

  const getSummaryValue = (resultsArray, metric) => {
    if (!resultsArray || !Array.isArray(resultsArray) || resultsArray.length === 0) { // Ensure it's an array
        return "N/A";
    }
    
    let value;
    if (metric.isEOP) { 
        value = resultsArray[resultsArray.length - 1]?.[metric.key];
    } else {
        const total = resultsArray.reduce((sum, item) => sum + (item[metric.key] || 0), 0);
        if (metric.isAverage) {
            const avg = total / resultsArray.length;
            if (metric.isPercentage && metric.baseKey) {
                const baseTotal = resultsArray.reduce((sum, item) => sum + (item[metric.baseKey] || 0), 0);
                value = baseTotal !== 0 ? (total / baseTotal) * 100 : 0;
            } else {
                value = avg;
            }
        } else if (metric.isPercentage && metric.baseKey) {
            const baseTotal = resultsArray.reduce((sum, item) => sum + (item[metric.baseKey] || 0), 0);
            value = baseTotal !== 0 ? (total / baseTotal) * 100 : 0;
        } else {
            value = total;
        }
    }
    return (typeof value === 'number' && !isNaN(value)) ? value : "N/A";
  };


  const chartOptionsConfig = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false }},
    scales: {
      y: { beginAtZero: false, title: { display: true, text: 'Amount ($)'}, grid: { color: "rgba(0,0,0,0.05)"}},
      x: { grid: { display: false }, title: { display: true, text: `Months (Total: ${simulationPeriodMonths})`}},
    },
  };


  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Comprehensive Scenario Modeling</h1>
            <p className="text-sky-100 text-xs">
              Adjust key business drivers to analyze "What-If" financial outcomes.
            </p>
          </div>
           <button onClick={() => window.print()} className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
            <FiDownload className="text-sky-50" /> <span className="text-sky-50">Export</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets & Global Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-sky-800">Scenario Configuration</h2>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Simulation Period:</label>
                <input type="number" value={simulationPeriodMonths} 
                       onChange={(e) => setSimulationPeriodMonths(Math.max(1, parseInt(e.target.value) || 1))}
                       className="w-20 p-2 border border-gray-300 rounded-md shadow-sm text-sm"/>
                <span className="text-sm text-gray-600">months</span>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => applyPreset('base')} className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${activeScenarioPreset === 'base' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <BsShieldFillCheck className="mr-2"/> Base Case
            </button>
            <button onClick={() => applyPreset('best')} className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${activeScenarioPreset === 'best' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <BsLightningFill className="mr-2"/> Best Case
            </button>
            <button onClick={() => applyPreset('worst')} className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${activeScenarioPreset === 'worst' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <BsGraphDown className="mr-2"/> Worst Case
            </button>
             <button onClick={() => setActiveScenarioPreset('custom')} className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-colors ${activeScenarioPreset === 'custom' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <FiMaximize2 className="mr-2"/> Custom
            </button>
        </div>
         <p className="text-xs text-gray-500 mt-3 italic">
            Selecting a preset will adjust drivers. Any manual driver change will switch to 'Custom'.
        </p>
      </div>

      {/* Driver Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-sky-800 mb-6">Adjust Scenario Drivers (% or Abs. Change from Baseline)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {driverInputsConfig.map(category => (
            <div key={category.category} className="space-y-4">
              <h3 className={`text-lg font-semibold ${category.color} flex items-center mb-1`}>
                <category.icon className="mr-2" /> {category.category}
              </h3>
              {category.fields.map(fieldInfo => (
                <div key={fieldInfo.field}>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">{fieldInfo.label}</label>
                  <input
                    type="number"
                    step="0.1" // Allows for decimal inputs
                    value={drivers[fieldInfo.field]}
                    onChange={(e) => handleDriverChange(fieldInfo.field, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Results Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-sky-800 mb-6 flex items-center"><BsTable className="mr-3 text-sky-600"/>Comparative Financial Impact (Total/Avg Over {simulationPeriodMonths} Months)</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider">Baseline Case</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider">Scenario: <span className="capitalize">{activeScenarioPreset}</span></th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider">Variance ($/Unit)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-sky-700 uppercase tracking-wider">Variance (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaryMetrics.map(metric => {
                const baselineValue = getSummaryValue(baselineResults, metric);
                const scenarioValue = getSummaryValue(scenarioResults, metric);
                
                let variance = "N/A";
                let variancePercent = "N/A";

                if (typeof scenarioValue === 'number' && typeof baselineValue === 'number') {
                    variance = scenarioValue - baselineValue;
                    if (baselineValue !== 0) {
                        variancePercent = (variance / Math.abs(baselineValue)) * 100; // Use Math.abs for percentage base
                    } else if (variance !== 0) {
                        variancePercent = scenarioValue > 0 ? Infinity : -Infinity; // Handle division by zero if baseline is 0 but scenario is not
                    } else {
                        variancePercent = 0; // Both are zero
                    }
                }
                
                return (
                  <tr key={metric.label} className="hover:bg-sky-50/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{metric.label}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                        {metric.format(baselineValue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">
                        {metric.format(scenarioValue)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${typeof variance === 'number' && variance < 0 ? 'text-red-600' : typeof variance === 'number' && variance > 0 ? 'text-green-600' : 'text-gray-700'}`}>
                        {/* For currency metrics, format variance as currency. For % metrics, show as plain number. */}
                        {metric.label.includes("(%)") || metric.label.includes("Headcount") ? 
                            (typeof variance === 'number' ? variance.toFixed(metric.label.includes("(%)") ? 1 : 0) : variance) : 
                            metric.format(variance)
                        }
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${typeof variancePercent === 'number' && variancePercent < 0 ? 'text-red-600' : typeof variancePercent === 'number' && variancePercent > 0 ? 'text-green-600' : 'text-gray-700'}`}>
                        {typeof variancePercent === 'number' ? `${variancePercent.toFixed(1)}%` : variancePercent === Infinity ? "∞%" : variancePercent === -Infinity ? "-∞%" : variancePercent}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-sky-800 mb-4 flex items-center"><FiBarChart2 className="mr-3 text-sky-600"/>Scenario Projection Chart</h2>
        <div className="h-[400px]">
          <Line data={chartsData} options={chartOptionsConfig} />
        </div>
      </div>

    </div>
  );
};

export default ScenarioModeling;
