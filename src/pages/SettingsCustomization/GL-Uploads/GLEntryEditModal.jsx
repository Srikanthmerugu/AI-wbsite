import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const GLEntryEditModal = ({ 
  entry, 
  onClose, 
  onSave,
  loading
}) => {
  const [editedEntry, setEditedEntry] = useState(entry);

  useEffect(() => {
    setEditedEntry(entry);
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEntry({
      ...editedEntry,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any existing toasts
    toast.dismiss();

    // GL Entry specific validation
    if (editedEntry.debit > 0 && editedEntry.credit > 0) {
      toast.error('You can update either debit or credit, not both at the same time.');
      return;
    }

    if (editedEntry.debit === 0 && editedEntry.credit === 0) {
      toast.warning('Please enter either a debit or credit amount.');
      return;
    }
    
    onSave(editedEntry);
  };

  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit GL Entry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GL Code</label>
              <input
                type="number"
                name="general_ledger_code"
                value={editedEntry.general_ledger_code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                name="account_name"
                value={editedEntry.account_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={editedEntry.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debit</label>
              <input
                type="number"
                step="0.01"
                name="debit"
                value={editedEntry.debit}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setEditedEntry({
                    ...editedEntry,
                    debit: value,
                    credit: value > 0 ? 0 : editedEntry.credit
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
              <input
                type="number"
                step="0.01"
                name="credit"
                value={editedEntry.credit}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setEditedEntry({
                    ...editedEntry,
                    credit: value,
                    debit: value > 0 ? 0 : editedEntry.debit
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004a80] focus:border-[#004a80]"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-[#004a80] hover:bg-[#003366] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GLEntryEditModal;