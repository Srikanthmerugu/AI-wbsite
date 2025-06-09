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
// import { TbWorldUpload } from "react-icons/tb";


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
  // TbWorldUpload,
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
            // children: [
            //   { path: "/revenue-component", type: "link", title: "Revenue", icon: { name: "FiFile" } },
            //   { path: "/expense-component", type: "link", title: "Expenses", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "Gross Profit", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "EBITDA", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "Cashflow", icon: { name: "FiFile" } },
            // ],
          },
          {
            path: "/key-financial",
            type: "link",
            title: "Key Financial KPIs",
            icon: { name: "FiFile" },
            // children: [
            //   { path: "#", type: "link", title: "Revenue per Employee", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "Marketing ROI", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "Cost per Lead", icon: { name: "FiFile" } },
            //   { path: "#", type: "link", title: "Profitability by Product/Region", icon: { name: "FiFile" } },
            // ],
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
          { path: "/headcount-payroll", title: "Headcount & Payroll Forecast", type: "link", icon: { name: "FiFile" } },
          { path: "/CAPEX-forecast-screen", title: "CAPEX Forecast", type: "link", icon: { name: "FiFile" } },
          { path: "/debt-interest-forecasting", title: "Debt & Interest Forecasting", type: "link", icon: { name: "FiFile" } },
          { path: "/scenario-modeling", title: "Scenario Modeling", type: "link", icon: { name: "FiFile" } },
        ],
      },



      {
        title: "Budgeting",
        icon: { name: "FiGrid" },
        path: "/operational-budgeting",
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
              { path: "/revenue-driven-expense", type: "link", title: "Revenue-Driven Expense Allocation ", icon: { name: "FiFile" } },
              { path: "/sale-growth-budget", type: "link", title: "Sales Growth-Linked Budget Adjustments ", icon: { name: "FiFile" } },
              { path: "/customer-acquisition-retention", type: "link", title: "Customer Acquisition & Retention Budgeting ", icon: { name: "FiFile" } },
              { path: "/subscription-recurring-revenue", type: "link", title: "Subscription & Recurring Revenue Considerations", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Capital Expenditure (CAPEX) Budgeting  ",
            icon: { name: "FiFile" },
            children: [
              { path: "/capital-investment-planning", type: "link", title: "Capital Investment Planning", icon: { name: "FiFile" } },
              { path: "/budget-roi-allocation", type: "link", title: "ROI-Based CAPEX Allocation", icon: { name: "FiFile" } },
              { path: "/budget-depreciation-forecast", type: "link", title: "Depreciation & Amortization Forecasting ", icon: { name: "FiFile" } },
              { path: "/scenario-based-capex", type: "link", title: "Scenario-Based CAPEX Modeling", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Workforce & Payroll Budgeting",
            icon: { name: "FiFile" },
            children: [
              { path: "/headcount-planning", type: "link", title: "Headcount Planning & Cost Forecasting ", icon: { name: "FiFile" } },
              { path: "/salary-compensation", type: "link", title: "Salary & Compensation Budgeting ", icon: { name: "FiFile" } },
              { path: "/attrition-replacement", type: "link", title: "Attrition & Replacement Cost Projections ", icon: { name: "FiFile" } },
              { path: "/workforce-efficiency", type: "link", title: "AI-Driven Workforce Efficiency Analysis ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Zero-Based Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "/justification-based", type: "link", title: "Justification-Based Budgeting  ", icon: { name: "FiFile" } },
              { path: "/costControl-wasteReduction", type: "link", title: "Cost Control & Waste Reduction  ", icon: { name: "FiFile" } },
              { path: "/department-ZBB-implementation", type: "link", title: "Department-Wide ZBB Implementation  ", icon: { name: "FiFile" } },
              { path: "/spending-efficiency-recommendations", type: "link", title: "AI-Based Spending Efficiency Recommendations  ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Rolling & Flexible Budgeting ",
            icon: { name: "FiFile" },
            children: [
              { path: "/continuous-budget-updates", type: "link", title: "Continuous Budget Updates   ", icon: { name: "FiFile" } },
              { path: "/scenarioBased-rollingForecasts", type: "link", title: "Scenario-Based Rolling Forecasts   ", icon: { name: "FiFile" } },
              { path: "/emergency-contigency", type: "link", title: "Emergency Fund & Contingency Budgeting  ", icon: { name: "FiFile" } },
              { path: "/automated-variance-alerts", type: "link", title: "Automated Variance Alerts   ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "#",
            type: "link",
            title: "Scenario Modeling & What-If Analysis ",
            icon: { name: "FiFile" },
            children: [
              { path: "/revenue-budget-expansion", type: "link", title: "Revenue Growth vs. Budget Expansion   ", icon: { name: "FiFile" } },
              { path: "/costCutting-scenario-testing", type: "link", title: "Cost-Cutting Scenario Testing    ", icon: { name: "FiFile" } },
              { path: "/investment-tradeOffs", type: "link", title: "Investment Trade-Offs  ", icon: { name: "FiFile" } },
              { path: "/market-economic-simulations", type: "link", title: "Market & Economic Condition Simulations    ", icon: { name: "FiFile" } },
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
        path: "/sales-performance-dashboard",
        type: "sub",
        badge: "badge badge-light-secondary",
        badgetxt: "New",
        active: false,
        children: [
          {
            path: "/sales-performance-dashboard",
            type: "link",
            title: "Sales and Marketing Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "/sales-performance-dashboard", type: "link", title: "Sales Performance Dashboard ", icon: { name: "FiFile" } },
              { path: "/pipeline-conversion", type: "link", title: "Pipeline & Conversion Analysis ", icon: { name: "FiFile" } },
              { path: "/cac-clv", type: "link", title: "CAC &  CLV", icon: { name: "FiFile" } },
              { path: "/churn-retention", type: "link", title: "Churn & Retention Analysis", icon: { name: "FiFile" } },
              { path: "/marketing-campaign", type: "link", title: "Marketing Campaign Performance ", icon: { name: "FiFile" } },
              { path: "/revenue-breakdown", type: "link", title: "Revenue Breakdown", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/hr-workforce",
            type: "link",
            title: "HR & Workforce Analytics",
            icon: { name: "FiFile" },
            children: [
              { path: "/employee-productivity-report", type: "link", title: "Employee Productivity Report ", icon: { name: "FiFile" } },
              { path: "/utilization-rate-report", type: "link", title: "Utilization Rate Report ", icon: { name: "FiFile" } },
              { path: "/retention-attrition-rate", type: "link", title: "Retention & Attrition Rate Analysis ", icon: { name: "FiFile" } },
              { path: "/hiring-funnel-metrics", type: "link", title: "Hiring Funnel Metrics ", icon: { name: "FiFile" } },
              { path: "/diversity-inclusion-metrics", type: "link", title: "Diversity & Inclusion Metrics", icon: { name: "FiFile" } },
              { path: "/compensation-benefits", type: "link", title: "Compensation & Benefits Analysis ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/it-technology-spend",
            type: "link",
            title: "IT & Technology Spend Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "/it-spend-breakdown", type: "link", title: "IT Spend Breakdown ", icon: { name: "FiFile" } },
              { path: "/software-license-utilization", type: "link", title: "Software License Utilization", icon: { name: "FiFile" } },
              { path: "/infrastructure-cost-efficiency", type: "link", title: "Infrastructure Cost Efficiency ", icon: { name: "FiFile" } },
              { path: "/it-budget-tracker", type: "link", title: "IT Project Budget vs. Actuals ", icon: { name: "FiFile" } },
              { path: "/security-compliance", type: "link", title: "Security & Compliance Analytics  ", icon: { name: "FiFile" } },
              { path: "/tech-debt-modernization", type: "link", title: "Tech Debt & Modernization Index   ", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/finance-accounting-dashboard",
            type: "link",
            title: "Finance & Accounting Analytics",
            icon: { name: "FiFile" },
            children: [
              { path: "/liquidity-working-capital", type: "link", title: "Liquidity & Working Capital Analysis ", icon: { name: "FiFile" } },
              { path: "/profitability-ratios", type: "link", title: "Profitability Ratios ", icon: { name: "FiFile" } },
              { path: "/debt-coverage", type: "link", title: "Debt & Interest Coverage Metrics ", icon: { name: "FiFile" } },
              { path: "/budget-utilization", type: "link", title: "Budget Utilization & Variance Reports", icon: { name: "FiFile" } },
              { path: "/tax-compliance", type: "link", title: "Tax & Compliance Risk Assessments", icon: { name: "FiFile" } },
              { path: "/expense-trend-analysis", type: "link", title: "Expense Trend Analysis", icon: { name: "FiFile" } },
            ],
          },
          {
            path: "/SupplyChainAnalytics",
            type: "link",
            title: "Supply Chain & Procurement Analytics ",
            icon: { name: "FiFile" },
            children: [
              { path: "/SupplierPerformanceScorecard", type: "link", title: "Supplier Performance Scorecard ", icon: { name: "FiFile" } },
              { path: "/InventoryTurnoverAnalysis", type: "link", title: "Inventory Turnover Analysis", icon: { name: "FiFile" } },
              { path: "/ProcurementSpendBreakdown", type: "link", title: "Procurement Spend Breakdown ", icon: { name: "FiFile" } },
              { path: "/FreightLogisticsOptimization", type: "link", title: "Freight & Logistics Optimization ", icon: { name: "FiFile" } },
              { path: "/OperationalRiskAssessment", type: "link", title: "Operational Risk Assessment", icon: { name: "FiFile" } },
              { path: "/CostSavingOpportunities", type: "link", title: "Cost-Saving Opportunity Identification ", icon: { name: "FiFile" } },
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



       










      // {
      //   title: "AI Insights & Alerts",
      //   icon: { name: "FiBell" },
      //   path: "/smart-financial-alerts",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     { path: "/smart-financial-alerts", title: "Smart Financial Alerts", type: "link", icon: { name: "FiFile" } },
      //     { path: "/aI-financial-recommendations", title: "AI-Powered Financial Recommendations", type: "link", icon: { name: "FiFile" } },
      //     { path: "/PredictiveRiskManagement", title: "Predictive Risk Management", type: "link", icon: { name: "FiFile" } },
      //     { path: "/ForecastAccuracyMonitoring", title: "AI-Driven Forecast Accuracy Monitoring", type: "link", icon: { name: "FiFile" } },
      //     { path: "/BenchmarkingPeerComparisons", title: "AI-Powered Benchmarking & Peer Comparisons", type: "link", icon: { name: "FiFile" } },
      //   ],
      // },
      // {
      //   title: "User Management",
      //   path: "/user-management",
      //   icon: { name: "FiUsers" },
      //   type: "link",
      //   type: "sub",
      //   active: false,
      // },
      // {
      //   path: "/company-management-table",
      //   icon: { name: "FaLayerGroup" },
      //   title: "All Companies Management",
      //   type: "link",
      // },
      // {
      //   path: "/settings-customization",
      //   icon: { name: "FiSettings" },
      //   title: "Settings & Customization",
      //   type: "link",
      // },
      {
        path: "/settings-customization",
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
      // {
      //   path: "/gl-upload-screen",
      //   icon: { name: "TbWorldUpload" },
      //   title: "Upload GL File ",
      //   type: "link",
      // },
      {
        path: "/ask-ai",
        icon: { name: "FiMessageSquare" },
        title: "Ask AI",
        type: "link",
      },
      // {
      //   path: "/AttritionPredictionDashboard ",
      //   icon: { name: "FiUsers" },
      //   title: "Attrition Prediction Dashboard ",
      //   type: "link",
      // },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname); // Changed: Initialize with current pathname

  // Changed: Function to find if a path is in the hierarchy of an item
  const findActivePath = (items, targetPath) => {
    for (const item of items) {
      if (item.path === targetPath) {
        return true;
      }
      if (item.children) {
        if (findActivePath(item.children, targetPath)) {
          return true;
        }
      }
    }
    return false;
  };

  // Changed: Update active item on location change
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  // Changed: Handle click to set active item
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
      <div className="flex items-center justify-between p-2 pt-2 border-b border-gray-100">
        {isOpen ? (
          <div className="flex items-center">
            <Link to="/">
              <img src={mainLogo} alt="FinSightAI" className="h-15" />
            </Link>
          </div>
        ) : (
          <img src={fevicon} alt="FinSightAI" className="h-8 mx-auto px-2" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
        >
          {isOpen ? (
            <RiMenuFold2Fill className="text-sky-800" size={20} />
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
                      : findActivePath([item], activeItem)
                      ? "bg-blue-50 text-blue-500"
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