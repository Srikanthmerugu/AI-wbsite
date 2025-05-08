import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiEye, FiEdit, FiUsers, FiLogOut } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

// Mock Data
const userProfile = {
  id: 1,
  name: "Tech Innovators Inc",
  email: "contact@TechInnovators.gmail.com",
  role: "Admin",
  status: "Active",
  phone: "+1 (555) 123-4567",
  address: "123 Innovation Blvd, Silicon Valley, CA 94025, USA",
  joinedDate: "2024-01-15",
  lastLogin: "2025-05-07 14:30"
};

const initialOrganizations = [
  { id: 1, name: "Tech Innovators Inc.", email: "contact@techinnovators.com", type: "Technology", status: "Active", createdDate: "2024-01-15" }
];

const activityLog = [
  { id: 1, action: "Logged in", timestamp: "2025-05-07 14:30" },
  { id: 2, action: "Updated profile", timestamp: "2025-05-06 09:15" },
  { id: 3, action: "Password reset", timestamp: "2025-05-05 16:45" }
];

// Edit Profile Form Component
const EditProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    user || { name: "", email: "", role: "Staff", status: "Active", phone: "", address: "", joinedDate: "" }
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
    <div id="edit-profile-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 h-[100%] mb-10 overflow-scroll left-0 z-50 flex justify-center items-center w-full md:inset-0 bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">✏️ Edit Profile</h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onCancel}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-5 ">
              {['name', 'email', 'phone', 'address'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-600 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 focus:border-sky-900 outline-none transition-all"
                    required={field === 'name' || field === 'email'}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manage Organizations Component
const ManageOrganizationsPopup = ({ organizations, onClose }) => {
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
    <div id="manage-orgs-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full bg-[#1312127c] bg-opacity-20">
      <div ref={modalRef} className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-900 to-sky-900 rounded-t-2xl" />
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">Manage Organizations</h3>
            <button type="button" className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onClose}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.map(org => (
                    <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-medium">{org.name}</td>
                      <td className="px-6 py-4 text-slate-600">{org.email}</td>
                      <td className="px-6 py-4 text-slate-600">{org.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          org.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{org.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
};

// Main Component
const ProfileDetailsScreen = () => {
  const [profile, setProfile] = useState(userProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrgsModal, setShowOrgsModal] = useState(false);

  
  const navigate = useNavigate();

  const handleUsers = () => {
    navigate("/user-management");
  }


  const handleSave = (formData) => {
    setProfile({ ...profile, ...formData });
    setShowEditModal(false);
  };

  const handleResetPassword = () => {
    alert("Password reset initiated");
  };

  const handleLogout = () => {
    alert("Logged out");
  };

  const exportToExcel = () => {
    const data = [{
      Name: profile.name,
      Email: profile.email,
      Role: profile.role,
      Status: profile.status,
      Phone: profile.phone,
      Address: profile.address,
      JoinedDate: profile.joinedDate,
      LastLogin: profile.lastLogin,
      Organizations: initialOrganizations.map(org => (
        `Name: ${org.name}, Email: ${org.email}, Type: ${org.type}, Status: ${org.status}`
      )).join('\n')
    }];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profile");
    XLSX.writeFile(workbook, "profile_details.xlsx");
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white">Profile Details</h1>
              <p className="text-sky-100 text-xs">Manage your account settings</p>
            </div>
            <div className="flex space-x-2">
            
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-2 text-sm flex items-center  bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
                data-tooltip-id="edit-tooltip"
                data-tooltip-content="Edit Profile"
              >
                <FiEdit className="inline-block mr-2" /> Edit Profile
              </button>
              <button
                onClick={handleResetPassword}
                className="px-3 py-2 text-sm flex items-center bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
                data-tooltip-id="reset-tooltip"
                data-tooltip-content="Reset Password"
               
              >
                <TbLockPassword className="inline-block mr-2" /> Reset Password
              </button>
              {/* <button
                onClick={exportToExcel}
                className="px-3 py-2 text-sm  flex gap-2 items-center border bg-sky-900 text-sky-50 outline-0 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none appearance-none"
              >
                <FiDownload className="" />
                Export Profile
              </button> */}
              {/* <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm  bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                data-tooltip-id="logout-tooltip"
                data-tooltip-content="Log Out"
              >
                <FiLogOut className="inline-block mr-2" /> Log Out
              </button> */}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl mt-10 shadow-lg border border-slate-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
                <div>
                  <span className="font-medium">Name: </span>{profile.name}
                </div>
                <div>
                  <span className="font-medium">Email: </span>{profile.email}
                </div>
                <div>
                  <span className="font-medium">Phone: </span>{profile.phone}
                </div>
                <div>
                  <span className="font-medium">Address: </span>{profile.address}
                </div>
                <div>
                  <span className="font-medium">Role: </span>{profile.role}
                </div>
                <div>
                  <span className="font-medium">Status: </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {profile.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Joined: </span>{profile.joinedDate}
                </div>
                <div>
                  <span className="font-medium">Last Login: </span>{profile.lastLogin}
                </div>
              </div>
            </div>
            {/* <div className="flex gap-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
                data-tooltip-id="edit-tooltip"
                data-tooltip-content="Edit Profile"
              >
                <FiEdit className="inline-block mr-2" /> Edit Profile
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
                data-tooltip-id="reset-tooltip"
                data-tooltip-content="Reset Password"
              >
                <TbLockPassword className="inline-block mr-2" /> Reset Password
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                data-tooltip-id="logout-tooltip"
                data-tooltip-content="Log Out"
              >
                <FiLogOut className="inline-block mr-2" /> Log Out
              </button>
            </div> */}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Users</h2>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm text-slate-600 mb-2">Total users (4)</p>
              <button
                // onClick={() => setShowOrgsModal(true)}
                onClick={handleUsers}
                
                className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors w-full"
                data-tooltip-id="manage-tooltip"
                data-tooltip-content="Manage Users"
              >
                <FiUsers className="inline-block mr-2" /> View Users
              </button>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl mt-6 shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityLog.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-800 font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showEditModal && (
          <EditProfileForm
            user={profile}
            onSave={handleSave}
            onCancel={() => setShowEditModal(false)}
          />
        )}

        {showOrgsModal && (
          <ManageOrganizationsPopup
            organizations={initialOrganizations}
            onClose={() => setShowOrgsModal(false)}
          />
        )}

        <Tooltip id="edit-tooltip" />
        <Tooltip id="reset-tooltip" />
        <Tooltip id="manage-tooltip" />
        <Tooltip id="logout-tooltip" />
      </div>
    </div>
  );
};

export default ProfileDetailsScreen;