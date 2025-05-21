import React, { useEffect, useRef, useState } from 'react';

const AIDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const menuItems = {
    title: "AI Insights & Alerts",
    icon: { name: "FiBell" },
    path: "/smart-financial-alerts",
    type: "sub",
    active: false,
    children: [
      { path: "/smart-financial-alerts", title: "Smart Financial Alerts", type: "link", icon: { name: "FiFile" } },
      { 
        path: "/aI-financial-recommendations", 
        title: "AI-Powered Financial Recommendations", 
        type: "sub", 
        icon: { name: "FiFile" },
        children: [
          { path: "/investment-recommendations", title: "Investment Recommendations", type: "link" },
          { path: "/savings-optimization", title: "Savings Optimization", type: "link" },
          { path: "/budgeting-strategies", title: "Budgeting Strategies", type: "link" }
        ]
      },
      { 
        path: "/PredictiveRiskManagement", 
        title: "Predictive Risk Management", 
        type: "sub", 
        icon: { name: "FiFile" },
        children: [
          { path: "/risk-assessment", title: "Risk Assessment", type: "link" },
          { path: "/mitigation-strategies", title: "Mitigation Strategies", type: "link" }
        ]
      },
      { 
        path: "/ForecastAccuracyMonitoring", 
        title: "AI-Driven Forecast Accuracy", 
        type: "sub", 
        icon: { name: "FiFile" },
        children: [
          { path: "/revenue-forecasting", title: "Revenue Forecasting", type: "link" },
          { path: "/expense-prediction", title: "Expense Prediction", type: "link" },
          { path: "/cashflow-analysis", title: "Cashflow Analysis", type: "link" }
        ]
      },
      { 
        path: "/BenchmarkingPeerComparisons", 
        title: "AI-Powered Benchmarking", 
        type: "sub", 
        icon: { name: "FiFile" },
        children: [
          { path: "/industry-comparisons", title: "Industry Comparisons", type: "link" },
          { path: "/performance-metrics", title: "Performance Metrics", type: "link" },
          { path: "/competitive-analysis", title: "Competitive Analysis", type: "link" }
        ]
      },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [isOpen, onClose, hoverTimeout]);

  const handleMouseEnter = (index) => {
    // Clear any pending timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    // Set new timeout to open submenu after a small delay
    setHoverTimeout(setTimeout(() => {
      setOpenSubmenu(index);
    }, 200));
  };

  const handleMouseLeave = () => {
    // Clear any pending timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    // Close submenu after a small delay (to allow moving to submenu)
    setHoverTimeout(setTimeout(() => {
      setOpenSubmenu(null);
    }, 200));
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-white  rounded-lg shadow-2xl z-50 overflow-visible"
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sky-800 font-semibold flex items-center">
          <span className="mr-2">{menuItems.title}</span>
        </h3>
      </div>
      
      <div className="py-2">
        {menuItems.children.map((item, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => item.type === 'sub' ? handleMouseEnter(index) : null}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className={`flex justify-between items-center px-4 py-3 text-sky-800 hover:text-sky-50 hover:bg-sky-400 cursor-pointer transition-colors ${openSubmenu === index ? 'bg-sky-200' : ''}`}
            >
              <a 
                href={item.type === 'link' ? item.path : '#'}
                className="flex-1"
              >
                {item.title}
              </a>
              {item.type === 'sub' && (
                <svg 
                  className={`w-4 h-4 transform transition-transform ${openSubmenu === index ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
            
            {item.type === 'sub' && openSubmenu === index && (
              <div 
                className="absolute left-full top-0 ml-1 w-64 bg-white border-b-4 text-sky-800 border-sky-900 rounded-r-lg shadow-lg z-50 overflow-hidden"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {item.children.map((subItem, subIndex) => (
                  <a 
                    key={subIndex} 
                    href={subItem.path}
                    className="block px-4 py-3 text-sky-800 hover:text-blue-800 transition-colors"
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIDropdown;