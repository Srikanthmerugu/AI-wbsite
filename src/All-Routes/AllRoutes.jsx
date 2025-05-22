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
import CashFlowProjections from '../pages/CashFlowProjections';
import SmartFinancialAlerts from '../pages/SmartFinancialAlerts/SmartFinancialAlerts';
import AIFinancialRecommendations from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/AIFinancialRecommendations';
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
import SalesPerformanceDashboard from '../pages/Performance Analytics/Sales and Marketing/SalesPerformanceDashboard';
import SalesPerformanceTable from '../pages/Performance Analytics/Sales and Marketing/SalesPerformanceTable';
import HRworkForce from '../pages/Performance Analytics/HR and Workforce/HRworkForce';
import ITandTechnology from '../pages/Performance Analytics/IT and Technology/ITandTechnology';
import PipelineConversion from '../pages/Performance Analytics/Sales and Marketing/PipelineConversion';
import CACandCLV from '../pages/Performance Analytics/Sales and Marketing/CACandCLV';
import ChurnRetention from '../pages/Performance Analytics/Sales and Marketing/ChurnRetention';
import MarketingCampaign from '../pages/Performance Analytics/Sales and Marketing/MarketingCampaign';
import RevenueBreakdown from '../pages/Performance Analytics/Sales and Marketing/RevenueBreakdown';
import EmployeeProductivityReport from '../pages/Performance Analytics/HR and Workforce/EmployeeProductivityReport';
import UtilizationRateReport from '../pages/Performance Analytics/HR and Workforce/UtilizationRate';

import ITSpendBreakdown from '../pages/Performance Analytics/IT and Technology/ITSpendBreakdown';
import SoftwareLicenseUtilization from '../pages/Performance Analytics/IT and Technology/SoftwareLicenseutilization';
import InfrastructureCostEfficiency from '../pages/Performance Analytics/IT and Technology/InfrastructureEfficiency';
import ITBudgetVsActuals from '../pages/Performance Analytics/IT and Technology/ITBudgetVsActuals';
import SecurityCompliance from '../pages/Performance Analytics/IT and Technology/SecurityCompliance';
import TechDebtModernization from '../pages/Performance Analytics/IT and Technology/TechDebtModernization';
import FinanceAccountingDashboard from '../pages/Performance Analytics/Finance and Accounting/FinanceAccountingDashboard';
import LiquidityWorkingCapital from '../pages/Performance Analytics/Finance and Accounting/LiquidityWorkingCapital';
import ProfitabilityRatios from '../pages/Performance Analytics/Finance and Accounting/ProfitabilityRatios';
import DebtCoverage from '../pages/Performance Analytics/Finance and Accounting/DebtCoverage';


import CostOptimizationSuggestions from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/CostOptimizationSuggestions';
import RevenueGrowthStrategies from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/RevenueGrowthStrategies';
import InvestmentCapitalAllocation from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/InvestmentCapitalAllocation';
import ProfitabilityEnhancement from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/ProfitabilityEnhancement';
import ForecastAccuracyMonitoring from '../pages/AI-driven Insights & Alerts/Forecast Accuracy Monitoring/ForecastAccuracyMonitoring';
import BenchmarkingPeerComparisons from '../pages/AI-driven Insights & Alerts/BenchmarkingDashboard/BenchmarkingDashboard';
import PredictiveRiskManagement from '../pages/AI-driven Insights & Alerts/PredictiveRiskManagement/PredictiveRiskManagement';
import SupplyChainAnalytics from '../pages/Supply Chain & Procurement Analytics/SupplyChainAnalytics';
import SupplierPerformanceScorecard from '../pages/Supply Chain & Procurement Analytics/SupplierPerformanceScorecard';
import InventoryTurnoverAnalysis from '../pages/Supply Chain & Procurement Analytics/InventoryTurnoverAnalysis';
import ProcurementSpendBreakdown from '../pages/Supply Chain & Procurement Analytics/ProcurementSpendBreakdown';
import FreightLogisticsOptimization from '../pages/Supply Chain & Procurement Analytics/FreightLogisticsOptimization';
import OperationalRiskAssessment from '../pages/Supply Chain & Procurement Analytics/OperationalRiskAssessment';
import CostSavingOpportunities from '../pages/Supply Chain & Procurement Analytics/CostSavingOpportunities';
import CashShortfallWarning from '../pages/SmartFinancialAlerts/CashShortfallWarning';
import UserManagement from '../pages/Suport/User Management/UserManagement';
import SettingsCustomization from '../pages/SettingsCustomization/SettingsCustomization';




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
              <Route path="/CashShortfallWarning" element={<CashShortfallWarning />} />



              <Route path="/expenseForecasting" element={<ExpenseForecastingDashboard />} />
              <Route path="/aI-financial-recommendations" element={<AIFinancialRecommendations />} />


              <Route path="/cost-optimization-suggestions" element={<CostOptimizationSuggestions />} />
              <Route path="/revenue-growth-strategies" element={<RevenueGrowthStrategies />} />
              <Route path="/InvestmentCapitalAllocation" element={<InvestmentCapitalAllocation />} />
              <Route path="/ProfitabilityEnhancement" element={<ProfitabilityEnhancement />} />
              <Route path="/ForecastAccuracyMonitoring" element={<ForecastAccuracyMonitoring />} />
              <Route path="/BenchmarkingPeerComparisons" element={<BenchmarkingPeerComparisons />} />
              <Route path="/PredictiveRiskManagement" element={<PredictiveRiskManagement />} />





              



 
              <Route path="/SupplyChainAnalytics" element={<SupplyChainAnalytics />} />
              <Route path="/SupplierPerformanceScorecard" element={<SupplierPerformanceScorecard />} />
              <Route path="/InventoryTurnoverAnalysis" element={<InventoryTurnoverAnalysis />} />
              <Route path="/ProcurementSpendBreakdown" element={<ProcurementSpendBreakdown />} />
              <Route path="/FreightLogisticsOptimization" element={<FreightLogisticsOptimization />} />
              <Route path="/OperationalRiskAssessment" element={<OperationalRiskAssessment />} />
              <Route path="/CostSavingOpportunities" element={<CostSavingOpportunities />} />


              
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
              <Route path="/pipeline-conversion" element={<PipelineConversion  />} />
              <Route path="/cac-clv" element={<CACandCLV  />} />
              <Route path="/churn-retention" element={<ChurnRetention />} />
              <Route path="/marketing-campaign" element={<MarketingCampaign />} />
              <Route path="/revenue-breakdown" element={<RevenueBreakdown />} />
              <Route path="/hr-workforce" element={<HRworkForce  />} /> 
              <Route path="/employee-productivity-report" element={<EmployeeProductivityReport  />} />
              <Route path="/utilization-rate-report" element={<UtilizationRateReport  />} />  
              <Route path="/it-technology-spend" element={<ITandTechnology  />} />
              <Route path="/it-spend-breakdown" element={<ITSpendBreakdown />} />
              <Route path="/software-license-utilization" element={<SoftwareLicenseUtilization />} />
              <Route path="/infrastructure-cost-efficiency" element={<InfrastructureCostEfficiency />} />
              <Route path="/it-budget-tracker" element={<ITBudgetVsActuals />} />
              <Route path="/security-compliance" element={<SecurityCompliance />} />
              <Route path="/tech-debt-modernization" element={<TechDebtModernization />} />
              <Route path="/finance-accounting-dashboard" element={<FinanceAccountingDashboard />} /> 
              <Route path="/liquidity-working-capital" element={<LiquidityWorkingCapital />} />
              <Route path="/profitability-ratios" element={<ProfitabilityRatios />} />
              <Route path="/debt-coverage" element={<DebtCoverage />} />
              <Route path="/settings-customization" element={<SettingsCustomization />} />

            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AllRoutes;