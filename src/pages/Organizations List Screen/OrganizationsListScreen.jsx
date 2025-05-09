import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiEye, FiEdit, FiTrash, FiUsers } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import { TbLockPassword } from "react-icons/tb";


// Mock Data
const initialOrganizations = [
  { id: 1, name: "Tech Innovators Inc.", email: "contact@techinnovators.com", phone: "+1 (555) 123-4567", address: "123 Innovation Blvd, Silicon Valley", type: "Technology", status: "Active", createdDate: "2024-01-15", subscriptionDiscount: "10%", billingAddress: "123 Innovation Blvd, Silicon Valley, CA 94025, USA" },
  { id: 2, name: "Global Solutions Ltd.", email: "info@globalsol.com", phone: "+44 20 7123 4567", address: "456 Business Park, London", type: "Consulting", status: "Active", createdDate: "2024-02-10", subscriptionDiscount: "15%", billingAddress: "456 Business Park, London, NY 10001, USA" },
  { id: 3, name: "Future Enterprises", email: "support@futureent.com", phone: "+81 3-1234-5678", address: "789 Progress St, Tokyo", type: "Enterprise", status: "Inactive", createdDate: "2024-03-05", subscriptionDiscount: "5%", billingAddress: "789 Progress St, Tokyo, TX 75001, USA" },
  { id: 4, name: "Green Energy Corp", email: "hello@greenenergy.com", phone: "+49 30 12345678", address: "321 Eco Road, Berlin", type: "Energy", status: "Active",  createdDate: "2024-04-20", subscriptionDiscount: "0%", billingAddress: "321 Eco Road, Berlin, FL 33101, USA" },
  { id: 5, name: "Cloud Networks Co.", email: "sales@cloudnet.com", phone: "+1 (555) 987-6543", address: "654 Data Center Dr, New York", type: "Cloud", status: "Active", createdDate: "2024-05-12", subscriptionDiscount: "20%", billingAddress: "654 Data Center Dr, New York, NY 10002, USA" },
  { id: 6, name: "HealthTech Solutions", email: "contact@healthtech.com", phone: "+61 2 1234 5678", address: "987 Wellness Ave, Sydney", type: "Healthcare", status: "Inactive", createdDate: "2024-06-01", subscriptionDiscount: "8%", billingAddress: "987 Wellness Ave, Sydney, CA 90210, USA" },
  { id: 7, name: "FinTech Global", email: "info@fintechglobal.com", phone: "+33 1 23 45 67 89", address: "159 Finance Street, Paris", type: "Finance", status: "Active", createdDate: "2024-07-18", subscriptionDiscount: "12%", billingAddress: "159 Finance Street, Paris, IL 60601, USA" },
  { id: 8, name: "EdTech Pioneers", email: "support@edtechpioneers.com", phone: "+86 10 1234 5678", address: "753 Education Road, Beijing", type: "Education", status: "Active", createdDate: "2024-08-22", subscriptionDiscount: "18%", billingAddress: "753 Education Road, Beijing, MA 02108, USA" },
  { id: 9, name: "Smart City Solutions", email: "hello@smartcity.com", phone: "+34 91 123 45 67", address: "258 Future Lane, Madrid", type: "Urban", status: "Inactive", createdDate: "2024-09-05", subscriptionDiscount: "7%", billingAddress: "258 Future Lane, Madrid, WA 98101, USA" },
  { id: 10, name: "AI Research Labs", email: "contact@airesearch.com", phone: "+1 (555) 321-7654", address: "951 Algorithm Way, Boston", type: "Research", status: "Active", createdDate: "2024-10-15", subscriptionDiscount: "25%", billingAddress: "951 Algorithm Way, Boston, MA 02114, USA" },
];

const initialUsers = [
  { id: 1, orgId: 1, name: "John Doe", email: "john@tech.com", role: "Admin", status: "Active" },
  { id: 2, orgId: 1, name: "Jane Smith", email: "jane@tech.com", role: "Staff", status: "Active" },
  { id: 3, orgId: 2, name: "Bob Johnson", email: "bob@innovate.com", role: "Staff", status: "Inactive" },
  { id: 4, orgId: 3, name: "Alice Brown", email: "alice@future.com", role: "Admin", status: "Active" },
  { id: 5, orgId: 4, name: "Charlie Wilson", email: "charlie@green.com", role: "Staff", status: "Active" },
];

