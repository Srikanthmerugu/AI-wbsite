import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiBell, FiMail } from 'react-icons/fi';

const AlertsNotificationPreferences = ({ token }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    thresholdAlerts: true,
    thresholdAmount: 10000,
    criticalAlerts: true,
    weeklySummary: true,
    monthlyReport: true
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#004a80] mb-4">Alerts & Notification Preferences</h2>
      <p className="text-gray-600 mb-6">Configure how you receive alerts and notifications.</p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-4 flex items-center">
          <FiBell className="mr-2" /> Notification Channels
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={preferences.emailNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Email Notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="inAppNotifications"
              checked={preferences.inAppNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Application Notifications</span>
          </label>
        </div>
      </div>

      {/* <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-4 flex items-center">
          <FiMail className="mr-2" /> Alert Preferences
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="thresholdAlerts"
              checked={preferences.thresholdAlerts}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Receive threshold alerts</span>
          </label>
          
          {preferences.thresholdAlerts && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert me when transactions exceed:
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="thresholdAmount"
                  value={preferences.thresholdAmount}
                  onChange={handleChange}
                  className="focus:ring-[#004a80] focus:border-[#004a80] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="criticalAlerts"
              checked={preferences.criticalAlerts}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Receive critical alerts (24/7)</span>
          </label>
        </div>
      </div> */}

      {/* <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Report Notifications</h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="weeklySummary"
              checked={preferences.weeklySummary}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Weekly Financial Summary</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="monthlyReport"
              checked={preferences.monthlyReport}
              onChange={handleChange}
              className="h-4 w-4 text-[#004a80] rounded"
            />
            <span>Monthly Detailed Report</span>
          </label>
        </div>
      </div> */}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center bg-[#004a80] text-white px-4 py-2 rounded hover:bg-[#003366] disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default AlertsNotificationPreferences;