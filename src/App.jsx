// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import FinancialOverview from './components/Dashboard/FinancialOverview';
import './App.css';
import KeyFinancialKPIs from './pages/KeyFinancialKPIs';
import FinancialReports from './pages/FinancialReportsCoreResult';
import RevenueForecasting from './pages/RevenueForecasting';
import AIChatBot from './pages/AIChatBot';
import LoginPage from './pages/Login';
import ExpenseForecastingDashboard from './pages/ExpenseForecastingDashboard';
import HelpSupport from './pages/Suport/HelpSupport';
import UserManagement from './pages/Suport/UserManagement';
import CashFlowProjections from './pages/CashFlowProjections';
import SmartFinancialAlerts from './pages/SmartFinancialAlerts';
import AIFinancialRecommendations from './pages/AIFinancialRecommendations';

function App() {
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
            </Route>
          </Route>

          {/* Redirect all other paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;