// Add/Edit User Form Component
const AddUserForm = ({ user, orgId, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    user || { name: "", email: "", role: "Staff", status: "Active", orgId }
  );
  const modalRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
    <div id="add-user-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative paphic p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">
              {user ? "✏️ Edit User" : "➕ Add User"}
            </h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onCancel}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {['name', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-600 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none transition-all"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none appearance-none"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmQwZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none appearance-none"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmQwZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-sky-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 text-sm font-medium text-white bg-sky-900 rounded-lg hover:bg-sky-950 transition-colors shadow-md"
                >
                  {user ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Organization Form Component
const OrganizationForm = ({ organization, onSave, onCancel }) => {
  const [formData, setFormData] = useState(organization || {
    name: "", email: "", phone: "", address: "", type: "", status: "Active", subscriptionDiscount: "", billingAddress: ""
  });
  const modalRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
    <div id="organization-form-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full overflow-scroll mb-5 bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">
              {organization ? "Edit Organization" : "➕ Add Organization"}
            </h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onCancel}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
              
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {['name', 'email', 'phone', 'address', 'type', 'subscriptionDiscount', 'billingAddress'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-600 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none transition-all"
                    required={field !== 'phone' && field !== 'address' && field !== 'subscriptionDiscount' && field !== 'billingAddress'}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none appearance-none"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmQwZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5rem'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-sky-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 text-sm font-medium text-white bg-sky-900 rounded-lg hover:bg-sky-950 transition-colors shadow-md"
                >
                  {organization ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Organization Details Component
const OrganizationDetailsPopup = ({ organization, onClose }) => {
  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="org-details-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">Organization Details</h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onClose}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Name:</span>
              <span className="flex-1">{organization.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Email:</span>
              <span className="flex-1">{organization.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Phone:</span>
              <span className="flex-1">{organization.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Address:</span>
              <span className="flex-1">{organization.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Billing Address:</span>
              <span className="flex-1">{organization.billingAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Type:</span>
              <span className="flex-1">{organization.type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                organization.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {organization.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Created:</span>
              <span className="flex-1">{organization.createdDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Subscription Discount:</span>
              <span className="flex-1">{organization.subscriptionDiscount}</span>
            </div>
          </div>
          <div className="flex justify-end p-4 md:p-5 border-t border-slate-100">
            <button
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manage Users Component
const ManageUsersPopup = ({ organization, onClose }) => {
  const [users, setUsers] = useState(initialUsers.filter(user => user.orgId === organization.id));
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const modalRef = useRef();

  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...formData } : user
      ));
    } else {
      setUsers([...users, {
        id: users.length + 1,
        ...formData
      }]);
    }
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const handleResetPassword = (userId) => {
    alert(`Password reset initiated for user ${userId}`);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="manage-users-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">Manage Users - {organization.name}</h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onClose}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Organization Info</h3>
              <div className="grid grid-cols-2 gap-4 text-slate-600">
                <div>
                  <span className="font-medium">Name: </span>{organization.name}
                </div>
                <div>
                  <span className="font-medium">Email: </span>{organization.email}
                </div>
                <div>
                  <span className="font-medium">Phone: </span>{organization.phone}
                </div>
                <div>
                  <span className="font-medium">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    organization.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {organization.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Users</h3>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
              >
                + Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-slate-600">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowAddUserModal(true);
                            }}
                            className="text-sky-900 hover:text-sky-950"
                            data-tooltip-id="edit-tooltip"
                            data-tooltip-content="Edit User"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user.id)}
                            className="text-yellow-600 hover:text-yellow-700"
                            data-tooltip-id="status-tooltip"
                            data-tooltip-content={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                          >
                            <FiUsers className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="text-sky-900 hover:text-sky-950"
                            data-tooltip-id="reset-tooltip"
                            data-tooltip-content="Reset Password"
                          >
                            {/* <FiTrash  /> */}
                            <TbLockPassword className="w-5 h-5"/>

                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Tooltip id="edit-tooltip" />
            <Tooltip id="status-tooltip" />
            <Tooltip id="reset-tooltip" />
          </div>
          <div className="flex justify-end p-4 md:p-5 border-t border-slate-100">
            <button
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {showAddUserModal && (
        <AddUserForm
          user={editingUser}
          orgId={organization.id}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowAddUserModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

// Main Component
const OrganizationsListScreen = () => {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (formData) => {
    if (editingOrg) {
      setOrganizations(organizations.map(org => 
        org.id === editingOrg.id ? { ...org, ...formData } : org
      ));
    } else {
      setOrganizations([...organizations, {
        id: organizations.length + 1,
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowFormModal(false);
    setEditingOrg(null);
  };

  const handleDelete = (id) => {
    setOrganizations(organizations.filter(org => org.id !== id));
    
  };

  const openFormModal = (org = null) => {
    setEditingOrg(org);
    setShowFormModal(true);
  };

  const openDetailsModal = (org) => {
    setSelectedOrg(org);
    setShowDetailsModal(true);
  };

  const openUsersModal = (org) => {
    setSelectedOrg(org);
    setShowUsersModal(true);
  };

  const exportToExcel = () => {
    const data = organizations.map(org => {
      const users = initialUsers.filter(user => user.orgId === org.id);
      return {
        Name: org.name,
        Email: org.email,
        Phone: org.phone,
        Address: org.address,
        Type: org.type,
        Status: org.status,
        Created: org.createdDate,
        SubscriptionDiscount: org.subscriptionDiscount,
        BillingAddress: org.billingAddress,
        Users: users.map(user => (
          `Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`
        )).join('\n')
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Organizations");
    XLSX.writeFile(workbook, "organizations.xlsx");
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white">Organizations Management</h1>
              <p className="text-sky-100 text-xs">Manage your partner organizations</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openFormModal()}
                className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Organization
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-5 mb-6 border border-slate-100">
          <div className="flex justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none transition-all"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <button
                onClick={exportToExcel}
                className="px-4 py-2.5 flex gap-2 items-center border bg-sky-900 text-sky-50 outline-0 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none appearance-none"
              >
                <FiDownload className="" />
                Export to Excel
              </button>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border bg-sky-900 text-sky-50 outline-0 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none appearance-none"
              style={{
                backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmQwZGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5rem'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sky-900 to-sky-900 text-white sticky top-0 ">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">User Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrganizations.map((org, index) => {
                  const userCount = initialUsers.filter(user => user.orgId === org.id).length;
                  return (
                    <tr
                      key={org.id}
                      className={`transition-all duration-200 hover:bg-sky-50/50 ${
                        index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-800 font-medium">{org.name}</td>
                      <td className="px-6 py-4 text-slate-600">{userCount}</td>
                      <td className="px-6 py-4 text-slate-600">{org.subscriptionDiscount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          org.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{org.createdDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openDetailsModal(org)}
                            className="text-sky-900 hover:text-sky-950 transform hover:scale-105 transition-transform"
                            data-tooltip-id="view-tooltip"
                            data-tooltip-content="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openFormModal(org)}
                            className="text-sky-900 hover:text-sky-950 transform hover:scale-105 transition-transform"
                            data-tooltip-id="edit-tooltip"
                            data-tooltip-content="Edit Organization"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(org.id)}
                            className="text-red-600 hover:text-red-800 transform hover:scale-105 transition-transform"
                            data-tooltip-id="delete-tooltip"
                            data-tooltip-content="Delete Organization"
                          >
                            <FiTrash className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openUsersModal(org)}
                            className="text-sky-900 hover:text-sky-950 transform hover:scale-105 transition-transform"
                            data-tooltip-id="manage-tooltip"
                            data-tooltip-content="Manage Users"
                          >
                            <FiUsers className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrganizations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mt-6 text-center border border-slate-100">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-800">No organizations found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filter, or add a new organization.</p>
          </div>
        )}

        {/* Modals */}
        {showFormModal && (
          <OrganizationForm
            organization={editingOrg}
            onSave={handleSave}
            onCancel={() => {
              setShowFormModal(false);
              setEditingOrg(null);
            }}
          />
        )}

        {showDetailsModal && selectedOrg && (
          <OrganizationDetailsPopup
            organization={selectedOrg}
            onClose={() => setShowDetailsModal(false)}
          />
        )}

        {showUsersModal && selectedOrg && (
          <ManageUsersPopup
            organization={selectedOrg}
            onClose={() => setShowUsersModal(false)}
          />
        )}

        <Tooltip id="view-tooltip" />
        <Tooltip id="edit-tooltip" />
        <Tooltip id="delete-tooltip" />
        <Tooltip id="manage-tooltip" />
      </div>
    </div>
  );
};

export default OrganizationsListScreen;