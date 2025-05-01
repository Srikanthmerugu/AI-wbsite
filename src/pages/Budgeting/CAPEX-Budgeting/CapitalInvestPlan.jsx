import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { FiClock, FiSave, FiDownload } from 'react-icons/fi';
import { HiOutlineChartSquareBar } from 'react-icons/hi';

const CapitalInvestmentPlan = () => {
  const [chartOptions] = useState({
    chart: {
      type: 'bar', 
      height: 200,
      stacked: false,
      toolbar: { show: true },
    },
    xaxis: {
      categories: ['Facilities', 'Equipment', 'R&D', 'Tech Upgrades'],
    },
    colors: ['#0d6efd', '#28a745', '#ffc107'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    tooltip: {
      y: {
        formatter: val => `₹ ${val} Lakhs`,
      },
    },
  });

  const baseValues = {
    planned: [300, 450, 200, 350],
    actual: [280, 400, 180, 320],
    forecast: [320, 470, 250, 380],
  };

  const [chartSeries, setChartSeries] = useState([
    { name: 'Planned Investment', data: baseValues.planned },
    { name: 'Actual Investment', data: baseValues.actual },
    { name: 'Forecasted Investment', data: baseValues.forecast },
  ]);

  const [totalPlanned] = useState(1300);
  const [totalActual] = useState(1180);
  const [totalForecast, setTotalForecast] = useState(1420);
  const [variancePercent, setVariancePercent] = useState(-9.23);

  // Inputs
  const [rdSpendIncrease, setRdSpendIncrease] = useState(15);
  const [equipmentDelay, setEquipmentDelay] = useState(6);
  const [facilityPauseImpact, setFacilityPauseImpact] = useState(12);
  const [techBudgetAdjustment, setTechBudgetAdjustment] = useState(5);
  const [marketCondition, setMarketCondition] = useState('stable');
  const [inflationRate, setInflationRate] = useState(4.5);

  useEffect(() => {
    const calculateForecast = () => {
      let newForecast = [...baseValues.forecast];

      newForecast[2] = Math.round(baseValues.forecast[2] * (1 + rdSpendIncrease / 100));
      newForecast[3] = Math.round(baseValues.forecast[3] * (1 + rdSpendIncrease / 200));
      newForecast[1] = Math.round(newForecast[1] * (1 - equipmentDelay * 0.01));
      newForecast[0] = Math.round(newForecast[0] * (1 - facilityPauseImpact * 0.01));
      newForecast[3] = Math.round(newForecast[3] * (1 + techBudgetAdjustment / 100));

      let marketMultiplier = 1;
      switch (marketCondition) {
        case 'bullish': marketMultiplier = 1.08; break;
        case 'bearish': marketMultiplier = 0.92; break;
        case 'volatile': marketMultiplier = 1 + (Math.random() * 0.1 - 0.05); break;
        default: marketMultiplier = 1;
      }

      newForecast = newForecast.map(val =>
        Math.round(val * marketMultiplier * (1 + inflationRate / 100))
      );

      setChartSeries([
        { name: 'Planned Investment', data: baseValues.planned },
        { name: 'Actual Investment', data: baseValues.actual },
        { name: 'Forecasted Investment', data: newForecast },
      ]);

      const newTotalForecast = newForecast.reduce((sum, val) => sum + val, 0);
      setTotalForecast(newTotalForecast);
      const newVariance = (((newTotalForecast - totalPlanned) / totalPlanned) * 100).toFixed(2);
      setVariancePercent(newVariance);
    };

    calculateForecast();
  }, [rdSpendIncrease, equipmentDelay, facilityPauseImpact, techBudgetAdjustment, marketCondition, inflationRate]);

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Capital Expenditure (CAPEX) Budgeting</h1>
            <p className="text-sky-100 text-xs">Plan and analyze strategic capital investments</p>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">Planned Investment</div>
          <div className="text-xl font-bold text-gray-800">₹ {totalPlanned} Lakhs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">Actual Investment</div>
          <div className="text-xl font-bold text-gray-800">₹ {totalActual} Lakhs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">Forecasted Investment</div>
          <div className="text-xl font-bold text-gray-800">₹ {totalForecast} Lakhs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">Forecast vs Plan</div>
          <div className={`text-xl font-bold ${parseFloat(variancePercent) < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {variancePercent}%
          </div>
        </div>
      </div>

      {/* Side-by-side: Chart + AI Scenario Modeling */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Chart Section */}
        <div className="bg-white p-4 rounded-lg shadow w-full lg:w-1/2">
          <h4 className="text-lg font-semibold mb-4">Investment Analysis</h4>
          <div className="mx-auto" style={{ maxWidth: '100%' }}>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={200} width={500} />
          </div>
        </div>

        {/* Scenario Modeling */}
        <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-4">Investment Scenario Modeling</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">R&D Adjustment (%)</label>
              <input type="range" min="-20" max="50" value={rdSpendIncrease}
                onChange={(e) => setRdSpendIncrease(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-blue-600 mt-1">{rdSpendIncrease}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Delay (months)</label>
              <input type="range" min="0" max="24" value={equipmentDelay}
                onChange={(e) => setEquipmentDelay(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-blue-600 mt-1">{equipmentDelay} months</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Pause Impact (%)</label>
              <input type="range" min="0" max="40" value={facilityPauseImpact}
                onChange={(e) => setFacilityPauseImpact(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-blue-600 mt-1">{facilityPauseImpact}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tech Budget Adjustment (%)</label>
              <input type="range" min="-20" max="30" value={techBudgetAdjustment}
                onChange={(e) => setTechBudgetAdjustment(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-blue-600 mt-1">{techBudgetAdjustment}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Condition</label>
              <select value={marketCondition}
                onChange={(e) => setMarketCondition(e.target.value)}
                className="w-full border-gray-300 rounded-lg text-sm">
                <option value="stable">Stable</option>
                <option value="bullish">Bullish</option>
                <option value="bearish">Bearish</option>
                <option value="volatile">Volatile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%)</label>
              <input type="range" min="0" max="15" step="0.5" value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-blue-600 mt-1">{inflationRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mb-8">
        <div>
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center">
            <HiOutlineChartSquareBar className="mr-2" /> Generate Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapitalInvestmentPlan;
