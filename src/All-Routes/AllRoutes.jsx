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
import DebtInterestForecasting from '../pages/ForecastingOverview/DebtInterestForecasting';
import ScenarioModeling from '../pages/ForecastingOverview/ScenarioModeling';
import HelpSupport from '../pages/Suport/HelpSupport';
import CashFlowProjections from '../pages/ForecastingOverview/CashFlowProjections';
import SmartFinancialAlerts from '../pages/SmartFinancialAlerts/SmartFinancialAlerts';
import AIFinancialRecommendations from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/AIFinancialRecommendations';
import CompanyManagementTable from '../pages/All Company management/CompanyManagementTable';
import ForecastingOverview from '../pages/ForecastingOverview/ForecastingOverview';
import CAPEXForecastScreen from '../pages/ForecastingOverview/CAPEXForecastScreen';

import { AuthProvider } from '../context/AuthContext';
import FixedVariableExpense from '../pages/Budgeting/Operational-Budgeting/FixedVariableExpense';
import  DepartmentBudgeting  from '../pages/Budgeting/Operational-Budgeting/DepartmentBudgeting';
import AICostOptimization from '../pages/Budgeting/Operational-Budgeting/AICostOptimization';
import BudgetVsActuals from '../pages/Budgeting/Operational-Budgeting/BudgetVsActuals';
import PLDashboard from '../pages/Financial Reports/PLDashboard';
import CapitalInvestmentPlanning from '../pages/Budgeting/CAPEX-Budgeting/CapitalInvestmentPlanning';
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
import HRWorkforceTable from '../pages/Performance Analytics/HR and Workforce/HRWorkforceTable';
import ITandTechnology from '../pages/Performance Analytics/IT and Technology/ITandTechnology';
import PipelineConversion from '../pages/Performance Analytics/Sales and Marketing/PipelineConversion';
import CACandCLV from '../pages/Performance Analytics/Sales and Marketing/CACandCLV';
import ChurnRetention from '../pages/Performance Analytics/Sales and Marketing/ChurnRetention';
import MarketingCampaign from '../pages/Performance Analytics/Sales and Marketing/MarketingCampaign';
import RevenueBreakdown from '../pages/Performance Analytics/Sales and Marketing/RevenueBreakdown';
import EmployeeProductivityReport from '../pages/Performance Analytics/HR and Workforce/EmployeeProductivityReport';
import UtilizationRateReport from '../pages/Performance Analytics/HR and Workforce/UtilizationRate';
import RetentionAttritionRate from '../pages/Performance Analytics/HR and Workforce/RetentionAttritionRate';

import ITSpendBreakdown from '../pages/Performance Analytics/IT and Technology/ITSpendBreakdown';
import ITSpendTable from '../pages/Performance Analytics/IT and Technology/ITSpendTable';
import SoftwareLicenseUtilization from '../pages/Performance Analytics/IT and Technology/SoftwareLicenseutilization';
import InfrastructureCostEfficiency from '../pages/Performance Analytics/IT and Technology/InfrastructureEfficiency';
import ITBudgetVsActuals from '../pages/Performance Analytics/IT and Technology/ITBudgetVsActuals';
import SecurityCompliance from '../pages/Performance Analytics/IT and Technology/SecurityCompliance';
import TechDebtModernization from '../pages/Performance Analytics/IT and Technology/TechDebtModernization';
import FinanceAccountingDashboard from '../pages/Performance Analytics/Finance and Accounting/FinanceAccountingDashboard';
import FinanceAccountingTable from '../pages/Performance Analytics/Finance and Accounting/FinanceAccountingTable';
import LiquidityWorkingCapital from '../pages/Performance Analytics/Finance and Accounting/LiquidityWorkingCapital';
import TaxCompliance from '../pages/Performance Analytics/Finance and Accounting/TaxCompliance';
import BudgetUtilization from '../pages/Performance Analytics/Finance and Accounting/BudgetUtilization';
import ProfitabilityRatios from '../pages/Performance Analytics/Finance and Accounting/ProfitabilityRatios';
import DebtCoverage from '../pages/Performance Analytics/Finance and Accounting/DebtCoverage';


