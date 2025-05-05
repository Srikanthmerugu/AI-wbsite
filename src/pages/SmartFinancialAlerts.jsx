import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
// import { BellIcon, FiMessageSquare } from '@heroicons/react/24/outline';
import { FiBell, FiMessageSquare, FiSend } from 'react-icons/fi';

import { motion } from 'framer-motion';

const AlertCard = ({ title, description, severity, time, suggestedActions }) => {
  const severityColors = {
    critical: 'bg-red-50 border-l-4 border-red-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    normal: 'bg-green-50 border-l-4 border-green-500'
  };

  const severityIcons = {
    critical: '🔴',
    warning: '🟡',
    normal: '🟢'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg shadow-sm mb-4 ${severityColors[severity]}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <span className="mr-2 text-lg">{severityIcons[severity]}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full shadow">
          {time}
        </span>
      </div>
      {suggestedActions && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-1 text-gray-500">SUGGESTED ACTIONS:</p>
          <ul className="text-sm list-disc list-inside text-gray-700">
            {suggestedActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const AlertChart = ({ data, chartType = 'area', title }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-sm h-64"
    >
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        {chartType === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" />
          </AreaChart>
        ) : chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        ) : chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : null}
      </ResponsiveContainer>
    </motion.div>
  );
};

const AIChatPanel = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

 
};

const SmartFinancialAlerts = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [aiMessages, setAiMessages] = useState([]);

  // Sample data
  const cashFlowData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const budgetData = [
    { name: 'Marketing', value: 40 },
    { name: 'R&D', value: 30 },
    { name: 'Sales', value: 20 },
    { name: 'Operations', value: 10 },
  ];

  const alerts = [
    {
      category: 'cash',
      title: 'Cash Shortfall Warning',
      description: 'Projected cash balance will fall below minimum threshold in 14 days.',
      severity: 'critical',
      time: '10 min ago',
      suggestedActions: [
        'Delay non-essential purchases',
        'Follow up on outstanding invoices',
        'Consider short-term financing options'
      ]
    },
    {
      category: 'cash',
      title: 'Positive Cash Flow Detected',
      description: 'Cash reserves increased by 12% this month.',
      severity: 'normal',
      time: '2 days ago'
    },
    {
      category: 'budget',
      title: 'Marketing Budget Overrun',
      description: 'Marketing department has spent 92% of quarterly budget with 6 weeks remaining.',
      severity: 'warning',
      time: '1 hour ago',
      suggestedActions: [
        'Review recent marketing expenditures',
        'Adjust campaign spending for remainder of quarter',
        'Request budget adjustment if needed'
      ]
    },
    {
      category: 'revenue',
      title: 'Revenue Drop Alert',
      description: 'Monthly revenue decreased by 18% compared to last month.',
      severity: 'critical',
      time: '30 min ago',
      suggestedActions: [
        'Analyze sales by product line',
        'Check for seasonal trends',
        'Review recent marketing effectiveness'
      ]
    },
    {
      category: 'expenses',
      title: 'Unusual Expense Detected',
      description: 'Office supplies expense increased by 250% compared to monthly average.',
      severity: 'warning',
      time: '5 hours ago',
      suggestedActions: [
        'Verify all office supply purchases',
        'Check for bulk orders or one-time purchases',
        'Review approval process for expenses'
      ]
    },
    {
      category: 'receivables',
      title: 'Overdue Payment Alert',
      description: '5 invoices totaling $24,850 are overdue by 30+ days.',
      severity: 'warning',
      time: '2 hours ago',
      suggestedActions: [
        'Send reminder emails to clients',
        'Initiate collection calls',
        'Review credit terms for repeat offenders'
      ]
    },
    {
      category: 'payables',
      title: 'Vendor Payment Due',
      description: 'Payment of $8,450 to Office Supply Co. due in 3 days.',
      severity: 'normal',
      time: '1 day ago',
      suggestedActions: [
        'Schedule payment',
        'Verify invoice details',
        'Take early payment discount if available'
      ]
    }
  ];

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.category === activeTab);

  const handleSendMessage = (message) => {
    setAiMessages([...aiMessages, { text: message, sender: 'user' }]);
    // Here you would typically call an AI API and add the response
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Financial Alerts</h1>
          <p className="text-gray-600">Automated notifications for key financial events</p>
        </div>
        <div className="flex items-center">
          <FiBell className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-sm font-medium">Alerts Center</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['all', 'cash', 'budget', 'revenue', 'expenses', 'receivables', 'payables'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {tab === 'all' ? 'All Alerts' : 
                 tab === 'cash' ? 'Cash Flow' : 
                 tab === 'budget' ? 'Budget' : 
                 tab === 'revenue' ? 'Revenue' : 
                 tab === 'expenses' ? 'Expenses' : 
                 tab === 'receivables' ? 'Receivables' : 'Payables'}
              </button>
            ))}
          </div>

          <div className="mb-6 ">
            <AlertChart 
              data={activeTab === 'cash' ? cashFlowData : budgetData} 
              chartType={activeTab === 'cash' ? 'area' : 'pie'}
              title={activeTab === 'all' ? 'Financial Overview' : 
                    activeTab === 'cash' ? 'Cash Flow Trend' : 
                    activeTab === 'budget' ? 'Budget Allocation' : 
                    activeTab === 'revenue' ? 'Revenue Analysis' : 
                    activeTab === 'expenses' ? 'Expense Breakdown' : 
                    activeTab === 'receivables' ? 'Receivables Status' : 'Payables Schedule'}
            />
          </div>

          <div className="space-y-4 ">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No alerts found for this category</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIChatPanel onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default SmartFinancialAlerts;