import React, { useState, useRef, useEffect } from 'react';
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
  FiDownload
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';

// Add/Edit User Modal
const AddEditUserModal = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    user || { name: '', email: '', role: 'Viewer', status: 'active' }
  );
  const modalRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSave(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f4b838e] ">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ user, onConfirm, onCancel }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {user.name} ({user.email})? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', lastActive: '2 hours ago', status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Finance Manager', lastActive: '1 day ago', status: 'active' },
    { id: 3, name: 'Michael Chen', email: 'michael@company.com', role: 'Analyst', lastActive: '3 days ago', status: 'active' },
    { id: 4, name: 'Emily Wilson', email: 'emily@company.com', role: 'Viewer', lastActive: '1 week ago', status: 'inactive' },
  ]);

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...formData, id: user.id, lastActive: user.lastActive } : user));
    } else {
      setUsers([...users, { ...formData, id: users.length + 1, lastActive: 'Just now' }]);
    }
    setShowAddEditModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
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

  return (
    <div className="flex min-h-screen bg-sky-50">
      {/* Sidebar Navigation */}
      <div className="w-64  sticky top-10 bg-white border-r border-gray-200 p-4">
        <h2 className="bg-gradient-to-r flex items-center font-semibold text-white from-[#004a80] to-[#91c8f3] p-4 rounded-lg shadow-sm mb-6">
          <FiUsers className="mr-2 font-semibold" size={20}/> User Management
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
                  {/* <p className="text-sm text-gray-600">{role.users} users</p> */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Financial Analyst"
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
              </div>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Save Role
              </button>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                  ))}
                </tbody>
              </table>
            </div>
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
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3">Change Master Admin Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        required
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Update Password
                </button>
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
                      <option>Disabled</option>
                      <option>10:00 PM - 6:00 AM</option>
                      <option>9:00 PM - 7:00 AM</option>
                      <option>Custom...</option>
                    </select>
                  </div>
                </div>
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
          />
        )}
        {showDeleteModal && userToDelete && (
          <DeleteConfirmModal
            user={userToDelete}
            onConfirm={() => handleDeleteUser(userToDelete)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        <Tooltip id="edit-tooltip" />
        <Tooltip id="delete-tooltip" />
      </div>
    </div>
  );
};

export default UserManagement;