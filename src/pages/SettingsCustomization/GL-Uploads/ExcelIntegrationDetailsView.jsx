import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiTrash2, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../../config/config';

const IntegrationDetails = ({ token }) => {
  const { integrationId } = useParams();
  const navigate = useNavigate();
  const [integrationData, setIntegrationData] = useState(null);
  const [glEntries, setGlEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Fetch integration details
  const fetchIntegrationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/integration-history/${integration_id}/gl-entries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });GET
// /api/v1/company/financial/integration-history/{integration_id}/gl-entries

      
      if (!response.ok) {
        throw new Error('Failed to fetch integration details');
      }
      
      const data = await response.json();
      setIntegrationData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch GL entries for this integration
  const fetchGlEntries = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/v1/company/financial/integration-history/${integrationId}/gl-entries?page=${currentPage}&limit=${itemsPerPage}`;
      
      // Add search filters if they exist
      if (searchTerm) {
        url += `&account_name=${searchTerm}`;
      }
      if (dateFilter) {
        url += `&date=${dateFilter}`;
      }
      if (dateRange.from) {
        url += `&date_from=${dateRange.from}`;
      }
      if (dateRange.to) {
        url += `&date_to=${dateRange.to}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch GL entries');
      }
      
      const data = await response.json();
      setGlEntries(data.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete integration
  const handleDeleteIntegration = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/integration-history/${integrationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete integration');
      }
      
      toast.success('Integration deleted successfully!');
      navigate('/gl-uploads'); // Navigate back to the main view
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle download as Excel
  const handleDownloadExcel = () => {
    const dataToExport = glEntries.map(entry => ({
      Date: new Date(entry.date).toLocaleDateString(),
      'GL Code': entry.general_ledger_code,
      'Account Name': entry.account_name,
      Category: entry.category,
      Description: entry.description,
      Debit: entry.debit,
      Credit: entry.credit,
      'Entry By': entry.entry_by,
      'Created At': new Date(entry.created_at).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GL Entries');
    XLSX.write_file(wb, `integration_${integrationId}_entries.xlsx`);
    toast.success('Excel file downloaded successfully!');
  };

  useEffect(() => {
    fetchIntegrationDetails();
    fetchGlEntries();
  }, [integrationId, currentPage, searchTerm, dateFilter, dateRange]);

  if (loading && !integrationData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004a80]"></div>
      </div>
    );
  }

  if (!integrationData) {
    return <div className="text-center py-10">No integration data found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#004a80] hover:text-[#003366]"
        >
          <FiArrowLeft className="mr-1" /> Back to History
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center bg-[#004a80] text-white px-3 py-1 rounded hover:bg-[#003366] text-sm"
            disabled={glEntries.length === 0}
          >
            <FiDownload className="mr-1" /> Download Excel
          </button>
          
          <button
            onClick={handleDeleteIntegration}
            className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            <FiTrash2 className="mr-1" /> Delete Integration
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Integration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Source Type</p>
            <p className="font-medium">{integrationData.source_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`font-medium ${
              integrationData.status === 'success' ? 'text-green-600' : 
              integrationData.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {integrationData.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-medium">{new Date(integrationData.created_at).toLocaleString()}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-gray-600">Message</p>
            <p className="font-medium">{integrationData.message}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-3">GL Entries ({glEntries.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Account</label>
            <input
              type="text"
              placeholder="Search account name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exact Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#004a80]"></div>
          </div>
        ) : glEntries.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No GL entries found for this integration</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">GL Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Account Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Debit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">Credit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {glEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {entry.general_ledger_code}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {entry.account_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {entry.category}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 border">
                      {entry.description}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {entry.debit.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border">
                      {entry.credit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationDetails;