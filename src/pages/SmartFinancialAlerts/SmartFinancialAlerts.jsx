
import React, { useState, useEffect } from 'react';
import { 
  FiAlertTriangle, 
  FiDollarSign, 
  FiTrendingDown, 
  FiCreditCard, 
  FiClock, 
  FiCalendar,
  FiChevronRight,
  FiBarChart2,
  FiBell,
  FiZap
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SmartFinancialAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const alertTypes = [
    {
      id: 'cash_shortfall',
      title: 'Cash Shortfall Warning',
      description: 'AI predicts potential liquidity issues and suggests corrective actions',
      icon: <FiDollarSign className="text-red-500" size={24} />,
      color: 'bg-red-50',
      textColor: 'text-red-600',
      linkTo: '/CashShortfallWarning'
    },
    {
      id: 'budget_overrun',
      title: 'Budget Overrun Alerts',
      description: 'Real-time notifications when departments exceed their allocated budgets',
      icon: <FiTrendingDown className="text-yellow-500" size={24} />,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      linkTo: '/smart-financial-alerts'
    },
    {
      id: 'revenue_drop',
      title: 'Revenue Drop Alerts',
      description: 'Identify unexpected drops in revenue & suggest corrective actions',
      icon: <FiBarChart2 className="text-purple-500" size={24} />,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
      linkTo: '/smart-financial-alerts'
    },
    {
      id: 'expense_spike',
      title: 'Expense Spike Detection',
      description: 'Highlights unusual spending patterns for further investigation',
      icon: <FiCreditCard className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      linkTo: '/smart-financial-alerts'
    },
    {
      id: 'ar_aging',
      title: 'Accounts Receivable Alerts',
      description: 'Notifies about overdue payments & suggests follow-ups',
      icon: <FiClock className="text-green-500" size={24} />,
      color: 'bg-green-50',
      textColor: 'text-green-600',
      linkTo: '/smart-financial-alerts'
    },
    {
      id: 'ap_due',
      title: 'Accounts Payable Alerts',
      description: 'Reminds users about upcoming vendor payments to avoid penalties',
      icon: <FiCalendar className="text-indigo-500" size={24} />,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      linkTo: '/smart-financial-alerts'
    }
  ];

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAlerts = [
          {
            id: 1,
            type: 'cash_shortfall',
            title: 'Potential Cash Shortfall Warning',
            message: 'AI predicts a potential liquidity issue in the next 30 days. Suggested actions: delay non-essential purchases or arrange short-term financing.',
            severity: 'high',
            date: new Date(),
            resolved: false,
            linkTo: '/CashShortfallWarning',
            details: {
              predictedShortfall: '$45,200',
              timeframe: 'Next 30 days',
              confidence: '82%',
              suggestions: [
                'Delay non-essential capital expenditures',
                'Arrange short-term line of credit',
                'Accelerate accounts receivable collection'
              ]
            }
          },
          {
            id: 2,
            type: 'budget_overrun',
            title: 'Marketing Budget Overrun',
            message: 'Marketing department has exceeded allocated budget by 15% this quarter.',
            severity: 'medium',
            date: new Date(Date.now() - 86400000),
            resolved: false,
            linkTo: '/smart-financial-alerts',
            details: {
              department: 'Marketing',
              overrunAmount: '$12,750',
              percentage: '15%',
              period: 'Q2 2023',
              suggestions: [
                'Review recent marketing expenditures',
                'Reallocate funds from underutilized budgets',
                'Request additional budget approval'
              ]
            }
          },
          {
            id: 3,
            type: 'revenue_drop',
            title: 'Revenue Decline Detected',
            message: 'Sales in the Southwest region dropped 22% compared to last month.',
            severity: 'high',
            date: new Date(Date.now() - 172800000),
            resolved: true,
            linkTo: '/smart-financial-alerts',
            details: {
              region: 'Southwest',
              dropPercentage: '22%',
              timePeriod: 'Month-over-month',
              comparedTo: 'May 2023',
              suggestions: [
                'Run targeted promotions in affected region',
                'Review regional sales team performance',
                'Analyze competitor activity in the area'
              ]
            }
          },
          {
            id: 4,
            type: 'expense_spike',
            title: 'Unusual Expense Pattern',
            message: 'Office supplies expense increased by 300% compared to monthly average.',
            severity: 'medium',
            date: new Date(Date.now() - 259200000),
            resolved: false,
            linkTo: '/smart-financial-alerts',
            details: {
              category: 'Office Supplies',
              increasePercentage: '300%',
              amount: '$8,450',
              averageAmount: '$2,100',
              suggestions: [
                'Verify all recent office supply purchases',
                'Check for duplicate orders or errors',
                'Implement purchase approval process'
              ]
            }
          },
          {
            id: 5,
            type: 'ar_aging',
            title: 'Overdue Accounts Receivable',
            message: '5 invoices totaling $12,450 are overdue by more than 60 days.',
            severity: 'medium',
            date: new Date(Date.now() - 345600000),
            resolved: false,
            linkTo: '/smart-financial-alerts',
            details: {
              overdueInvoices: 5,
              totalAmount: '$12,450',
              agingPeriod: '60+ days',
              oldestInvoice: 'Invoice #20345 (92 days)',
              suggestions: [
                'Send payment reminders to clients',
                'Offer early payment discounts',
                'Consider collection agency for oldest invoices'
              ]
            }
          },
          {
            id: 6,
            type: 'ap_due',
            title: 'Vendor Payment Due',
            message: 'Payment of $8,750 to Tech Supplies Inc. is due in 3 days.',
            severity: 'low',
            date: new Date(Date.now() - 432000000),
            resolved: false,
            linkTo: '/smart-financial-alerts',
            details: {
              vendor: 'Tech Supplies Inc.',
              amount: '$8,750',
              dueDate: 'June 15, 2023',
              paymentTerms: 'Net 30',
              suggestions: [
                'Schedule payment processing',
                'Verify goods/services received',
                'Confirm payment details with vendor'
              ]
            }
          }
        ];
        
        setAlerts(mockAlerts);
        setIsLoading(false);
        
        // Show toast for high severity alerts
        mockAlerts.filter(a => a.severity === 'high' && !a.resolved).forEach(alert => {
          toast.error(alert.message, {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);
  
  const getSeverityBadge = (severity) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${classes[severity] || 'bg-gray-100 text-gray-800'}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };
  
  const markAsResolved = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };
  
  const filteredAlerts = activeTab === 'all' 
    ? alerts.filter(alert => !alert.resolved)
    : alerts.filter(alert => !alert.resolved && alert.type === activeTab);
  
  const resolvedAlerts = alerts.filter(alert => alert.resolved);
  
  const navigateToAlertDetails = (alert) => {
    navigate(alert.linkTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* <ToastContainer /> */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm w-full">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Smart Financial Alerts</h1>
          </div>
          <p className="text-lg text-white">Automated notifications for key financial events with AI-driven insights</p>
        </div>
        
        {/* Alert Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {alertTypes.map((type) => (
            <Link
              key={type.id}
              to={type.linkTo}
              className={`${type.color} p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${type.color} mr-4`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-1 ${type.textColor}`}>{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
                <FiChevronRight className="text-gray-400 mt-1" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Alerts Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                All Alerts
              </button>
              {alertTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === type.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {type.title}
                </button>
              ))}
              <button
                onClick={() => setActiveTab('resolved')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'resolved' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Resolved
              </button>
            </nav>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {activeTab !== 'resolved' && (
                <div className="divide-y divide-gray-200">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => {
                      const alertType = alertTypes.find(t => t.id === alert.type);
                      return (
                        <div 
                          key={alert.id} 
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => navigateToAlertDetails(alert)}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 p-3 rounded-lg ${alertType?.color || 'bg-gray-50'} mr-4`}>
                              {alertType?.icon || <FiAlertTriangle className="text-gray-500" size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                                {getSeverityBadge(alert.severity)}
                              </div>
                              <p className="text-gray-600 mb-3">{alert.message}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {alert.date.toLocaleDateString()} at {alert.date.toLocaleTimeString()}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsResolved(alert.id);
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Mark as Resolved
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium">No alerts found</h3>
                      <p className="mt-1">You're all caught up with no {activeTab === 'all' ? '' : 'active'} alerts in this category.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'resolved' && (
                <div className="divide-y divide-gray-200">
                  {resolvedAlerts.length > 0 ? (
                    resolvedAlerts.map(alert => {
                      const alertType = alertTypes.find(t => t.id === alert.type);
                      return (
                        <div 
                          key={alert.id} 
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => navigateToAlertDetails(alert)}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 p-3 rounded-lg ${alertType?.color || 'bg-gray-50'} mr-4 opacity-60`}>
                              {alertType?.icon || <FiAlertTriangle className="text-gray-500" size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-medium text-gray-500 line-through">{alert.title}</h3>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                  Resolved
                                </span>
                              </div>
                              <p className="text-gray-400 mb-3">{alert.message}</p>
                              <div className="text-sm text-gray-400">
                                {alert.date.toLocaleDateString()} at {alert.date.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium">No resolved alerts</h3>
                      <p className="mt-1">All resolved alerts will appear here for your reference.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartFinancialAlerts;
