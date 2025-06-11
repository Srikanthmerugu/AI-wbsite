import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiDownload, FiTrash2, FiEdit2, FiSearch, FiPlus } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../config/config';
import ExcelUploadTable from './ExcelUploadTable';

const SystemDataPreferences = ({ token }) => {
  const [activeTab, setActiveTab] = useState('view');
  const [glMasterData, setGlMasterData] = useState([]);
  const [glEntries, setGlEntries] = useState([]);
  const [integrationHistory, setIntegrationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataFormat, setDataFormat] = useState('json');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [newGlAccount, setNewGlAccount] = useState({
    general_ledger_code: '',
    account_name: '',
    category: ''
  });
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch GL Master Data
  const fetchGlMasterData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-master/codes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch GL master data');
      const data = await response.json();
      setGlMasterData(data.master_gl_info || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch GL Entries
  const fetchGlEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-entries?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch GL entries');
      const data = await response.json();
      // setGlEntries(data.data || []);
      console.log('Fetched GL Entries 55:', data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Integration History
  const fetchIntegrationHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/integration-history?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch integration history');
      const data = await response.json();
      setIntegrationHistory(data.records || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchGlMasterData();
    } else if (activeTab === 'entries') {
      fetchGlEntries();
    } else if (activeTab === 'history') {
      fetchIntegrationHistory();
    }
  }, [activeTab, currentPage]);

  const handleDownload = () => {
    const dataToExport = glMasterData.map(item => ({
      general_ledger_code: item.general_ledger_code,
      account_name: item.account_name,
      category: item.category
    }));

    if (dataFormat === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gl-master-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (dataFormat === 'csv') {
      const csvContent = [
        ['General Ledger Code', 'Account Name', 'Category'],
        ...dataToExport.map(item => [item.general_ledger_code, item.account_name, item.category])
      ].map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gl-master-data.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else if (dataFormat === 'excel') {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'GL Master Data');
      XLSX.write_file(wb, 'gl-master-data.xlsx');
    }

    toast.success('GL master data downloaded successfully!');
  };

  const handleCreateGlAccount = async () => {
    if (!newGlAccount.general_ledger_code || !newGlAccount.account_name || !newGlAccount.category) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-master/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            general_ledger_code: parseInt(newGlAccount.general_ledger_code),
            account_name: newGlAccount.account_name,
            category: newGlAccount.category
          }]
        })
      });
      if (!response.ok) throw new Error('Failed to create GL account');
      toast.success('GL account created successfully!');
      setNewGlAccount({
        general_ledger_code: '',
        account_name: '',
        category: ''
      });
      fetchGlMasterData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGlAccount = async (glCode) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-master/${glCode}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete GL account');
      toast.success('GL account deleted successfully!');
      setShowDeleteModal(false);
      fetchGlMasterData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-entries/item/${entryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete GL entry');
      toast.success('GL entry deleted successfully!');
      setShowDeleteModal(false);
      fetchGlEntries();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!entryToEdit) return;

    const updateData = {
      date: entryToEdit.date,
      general_ledger_code: parseInt(entryToEdit.general_ledger_code),
      account_name: entryToEdit.account_name,
      category: entryToEdit.category,
      description: entryToEdit.description,
      debit: parseFloat(entryToEdit.debit) || 0,
      credit: parseFloat(entryToEdit.credit) || 0
    };

    if (updateData.debit > 0 && updateData.credit > 0) {
      toast.error('You can update either debit or credit, not both at the same time.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-entries/item/${entryToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) throw new Error('Failed to update GL entry');
      toast.success('GL entry updated successfully!');
      setShowEditModal(false);
      fetchGlEntries();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
  };

  const filteredGlMasterData = glMasterData.filter(item =>
    item.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.general_ledger_code.toString().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGlEntries = glEntries.filter(item =>
    item.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.general_ledger_code.toString().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIntegrationHistory = integrationHistory.filter(item =>
    item.source_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGlMasterData = filteredGlMasterData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedGlEntries = filteredGlEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedIntegrationHistory = filteredIntegrationHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalGlMasterPages = Math.ceil(filteredGlMasterData.length / itemsPerPage);
  const totalGlEntriesPages = Math.ceil(filteredGlEntries.length / itemsPerPage);
  const totalHistoryPages = Math.ceil(filteredIntegrationHistory.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#004a80] mb-4">General Ledger Management</h2>
      <p className="text-gray-600 mb-6">Manage GL accounts, entries, and integration history.</p>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex flex-wrap border-b border-gray-200">
         
          <button
            onClick={() => { setActiveTab('view'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${activeTab === 'view' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            View GL Accounts
          </button>
           <button
            onClick={() => { setActiveTab('create'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${activeTab === 'create' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Create GL Account
          </button>
          <button
            onClick={() => { setActiveTab('entries'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 ${activeTab === 'entries' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            GL Entries
          </button>
          <button
            onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'history' ? 'bg-[#004a80] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Integration History
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#004a80]"></div>
          </div>
        )}

        {!loading && activeTab === 'view' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">GL Accounts</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    value={dataFormat}
                    onChange={(e) => setDataFormat(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80] text-sm"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={!paginatedGlMasterData.length}
                  className="flex items-center bg-[#004a80] text-white px-3 py-1 rounded hover:bg-[#003366] disabled:opacity-50 text-sm"
                >
                  <FiDownload className="mr-1" />
                  Download
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedGlMasterData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No GL accounts found</td>
                    </tr>
                  ) : (
                    paginatedGlMasterData.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.general_ledger_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.account_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => {
                              setEntryToDelete({
                                id: item.general_ledger_code,
                                name: item.account_name
                              });
                              setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 mr-2"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredGlMasterData.length)}</span> of{' '}
                  <span className="font-medium">{filteredGlMasterData.length}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalGlMasterPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'create' && (
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Create New GL Account</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GL Code</label>
                <input
                  type="number"
                  value={newGlAccount.general_ledger_code}
                  onChange={(e) => setNewGlAccount({...newGlAccount, general_ledger_code: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                  placeholder="e.g., 4000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={newGlAccount.account_name}
                  onChange={(e) => setNewGlAccount({...newGlAccount, account_name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                  placeholder="e.g., Product Revenue"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newGlAccount.category}
                onChange={(e) => setNewGlAccount({...newGlAccount, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              >
                <option value="">Select a category</option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <ExcelUploadTable token={token} onUploadSuccess={fetchGlMasterData} />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCreateGlAccount}
                disabled={!newGlAccount.general_ledger_code || !newGlAccount.account_name || !newGlAccount.category}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                <FiPlus className="mr-2" />
                Create Account
              </button>
            </div>
          </div>
        )}

        {!loading && activeTab === 'entries' && (
          <div>
            <h3 className="font-medium text-gray-700 mb-4">GL Entries</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedGlEntries.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No GL entries found</td>
                    </tr>
                  ) : (
                    paginatedGlEntries.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.general_ledger_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.account_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.debit > 0 ? item.debit.toFixed(2) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.credit > 0 ? item.credit.toFixed(2) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => {
                              setEntryToEdit(item);
                              setShowEditModal(true);
                            }}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => {
                              setEntryToDelete({
                                id: item.id,
                                name: `${item.account_name} (${new Date(item.date).toLocaleDateString()})`
                              });
                              setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredGlEntries.length)}</span> of{' '}
                  <span className="font-medium">{filteredGlEntries.length}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalGlEntriesPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'history' && (
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Integration History</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedIntegrationHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No integration history found</td>
                    </tr>
                  ) : (
                    paginatedIntegrationHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.source_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'success' ? 'bg-green-100 text-green-800' :
                            item.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => {
                              setEntryToDelete({
                                id: item.id,
                                name: `${item.source_type} (${new Date(item.created_at).toLocaleDateString()})`
                              });
                              setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredIntegrationHistory.length)}</span> of{' '}
                  <span className="font-medium">{filteredIntegrationHistory.length}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalHistoryPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {entryToDelete?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'view') {
                    handleDeleteGlAccount(entryToDelete.id);
                  } else if (activeTab === 'entries') {
                    handleDeleteEntry(entryToDelete.id);
                  }
                }}
                className="px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditModal && entryToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit GL Entry</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={entryToEdit.date.split('T')[0]}
                  onChange={(e) => setEntryToEdit({...entryToEdit, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GL Code</label>
                <input
                  type="number"
                  value={entryToEdit.general_ledger_code}
                  onChange={(e) => setEntryToEdit({...entryToEdit, general_ledger_code: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={entryToEdit.account_name}
                  onChange={(e) => setEntryToEdit({...entryToEdit, account_name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={entryToEdit.category}
                  onChange={(e) => setEntryToEdit({...entryToEdit, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={entryToEdit.description}
                  onChange={(e) => setEntryToEdit({...entryToEdit, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryToEdit.debit}
                    onChange={(e) => setEntryToEdit({...entryToEdit, debit: e.target.value, credit: e.target.value ? 0 : entryToEdit.credit})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryToEdit.credit}
                    onChange={(e) => setEntryToEdit({...entryToEdit, credit: e.target.value, debit: e.target.value ? 0 : entryToEdit.debit})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEntry}
                className="px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-[#004a80] hover:bg-[#003366]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDataPreferences;