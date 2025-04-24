import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/MainLayout';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
// import '../AllRoutes.css';
import KeyFinancialKPIs from '../pages/KeyFinancialKPIs';
import FinancialReports from '../pages/FinancialReportsCoreResult';
import RevenueForecasting from '../pages/ForecastingOverview/RevenueForecasting';
import AIChatBot from '../pages/AIChatBot';
import LoginPage from '../pages/Login';
import ExpenseForecastingDashboard from '../pages/ForecastingOverview/ExpenseForecastingDashboard';
import HelpSupport from '../pages/Suport/HelpSupport';
import UserManagement from '../pages/Suport/UserManagement';
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

function AllRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
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
              <Route path="/budget-vs-actuals" element={<BudgetVsActuals />} />
              {/* <Route path='/AICostOptimization' element={<AICostOptimization />} /> */}

            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AllRoutes;