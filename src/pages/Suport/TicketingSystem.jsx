import React, { useState, useEffect, useContext } from 'react';
import { FiLifeBuoy, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/config';

const TicketingSystem = () => {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [formData, setFormData] = useState({
    Issue_Type: '',
    Title: '',
    Description: '',
    priority: 'Low',
    files: []
  });

  useEffect(() => {
    fetchTickets();
  }, [page, limit, token]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/tickets/?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Issue_Type', formData.Issue_Type);
      formDataToSend.append('Title', formData.Title);
      formDataToSend.append('Description', formData.Description);
      formDataToSend.append('priority', formData.priority);
      
      formData.files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/tickets/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const newTicket = await response.json();
      setTickets([newTicket, ...tickets]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTicket = (ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      Issue_Type: ticket.Issue_Type || '',
      Title: ticket.Title || '',
      Description: ticket.Description || '',
      priority: ticket.priority || 'Low',
      files: []
    });
    setShowEditModal(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('TicketId', currentTicket.id);
      if (formData.Issue_Type) formDataToSend.append('Issue_Type', formData.Issue_Type);
      if (formData.Title) formDataToSend.append('Title', formData.Title);
      if (formData.Description) formDataToSend.append('Description', formData.Description);
      if (formData.priority) formDataToSend.append('priority', formData.priority);
      
      formData.files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/tickets/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTickets(tickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ));
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/tickets/${ticketId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: [...e.target.files]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      Issue_Type: '',
      Title: '',
      Description: '',
      priority: 'Low',
      files: []
    });
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/tickets/${ticketId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      const updatedTicket = await response.json();
      setTickets(tickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading tickets...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <FiLifeBuoy className="mr-2 text-blue-500" /> Ticketing System
        </h3>
        <button 
          className="bg-sky-900 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
          onClick={() => setShowCreateModal(true)}
        >
          New Ticket
        </button>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Issue Type*</label>
                <input
                  type="text"
                  name="Issue_Type"
                  value={formData.Issue_Type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title*</label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description*</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Priority*</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-700"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && currentTicket && (
        <div className="fixed inset-0 bg-[#cccc] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg h-[90%] overflow-scroll p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Ticket</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateTicket}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Issue Type</label>
                <input
                  type="text"
                  name="Issue_Type"
                  value={formData.Issue_Type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {currentTicket.files?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current attachments:</p>
                    <ul className="text-sm text-gray-500">
                      {currentTicket.files.map((file, index) => (
                        <li key={index}>{file.name || `Attachment ${index + 1}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-700"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="font-medium">{ticket.Title}</div>
                  <div className="text-sm text-gray-500">{ticket.Issue_Type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status || 'Open'}
                    </span>
                    {/* <div className="ml-2 flex space-x-1">
                      <button 
                        onClick={() => handleStatusChange(ticket.id, 'In Progress')}
                        className="text-blue-500 hover:text-blue-700"
                        title="Mark as In Progress"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                        className="text-green-500 hover:text-green-700"
                        title="Mark as Resolved"
                      >
                        <FiCheck size={14} />
                      </button>
                    </div> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditTicket(ticket)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    {/* <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tickets.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No tickets found. Create your first ticket!
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-600">
            Showing {tickets.length} tickets
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={tickets.length < limit}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketingSystem;