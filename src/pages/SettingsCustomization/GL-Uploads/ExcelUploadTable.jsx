import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/config';

const ExcelUploadTable = ({ token, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Read the file for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Transform data to match expected format
      const transformedData = jsonData.map(item => ({
        general_ledger_code: item['General Ledger Code'] || item['general_ledger_code'] || '',
        account_name: item['Account Name'] || item['account_name'] || '',
        category: item['Category'] || item['category'] || '',
        tags: item['Tags'] || item['tags'] || []
      }));
      
      setPreviewData(transformedData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/upload-gl/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      toast.success('GL accounts uploaded successfully!');
      setFile(null);
      setPreviewData([]);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-700 mb-3">Upload GL Accounts (Excel/CSV)</h4>
      
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex-1">
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white hover:bg-gray-50">
              <span className="text-sm text-gray-700 truncate">
                {file ? file.name : 'Choose file...'}
              </span>
              <FiUpload className="text-gray-500" />
            </div>
          </div>
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="flex items-center bg-[#004a80] text-white px-4 py-2 rounded hover:bg-[#003366] disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {previewData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewData.slice(0, 5).map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.general_ledger_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.account_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Array.isArray(item.tags) ? item.tags.join(', ') : item.tags}
                  </td>
                </tr>
              ))}
              {previewData.length > 5 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    + {previewData.length - 5} more records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadTable;