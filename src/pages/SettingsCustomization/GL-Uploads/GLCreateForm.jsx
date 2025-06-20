import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ExcelUploadTable from './ExcelUploadTable';
import { API_BASE_URL } from '../../../config/config';

const GLCreateForm = ({ 
  token, 
  onCreateSuccess,
  loading 
}) => {
  const [newGlAccount, setNewGlAccount] = useState({
    general_ledger_code: '',
    account_name: '',
    category: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const handleCreateGlAccount = async () => {
    if (!newGlAccount.general_ledger_code || !newGlAccount.account_name || !newGlAccount.category) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`https://fpnainsightsapi.mavenerp.in/api/v1/company/financial/gl-master/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{
            general_ledger_code: parseInt(newGlAccount.general_ledger_code),
            account_name: newGlAccount.account_name,
            category: newGlAccount.category,
            tags: newGlAccount.tags
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create GL account');
      }

      toast.success('GL account created successfully!');
      setNewGlAccount({
        general_ledger_code: '',
        account_name: '',
        category: '',
        tags: []
      });
      onCreateSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addTag = () => {
    if (newTag && !newGlAccount.tags.includes(newTag)) {
      setNewGlAccount({
        ...newGlAccount,
        tags: [...newGlAccount.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewGlAccount({
      ...newGlAccount,
      tags: newGlAccount.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GL Code*</label>
          <input
            type="number"
            value={newGlAccount.general_ledger_code}
            onChange={(e) => setNewGlAccount({...newGlAccount, general_ledger_code: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            placeholder="e.g., 4000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Name*</label>
          <input
            type="text"
            value={newGlAccount.account_name}
            onChange={(e) => setNewGlAccount({...newGlAccount, account_name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            placeholder="e.g., Product Revenue"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              placeholder="Add tag and press Enter"
            />
            <button
              onClick={addTag}
              className="bg-[#004a80] text-white px-3 py-2 rounded-r hover:bg-[#003366]"
            >
              Add
            </button>
          </div>
          {newGlAccount.tags.length > 0 && (
            <div className="flex flex-wrap mt-2">
              {newGlAccount.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ExcelUploadTable token={token} onUploadSuccess={onCreateSuccess} />
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleCreateGlAccount}
          disabled={!newGlAccount.general_ledger_code || !newGlAccount.account_name || !newGlAccount.category || loading}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : (
            <>
              <FiPlus className="mr-2" />
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GLCreateForm;