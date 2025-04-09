import React, { useState } from 'react';
import { FiSearch, FiBell, FiMessageSquare, FiMenu } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import NotificationToast from './NotificationToast';
import MessageNotification from './MessageNotification';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  
  // Sample data
  const notifications = [
    { id: 1, type: 'success', message: 'Item moved successfully' },
    { id: 2, type: 'error', message: 'Item has been deleted' },
    { id: 3, type: 'warning', message: 'Low inventory warning' }
  ];

  const messages = [
    { id: 1, sender: 'John Doe', message: 'Please review the report', time: '2 min ago' },
    { id: 2, sender: 'Jane Smith', message: 'Meeting at 3pm', time: '1 hour ago' }
  ];

  return (
    <header className="bg-white shadow-sm z-40">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side - Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <FiMenu className="text-gray-600 hover:text-gray-900" size={20} />
        </button>
        
        {/* Search Bar */} 
        <div> <h1 className="text-2xl  mx-5 font-bold text-sky-900">Welcome,Shashi Konduru!</h1></div>
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>
        
        {/* Right Side - Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FiSearch className="text-gray-600 hover:text-gray-900 md:hidden" size={20} />
          </button>
          
          {/* Messages Button */}
          <div className="relative">
            <button 
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FiMessageSquare className="text-gray-600 hover:text-gray-900" size={20} />
              {messages.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </button>
            
            {isMessagesOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Messages ({messages.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {messages.map(msg => (
                    <MessageNotification
                      key={msg.id}
                      sender={msg.sender}
                      message={msg.message}
                      time={msg.time}
                      onClose={() => setIsMessagesOpen(false)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FiBell className="text-gray-600 hover:text-gray-900" size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Notifications ({notifications.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <NotificationToast
                      key={notification.id}
                      type={notification.type}
                      message={notification.message}
                      onClose={() => setIsNotificationsOpen(false)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Button */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex  p-2 bg-gradient-to-r from-[#004a80] to-[#9ccdf3]  rounded-sm items-center space-x-2 focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >  
            <span className="hidden capitalize md:inline-block text-sm bord   font-medium text-white">INSIENT CONSULTING</span>

              <FaUserCircle className="text-sky-800 hover:text-sky-200 text-2xl" />
            </button>
            
            <ProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;