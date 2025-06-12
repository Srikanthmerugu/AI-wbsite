import React, { useContext } from "react";
import { FiFilter, FiDownload } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import WidgetSelector from "./WidgetSelector";

const FinancialHeader = ({ showFilters, setShowFilters }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-white">Financial Dashboard</h1>
          <p className="text-sky-100 text-xs">{currentUser.company_name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            onClick={() => setShowFilters(!showFilters)}>
            <FiFilter className="mr-1" />
            Filters
          </button>
          <WidgetSelector />
          <button
            onClick={() => window.print()}
            className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white  bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200">
            <FiDownload className="text-sky-50 hover:text-sky-900" />
            <span className="text-sky-50 hover:text-sky-900">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default FinancialHeader;