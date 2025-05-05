import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './CustomTreeMenu.css'
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiHome,
  FiUser,
  FiClipboard,
  FiGrid,
  FiBarChart2,
  FiBell,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare,
  FiFolder,
  FiFile
} from 'react-icons/fi';

const iconComponents = {
  FiHome,
  FiUser,
  FiClipboard,
  FiGrid,
  FiBarChart2,
  FiBell,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare
};

const TreeItem = ({ item, level = 0, isLast = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = iconComponents[item.icon?.name] || (hasChildren ? FiFolder : FiFile);

  return (
    <div className={`tree-item level-${level}`}>
      <div 
        className={`tree-item-header ${hasChildren ? 'has-children' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {/* Vertical connector line */}
        {level > 0 && (
          <div className={`vertical-connector ${isLast ? 'half-height' : ''}`} />
        )}
        
        {/* Horizontal connector line */}
        {level > 0 && <div className="horizontal-connector" />}
        
        {/* Chevron icon for expandable items */}
        {hasChildren ? (
          isOpen ? (
            <FiChevronDown className="tree-chevron" />
          ) : (
            <FiChevronRight className="tree-chevron" />
          )
        ) : (
          <span className="tree-chevron-spacer" />
        )}
        
        {/* Item icon */}
        <Icon className="tree-icon" />
        
        {/* Item label/link */}
        {item.path ? (
          <NavLink 
            to={item.path} 
            className={({ isActive }) => `tree-link ${isActive ? 'active' : ''}`}
            end
          >
            {item.title}
          </NavLink>
        ) : (
          <span className="tree-label">{item.title}</span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="tree-children">
          {item.children.map((child, index) => (
            <TreeItem 
              key={index} 
              item={child} 
              level={level + 1}
              isLast={index === item.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomTreeMenu = ({ items }) => {
  return (
    <div className="custom-tree-menu">
      {items.map((item, index) => (
        <TreeItem 
          key={index} 
          item={item} 
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};