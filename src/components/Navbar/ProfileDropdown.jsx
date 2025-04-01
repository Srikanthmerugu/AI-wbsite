import React, { useEffect, useRef, useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-sm z-50"
    >
      <div className="flex justify-end p-2">
        <button className="text-gray-500 hover:bg-gray-100 rounded-lg p-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 3">
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-center px-4 pb-4">
        <FaUserCircle className="w-24 h-24 text-gray-400" />
        <h5 className="text-xl font-medium text-gray-900 mt-2">Admin User</h5>
        <span className="text-sm text-gray-500">Administrator</span>
        <div className="flex mt-4 space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-900">
            Profile
          </button>
          <button 
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
        >
          Sign out
        </button>
        </div>
      </div>
      {/* <div className="border-t  border-gray-200">
        <Link to="/login" className="block border-2 px-4 py-2 rounded-2xl text-center   text-sm text-sky-200 bg-sky-900 hover:bg-gray-100 hover:border-sky-900 hover:text-sky-900">Sign out</Link>
      </div> */}
    </div>
  );
};

export default ProfileDropdown;