import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { RiMenuFold2Fill } from "react-icons/ri";
import { CustomTreeMenu } from "./CustomTreeMenu/CustomTreeMenu";
import { mainLogo, fevicon } from "../../assets/Assets";
import { FaLayerGroup } from "react-icons/fa6";

import {
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
  FiFile,
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
  FiFile,
};

const MENUITEMS = [
  {
    menutitle: "",
    menucontent: "Ready to use Apps",
    Items: [
      {
        title: "DASHBOARD",
        icon: { name: "FiHome" },
        path: "/financial-overview",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          {
            path: "/financial-overview",
            type: "link",
            title: "Financial Overview",
            icon: { name: "FiFile" },
            children: [
              { path: "/revenue-component", type: "link", title: "Revenue", icon: { name: "FiFile" } },
              { path: "/expense-component", type: "link", title: "Expenses", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Gross Profit", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "EBITDA", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cashflow", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/key-financial",
            type: "link",
            title: "Key Financial KPIs",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Revenue per Employee", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Marketing ROI", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cost per Lead", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Profitability by Product/Region", icon: { name: "FiFile" } },
            ],
          },
        ],
      },
      {
        title: "Financial Reports",
        icon: { name: "FiUser" },
        path: "/financial-core-reports",
        type: "sub",
        bookmark: true,
        active: false,
        children: [
          { path: "/financial-core-reports", type: "link", title: "Core & Custom Reports", icon: { name: "FiFile" } },
          // { path: "/p&l-Dashboard", type: "link", title: "Core & Custom Reports", icon: { name: "FiFile" } },
        ],
      },
      {
        title: "Forecasting & Scenario",
        icon: { name: "FiClipboard" },
        path: "/forecasting-overview",
        type: "sub",
        active: false,
        children: [
          { path: "/revenueForecasting", title: "Revenue Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: "/expenseForecasting", title: "Expense Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: "/cashFlow-projections", title: "Cash Flow Projections", type: "link", icon: { name: "FiFile" } },
          { path: "", title: "Headcount & Payroll Forecast", type: "link", icon: { name: "FiFile" } },
          { path: "/CAPEX-forecast-screen", title: "CAPEX Forecast", type: "link", icon: { name: "FiFile" } },
          { path: "#", title: "Debt & Interest Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: "#", title: "Scenario Modeling", type: "link", icon: { name: "FiFile" } },
        ],
      },



      {
        title: "Budgeting",
        icon: { name: "FiGrid" },
        path: "#",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [ 
          {
            path: "/operational-budgeting",
            type: "link",
            title: "Operational Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "/department-budgeting", type: "link", title: "Department-Level Budgeting", icon: { name: "FiFile" } },
              { path: "/fixed-variable-expense", type: "link", title: "Fixed vs. Variable Expense Planning ", icon: { name: "FiFile" } },
              { path: "/aI-cost-optimization", type: "link", title: "AI-Based Cost Optimization Suggestions", icon: { name: "FiFile" } },
              // { path: "/ai-cost-optimization", type: "link", title: "AI-Based Cost Optimization Suggestions ", icon: { name: "FiFile" } },
              { path: "/budget-vs-actuals", type: "link", title: "Budget vs. Actuals Tracking ", icon: { name: "FiFile" } },
              // { path: "#", type: "link", title: "Cashflow", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/revenue-budgeting",
            type: "link",
            title: "Revenue-Based Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Revenue-Driven Expense Allocation ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Sales Growth-Linked Budget Adjustments ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Customer Acquisition & Retention Budgeting ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Subscription & Recurring Revenue Considerations", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Capital Expenditure (CAPEX) Budgeting  ",
            icon: { name: "FiFile" },
            children: [
              { path: "/budget-capital-investment", type: "link", title: "Capital Investment Planning", icon: { name: "FiFile" } },
              { path: "/budget-roi-allocation", type: "link", title: "ROI-Based CAPEX Allocation", icon: { name: "FiFile" } },
              { path: "/budget-depreciation-forecast", type: "link", title: "Depreciation & Amortization Forecasting ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Scenario-Based CAPEX Modeling", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Workforce & Payroll Budgeting",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Headcount Planning & Cost Forecasting ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Salary & Compensation Budgeting ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Attrition & Replacement Cost Projections ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "AI-Driven Workforce Efficiency Analysis ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Zero-Based Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Justification-Based Budgeting  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cost Control & Waste Reduction  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Department-Wide ZBB Implementation  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "AI-Based Spending Efficiency Recommendations  ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Rolling & Flexible Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Continuous Budget Updates   ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Scenario-Based Rolling Forecasts   ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Emergency Fund & Contingency Budgeting  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Automated Variance Alerts   ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Scenario Modeling & What-If Analysis ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Revenue Growth vs. Budget Expansion   ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cost-Cutting Scenario Testing    ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Investment Trade-Offs  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Market & Economic Condition Simulations    ", icon: { name: "FiFile" } },
            ],
          },
        ],
      },



      // {
      //   title: "Budgeting",
      //   icon: { name: "FiGrid" },
      //   path: "#",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     { path: "#", title: "Operational Budgeting", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Revenue-Based", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Capital Expenditure(CAPEX)", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Workforce Payroll Budgeting", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Zero-Based Budgeting (ZBB)", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Rolling & Flexible Budgeting", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Scenario Modeling & If Analysis for Budgeting", type: "link", icon: { name: "FiFile" } },
      //   ],
      // },



      {
        title: "Performance Analytics ",
        icon: { name: "FiBarChart2" },
        path: "#",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          {
            path: "#",
            type: "link",
            title: "Sales and Marketing Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Sales Performance Dashboard ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Pipeline & Conversion Analysis ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "CAC &  CLV", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Churn & Retention Analysis", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Marketing Campaign Performance ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Revenue Breakdown", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "HR & Workforce Analytics",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Employee Productivity Report ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Utilization Rate Report ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Retention & Attrition Rate Analysis ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Hiring Funnel Metrics ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Diversity & Inclusion Metrics", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Compensation & Benefits Analysis ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "IT & Technology Spend Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "IT Spend Breakdown ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Software License Utilization", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Infrastructure Cost Efficiency ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "IT Project Budget vs. Actuals ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Security & Compliance Analytics  ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Tech Debt & Modernization Index   ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Finance & Accounting Analytics",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Liquidity & Working Capital Analysis ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Profitability Ratios ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Debt & Interest Coverage Metrics ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Budget Utilization & Variance Reports", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Tax & Compliance Risk Assessments", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Expense Trend Analysis", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Supply Chain & Procurement Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Supplier Performance Scorecard ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Inventory Turnover Analysis", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Procurement Spend Breakdown ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Freight & Logistics Optimization ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Operational Risk Assessment", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cost-Saving Opportunity Identification ", icon: { name: "FiFile" } },
            ],
          },
          // {
          //   path: "#",
          //   type: "link",
          //   title: "HR & Workforce Analytics",
          //   icon: { name: "FiFile" },
          //   children: [
          //     { path: "#", type: "link", title: "Revenue per Employee", icon: { name: "FiFile" } },
          //     { path: "#", type: "link", title: "Marketing ROI", icon: { name: "FiFile" } },
          //     { path: "#", type: "link", title: "Cost per Lead", icon: { name: "FiFile" } },
          //     { path: "#", type: "link", title: "Profitability by Product/Region", icon: { name: "FiFile" } },
          //   ],
          // },
        ],
      },




















      // {
      //   title: "Performance Analytics",
      //   icon: { name: "FiBarChart2" },
      //   path: "#",
      //   type: "sub",
      //   active: false, 
      //   children: [
      //     { path: "#", title: "Sales and Marketing Analytics", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "HR & Workforce Analytics", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Finance & Accounting Analytics", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Supply Chain & Procurement Analytics", type: "link", icon: { name: "FiFile" } },
      //   ],
      // },



      {
        title: "AI Insights & Alerts",
        icon: { name: "FiBell" },
        path: "#",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          {
            path: "/smart-financial-alerts",
            type: "link",
            title: "Smart Financial Alerts",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Cash Shortfall Warning", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Budget Overrun Alerts", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Revenue Drop & Sales Decline Alerts", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Expense Spike Detection", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Accounts Receivable Aging Alerts", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Accounts Payable Due Alerts", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "AI-Powered Financial Recommendations ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Cost Optimization Suggestions ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Revenue Growth Strategies", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Profitability Enhancement Plans", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Investment & Capital Allocation Advice", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Vendor Contract Negotiation", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Tax Optimization & Compliance Suggestions", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Predictive Risk Management ",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Financial Fraud & Anomaly Detection ", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Operational Risk Alerts", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Market Volatility & External Risk Alerts", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Debt Repayment & Interest Rate Risks", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Customer Churn Risk Forecasting", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Credit Risk Exposure", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "AI-Driven Forecast Accuracy Monitoring",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Revenue Forecast Deviation Analysis", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Expense Forecast Accuracy", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Cash Flow Forecast Reliability", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "AI Model Confidence Scores", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Forecast Adjustment History", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "AI-Powered Benchmarking & Peer Comparisons",
            icon: { name: "FiFile" },
            children: [
              { path: "#", type: "link", title: "Industry Profitability Comparison", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Revenue Growth Benchmarking", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Operational Cost Efficiency Index", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Debt & Leverage Comparisons", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Employee Productivity Metrics", icon: { name: "FiFile" } },
              { path: "#", type: "link", title: "Market Expansion & Performance Trends", icon: { name: "FiFile" } },
            ],
          },
         
        ],
      },










      // {
      //   title: "AI Insights & Alerts",
      //   icon: { name: "FiBell" },
      //   path: "/smart-financial-alerts",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     { path: "/smart-financial-alerts", title: "Smart Financial Alerts", type: "link", icon: { name: "FiFile" } },
      //     { path: "/aI-financial-recommendations", title: "AI-Powered Financial Recommendations", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "Predictive Risk Management", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "AI-Driven Forecast Accuracy Monitoring", type: "link", icon: { name: "FiFile" } },
      //     { path: "#", title: "AI-Powered Benchmarking & Peer Comparisons", type: "link", icon: { name: "FiFile" } },
      //   ],
      // },
      {
        title: "User Management",
        path: "/user-management",
        icon: { name: "FiUsers" },
        type: "link",
        type: "sub",
        active: false,
      },
      {
        path: "/company-management-table",
        icon: { name: "FaLayerGroup" },
        title: "All Companies Management",
        type: "link",
      },
      {
        path: "#",
        icon: { name: "FiSettings" },
        title: "Settings & Customization",
        type: "link",
      },
      {
        path: "/help-Support",
        icon: { name: "FiHelpCircle" },
        title: "Help & Support",
        type: "link",
      },
      {
        path: "/ask-ai",
        icon: { name: "FiMessageSquare" },
        title: "Ask AI",
        type: "link",
      },
      // {
      //   path: "organizations-list-screen",
      //   icon: { name: "FiUsers" },
      //   title: "Organizations-List",
      //   type: "link",
      // },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    // Initialize active item based on current path
    const currentItem = MENUITEMS[0].Items.find(
      (item) => item.path && location.pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.path : null;
  });

  // Handle click to set active item
  const handleNavClick = (path) => {
    if (path && path !== "#") {
      setActiveItem(path);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-2 pt-2  border-b border-gray-100">
        {isOpen ? (
          <div className="flex items-center">
            <Link to="/"><img src={mainLogo} alt="FinSightAI" className="h-15" /></Link>
          </div>
        ) : (
          <img src={fevicon} alt="FinSightAI" className="h-8 mx-auto px-2 " />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1  rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
        >
          {isOpen ? (
            <RiMenuFold2Fill className="text-sky-800  " size={20} />
          ) : (
            <FiChevronRight className="text-gray-600 wave-animation" size={16} />
          )}
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto">
        {isOpen ? (
          <CustomTreeMenu
            items={MENUITEMS[0].Items}
            iconComponents={iconComponents}
            activeItem={activeItem}
            onItemClick={handleNavClick}
          />
        ) : (
          <div className="flex flex-col items-center py-4 space-y-4">
            {MENUITEMS[0].Items.map((item, index) => (
              <NavLink
                key={index}
                to={item.path || "#"}
                onClick={() => handleNavClick(item.path)}
                className={() =>
                  `p-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    activeItem === item.path
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
                title={item.title}
              >
                {item.icon &&
                  React.createElement(iconComponents[item.icon.name], {
                    size: 16,
                  })}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;