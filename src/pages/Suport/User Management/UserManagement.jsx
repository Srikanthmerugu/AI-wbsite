import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  FiUsers,
  FiKey,
  FiUserPlus,
  FiUserMinus,
  FiSettings,
  FiActivity,
  FiBell,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiChevronDown,
  FiDownload,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../config/config';
import TwoFactorToggle from './TwoFactorToggle';

// ... (keep ErrorBoundary and AddEditUserModal components unchanged)

// Delete Confirmation Modal
const DeleteConfirmModal = ({ user, onConfirm, onCancel, loading }) => {
  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center shadow-2xl bg-[#234567b7] bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {user.name || user.full_name || 'User'} (
          {user.user_email || user.email || 'N/A'})? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('roles');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const roles = [
    { name: 'Admin', permissions: ['All'], users: 4 },
    { name: 'Finance Manager', permissions: ['Dashboard', 'Reports', 'Forecasting'], users: 5 },
    { name: 'Analyst', permissions: ['Dashboard', 'Reports'], users: 8 },
    { name: 'Viewer', permissions: ['Dashboard'], users: 12 },
  ];

  const auditLogs = [
    { id: 1, user: 'John Smith', action: 'Logged in', timestamp: '2023-06-15 09:30:45', ip: '192.168.1.100' },
    { id: 2, user: 'Sarah Johnson', action: 'Updated forecast', timestamp: '2023-06-15 10:15:22', ip: '192.168.1.101' },
    { id: 3, user: 'Michael Chen', action: 'Exported report', timestamp: '2023-06-14 14:45:10', ip: '192.168.1.102' },
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/management/company-users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      let userArray = [];
      if (Array.isArray(data)) {
        userArray = data;
      } else if (data.users && Array.isArray(data.users)) {
        userArray = data.users;
      } else if (data.results && Array.isArray(data.results)) {
        userArray = data.results;
      } else {
        console.error('Expected an array or object with users/results array, received:', data);
        toast.error('Invalid data format received from server');
      }
      // Ensure is_two_factor_enabled is included in the user object
      userArray = userArray.map(user => ({
        ...user,
        is_two_factor_enabled: user.is_two_factor_enabled ?? false
      }));
      setUsers(userArray);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error(error.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        (user.name || user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.user_email || user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSaveUser = async (formData) => {
    try {
      setApiLoading(true);

      if (editingUser) {
        // Update user
        const response = await fetch(`${API_BASE_URL}/api/v1/company/management/update-user/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: editingUser.id,
            user_email: formData.user_email,
            user_department: formData.user_department,
            user_role: formData.user_role,
            reset_password: false
          })
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorMessage = responseData.message || 
                              responseData.detail || 
                              'Failed to update user';
          throw new Error(errorMessage);
        }

        toast.success('User updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Add new user
        const response = await fetch(`${API_BASE_URL}/api/v1/company/management/add-user/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            user_email: formData.user_email,
            user_department: formData.user_department,
            user_role: formData.user_role
          })
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorMessage = responseData.message || 
                              responseData.detail || 
                              'Failed to add user';
          throw new Error(errorMessage);
        }

        toast.success('User added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      await fetchUsers();
      setShowAddEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('User operation error:', error);
      toast.error(error.message || 'Operation failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteUser = async () => {  
    try {
      setApiLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/v1/company/management/delete-user/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userToDelete.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      await fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setApiLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setTogglingStatus(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/management/user/activate-deactivate?user_id=${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle user status');
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));

      toast.success(
        `User ${data.user_name} has been ${currentStatus ? 'deactivated' : 'activated'}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error('Toggle user status error:', error);
      toast.error(error.message || 'Failed to toggle user status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleToggle2FA = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, is_two_factor_enabled: newStatus } : user
    ));
  };

  const exportAuditLogs = () => {
    const data = auditLogs.map(log => ({
      Timestamp: log.timestamp,
      User: log.user,
      Action: log.action,
      IP: log.ip
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');
    XLSX.writeFile(workbook, 'audit_logs.xlsx');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleString();
  };

  return (
    <div>
      <div className="flex min-h-screen bg-sky-50">
        {/* Sidebar Navigation */}
        <div className="w-64 sticky top-10 bg-white border-r border-gray-200 p-4">
          <h2 className="bg-gradient-to-r flex items-center font-semibold text-white from-[#004a80] to-[#91c8f3] p-4 rounded-lg shadow-sm mb-6">
            <FiUsers className="mr-2" size={20} /> User Management
          </h2>
          <nav>
            <ul className="space-y-1">
              {[
                { tab: 'roles', icon: FiKey, label: 'Roles & Permissions' },
                { tab: 'accounts', icon: FiUserPlus, label: 'Account Management' },
                { tab: 'security', icon: FiLock, label: 'Security Settings' },
                { tab: 'audit', icon: FiActivity, label: 'Audit Logs' },
                { tab: 'notifications', icon: FiBell, label: 'Notification Settings' }
              ].map(({ tab, icon: Icon, label }) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center p-3 rounded-lg text-sm font-medium ${
                      activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-white">User Management Dashboard</h1>
                <p className="text-sky-100 text-xs">Manage roles, accounts, and security settings</p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
                  onClick={() => setShowAddEditModal(true)}
                >
                  <FiUserPlus className="mr-1" />
                  Add User
                </button>
                <button
                  type="button"
                  className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
                  onClick={exportAuditLogs}
                >
                  <FiDownload className="mr-1" />
                  Export Logs
                </button>
              </div>
            </div>
          </div>

          {/* Roles & Permissions */}
          {activeTab === 'roles' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FiKey className="mr-2 text-blue-500" /> Access Control & Security Management
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {roles.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg mb-2">{role.name}</h4>
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">Permissions:</span>
                      <ul className="mt-1 space-y-1">
                        {role.permissions.map((perm, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold mb-4">Create New Role</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none၁"
                      placeholder="eg Financial Analyst"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                    <select
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-[100px]"
                    >
                      <option value="dashboard">Dashboard Access</option>
                      <option value="reports">Report Generation</option>
                      <option value="forecasting">Forecasting Tools</option>
                      <option value="admin">Administration</option>
                      <option value="export">Data Export</option>
                    </select>
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Save Role
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Account Management */}
          {activeTab === 'accounts' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <FiUserPlus className="mr-2 text-blue-500" /> User Account Management
                </h3>
              </div>
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              {user.name || user.full_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {user.user_email || user.email || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                                {user.role || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs text-blue-800 capitalize">
                                {user.department || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <TwoFactorToggle
                                userId={user.id}
                                isTwoFactorEnabled={user.is_two_factor_enabled}
                                onToggle={handleToggle2FA}
                              />
                              <button
                                className="text-gray-600 hover:text-gray-900 mr-3"
                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                disabled={togglingStatus}
                                data-tooltip-id="status-tooltip"
                                data-tooltip-content={user.is_active ? 'Deactivate User' : 'Activate User'}
                              >
                                {user.is_active ? (
                                  <FiToggleRight className="inline text-green-500" size={25} />
                                ) : (
                                  <FiToggleLeft className="inline text-gray-400" size={25} />
                                )}
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowAddEditModal(true);
                                }}
                                data-tooltip-id="edit-tooltip"
                                data-tooltip-content="Edit User"
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => {
                                  setUserToDelete(user);
                                  setShowDeleteModal(true);
                                }}
                                data-tooltip-id="delete-tooltip"
                                data-tooltip-content="Delete User"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <Tooltip id="edit-tooltip" />
              <Tooltip id="status-tooltip" />
              <Tooltip id="delete-tooltip" />
            </div>
          )}

          {/* Security & Authentication */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FiLock className="mr-2 text-blue-500" /> Enterprise-Grade Security Controls
              </h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3">Authentication Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Multi-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Require additional verification step for all users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password Complexity</p>
                        <p className="text-sm text-gray-600">Require strong passwords with special characters</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-gray-600">Automatically log out inactive users</p>
                      </div>
                      <select className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>15 minutes</option>
                        <option selected>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3">IP Restrictions</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelisting</p>
                        <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowed IP Addresses</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter one IP per line"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <FiActivity className="mr-2 text-blue-500" /> User Activity & Compliance Monitoring
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{log.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FiBell className="mr-2 text-blue-500" /> Notification & Communication Preferences
              </h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-4">System Alerts</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Critical System Updates</p>
                        <p className="text-sm text-gray-600">Receive notifications for system maintenance or outages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-gray-600">Notifications for suspicious login attempts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-4">Notification Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-sm text-gray-600">Receive notifications via your registered email address</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="font-medium">In-App Notifications</span>
                      </div>
                      <p className="text-sm text-gray-600">See notifications when logged into the platform</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-4">Notification Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daily Digest Time</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>6:00 AM</option>
                        <option>8:00 AM</option>
                        <option selected>5:00 PM</option>
                        <option>9:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Do Not Disturb Hours</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>None</option>
                        <option>10:00 PM - 6:00 AM</option>
                        <option>11:00 PM - 7:00 AM</option>
                        <option>12:00 AM - 8:00 AM</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modals */}
          {showAddEditModal && (
            <AddEditUserModal
              user={editingUser}
              onSave={handleSaveUser}
              onCancel={() => {
                setShowAddEditModal(false);
                setEditingUser(null);
              }}
              loading={apiLoading}
            />
          )}
          {showDeleteModal && (
            <DeleteConfirmModal
              user={userToDelete}
              onConfirm={handleDeleteUser}
              onCancel={() => setShowDeleteModal(false)}
              loading={apiLoading}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserManagement;