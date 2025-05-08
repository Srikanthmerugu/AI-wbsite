import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
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
      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${severityColors[severity]}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <span className="mr-2 text-lg">{severityIcons[severity]}</span>
          <div>
            <h3 className="font-bold text-base text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full shadow">
          {time}
        </span>
      </div>
      {suggestedActions && (
        <div className="mt-2">
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
      className="bg-white p-4 rounded-lg shadow-sm h-80"
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

const AIChatPanel = ({ onSendMessage, messages }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <> 
    {/* <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white h-110 p-4 rounded-lg sticky top-3 shadow-sm  flex flex-col"
    >
      <h3 className="font-semibold text-gray-800 mb-2">AI Assistant</h3>
      <div className="flex-1 overflow-y-auto mb-2 p-2 bg-gray-50 rounded-lg">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-100 ml-auto max-w-[80%]' : 'bg-gray-200 mr-auto max-w-[80%]'
              }`}
            >
              <p className="text-sm text-gray-800">{msg.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">Start a conversation with the AI</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the AI..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          <FiSend size={20} />
        </button>
      </form>
    </motion.div> */}
    </>
   
  );
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
      description: 'Payment W of $8,450 to Office Supply Co. due in 3 days.',
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
    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      setAiMessages(prev => [...prev, { text: 'Processing your request...', sender: 'ai' }]);
    }, 500);
  };

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Smart Financial Alerts</h1>
          <p className="text-sm text-gray-600">Automated notifications for key financial events</p>
        </div>
        <div className="flex items-center">
          <FiBell className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium">Alerts Center</span>
        </div>
      </div> */}





<div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white">Smart Financial Alerts</h1>
              <p className="text-sky-100 text-xs">Automated notifications for key financial events</p>
            </div>
            <div className="flex space-x-2">
              {/* <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="py-2 px-4 text-sm font-medium cursor-pointer text-sky-50 bg-sky-800 rounded-lg hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="12M">Last 12 Months</option>
                <option value="YTD">Year to Date</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center py-2 px-4 text-sm font-medium text-sky-50 bg-sky-800 rounded-lg hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <FiFilter className="mr-2" /> Filters
              </button>
              <Link to='/financial-gl-upload'><p
                
                className="flex items-center py-2 px-4 text-sm font-medium text-sky-50 bg-sky-800 rounded-lg hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <MdOutlineFileUpload className="mr-2"  size={20} />
                
                 Upload GL file
              </p></Link> */}
            </div>
          </div>
        </div>


















      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {['all', 'cash', 'budget', 'revenue', 'expenses', 'receivables', 'payables'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-sky-800 text-white' : 'bg-white text-sky-700 border border-gray-200 hover:bg-gray-100'
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

          {/* <AlertChart 
            data={activeTab === 'cash' ? cashFlowData : budgetData} 
            chartType={activeTab === 'cash' ? 'area' : 'pie'}
            title={activeTab === 'all' ? 'Financial Overview' : 
                  activeTab === 'cash' ? 'Cash Flow Trend' : 
                  activeTab === 'budget' ? 'Budget Allocation' : 
                  activeTab === 'revenue' ? 'Revenue Analysis' : 
                  activeTab === 'expenses' ? 'Expense Breakdown' : 
                  activeTab === 'receivables' ? 'Receivables Status' : 'Payables Schedule'}
          /> */}

          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No alerts found for this category</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIChatPanel onSendMessage={handleSendMessage} messages={aiMessages} />
        </div>
      </div>
    </div>
  );
};

export default SmartFinancialAlerts;