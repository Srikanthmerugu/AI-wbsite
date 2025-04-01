import React from "react";
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import MenuItem from "./MenuItem";
import "./styles.css";
import { MdMenuOpen } from "react-icons/md";
import { RiMenuFold2Fill } from "react-icons/ri";



// Import React Icons for menu items
import { FiHome, FiUser, FiClipboard, FiGrid, FiBarChart2, FiBell, FiUsers, FiSettings, FiHelpCircle } from "react-icons/fi";
import { fevicon, mainLogo } from "../../assets/Assets";

const MENUITEMS = [
  
  {
    menutitle: "",
    menucontent: "Ready to use Apps",
    Items: [
      // {
      //   path: '/financial-overview',
      //   icon: FiMessageSquare
      //   , 
      //   title: "DASHBOARD",
      //   type: "link",
      // },

    
      {
        title: "DASHBOARD",
        icon: FiHome,
        path: '/financial-overview',
        type: "sub" || "link",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          { path: '/financial-overview', type: "link", title: "Financial Overview" },
          { path:'/key-financial' , type: "link", title: "Key Financial KPIs" },
        ],
      },
      {
        title: "Financial Reports",
        icon: FiUser, 
        path: '/financial-core-reports',
        type: "sub",
        bookmark: true,
        active: false,
        children: [
          { path: '/financial-core-reports', type: "link", title: "Core  & Custom Reports" },
        //   { path: '#', type: "link", title: "Custom Reports" },
        ],
      },
      {
        title: "Forecasting & Scenario ",
        icon: FiClipboard, 
        type: "sub",
        active: false,
        children: [
          { path: '/revenueForecasting', title: "Revenue Forecasting", type: "link" },
          { path: '/expenseForecasting', title: "Expense Forecasting", type: "link" },
          { path:'/cashFlow-projections', title: "Cash Flow Projections", type: "link" },
          { path: '#', title: "Headcount & Payroll Forecast", type: "link" },
          { path:'#', title: "CAPEX Forecast", type: "link" },
          { path: '#', title: "Debt & Interest Forecasting", type: "link" },
          { path: '#', title: "Scenario Modeling", type: "link" },
        ],
      },
      {
        title: "Budgeting",
        icon: FiGrid, 
        type: "sub",
        active: false,
        children: [
          { path: '#', title: "Operational Budgeting", type: "link" },
          { path: '#', title: "Revenue-Based", type: "link" },
          { path:'#', title: "Capital Expenditure(CAPEX)", type: "link" },
          { path: '#', title: "Workforce Payroll Budgeting", type: "link" },
          { path: '#', title: "Zero-Based Budgeting (ZBB)", type: "link" },
          { path: '#', title: "Rolling & Flexible Budgeting", type: "link" },
          { path: '#', title: "Scenario Modeling & If Analysis for Budgeting", type: "link" },
        ],
      },
      {
        title: "Performance Analytics",
        icon: FiBarChart2, 
        type: "sub",
        active: false,
        children: [
          { path: '#', title: "Sales and Marketing Analytics", type: "link" },
          { path: '#', title: "HR & Workforce Analytics", type: "link" },
          { path: '#', title: "Finance & Accounting Analytics", type: "link" },
          { path: '#', title: "Supply Chain & Procurement Analytics", type: "link" },
        ],
      },
      {
        title: "AI Insights & Alerts",
        icon: FiBell,
        type: "sub",
        active: false,
        children: [
          { path: '/smart-financial-alerts', title: "Smart Financial Alerts", type: "link" },
          { path: '/aI-financial-recommendations', title: "AI-Powered Financial Recommendations", type: "link" },
          { path:'#', title: "Predictive Risk Management", type: "link" },
          { path: '#', title: "AI-Driven Forecast Accuracy Monitoring", type: "link" },
          { path: '#', title: "AI-Powered Benchmarking & Peer Comparisons", type: "link" },
        ],
      },
      {
        path: '/user-management',
        icon: FiUsers, 
        title: "User Management",
        type: "link",
      },
      {
        path: '#',
        icon: FiSettings, 
        title: "Settings & Customization",
        type: "link",
      },
      {
        path: '/help-Support',
        icon: FiHelpCircle, 
        title: "Help & Support",
        type: "link",
      },
      {
        path: '/ask-ai',
        icon: FiMessageSquare
        , 
        title: "Ask AI",
        type: "link",
      },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  
  return (
    <div className={`fixed overflow-scroll  inset-y-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 ${isOpen ? "w-60" : "w-20 px-4"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between  mr-5 py-2 border-b border-gray-100">
        {isOpen ? (
          <div className="flex items-center">
            <img src={mainLogo} alt="FinSightAI"  />
            {/* <span className="ml-2 text-xl font-semibold text-gray-800">FinSightAI</span> */}
            {/* <img src={mainLogo} /> */}
          </div>
        ) : (
          <img src={fevicon} alt="FinSightAI" className="h-8 px-0 mx-auto" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full bg-blue-200 hover:bg-gray-100 transition-colors duration-200"
        >
          {isOpen ? (
            // <FiChevronLeft className="text-gray-600 hover:text-gray-900" size={20} />
            // <MdMenuOpen className="text-gray-600 hover:text-gray-900" size={30} />
            <RiMenuFold2Fill className="text-gray-600 text-blue-800  hover:text-gray-900" size={20}  />


          ) : (
            <FiChevronRight className="text-gray-600  hover:text-gray-900" size={15} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {MENUITEMS.map((menuGroup, index) => (
          <div key={index}>
            {menuGroup.menutitle && (
              <div className="px-1 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {isOpen ? menuGroup.menutitle : ""}
              </div>
            )}
            <ul className="space-y-1 px-2 py-3">
              {menuGroup.Items.map((item, itemIndex) => (
                <MenuItem key={itemIndex} item={item} isSidebarOpen={isOpen} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;