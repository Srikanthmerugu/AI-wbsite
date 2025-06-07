import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const ReportWorkflowAutomation = ({ token }) => {
  const [reportName, setReportName] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [recipients, setRecipients] = useState('');
  const [savedReports, setSavedReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddReport = async () => {
    if (!reportName.trim()) {
      toast.error('Please enter a report name');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport = {
        id: Date.now(),
        name: reportName,
        frequency,
        recipients: recipients.split(',').map(email => email.trim()),
        createdAt: new Date().toISOString()
      };
      
      setSavedReports([...savedReports, newReport]);
      setReportName('');
      setRecipients('');
      toast.success('Report automation added successfully!');
    } catch (error) {
      toast.error('Failed to add report automation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = (id) => {
    setSavedReports(savedReports.filter(report => report.id !== id));
    toast.success('Report automation deleted');
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#004a80] mb-4">Report & Workflow Automation</h2>
      <p className="text-gray-600 mb-6">Configure automated reports and financial workflows.</p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Create New Report Automation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              placeholder="e.g., Monthly Financial Summary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipients (comma separated emails)</label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            placeholder="e.g., finance@company.com, accounting@company.com"
          />
        </div>
        
        <button
          onClick={handleAddReport}
          disabled={loading}
          className="flex items-center bg-[#004a80] text-white px-4 py-2 rounded hover:bg-[#003366] disabled:opacity-50"
        >
          <FiPlus className="mr-2" />
          {loading ? 'Adding...' : 'Add Automation'}
        </button>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-4">Saved Report Automations</h3>
        {savedReports.length === 0 ? (
          <p className="text-gray-500 italic">No report automations configured yet</p>
        ) : (
          <div className="space-y-4">
            {savedReports.map(report => (
              <div key={report.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#004a80]">{report.name}</h4>
                    <p className="text-sm text-gray-600">Frequency: {report.frequency}</p>
                    <p className="text-sm text-gray-600">
                      Recipients: {report.recipients.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportWorkflowAutomation;