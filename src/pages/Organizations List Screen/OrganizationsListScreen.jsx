import React, { useState, useEffect, useRef, useContext } from 'react';
import { FiDownload, FiEye, FiEdit, FiUsers, FiLogOut } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

// Edit Profile Form Component (keep this the same as your original)
const EditProfileForm = ({ user, onSave, onCancel }) => {
  // ... keep your existing EditProfileForm implementation
};

// Manage Organizations Component (keep this the same as your original)
const ManageOrganizationsPopup = ({ organizations, onClose }) => {
  // ... keep your existing ManageOrganizationsPopup implementation
};

// Main Component
const ProfileDetailsScreen = () => {
  const { userData, logout } = useAuth();
  const [profile, setProfile] = useState({
    id: 1,
    name: "",
    email: "",
    role: "",
    status: "Active",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Blvd, Silicon Valley, CA 94025, USA",
    joinedDate: "",
    lastLogin: "2025-05-07 14:30"
  });
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrgsModal, setShowOrgsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setProfile({
        ...profile,
        name: userData.name || "N/A",
        email: userData.email || "N/A",
        role: userData.role || "N/A",
        joinedDate: userData.joinedDate ? new Date(userData.joinedDate).toLocaleDateString() : "N/A",
        status: userData.isActive ? "Active" : "Inactive"
      });
    }
  }, [userData]);

  const handleUsers = () => {
    navigate("/user-management");
  }

  const handleSave = (formData) => {
    setProfile({ ...profile, ...formData });
    setShowEditModal(false);
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const handleLogout = () => {
    logout();
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
      Company: userData?.companyName || "N/A",
      Department: userData?.department || "N/A"
    }];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profile");
    XLSX.writeFile(workbook, "profile_details.xlsx");
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-slate-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-2 text-sm flex items-center bg-sky-900 text-white rounded-lg hover:bg-sky-950 transition-colors"
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
              <button
                onClick={exportToExcel}
                className="px-3 py-2 text-sm flex gap-2 items-center border bg-sky-900 text-sky-50 outline-0 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-900 outline-none appearance-none"
              >
                <FiDownload className="" />
                Export Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                data-tooltip-id="logout-tooltip"
                data-tooltip-content="Log Out"
              >
                <FiLogOut className="inline-block mr-2" /> Log Out
              </button>
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
                  <span className="font-medium">Company: </span>{userData.companyName || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Department: </span>{userData.department || "N/A"}
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
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mx-4 text-slate-800 mb-4">Users</h2>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm text-slate-600 mb-2">Manage the Users </p>
              <button
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
            organizations={[]}
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