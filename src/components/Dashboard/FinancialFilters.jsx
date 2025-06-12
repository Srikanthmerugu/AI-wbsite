import React, { useRef } from "react";

const FinancialFilters = ({ showFilters, setShowFilters }) => {
  const filtersRef = useRef(null);

  return (
    showFilters && (
      <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
              <option>Month</option>
              <option>Quarter</option>
              <option>YTD</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Business Unit
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
              <option>All</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Geography
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
              <option>All</option>
              <option>USA</option>
              <option>UK</option>
              <option>Germany</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Client Demographics
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-xs">
              <option>All</option>
              <option>By Industry</option>
              <option>By Revenue Person</option>
            </select>
          </div>
        </div>
      </div>
    )
  );
};


export default FinancialFilters;