import CostOptimizationSuggestions from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/CostOptimizationSuggestions';
import RevenueGrowthStrategies from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/RevenueGrowthStrategies';
import InvestmentCapitalAllocation from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/InvestmentCapitalAllocation';
import ProfitabilityEnhancement from '../pages/AI-driven Insights & Alerts/AI-Financial Recommendations/ProfitabilityEnhancement';
import ForecastAccuracyMonitoring from '../pages/AI-driven Insights & Alerts/Forecast Accuracy Monitoring/ForecastAccuracyMonitoring';
import BenchmarkingPeerComparisons from '../pages/AI-driven Insights & Alerts/BenchmarkingDashboard/BenchmarkingDashboard';
import PredictiveRiskManagement from '../pages/AI-driven Insights & Alerts/PredictiveRiskManagement/PredictiveRiskManagement';
import SupplyChainAnalytics from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/SupplyChainAnalytics';
import SupplyChainTable from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/SupplyChainTable';
import SupplierPerformanceScorecard from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/SupplierPerformanceScorecard';
import InventoryTurnoverAnalysis from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/InventoryTurnoverAnalysis';
import ProcurementSpendBreakdown from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/ProcurementSpendBreakdown';
import FreightLogisticsOptimization from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/FreightLogisticsOptimization';
import OperationalRiskAssessment from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/OperationalRiskAssessment';
import CostSavingOpportunities from '../pages/Performance Analytics/Supply Chain & Procurement Analytics/CostSavingOpportunities';
import CashShortfallWarning from '../pages/SmartFinancialAlerts/CashShortfallWarning';
import UserManagement from '../pages/Suport/User Management/UserManagement';
import SettingsCustomization from '../pages/SettingsCustomization/SettingsCustomization'; 
import ExpenseTrendAnalysis from '../pages/Performance Analytics/Finance and Accounting/ExpendTrendAnalysis';
import HeadcountPayroll from '../pages/ForecastingOverview/HeadcountPayroll';
import HiringFunnelMetrics from '../pages/Performance Analytics/HR and Workforce/HiringFunnelMetrics';
import DiversityInclusionMetrics from '../pages/Performance Analytics/HR and Workforce/DiversityInclusionMetrics';
import CompensationBenefits from '../pages/Performance Analytics/HR and Workforce/CompensationBenefits';
import GLUploadScreen from '../pages/Gl-Data-upload-screen/GLDataUploadScreen';
import ScrollToTop from '../ScrollToTop';
import OperationalBudgeting from '../pages/Budgeting/Operational-Budgeting/OperationalBudgeting';
import RevenueBasedBudgeting from '../pages/Budgeting/RevenueBased-Budgeting/RevenuebasedBudgeting';
import RevenueDrivenExpenseAllocation from '../pages/Budgeting/RevenueBased-Budgeting/RevenueDrivenExpense';
import SalesGrowthBudgetAdjustments from '../pages/Budgeting/RevenueBased-Budgeting/SaleGrowthBudget';
import CustomerAcquisitionRetentionBudgeting from '../pages/Budgeting/RevenueBased-Budgeting/CustomerAcquisitionRetention';
import SubscriptionRevenueBudgeting from '../pages/Budgeting/RevenueBased-Budgeting/SubscriptionRevenue';
import ScenarioBasedCapexModeling from '../pages/Budgeting/CAPEX-Budgeting/ScenarioBasedCapex';
import HeadcountPlanning from '../pages/Budgeting/WorkforcePayroll-Budgeting/HeadcountPlanning';
<<<<<<< HEAD
import Setup2FA from '../context/setup-2fa';
import Verify2FA from '../context/verify-2fa';
=======
import SalaryCompensationBudgeting from '../pages/Budgeting/WorkforcePayroll-Budgeting/SalaryCompensation';
import AttritionReplacementCostProjections from '../pages/Budgeting/WorkforcePayroll-Budgeting/AttritionReplacement';
import WorkforceEfficiencyAnalysis from '../pages/Budgeting/WorkforcePayroll-Budgeting/orkforceEfficiency';
import JustificationBasedBudgeting from '../pages/Budgeting/ZeroBased-Budgeting/JustificationBased';
import CostControlWasteReduction from '../pages/Budgeting/ZeroBased-Budgeting/CostControlWasteReduction';
import DepartmentZBBImplementation from '../pages/Budgeting/ZeroBased-Budgeting/DepartmentZBBImplementation';
import SpendingEfficiencyRecommendations from '../pages/Budgeting/ZeroBased-Budgeting/SpendingEfficiency';
import ContinuousBudgetUpdates from '../pages/Budgeting/Rolling&Flexible-Budgeting/ContinuousBudgetUpdates';
import ScenarioBasedRollingForecasts from '../pages/Budgeting/Rolling&Flexible-Budgeting/ScenarioBasedRollingForecasts';
import EmergencyContingencyBudgeting from '../pages/Budgeting/Rolling&Flexible-Budgeting/EmergencyContigency';
import AutomatedVarianceAlerts from '../pages/Budgeting/Rolling&Flexible-Budgeting/AutomatedVarianceAlerts';
import RevenueVsBudgetExpansion from '../pages/Budgeting/ScenarioModelling/RevenueVsBudgetExpansion';
import CostCuttingScenarioTesting from '../pages/Budgeting/ScenarioModelling/CostCuttingScenarioTesting';
import MarketEconimicConditionSimulations from '../pages/Budgeting/ScenarioModelling/InvestmentTradeOffs';
import InvestmentTradeOffs from '../pages/Budgeting/ScenarioModelling/InvestmentTradeOffs';
import MarketEconomicSimulations from '../pages/Budgeting/ScenarioModelling/MarketEconomicSimulations';
import AICostOptimizationSuggestions from '../pages/Budgeting/Operational-Budgeting/AICostOptimization';
import CapexBudgeting from '../pages/Budgeting/CAPEX-Budgeting/CapexBudgeting';
import WorkforceBudgeting from '../pages/Budgeting/WorkforcePayroll-Budgeting/WorkforceBudgeting';
import ZeroBasedBudgeting from '../pages/Budgeting/ZeroBased-Budgeting/ZeroBasedBudgeting';
import RollingBudgeting from '../pages/Budgeting/Rolling&Flexible-Budgeting/RollingBudgeting';
import ScenarioModelingBudgeting from '../pages/Budgeting/ScenarioModelling/ScenarioModellingBudgeting';
>>>>>>> a17315b2b3e8ce7124e44c6dd59fd577f0ffbed0




