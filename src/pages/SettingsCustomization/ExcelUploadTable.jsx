import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const ExcelUploadTable = ({ token, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(droppedFile.type)) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      parseExcelFile(droppedFile);
    } else {
      toast.error('Please upload a valid Excel or CSV file');
    }
  };

  const handleFilePickerChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length < 1) {
        toast.error('No data found in the file.');
        return;
      }

      // Extract headers from the first row
      const fileHeaders = jsonData[0].map(header => header.toString().trim());
      setHeaders(fileHeaders);

      // Extract data rows (skip header row)
      const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

      // Map data rows to objects with headers as keys
      const validData = dataRows.map(row => {
        const rowData = {};
        fileHeaders.forEach((header, index) => {
          rowData[header] = row[index] !== undefined ? row[index] : '';
          // Convert numeric fields to appropriate types if needed
          if (['GL Number', 'Debit', 'Credit'].includes(header)) {
            rowData[header] = isNaN(rowData[header]) ? rowData[header] : parseFloat(rowData[header]);
          }
        });
        return rowData;
      });

      if (validData.length === 0) {
        toast.error('No valid data found in the file.');
      } else {
        setTableData(validData);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: ['GL Number', 'Debit', 'Credit'].includes(field) ? (isNaN(value) ? value : parseFloat(value)) : value
    };
    setTableData(updatedData);
  };

  const handleRemoveRow = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    if (updatedData.length === 0) {
      setFile(null);
      setFileName('');
      setHeaders([]);
    }
  };

  const handleSubmit = async () => {
    if (tableData.length === 0) {
      toast.error('No data to submit');
      return;
    }

    try {
      setIsLoading(true);
      // Map headers to API expected keys if needed
      const mappedData = tableData.map(row => {
        const mappedRow = {};
        headers.forEach(header => {
          // Map common headers to API expected keys
          if (header === 'GL Number') {
            mappedRow['general_ledger_code'] = row[header];
          } else if (header === 'Account Name') {
            mappedRow['account_name'] = row[header];
          } else if (header === 'Category') {
            mappedRow['category'] = row[header];
          } else {
            // Include other fields as-is
            mappedRow[header.toLowerCase().replace(/\s/g, '_')] = row[header];
          }
        });
        return mappedRow;
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/company/financial/gl-master/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: mappedData })
      });

      if (!response.ok) throw new Error('Failed to upload GL data');
      toast.success('GL data uploaded successfully!');
      setFile(null);
      setFileName('');
      setTableData([]);
      setHeaders([]);
      onUploadSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">Upload Excel File</label>
      {/* <div
        className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer ${isDragging ? 'border-sky-400 bg-sky-50' : 'border-sky-200 hover:border-sky-300 bg-sky-50 hover:bg-sky-100'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="gl-file-picker-upload-tab" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <FiUpload className="w-7 h-7 mb-2 text-sky-400" />
            <p className="mb-1 text-xs text-gray-600"><span className="font-semibold text-sky-600">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">Excel (.xls, .xlsx, .csv)</p>
          </div>
        </label>
        <input
          id="gl-file-picker-upload-tab"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={handleFilePickerChange}
          disabled={isLoading}
        />
      </div> */}

      {fileName && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Selected File: <span className="font-medium">{fileName}</span></p>
        </div>
      )}

      {tableData.length > 0 && headers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview and Edit Data</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="px-2 outline-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y h-[75%] divide-gray-200">
                {tableData.map((row, index) => (
                  <tr key={index}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type={['GL Number', 'Debit', 'Credit'].includes(header) ? 'number' : 'text'}
                          value={row[header] || ''}
                          onChange={(e) => handleInputChange(index, header, e.target.value)}
                          className="w-full p-1 outline-0 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center bg-[#004a80] text-white px-4 py-2 rounded hover:bg-[#003366] disabled:opacity-50"
            >
              <FiUpload className="mr-2" />
              Submit Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadTable;