import React, { useContext, useState } from "react";
import { FiFilter, FiDownload } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/config";
import axios from "axios";
import WidgetSelector from "./WidgetSelector";
import { toast } from "react-toastify";

const FinancialHeader = ({ showFilters, setShowFilters, refreshWidgets }) => {
  const { currentUser, token } = useContext(AuthContext);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const handleAddWidget = async (widgetData) => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/company/financial/widgets`,
      {
        widgets: [{
          widgetName: widgetData.widgetName,
          chartType: widgetData.chartType,
          chartEnableOrDisable: widgetData.chartEnableOrDisable
        }]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', response); // Debug log

    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || "API returned unsuccessful");
    }

    if (response.status === 200 || response.status === 201) {
      toast.success("Widget added successfully!");
      refreshWidgets();
      return Promise.resolve();
    }
    
    throw new Error("Unexpected response status");
  } catch (err) {
    console.error('Error adding widget:', err); // Debug log
    const errorMsg = err.response?.data?.message || 
                    err.message || 
                    "Failed to add widget";
    setError(errorMsg);
    // toast.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  } finally {
    setLoading(false);
  }
};

  return (
    <>
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
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="mr-1" />
              Filters
            </button>
            
            <button
              onClick={() => setShowAddWidgetModal(true)}
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200"
            >
              <span className="text-sky-50 hover:text-sky-900">+ Add Widget</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-sky-700 hover:text-sky-900 transition-colors duration-200"
            >
              <FiDownload className="text-sky-50 hover:text-sky-900" />
              <span className="text-sky-50 hover:text-sky-900">Export</span>
            </button>
          </div>
        </div>
      </div>

      <WidgetSelector 
        isOpen={showAddWidgetModal}
        onClose={() => setShowAddWidgetModal(false)}
        onSubmit={handleAddWidget}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default FinancialHeader;