function AllRoutes() {
  return (
    <Router>
            <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
           <Route path="/setup-2fa/:token" element={<Setup2FA />} />
          <Route path="/verify-2fa" element={<Verify2FA />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
             <Route element={<MainLayout />}>
              <Route path="/" element={<FinancialOverview />} />
              <Route path="/financial-overview" element={<FinancialOverview />} />
              <Route path="/key-financial" element={<KeyFinancialKPIs />} />
              <Route path="/financial-core-reports" element={<FinancialReports />} />
              <Route path="/revenueForecasting" element={<RevenueForecasting />} />
              <Route path="debt-interest-Forecasting" element={<DebtInterestForecasting />} />
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
              <Route path="/SupplyChainTable" element={<SupplyChainTable />} />
              <Route path="/SupplierPerformanceScorecard" element={<SupplierPerformanceScorecard />} />
              <Route path="/InventoryTurnoverAnalysis" element={<InventoryTurnoverAnalysis />} />
              <Route path="/ProcurementSpendBreakdown" element={<ProcurementSpendBreakdown />} />
              <Route path="/FreightLogisticsOptimization" element={<FreightLogisticsOptimization />} />
              <Route path="/OperationalRiskAssessment" element={<OperationalRiskAssessment />} />
              <Route path="/CostSavingOpportunities" element={<CostSavingOpportunities />} />



              <Route path="/company-management-table" element={<CompanyManagementTable />} />
              <Route path="/forecasting-overview" element={<ForecastingOverview />} />
              <Route path="/CAPEX-forecast-screen" element={<CAPEXForecastScreen />} />
              <Route path="/scenario-modeling" element={<ScenarioModeling/>} />
              <Route path="/headcount-payroll" element={<HeadcountPayroll />} />
              <Route path="/operational-budgeting" element={<OperationalBudgeting />} />
              <Route path="/fixed-variable-expense" element={<FixedVariableExpense />} />
              <Route path="/capex-budgeting" element={<CapexBudgeting />} />
              <Route path="/revenue-based-budgeting" element={<RevenueBasedBudgeting />} />
              <Route path="/workforce-budgeting" element={<WorkforceBudgeting />} />
              <Route path="/zeroBased-budgeting" element={<ZeroBasedBudgeting />} />
              <Route path="/rolling-budgeting" element={<RollingBudgeting />} />
              <Route path="/scenario-modelling-budgeting" element={<ScenarioModelingBudgeting />} />
              <Route path="/department-budgeting" element={<DepartmentBudgeting />} />
              {/* <Route path="/department-budgeting" element={<AICostOptimization />} /> */}
              <Route path="/aI-cost-optimization" element={<AICostOptimizationSuggestions />} />
              <Route path="/budget-vs-actuals" element={<BudgetVsActuals />} />
              <Route path="/revenue-driven-expense" element={<RevenueDrivenExpenseAllocation />} />
              <Route path="/sale-growth-budget" element={<SalesGrowthBudgetAdjustments />} />
              <Route path="/customer-acquisition-retention" element={<CustomerAcquisitionRetentionBudgeting />} />
              <Route path="/subscription-recurring-revenue" element={<SubscriptionRevenueBudgeting />} />
              <Route path="/salary-compensation" element={<SalaryCompensationBudgeting />} />
              <Route path="/attrition-replacement" element={<AttritionReplacementCostProjections />} />
              <Route path="/workforce-efficiency" element={<WorkforceEfficiencyAnalysis />} />
              <Route path="/justification-based" element={<JustificationBasedBudgeting />} />
              <Route path="/costControl-wasteReduction" element={<CostControlWasteReduction />} />
              <Route path="/department-ZBB-implementation" element={<DepartmentZBBImplementation />} />
              <Route path="/spending-efficiency-recommendations" element={<SpendingEfficiencyRecommendations />} />
              <Route path="/continuous-budget-updates" element={<ContinuousBudgetUpdates />} />
              <Route path="/scenarioBased-rollingForecasts" element={<ScenarioBasedRollingForecasts />} />
              <Route path="/emergency-contigency" element={<EmergencyContingencyBudgeting />} />
              <Route path="/automated-variance-alerts" element={<AutomatedVarianceAlerts />} />
              <Route path="/revenue-budget-expansion" element={<RevenueVsBudgetExpansion />} />
              <Route path="/costCutting-scenario-testing" element={<CostCuttingScenarioTesting />} />
              <Route path="/investment-tradeOffs" element={<InvestmentTradeOffs/>} />
              <Route path="/market-economic-simulations" element={<MarketEconomicSimulations/>} />
              <Route path="/p&l-Dashboard" element={<PLDashboard />} />
              <Route path="/capital-investment-planning" element={<CapitalInvestmentPlanning />} />
              <Route path="/budget-roi-allocation" element={<ROIAllocation />} />
              <Route path="/budget-depreciation-forecast" element={<DepreciationForecast  />} />
              <Route path="/scenario-based-capex" element={<ScenarioBasedCapexModeling  />} />
              <Route path="/headcount-planning" element={<HeadcountPlanning  />} />
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
              <Route path="/hr-workforce-table" element={<HRWorkforceTable  />} />
              <Route path="/employee-productivity-report" element={<EmployeeProductivityReport  />} />
              <Route path="/utilization-rate-report" element={<UtilizationRateReport  />} />  
              <Route path="/retention-attrition-rate" element={<RetentionAttritionRate  />} />  
              <Route path="/hiring-funnel-metrics" element={<HiringFunnelMetrics  />} /> 
              <Route path="/diversity-inclusion-metrics" element={<DiversityInclusionMetrics  />} /> 
              <Route path="/compensation-benefits" element={<CompensationBenefits  />} /> 
              <Route path="/it-technology-spend" element={<ITandTechnology  />} />
              <Route path="/it-spend-table" element={<ITSpendTable  />} />
              <Route path="/it-spend-breakdown" element={<ITSpendBreakdown />} />
              <Route path="/software-license-utilization" element={<SoftwareLicenseUtilization />} />
              <Route path="/infrastructure-cost-efficiency" element={<InfrastructureCostEfficiency />} />
              <Route path="/it-budget-tracker" element={<ITBudgetVsActuals />} />
              <Route path="/security-compliance" element={<SecurityCompliance />} />
              <Route path="/tech-debt-modernization" element={<TechDebtModernization />} />
              <Route path="/finance-accounting-dashboard" element={<FinanceAccountingDashboard />} /> 
              <Route path="/finance-accounting-table" element={<FinanceAccountingTable />} /> 
              <Route path="/tax-compliance" element={<TaxCompliance />} /> 
              <Route path="/expense-trend-analysis" element={<ExpenseTrendAnalysis />} /> 
              <Route path="/liquidity-working-capital" element={<LiquidityWorkingCapital />} />
              <Route path="/budget-utilization" element={<BudgetUtilization />} />
              <Route path="/profitability-ratios" element={<ProfitabilityRatios />} />
              <Route path="/debt-coverage" element={<DebtCoverage />} />
              <Route path="/settings-customization" element={<SettingsCustomization />} />


              {/* GLUploadScreen */}
            <Route path="/gl-upload-screen" element={<GLUploadScreen />} />



              



            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AllRoutes;