import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { RiMenuFold2Fill } from "react-icons/ri";
import { CustomTreeMenu } from "./CustomTreeMenu/CustomTreeMenu";
import { mainLogo, fevicon } from "../../assets/Assets";
import { FaLayerGroup } from "react-icons/fa6";


// Import React Icons for menu items
import { 
  FiHome, 
  FiUser, 
  FiClipboard, 
  FiGrid, 
  FiBarChart2, 
  FiBell, 
  FiUsers, 
  // FaLayerGroup,
  FiSettings, 
  FiHelpCircle,
  FiMessageSquare,
  FiFile
} from "react-icons/fi";

const iconComponents = {
  FiHome,
  FiUser,
  FiClipboard,
  FiGrid,
  FiBarChart2,
  FiBell,
  FiUsers,
  FaLayerGroup,
  FiSettings,
  FiHelpCircle,
  FiMessageSquare,
  FiFile
};

const MENUITEMS = [
  {
    menutitle: "",
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "DASHBOARD",
        icon: { name: "FiHome" },
        path: '/financial-overview',
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          { 
            path: '/financial-overview', 
            type: "link", 
            title: "Financial Overview",
            icon: { name: "FiFile" },
            children: [
              { path: '#', type: "link", title: "Revenue", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Expenses", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Gross Profit", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "EBITDA", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Cashflow", icon: { name: "FiFile" } },
            ],
          },
          { 
            path: '/key-financial', 
            type: "link", 
            title: "Key Financial KPIs",
            icon: { name: "FiFile" },
            children: [
              { path: '#', type: "link", title: "Revenue per Employee", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Marketing ROI", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Cost per Lead", icon: { name: "FiFile" } },
              // { path: '#', type: "link", title: "EBITDA", icon: { name: "FiFile" } },
              { path: '#', type: "link", title: "Profitability by Product/Region", icon: { name: "FiFile" } },
            ],
          },
        ],
      },
      {
        title: "Financial Reports",
        icon: { name: "FiUser" }, 
        path: '/financial-core-reports',
        type: "sub",
        bookmark: true,
        active: false,
        children: [
          { path: '/financial-core-reports', type: "link", title: "Core & Custom Reports", icon: { name: "FiFile" } },
        ],
      },
      {
        title: "Forecasting & Scenario",
        icon: { name: "FiClipboard" }, 
        type: "sub",
        active: false,
        children: [
          { path: '/revenueForecasting', title: "Revenue Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: '/expenseForecasting', title: "Expense Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: '/cashFlow-projections', title: "Cash Flow Projections", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Headcount & Payroll Forecast", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "CAPEX Forecast", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Debt & Interest Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Scenario Modeling", type: "link", icon: { name: "FiFile" } },
        ],
      },
      {
        title: "Budgeting",
        icon: { name: "FiGrid" }, 
        type: "sub",
        active: false,
        children: [
          { path: '#', title: "Operational Budgeting", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Revenue-Based", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Capital Expenditure(CAPEX)", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Workforce Payroll Budgeting", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Zero-Based Budgeting (ZBB)", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Rolling & Flexible Budgeting", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Scenario Modeling & If Analysis for Budgeting", type: "link", icon: { name: "FiFile" } },
        ],
      },
      {
        title: "Performance Analytics",
        icon: { name: "FiBarChart2" }, 
        type: "sub",
        active: false,
        children: [
          { path: '#', title: "Sales and Marketing Analytics", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "HR & Workforce Analytics", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Finance & Accounting Analytics", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Supply Chain & Procurement Analytics", type: "link", icon: { name: "FiFile" } },
        ],
      },
      {
        title: "AI Insights & Alerts",
        icon: { name: "FiBell" },
        type: "sub",
        active: false,
        children: [
          { path: '/smart-financial-alerts', title: "Smart Financial Alerts", type: "link", icon: { name: "FiFile" } },
          { path: '/aI-financial-recommendations', title: "AI-Powered Financial Recommendations", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "Predictive Risk Management", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "AI-Driven Forecast Accuracy Monitoring", type: "link", icon: { name: "FiFile" } },
          { path: '#', title: "AI-Powered Benchmarking & Peer Comparisons", type: "link", icon: { name: "FiFile" } },
        ],
      },
      {
        path: '/user-management',
        icon: { name: "FiUsers" }, 
        title: "User Management",
        type: "link",
      },
      {
        path: '/company-management-table',
        icon: { name: "FaLayerGroup" }, 
        title: "All Companies Management",
        type: "link",
      },
      {
        path: '#',
        icon: { name: "FiSettings" }, 
        title: "Settings & Customization",
        type: "link",
      },
      {
        path: '/help-Support',
        icon: { name: "FiHelpCircle" }, 
        title: "Help & Support",
        type: "link",
      },
      {
        path: '/ask-ai',
        icon: { name: "FiMessageSquare" },
        title: "Ask AI",
        type: "link",
      },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-20"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {isOpen ? (
          <div className="flex items-center">
            <img src={mainLogo} alt="FinSightAI" className="h-13" />
          </div>
        ) : (
          <img src={fevicon} alt="FinSightAI" className="h-8 mx-auto" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
        >
          {isOpen ? (
            <RiMenuFold2Fill className="text-sky-800" size={20} />
          ) : (
            <FiChevronRight className="text-gray-600" size={20} />
          )}
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto">
        {isOpen ? (
          <CustomTreeMenu items={MENUITEMS[0].Items} />
        ) : (
          <div className="flex flex-col items-center py-4 space-y-4">
            {MENUITEMS[0].Items.map((item, index) => (
              <NavLink
                key={index}
                to={item.path || '#'}
                className={({ isActive }) =>
                  `p-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                title={item.title}
              >
                {item.icon && React.createElement(iconComponents[item.icon.name], { size: 20 })}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;