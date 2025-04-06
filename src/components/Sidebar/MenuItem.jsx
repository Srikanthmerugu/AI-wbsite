import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { BsArrowBarRight } from "react-icons/bs";

const MenuItem = ({ item, isSidebarOpen, level = 0, isLastChild = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  // Single Link Item
  if (item.type === "link" && !hasChildren) {
    return (
      <li className={`relative pl-${level * 4}`}>
        {/* Vertical connector line */}
        {level > 0 && (
          <div className={`absolute left-5 top-0 h-full w-px bg-gray-300 ${isLastChild ? 'h-1/2' : 'h-full'}`}></div>
        )}
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center py-2 pl-8 text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group relative ${
              isActive ? "text-sky-900 bg-blue-50" : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          {/* Horizontal connector line */}
          {level > 0 && (
            <div className="absolute left-0 top-1/2 h-px w-3 bg-gray-300 transform -translate-y-1/2"></div>
          )}
          {level > 0 && <BsArrowBarRight className="absolute left-3 text-gray-400 text-xs" />}
          {Icon && level === 0 && (
            <span className="icon-container group-hover:animate-pop mr-2">
              <Icon size="1.2rem" className="transition-all duration-200" />
            </span>
          )}
          <span className="font-medium">{item.title}</span>
        </NavLink>
      </li>
    );
  }

  // Submenu Item
  return (
    <li className={`relative pl-${level * 4}`}>
      {/* Vertical connector line for parent */}
      {level > 0 && (
        <div className={`absolute left-5 top-0 h-full w-px bg-gray-300 ${isLastChild ? 'h-1/2' : 'h-full'}`}></div>
      )}

      <div
        onClick={toggleSubmenu}
        className={`flex items-center justify-between w-full py-2 pl-8 text-sm transition-all duration-200 hover:bg-blue-50 hover:text-gray-900 cursor-pointer relative ${
          isOpen ? "text-sky-700 bg-sky-50" : "text-sky-900"
        }`}
      >
        {/* Horizontal connector line */}
        {level > 0 && (
          <div className="absolute left-0 top-1/2 h-px w-3 bg-gray-300 transform -translate-y-1/2"></div>
        )}
        {level > 0 && <BsArrowBarRight className="absolute left-3 text-gray-400 text-xs" />}
        
        <div className="flex items-center">
          {Icon && level === 0 && (
            <span className="icon-container group-hover:animate-pop mr-2">
              <Icon size="1.2rem" className="transition-all duration-200" />
            </span>
          )}
          <span className="font-medium">{item.title}</span>
          {item.badgetxt && (
            <span className={`ml-2 ${item.badge}`}>{item.badgetxt}</span>
          )}
        </div>
        
        {hasChildren && (
          <span>
            {isOpen ? (
              <FiChevronDown className="ml-2" size={16} />
            ) : (
              <FiChevronRight className="ml-2" size={16} />
            )}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className={`relative ${level > 0 ? 'pl-4' : 'pl-8'}`}>
          {item.children.map((child, childIndex) => (
            <MenuItem
              key={childIndex}
              item={child}
              isSidebarOpen={isSidebarOpen}
              level={level + 1}
              isLastChild={childIndex === item.children.length - 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;