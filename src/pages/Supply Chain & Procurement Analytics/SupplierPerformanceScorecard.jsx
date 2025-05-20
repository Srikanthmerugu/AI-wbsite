import React, { useState } from 'react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Expanded mock data for suppliers
const supplierData = [
  { id: 1, name: 'Supplier A', onTimeDelivery: 95, contractAdherence: 90, costCompetitiveness: 85, avgDeliveryDelay: 2, complianceScore: 92 },
  { id: 2, name: 'Supplier B', onTimeDelivery: 80, contractAdherence: 85, costCompetitiveness: 90, avgDeliveryDelay: 5, complianceScore: 88 },
  { id: 3, name: 'Supplier C', onTimeDelivery: 88, contractAdherence: 92, costCompetitiveness: 78, avgDeliveryDelay: 3, complianceScore: 90 },
  { id: 4, name: 'Supplier D', onTimeDelivery: 75, contractAdherence: 80, costCompetitiveness: 88, avgDeliveryDelay: 7, complianceScore: 85 },
  { id: 5, name: 'Supplier E', onTimeDelivery: 92, contractAdherence: 87, costCompetitiveness: 82, avgDeliveryDelay: 1, complianceScore: 89 },
  { id: 6, name: 'Supplier F', onTimeDelivery: 78, contractAdherence: 83, costCompetitiveness: 91, avgDeliveryDelay: 4, complianceScore: 87 },
  { id: 7, name: 'Supplier G', onTimeDelivery: 85, contractAdherence: 89, costCompetitiveness: 80, avgDeliveryDelay: 3, complianceScore: 91 },
  { id: 8, name: 'Supplier H', onTimeDelivery: 90, contractAdherence: 91, costCompetitiveness: 84, avgDeliveryDelay: 2, complianceScore: 93 },
  { id: 9, name: 'Supplier I', onTimeDelivery: 82, contractAdherence: 86, costCompetitiveness: 89, avgDeliveryDelay: 6, complianceScore: 86 },
  { id: 10, name: 'Supplier J', onTimeDelivery: 87, contractAdherence: 88, costCompetitiveness: 83, avgDeliveryDelay: 3, complianceScore: 90 },
];

// Chart data for Supplier Performance
const chartData = {
  labels: supplierData.map((supplier) => supplier.name),
  datasets: [
    {
      label: 'On-time Delivery (%)',
      data: supplierData.map((supplier) => supplier.onTimeDelivery),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
    {
      label: 'Contract Adherence (%)',
      data: supplierData.map((supplier) => supplier.contractAdherence),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Cost Competitiveness (%)',
      data: supplierData.map((supplier) => supplier.costCompetitiveness),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    },
    {
      label: 'Compliance Score (%)',
      data: supplierData.map((supplier) => supplier.complianceScore),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Supplier Performance Metrics',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Percentage (%)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Suppliers',
      },
    },
  },
};

// AG-Grid column definitions
const columnDefs = [
  { headerName: 'Supplier Name', field: 'name', sortable: true, filter: true },
  { headerName: 'On-time Delivery (%)', field: 'onTimeDelivery', sortable: true, filter: true },
  { headerName: 'Contract Adherence (%)', field: 'contractAdherence', sortable: true, filter: true },
  { headerName: 'Cost Competitiveness (%)', field: 'costCompetitiveness', sortable: true, filter: true },
  { headerName: 'Avg Delivery Delay (Days)', field: 'avgDeliveryDelay', sortable: true, filter: true },
  { headerName: 'Compliance Score (%)', field: 'complianceScore', sortable: true, filter: true },
];

const SupplierPerformanceScorecard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const currentUser = { company_name: 'Example Corp' }; // Mock user data

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">Supplier Performance Scorecard</h1>
            <p className="text-sky-100 text-xs">{currentUser.company_name}</p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" />
              Filters
            </button>
            <button
              type="button"
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <FiPlus className="mr-1" />
              Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section (Conditional) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-md font-semibold mb-2">Filters</h2>
          <div className="flex space-x-4">
            <select className="border rounded-lg p-2">
              <option>All Suppliers</option>
              {supplierData.map((supplier) => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <select className="border rounded-lg p-2">
              <option>All Time</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
            <select className="border rounded-lg p-2">
              <option>All Metrics</option>
              <option>On-time Delivery</option>
              <option>Contract Adherence</option>
              <option>Cost Competitiveness</option>
              <option>Compliance Score</option>
            </select>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-md font-semibold mb-4">Performance Overview</h2>
        <div className="w-full h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-md font-semibold mb-4">Detailed Supplier Metrics</h2>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={supplierData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierPerformanceScorecard;