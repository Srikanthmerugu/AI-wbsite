import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSettings } from 'react-icons/fi';
import DashboardUICustomization from './DashboardUICustomization';
import ReportWorkflowAutomation from './ReportWorkflowAutomation';
import AlertsNotificationPreferences from './AlertsNotificationPreferences';
import SystemDataPreferences from './SystemDataPreferences';
import RoleBasedFeatureAccess from './RoleBasedFeatureAccess';
import { AuthContext } from '../../context/AuthContext';

const SettingsCustomization = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('system-data');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 sm:p-6 bg-sky-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FiSettings className="w-6 h-6 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">Settings & Customization</h1>
          </div>
        

      {/* Navigation Tabs */}
      <div className="">
        <nav className="flex flex-wrap ">
          {/* <button
            onClick={() => handleTabChange('dashboard-ui')}
            className={`px-4 py-2 font-medium text-sm rounded-xl mr-2 ${activeTab === 'dashboard-ui' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Dashboard & UI
          </button> */}
          <button
            onClick={() => handleTabChange('system-data')}
            className={`px-4 py-2 font-medium text-sm rounded-xl mr-2 ${activeTab === 'system-data' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            System & Data
          </button>
          <button
            onClick={() => handleTabChange('report-workflow')}
            className={`px-4 py-2 font-medium text-sm rounded-xl mr-2 ${activeTab === 'report-workflow' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Report & Workflow
          </button>
          <button
            onClick={() => handleTabChange('alerts-notifications')}
            className={`px-4 py-2 font-medium text-sm rounded-xl mr-2 ${activeTab === 'alerts-notifications' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Alerts & Notifications
          </button>
          
          {/* <button
            onClick={() => handleTabChange('role-access')}
            className={`px-4 py-2 font-medium text-sm rounded-xl ${activeTab === 'role-access' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Role-Based Access
          </button> */}
        </nav>
      </div>
</div>
      </div>
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'report-workflow' && <ReportWorkflowAutomation token={token} />}
        {activeTab === 'alerts-notifications' && <AlertsNotificationPreferences token={token} />}
        {activeTab === 'system-data' && <SystemDataPreferences token={token} />}
        {activeTab === 'role-access' && <RoleBasedFeatureAccess token={token} />}
                {activeTab === 'dashboard-ui' && <DashboardUICustomization token={token} />}

      </div>
    </div>
  );
};

export default SettingsCustomization;