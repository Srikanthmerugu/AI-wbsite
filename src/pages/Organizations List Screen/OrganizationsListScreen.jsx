import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiUsers, FiSettings, FiLogOut, FiEdit, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const ProfileDetailsScreen = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigateToUsers = () => navigate('/user-management');
  // const handleEditProfile = () => navigate('/edit-profile');
  const handleChangePassword = () => navigate('/forgot-password');

  // Format the joined date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if user is admin and in IT department
  const isAdminIT = currentUser?.user_role === 'admin' && 
                   currentUser?.user_department === 'it';

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-bold text-white">Profile Details</h1>
                <p className="text-sky-100 text-xs">Manage your account settings</p>
              </div>
            </div>
          </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#004a80] to-[#82bfee] h-34"></div>
              <div className="px-6 pb-6 pt-2 relative">
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {currentUser?.user_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentUser?.user_name || 'N/A'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {currentUser?.user_role || 'N/A'} • {currentUser?.company_name || 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {currentUser?.user_email || 'N/A'}
                  </p>
                </div>

                <div className="mt-6 flex flex-col space-y-3">
                  {/* <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit className="mr-2" /> Edit Profile
                  </button> */}
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FiLock className="mr-2" /> Change Password
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-blue-600">Projects</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-green-600">Tasks</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-purple-600">Teams</p>
                  <p className="text-xl font-bold">3</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-yellow-600">Active</p>
                  <p className="text-xl font-bold">
                    {currentUser?.user_is_active ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-2 px-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentUser?.user_is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {currentUser?.user_is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentUser?.user_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentUser?.user_email || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentUser?.company_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentUser?.user_role || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentUser?.user_department || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(currentUser?.Joined_on)}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Section */}
            {isAdminIT && (
              <div className="bg-white shadow rounded-lg p-2 px-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleNavigateToUsers}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <FiUsers className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">User Management</h3>
                        <p className="text-sm text-gray-500">Manage all system users</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <button
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg mr-4">
                        <FiSettings className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">System Settings</h3>
                        <p className="text-sm text-gray-500">Configure application</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {/* <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Logged in to the system</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Tooltip id="profile-tooltip" />
    </div>
  );
};

export default ProfileDetailsScreen;