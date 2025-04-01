import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { BsArrowBarRight } from "react-icons/bs";




const MenuItem = ({ item, isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon; 

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  // Single Link Item
  if (item.type === "link") {
    return (
      <li>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center py-3 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group ${
              isActive ? " text-sky-900" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          
          {Icon && (
            <span className="icon-container group-hover:animate-pop">
              <Icon size="1.2rem" className="transition-all duration-200" />
            </span>
          )}
          {isSidebarOpen && <span className="ml-3 font-medium">{item.title}</span>}
        </NavLink>
      </li>
    );
  }

  // Submenu Item
  if (item.type === "sub") {
    return (
      <li>
        <button
          onClick={toggleSubmenu}
          className={`flex items-center justify-between w-full text-sm p-2  py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-gray-900 ${
            isOpen ? "text-sky-700 bg-sky-50" : "text-sky-900"
          }`}
        >
          <div className="flex items-center">
            {Icon && (
              <span className="icon-container group-hover:animate-pop">
                <Icon size="1.2rem" className="transition-all duration-200" />
              </span>
            )}
            {isSidebarOpen && <span className="ml-3 font-sm font-medium">{item.title}</span>}
          </div>
          {isSidebarOpen && (
            <span>
              {isOpen ? (
                <FiChevronDown className="ml-2" size={16} />
              ) : (
                <FiChevronRight className="ml-2" size={16} />
              )}
            </span>
          )}
        </button>

        {isOpen && isSidebarOpen && (
          <ul className="ml-8 mt-1 space-y-1">
            {item.children.map((child, childIndex) => (
              <li key={childIndex}>
                <NavLink
                  to={child.path}
                  className={({ isActive }) =>
                    `block px-0 text-sm py-2 flex gap-2 items-center rounded-lg transition-all duration-200 hover:bg-sky-50 hover:text-sky-600 ${
                      isActive ? "text-sky-900" : "text-gray-700"
                    }`
                  }
                >
                  <span><BsArrowBarRight   className="text-sky-900"/>
                  </span>
                 <span> {child.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return null;
};

export default MenuItem;