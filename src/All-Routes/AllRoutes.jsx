// src/AllRoutes.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/MainLayout';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
import KeyFinancialKPIs from '../pages/KeyFinancialKPIs';
import FinancialReports from '../pages/FinancialReportsCoreResult';
import RevenueForecasting from '../pages/ForecastingOverview/RevenueForecasting';
import AIChatBot from '../pages/AIChatBot';
import LoginPage from '../pages/Login';
import ExpenseForecastingDashboard from '../pages/ForecastingOverview/ExpenseForecastingDashboard';
import HelpSupport from '../pages/Suport/HelpSupport';
import UserManagement from '../pages/Suport/User Management/UserManagement';
import CashFlowProjections from '../pages/CashFlowProjections';
import SmartFinancialAlerts from '../pages/SmartFinancialAlerts';
import AIFinancialRecommendations from '../pages/AIFinancialRecommendations';
import CompanyManagementTable from '../pages/All Company management/CompanyManagementTable';
import ForecastingOverview from '../pages/ForecastingOverview/ForecastingOverview';
import CAPEXForecastScreen from '../pages/ForecastingOverview/CAPEXForecastScreen';
import { AuthProvider } from '../context/AuthContext';
import OperationalBudgeting from '../pages/Budgeting/OperationalBudgeting';
import FixedVariableExpense from '../pages/Budgeting/FixedVariableExpense';
import { RevenueBudgeting } from '../pages/Budgeting/RevenuebasedBudgeting';
import { DepartmentBudgeting } from '../pages/Budgeting/DepartmentBudgeting ';
import AICostOptimization from '../pages/Budgeting/AICostOptimization';
import BudgetVsActuals from '../pages/Budgeting/BudgetVsActuals';
import PLDashboard from '../pages/Financial Reports/PLDashboard';
import CapitalInvestmentPlan from '../pages/Budgeting/CAPEX-Budgeting/CapitalInvestPlan';
import ROIAllocation from '../pages/Budgeting/CAPEX-Budgeting/ROIAllocation';
import DepreciationForecast from '../pages/Budgeting/CAPEX-Budgeting/DepreciationForecast';
import UploadGL from '../pages/Financial Reports/UploadGL';
import RegisterPage from '../pages/RegisterPage';
import OrganizationsListScreen from '../pages/Organizations List Screen/OrganizationsListScreen';
import RevenueComponent from '../components/Dashboard/FinancialOverview items/RevenueComponent';
import ExpenseComponent from '../components/Dashboard/FinancialOverview items/ExpenseComponent';
// import ProfileDetailsScreen from '../pages/Organizations List Screen/OrganizationsListScreen';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

import ProfileDetailsScreen from '../pages/Organizations List Screen/OrganizationsListScreen';
import SalesPerformanceDashboard from '../pages/Performance Analytics/SalesPerformanceDashboard';
import SalesPerformanceTable from '../pages/Performance Analytics/SalesPerformanceTable';
import HRworkForce from '../pages/Performance Analytics/HRworkForce';
import ITSpendAnalytics from '../pages/Performance Analytics/ITspendAnalytics';


function AllRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
             <Route element={<MainLayout />}>
              <Route path="/" element={<FinancialOverview />} />
              <Route path="/financial-overview" element={<FinancialOverview />} />
              <Route path="/key-financial" element={<KeyFinancialKPIs />} />
              <Route path="/financial-core-reports" element={<FinancialReports />} />
              <Route path="/revenueForecasting" element={<RevenueForecasting />} />
              <Route path="/ask-ai" element={<AIChatBot />} />
              <Route path="/help-Support" element={<HelpSupport />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/cashFlow-projections" element={<CashFlowProjections />} />
              <Route path="/smart-financial-alerts" element={<SmartFinancialAlerts />} />
              <Route path="/expenseForecasting" element={<ExpenseForecastingDashboard />} />
              <Route path="/aI-financial-recommendations" element={<AIFinancialRecommendations />} />
              <Route path="/company-management-table" element={<CompanyManagementTable />} />
              <Route path="/forecasting-overview" element={<ForecastingOverview />} />
              <Route path="/CAPEX-forecast-screen" element={<CAPEXForecastScreen />} />
              <Route path="/operational-budgeting" element={<OperationalBudgeting />} />
              <Route path="/fixed-variable-expense" element={<FixedVariableExpense />} />
              <Route path="/revenue-budgeting" element={<RevenueBudgeting />} />
              <Route path="/department-budgeting" element={<DepartmentBudgeting />} />
              {/* <Route path="/department-budgeting" element={<AICostOptimization />} /> */}
              <Route path="/aI-cost-optimization" element={<AICostOptimization />} />
              <Route path="/budget-vs-actuals" element={<BudgetVsActuals />} />
              <Route path="/p&l-Dashboard" element={<PLDashboard />} />
              <Route path="/budget-capital-investment" element={<CapitalInvestmentPlan />} />
              <Route path="/budget-roi-allocation" element={<ROIAllocation />} />
              <Route path="/budget-depreciation-forecast" element={<DepreciationForecast  />} />
              <Route path="/financial-gl-upload" element={<UploadGL  />} />
              {/* <Route path="/profile-details" element={<OrganizationsListScreen  />} /> */}
              <Route path='/revenue-component' element={<RevenueComponent />} />
              <Route path='/expense-component' element={<ExpenseComponent />} />
              <Route path="/profile-details" element={<ProfileDetailsScreen  />} />

              {/* Performance Analytics */}
              <Route path="/sales-performance-dashboard" element={<SalesPerformanceDashboard  />} />
              <Route path="/sales-performance-table" element={<SalesPerformanceTable  />} />
              <Route path="/hr-workforce" element={<HRworkForce  />} /> 
              <Route path="/it-technology-spend" element={<ITSpendAnalytics  />} />

            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AllRoutes;