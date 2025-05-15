import React, { useEffect, useRef, useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const ProfileHandle = () => {
    navigate('/profile-details');
  }
  

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
      className="absolute right-0 mt-2 pt-2 w-60 bg-gradient-to-t  from-[#012036] to-[#146ec7] rounded-lg shadow-2xl z-50"
    >
      {/* <div className="flex justify-end p-2">
        <button className="text-gray-500 hover:bg-gray-100 rounded-lg p-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 3">
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
          </svg>
        </button>
      </div> */}
      <div className="flex flex-col items-center px-4 pb-4">
        <FaUserCircle className="w-24 h-24 text-gray-50" />
        <h5 className="text-xl font-medium  text-white mt-2">Tech Innovators Inc</h5>
        {/* <span className="text-sm text-gray-200">Administrator</span> */}
        <div className="flex mt-4 space-x-2">
          <button

          onClick={ProfileHandle}organizations-list-screen
          
          className="px-4 py-2 text-sm font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-900">
            Profile
          </button>
          <button 
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-sky-700 hover:text-white"
        >
          Sign out
        </button>
        </div>
        {/* <div className=" w-full mt-3 bg-sky-700 rounded-lg over:bg-sky-900">
        <Link to="/company-management-table" className="block border--2 border-sky-900 px-4 py-2  text-center   text-sm text-sky-50 h hover:border-sky-900 hover:text-white">All Companies</Link>
      </div> */}
      </div>
     
    </div>
  );
};

export default ProfileDropdown;