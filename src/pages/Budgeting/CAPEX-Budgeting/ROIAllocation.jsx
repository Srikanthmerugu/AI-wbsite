import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { FiClock, FiSave, FiDownload } from 'react-icons/fi';
import { HiOutlineLightBulb, HiOutlineChartSquareBar } from 'react-icons/hi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ROIAllocation = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const chartData = {
    series: [30, 25, 20, 15, 10], 
    options: {
      labels: ['Plant Upgrade', 'Automation', 'New Facility', 'Tech Infra', 'Training'],
      chart: {
        type: 'donut',
      },
      legend: {
        position: 'bottom',
      },
      colors: ['#28a745', '#0d6efd', '#ffc107', '#6610f2', '#fd7e14'],
      tooltip: {
        y: {
          formatter: val => `₹ ${val} Lakhs`,
        },
      },
    },
  };

  const projects = [
    {
      name: 'Plant Upgrade',
      budget: 200,
      roi: 24,
      payback: '2.1 yrs',
      value: 'High',
      risk: 'Low',
      priority: 1,
    },
    {
      name: 'Automation Tools',
      budget: 150,
      roi: 18,
      payback: '2.5 yrs',
      value: 'Medium',
      risk: 'Medium',
      priority: 2,
    },
    {
      name: 'New Facility',
      budget: 300,
      roi: 12,
      payback: '4.0 yrs',
      value: 'High',
      risk: 'High',
      priority: 3,
    },
  ];

  // ✅ CSV download logic
  const downloadCSV = () => {
    const headers = ['Project', 'Budget (₹ Lakhs)', 'ROI (%)', 'Payback', 'Strategic Value', 'Risk', 'AI Priority'];
    const rows = projects.map(p => [
      p.name,
      p.budget,
      p.roi,
      p.payback,
      p.value,
      p.risk,
      `Priority ${p.priority}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'ROI-Based-CAPEX-Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ PDF download logic
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('ROI-Based CAPEX Allocation Report', 14, 16);

    const tableColumn = ['Project', 'Budget (₹ Lakhs)', 'ROI (%)', 'Payback', 'Strategic Value', 'Risk', 'AI Priority'];
    const tableRows = projects.map(p => [
      p.name,
      p.budget,
      p.roi,
      p.payback,
      p.value,
      p.risk,
      `Priority ${p.priority}`,
    ]);

    doc.autoTable({
      startY: 22,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('ROI-Based-CAPEX-Report.pdf');
  };

  const handleDownload = () => {
    downloadCSV();
    downloadPDF();
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">ROI-Based CAPEX Allocation</h1>
            <p className="text-sky-100 text-xs">Prioritize capital projects based on expected returns</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg hover:bg-white hover:text-sky-900 border border-sky-200 transition">
              <FiDownload className="mr-1" /> Dowload Report
            </button>
          </div>
        </div>
      </div>

      {/* ROI Summary and Allocation */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow w-full lg:w-1/2">
          <h4 className="text-md font-semibold mb-2">CAPEX Allocation by Project</h4>
          <Chart options={chartData.options} series={chartData.series} type="donut" height={280} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full lg:w-1/2">
          <h4 className="text-md font-semibold mb-2">AI Suggestions</h4>
          <div className="space-y-3 text-sm">
            <div className="flex bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <HiOutlineLightBulb className="text-blue-600 text-xl mr-2" />
              <div>
                <div className="font-medium">Prioritize "Plant Upgrade"</div>
                <div className="text-gray-600 text-xs">High ROI and low risk make it ideal for near-term investment</div>
              </div>
            </div>
            <div className="flex bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <HiOutlineLightBulb className="text-yellow-500 text-xl mr-2" />
              <div>
                <div className="font-medium">Review "New Facility"</div>
                <div className="text-gray-600 text-xs">Longer payback and high risk may affect cash flow</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Evaluation Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-md font-semibold mb-4">Project Evaluation Table</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr>
                <th className="py-2 px-4">Project</th>
                <th className="py-2 px-4">Budget (₹ Lakhs)</th>
                <th className="py-2 px-4">ROI (%)</th>
                <th className="py-2 px-4">Payback</th>
                <th className="py-2 px-4">Strategic Value</th>
                <th className="py-2 px-4">Risk</th>
                <th className="py-2 px-4">AI Priority</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">{proj.name}</td>
                  <td className="py-2 px-4">{proj.budget}</td>
                  <td className="py-2 px-4 text-green-600">{proj.roi}%</td>
                  <td className="py-2 px-4">{proj.payback}</td>
                  <td className="py-2 px-4">{proj.value}</td>
                  <td className="py-2 px-4">{proj.risk}</td>
                  <td className="py-2 px-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                      Priority {proj.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-sm font-medium flex items-center"
        >
          <HiOutlineChartSquareBar className="mr-2" /> Download ROI Report
        </button>
      </div>
    </div>
  );
};

export default ROIAllocation;
