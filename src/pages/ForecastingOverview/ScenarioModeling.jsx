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
import { FiTrendingUp, FiDownload, FiTrendingDown, FiUsers, FiDollarSign, FiTarget, FiAlertTriangle, FiBarChart2, FiSettings } from "react-icons/fi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (value, minimumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
};

const ScenarioModeling = () => {
  const [activeTab, setActiveTab] = useState("revenueCost");

  // Scenario 1: Revenue Growth vs. Cost Increases
  const [revenueCostScenario, setRevenueCostScenario] = useState({
    baselineRevenue: 1000000,
    baselineCosts: 600000,
    revenueGrowthRate: 5, // Annual %
    costIncreaseRate: 3, // Annual %
    timePeriod: 12, // months
  });
  const [revenueCostResults, setRevenueCostResults] = useState({
    labels: [],
    revenueData: [],
    costsData: [],
    profitData: [],
  });

  // Scenario 2: Customer Churn Impact
  const [customerChurnScenario, setCustomerChurnScenario] = useState({
    currentCustomers: 1000,
    arpc: 50, // Average Revenue Per Customer (monthly)
    acpc: 20, // Average Cost Per Customer (monthly)
    churnRate: 2, // Monthly %
    timePeriod: 12, // months
  });
  const [customerChurnResults, setCustomerChurnResults] = useState({
    labels: [],
    customersData: [],
    revenueData: [],
    profitData: [],
  });

  // Scenario 3: Investment Trade-Offs
  const [investmentTradeoffScenario, setInvestmentTradeoffScenario] = useState({
    investmentAmount: 50000,
    optionA: { name: "Marketing Campaign", expectedReturn: 20, timeToRealize: 6 }, // % return, months
    optionB: { name: "R&D Project", expectedReturn: 15, timeToRealize: 12 },
  });
  const [investmentTradeoffResults, setInvestmentTradeoffResults] = useState({
    optionANetGain: 0,
    optionBNetGain: 0,
    optionAROI:0,
    optionBROI:0,
  });

  // Scenario 4: Supply Chain Disruption
  const [supplyChainScenario, setSupplyChainScenario] = useState({
    baselineRevenue: 1000000, // Per period (e.g., monthly)
    baselineCOGS: 400000, // Per period
    cogsIncrease: 15, // %
    revenueImpact: 5, // % decrease
    disruptionDuration: 3, // months
  });
  const [supplyChainResults, setSupplyChainResults] = useState({
    originalGrossProfit: 0,
    disruptionGrossProfit: 0,
    originalGrossMargin: 0,
    disruptionGrossMargin: 0,
    totalImpact: 0,
  });
  
  // --- Calculation Effects ---

  // Revenue Growth vs. Cost Increases Calculation
  useEffect(() => {
    const { baselineRevenue, baselineCosts, revenueGrowthRate, costIncreaseRate, timePeriod } = revenueCostScenario;
    if (timePeriod <= 0) {
      setRevenueCostResults({ labels: [], revenueData: [], costsData: [], profitData: [] });
      return;
    }

    const monthlyRevenueGrowthRate = Math.pow(1 + revenueGrowthRate / 100, 1 / 12) - 1;
    const monthlyCostIncreaseRate = Math.pow(1 + costIncreaseRate / 100, 1 / 12) - 1;

    let currentRevenue = baselineRevenue;
    let currentCosts = baselineCosts;

    const labels = [];
    const revenueData = [];
    const costsData = [];
    const profitData = [];

    for (let i = 1; i <= timePeriod; i++) {
      labels.push(`Month ${i}`);
      if (i > 1) { // First month uses baseline for projection start
         currentRevenue *= (1 + monthlyRevenueGrowthRate);
         currentCosts *= (1 + monthlyCostIncreaseRate);
      } else {
        // For Month 1, project from baseline
        currentRevenue = baselineRevenue * (1 + monthlyRevenueGrowthRate);
        currentCosts = baselineCosts * (1 + monthlyCostIncreaseRate);
      }
      
      revenueData.push(currentRevenue);
      costsData.push(currentCosts);
      profitData.push(currentRevenue - currentCosts);
    }
    setRevenueCostResults({ labels, revenueData, costsData, profitData });
  }, [revenueCostScenario]);

  // Customer Churn Impact Calculation
  useEffect(() => {
    const { currentCustomers, arpc, acpc, churnRate, timePeriod } = customerChurnScenario;
    if (timePeriod <= 0) {
       setCustomerChurnResults({ labels: [], customersData: [], revenueData: [], profitData: [] });
       return;
    }

    let customers = currentCustomers;
    const monthlyChurnRate = churnRate / 100;

    const labels = [];
    const customersData = [];
    const revenueData = [];
    const profitData = [];

    for (let i = 1; i <= timePeriod; i++) {
      labels.push(`Month ${i}`);
      if (i > 1) customers *= (1 - monthlyChurnRate); // Apply churn after the first month count
      else customers = currentCustomers * (1-monthlyChurnRate); // Churn applies from month 1

      customersData.push(Math.max(0, customers)); // Ensure customers don't go negative
      const currentPeriodRevenue = Math.max(0, customers) * arpc;
      const currentPeriodProfit = Math.max(0, customers) * (arpc - acpc);
      revenueData.push(currentPeriodRevenue);
      profitData.push(currentPeriodProfit);
    }
    setCustomerChurnResults({ labels, customersData, revenueData, profitData });
  }, [customerChurnScenario]);

  // Investment Trade-Offs Calculation
  useEffect(() => {
    const { investmentAmount, optionA, optionB } = investmentTradeoffScenario;
    const gainA = investmentAmount * (optionA.expectedReturn / 100);
    const gainB = investmentAmount * (optionB.expectedReturn / 100);
    setInvestmentTradeoffResults({
      optionANetGain: gainA,
      optionBNetGain: gainB,
      optionAROI: optionA.expectedReturn,
      optionBROI: optionB.expectedReturn,
    });
  }, [investmentTradeoffScenario]);

  // Supply Chain Disruption Calculation
  useEffect(() => {
    const { baselineRevenue, baselineCOGS, cogsIncrease, revenueImpact, disruptionDuration } = supplyChainScenario;
    
    const originalGrossProfit = baselineRevenue - baselineCOGS;
    const originalGrossMargin = baselineRevenue > 0 ? (originalGrossProfit / baselineRevenue) * 100 : 0;

    const disruptedCOGS = baselineCOGS * (1 + cogsIncrease / 100);
    const disruptedRevenue = baselineRevenue * (1 - revenueImpact / 100);
    const disruptionGrossProfit = disruptedRevenue - disruptedCOGS;
    const disruptionGrossMargin = disruptedRevenue > 0 ? (disruptionGrossProfit / disruptedRevenue) * 100 : 0;
    
    const totalImpact = (originalGrossProfit - disruptionGrossProfit) * disruptionDuration;

    setSupplyChainResults({
      originalGrossProfit,
      disruptionGrossProfit,
      originalGrossMargin,
      disruptionGrossMargin,
      totalImpact,
    });
  }, [supplyChainScenario]);


  const handleInputChange = (scenarioSetter, field, value, isNumeric = true, subField = null) => {
    scenarioSetter(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: isNumeric ? parseFloat(value) || 0 : value
          }
        };
      }
      return { ...prev, [field]: isNumeric ? parseFloat(value) || 0 : value };
    });
  };

  // --- Chart Data and Options ---
  const revenueCostChartData = useMemo(() => ({
    labels: revenueCostResults.labels,
    datasets: [
      {
        label: 'Projected Revenue',
        data: revenueCostResults.revenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Projected Costs',
        data: revenueCostResults.costsData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Projected Profit',
        data: revenueCostResults.profitData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
    ],
  }), [revenueCostResults]);
  
  const customerChurnChartData = useMemo(() => ({
    labels: customerChurnResults.labels,
    datasets: [
      {
        label: 'Number of Customers',
        data: customerChurnResults.customersData,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        yAxisID: 'y1',
        tension: 0.1,
      },
      {
        label: 'Projected Revenue',
        data: customerChurnResults.revenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'Projected Profit',
        data: customerChurnResults.profitData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y',
        tension: 0.1,
      },
    ],
  }), [customerChurnResults]);

  const investmentTradeoffChartData = useMemo(() => ({
    labels: [investmentTradeoffScenario.optionA.name, investmentTradeoffScenario.optionB.name],
    datasets: [
      {
        label: 'Net Gain from Investment',
        data: [investmentTradeoffResults.optionANetGain, investmentTradeoffResults.optionBNetGain],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(255, 159, 64)'],
        borderWidth: 1,
      },
    ],
  }), [investmentTradeoffResults, investmentTradeoffScenario.optionA.name, investmentTradeoffScenario.optionB.name]);

  const supplyChainChartData = useMemo(() => ({
    labels: ['Original', 'With Disruption'],
    datasets: [
      {
        label: 'Gross Profit per Period',
        data: [supplyChainResults.originalGrossProfit, supplyChainResults.disruptionGrossProfit],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
        borderWidth: 1,
      },
    ],
  }), [supplyChainResults]);


  const chartOptions = (yLabel = 'Amount ($)', y1Label = null) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yLabel },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      ...(y1Label && {
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: y1Label },
          grid: { drawOnChartArea: false }, // only show grid for the first y-axis
        },
      }),
      x: {
        grid: { display: false },
        title: { display: true, text: "Month" },
      },
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "revenueCost":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiSettings className="mr-2 text-sky-600" /> Scenario Parameters
              </h3>
              {[
                { label: "Baseline Revenue ($/year)", field: "baselineRevenue", value: revenueCostScenario.baselineRevenue },
                { label: "Baseline Costs ($/year)", field: "baselineCosts", value: revenueCostScenario.baselineCosts },
                { label: "Annual Revenue Growth Rate (%)", field: "revenueGrowthRate", value: revenueCostScenario.revenueGrowthRate },
                { label: "Annual Cost Increase Rate (%)", field: "costIncreaseRate", value: revenueCostScenario.costIncreaseRate },
                { label: "Time Period (months)", field: "timePeriod", value: revenueCostScenario.timePeriod },
              ].map(item => (
                <div className="mb-4" key={item.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleInputChange(setRevenueCostScenario, item.field, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-sky-600" /> Analysis Results
              </h3>
              <div className="h-[400px]">
                <Line data={revenueCostChartData} options={chartOptions()} />
              </div>
            </div>
          </div>
        );
      case "customerChurn":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiSettings className="mr-2 text-sky-600" /> Scenario Parameters
              </h3>
              {[
                { label: "Current Number of Customers", field: "currentCustomers", value: customerChurnScenario.currentCustomers },
                { label: "Avg. Monthly Revenue Per Customer ($)", field: "arpc", value: customerChurnScenario.arpc },
                { label: "Avg. Monthly Cost Per Customer ($)", field: "acpc", value: customerChurnScenario.acpc },
                { label: "Monthly Churn Rate (%)", field: "churnRate", value: customerChurnScenario.churnRate },
                { label: "Time Period (months)", field: "timePeriod", value: customerChurnScenario.timePeriod },
              ].map(item => (
                <div className="mb-4" key={item.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleInputChange(setCustomerChurnScenario, item.field, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-sky-600" /> Analysis Results
              </h3>
              <div className="h-[400px]">
                <Line data={customerChurnChartData} options={chartOptions('Amount ($)', 'Number of Customers')} />
              </div>
            </div>
          </div>
        );
      case "investmentTradeoff":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-sky-800 mb-6 text-center">
              <FiTarget className="mr-2 text-sky-600 inline" /> Investment Trade-Off Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                <h4 className="text-md font-semibold text-sky-700 mb-3">Common Parameter</h4>
                 <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount ($)</label>
                  <input
                    type="number"
                    value={investmentTradeoffScenario.investmentAmount}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'investmentAmount', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                 <h4 className="text-md font-semibold text-sky-700 mb-3">Option A: {investmentTradeoffScenario.optionA.name}</h4>
                 <input
                    type="text"
                    value={investmentTradeoffScenario.optionA.name}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionA', e.target.value, false, 'name')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm mb-2"
                    placeholder="Option A Name"
                  />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (%)</label>
                  <input
                    type="number"
                    value={investmentTradeoffScenario.optionA.expectedReturn}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionA', e.target.value, true, 'expectedReturn')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
                 <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time to Realize (months)</label>
                  <input
                    type="number"
                    value={investmentTradeoffScenario.optionA.timeToRealize}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionA', e.target.value, true, 'timeToRealize')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                 <h4 className="text-md font-semibold text-sky-700 mb-3">Option B: {investmentTradeoffScenario.optionB.name}</h4>
                 <input
                    type="text"
                    value={investmentTradeoffScenario.optionB.name}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionB', e.target.value, false, 'name')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm mb-2"
                    placeholder="Option B Name"
                  />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (%)</label>
                  <input
                    type="number"
                    value={investmentTradeoffScenario.optionB.expectedReturn}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionB', e.target.value, true, 'expectedReturn')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
                 <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time to Realize (months)</label>
                  <input
                    type="number"
                    value={investmentTradeoffScenario.optionB.timeToRealize}
                    onChange={(e) => handleInputChange(setInvestmentTradeoffScenario, 'optionB', e.target.value, true, 'timeToRealize')}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              </div>
            </div>
             <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-sky-600" /> Analysis Results
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="p-4 bg-sky-50 rounded-lg mb-4">
                  <h5 className="text-md font-semibold text-sky-700">{investmentTradeoffScenario.optionA.name}</h5>
                  <p>Net Gain: <span className="font-bold text-green-600">{formatCurrency(investmentTradeoffResults.optionANetGain)}</span> (ROI: {investmentTradeoffResults.optionAROI}%)</p>
                  <p>Time to Realize: {investmentTradeoffScenario.optionA.timeToRealize} months</p>
                </div>
                 <div className="p-4 bg-sky-50 rounded-lg">
                  <h5 className="text-md font-semibold text-sky-700">{investmentTradeoffScenario.optionB.name}</h5>
                  <p>Net Gain: <span className="font-bold text-green-600">{formatCurrency(investmentTradeoffResults.optionBNetGain)}</span> (ROI: {investmentTradeoffResults.optionBROI}%)</p>
                  <p>Time to Realize: {investmentTradeoffScenario.optionB.timeToRealize} months</p>
                </div>
              </div>
              <div className="h-[300px]">
                <Bar data={investmentTradeoffChartData} options={chartOptions('Net Gain ($)')} />
              </div>
            </div>
          </div>
        );
      case "supplyChain":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiSettings className="mr-2 text-sky-600" /> Scenario Parameters
              </h3>
              {[
                { label: "Baseline Monthly Revenue ($)", field: "baselineRevenue", value: supplyChainScenario.baselineRevenue },
                { label: "Baseline Monthly COGS ($)", field: "baselineCOGS", value: supplyChainScenario.baselineCOGS },
                { label: "COGS Increase due to Disruption (%)", field: "cogsIncrease", value: supplyChainScenario.cogsIncrease },
                { label: "Revenue Impact due to Disruption (%)", field: "revenueImpact", value: supplyChainScenario.revenueImpact },
                { label: "Duration of Disruption (months)", field: "disruptionDuration", value: supplyChainScenario.disruptionDuration },
              ].map(item => (
                <div className="mb-4" key={item.field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleInputChange(setSupplyChainScenario, item.field, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2 text-sky-600" /> Analysis Results
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="p-3 bg-sky-50 rounded-lg">
                      <p className="font-medium text-sky-700">Original Gross Profit/Month</p>
                      <p className="text-xl font-bold text-sky-900">{formatCurrency(supplyChainResults.originalGrossProfit)}</p>
                      <p className="text-xs text-sky-600">Margin: {supplyChainResults.originalGrossMargin.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-700">Disrupted Gross Profit/Month</p>
                      <p className="text-xl font-bold text-red-900">{formatCurrency(supplyChainResults.disruptionGrossProfit)}</p>
                      <p className="text-xs text-red-600">Margin: {supplyChainResults.disruptionGrossMargin.toFixed(1)}%</p>
                  </div>
                   <div className="col-span-2 p-3 bg-amber-50 rounded-lg">
                      <p className="font-medium text-amber-700">Total Impact over {supplyChainScenario.disruptionDuration} months</p>
                      <p className="text-xl font-bold text-amber-900">{formatCurrency(supplyChainResults.totalImpact)}</p>
                       <p className="text-xs text-amber-600">This is the total reduction in gross profit during the disruption period.</p>
                  </div>
              </div>
              <div className="h-[300px]">
                <Bar data={supplyChainChartData} options={chartOptions('Gross Profit per Period ($)')} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  const scenarioTabs = [
    { id: "revenueCost", label: "Revenue vs. Costs", icon: FiTrendingUp },
    { id: "customerChurn", label: "Customer Churn", icon: FiUsers },
    { id: "investmentTradeoff", label: "Investment Trade-Offs", icon: FiTarget },
    { id: "supplyChain", label: "Supply Chain Disruption", icon: FiAlertTriangle },
  ];

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Scenario Modeling ("What-If" Analysis)</h1>
            <p className="text-sky-100 text-xs">
              Analyze potential outcomes of different business scenarios.
            </p>
          </div>
          <button
                                                  onClick={() => window.print()}
                                                  className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-50 transition-colors duration-200">
                                                  <FiDownload className="text-sky-50" />
                                                  <span className="text-sky-50">Export</span>
                                              </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-6">
        {scenarioTabs.map(tab => (
           <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center
              ${ activeTab === tab.id
                ? "bg-sky-800 text-sky-50 shadow-md"
                : "text-sky-700 bg-sky-100 hover:bg-sky-700 hover:text-sky-50"
            }`}
          >
            <tab.icon className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Active Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default ScenarioModeling;