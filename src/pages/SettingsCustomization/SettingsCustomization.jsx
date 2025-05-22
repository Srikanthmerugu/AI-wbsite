import React, { useState } from 'react';
import { 
  FiSettings, 
  FiLayout, 
  FiActivity, 
  FiBell, 
  FiDatabase, 
  FiLock,
  FiCheck,
  FiPlus,
  FiEdit2
} from 'react-icons/fi';

const SettingsCustomization = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard & UI Customization',
      description: 'Personalized User Experience',
      icon: <FiLayout className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'reports',
      title: 'Report & Workflow Automation',
      description: 'Effortless Financial Management',
      icon: <FiActivity className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'alerts',
      title: 'Alerts & Notification Preferences',
      description: 'Stay Informed & Proactive',
      icon: <FiBell className="w-5 h-5 text-green-500" />
    },
    {
      id: 'system',
      title: 'System & Data Preferences',
      description: 'Platform Configuration & Compliance',
      icon: <FiDatabase className="w-5 h-5 text-purple-500" />
    },
    {
      id: 'roles',
      title: 'Role-Based Feature Access',
      description: 'Tailored Access Control for Teams',
      icon: <FiLock className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <div className="flex h-full bg-gray-50 rounded-xl overflow-scroll shadow-lg">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center mb-8">
          <FiSettings className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Settings & Customization</h2>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="mr-3">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 h-full">
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard & UI Customization</h3>
              <p className="text-gray-600 mb-6">Customize your dashboard layout, color scheme, and display preferences.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Theme Settings</h4>
                  <div className="flex space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-green-600 cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer"></div>
                  </div>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiCheck className="mr-1" /> Apply Theme
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Layout Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                      <span className="ml-2 text-gray-700">Compact view</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                      <span className="ml-2 text-gray-700">Show recent activities</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Report & Workflow Automation</h3>
              <p className="text-gray-600 mb-6">Configure automated report generation and financial workflows.</p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Scheduled Reports</h4>
                  <p className="text-sm text-gray-500 mb-3">Set up automatic report generation and distribution.</p>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiPlus className="mr-1" /> Add New Schedule
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Workflow Rules</h4>
                  <p className="text-sm text-gray-500 mb-3">Create rules to automate financial processes.</p>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiPlus className="mr-1" /> Create New Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Alerts & Notification Preferences</h3>
              <p className="text-gray-600 mb-6">Manage how and when you receive important financial alerts.</p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Notification Channels</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" checked />
                      <span className="ml-2 text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" checked />
                      <span className="ml-2 text-gray-700">In-app notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                      <span className="ml-2 text-gray-700">Mobile push notifications</span>
                    </label>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Alert Thresholds</h4>
                  <p className="text-sm text-gray-500 mb-3">Set thresholds for financial alerts and warnings.</p>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiEdit2 className="mr-1" /> Configure Thresholds
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System & Data Preferences</h3>
              <p className="text-gray-600 mb-6">Configure platform settings and data management options.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Data Backup</h4>
                  <p className="text-sm text-gray-500 mb-3">Configure automatic data backup settings.</p>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiSettings className="mr-1" /> Backup Settings
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Data Export</h4>
                  <p className="text-sm text-gray-500 mb-3">Set up data export formats and schedules.</p>
                  <button className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                    <FiDatabase className="mr-1" /> Export Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Role-Based Feature Access</h3>
              <p className="text-gray-600 mb-6">Manage team permissions and feature access controls.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard Access</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Administrator</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Finance Manager</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Full</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Department Head</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Department Only</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="mt-4 flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">
                <FiEdit2 className="mr-1" /> Edit Permissions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsCustomization;