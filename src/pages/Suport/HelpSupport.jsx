  import React, { useState } from 'react';
  import { 
    FiHelpCircle, 
    FiBookOpen, 
    FiMessageSquare, 
    FiCalendar,
    FiUsers,
    FiLifeBuoy,
    FiChevronDown,
    FiChevronUp,
    FiSearch,
    FiSend
  } from 'react-icons/fi';

  const HelpSupport = () => {
    const [activeTab, setActiveTab] = useState('knowledge');
    const [activeFaq, setActiveFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    
    // Sample data
    const knowledgeBase = [
      {
        id: 1,
        title: "Getting Started Guide",
        category: "Onboarding",
        views: 1245,
        updated: "2 days ago"
      },
      {
        id: 2,
        title: "Advanced Forecasting Techniques",
        category: "Forecasting",
        views: 892,
        updated: "1 week ago"
      },
      {
        id: 3,
        title: "Troubleshooting Data Imports",
        category: "Technical",
        views: 567,
        updated: "3 days ago"
      }
    ];

    const faqs = [
      {
        id: 1,
        question: "How do I create a new expense forecast?",
        answer: "Navigate to the Forecasting tab and click 'New Forecast'. You can either start from scratch or duplicate an existing forecast template."
      },
      {
        id: 2,
        question: "How does AI categorize fixed vs variable expenses?",
        answer: "Our AI analyzes historical spending patterns, vendor contracts, and expense descriptions to automatically classify costs. You can manually override any categorization."
      }
    ];

    const tickets = [
      {
        id: 1,
        title: "Dashboard loading slowly",
        status: "In Progress",
        created: "2023-06-15",
        priority: "Medium"
      },
      {
        id: 2,
        title: "Export formatting issue",
        status: "Resolved",
        created: "2023-06-10",
        priority: "Low"
      }
    ];

    const upcomingEvents = [
      {
        id: 1,
        title: "New Feature Walkthrough",
        date: "June 20, 2023",
        time: "2:00 PM EST",
        type: "Webinar"
      },
      {
        id: 2,
        title: "Q2 Financial Planning Best Practices",
        date: "June 25, 2023",
        time: "11:00 AM EST",
        type: "Training"
      }
    ];

    const communityPosts = [
      {
        id: 1,
        title: "How are you handling inflationary adjustments?",
        author: "Sarah Johnson",
        replies: 12,
        lastActivity: "3 hours ago"
      },
      {
        id: 2,
        title: "Custom report templates - sharing mine",
        author: "Michael Chen",
        replies: 8,
        lastActivity: "1 day ago"
      }
    ];

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiHelpCircle className="mr-2" /> Help & Support
          </h2>
          
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'knowledge' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiBookOpen className="mr-3" />
                  <span>Knowledge Base</span>
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'ai' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiMessageSquare className="mr-3" />
                  <span>AI Chat Support</span>
                </button>
              </li> */}
              <li>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'tickets' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiLifeBuoy className="mr-3" />
                  <span>Ticketing System</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'training' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiCalendar className="mr-3" />
                  <span>Training & Webinars</span>
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'community' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiUsers className="mr-3" />
                  <span>Community Forum</span>
                </button>
              </li> */}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Knowledge Base */}
          {activeTab === 'knowledge' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <FiBookOpen className="mr-2 text-blue-500" /> Knowledge Base & Documentation
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Suggest Article
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {knowledgeBase.map(article => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg mb-2">{article.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>{article.category}</span>
                      <span>{article.views} views</span>
                    </div>
                    <p className="text-sm text-gray-600">Updated {article.updated}</p>
                    <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Read Article →
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <FiHelpCircle className="mr-2 text-blue-500" /> Frequently Asked Questions
                </h4>
                <div className="space-y-4">
                  {faqs.map(faq => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {activeFaq === faq.id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </button>
                      {activeFaq === faq.id && (
                        <div className="p-4 bg-white text-gray-600 border-t border-gray-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Chat Support */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FiMessageSquare className="mr-2 text-blue-500" /> AI Virtual Assistant
              </h3>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6 h-64 overflow-y-auto">
                <div className="bg-blue-50 p-3 rounded-lg max-w-xs mb-3">
                  <p className="text-sm">Hello! I'm your financial assistant. How can I help you today?</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg max-w-xs ml-auto mb-3">
                  <p className="text-sm">How do I create a custom report?</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">You can create custom reports by going to the Reports section and clicking "New Custom Report". Would you like me to show you a step-by-step guide?</p>
                </div>
              </div>

              <div className="flex">
                <input
                  type="text"
                  placeholder="Ask your question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg">
                  <FiSend />
                </button>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Reset password
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Export data
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Create forecast
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Add new user
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ticketing System */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <FiLifeBuoy className="mr-2 text-blue-500" /> Ticketing System
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  New Ticket
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ticket.created}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-gray-600 hover:text-gray-900">Follow Up</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Training & Webinars */}
          {activeTab === 'training' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" /> Training & Webinars
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FiCalendar className="mr-2" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mb-3">
                      {event.type}
                    </span>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                      Register Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold mb-4">Training Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">Onboarding Videos</h5>
                    <p className="text-sm text-gray-600">Get started with our platform</p>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">Advanced Features</h5>
                    <p className="text-sm text-gray-600">Master our powerful tools</p>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">Certification Program</h5>
                    <p className="text-sm text-gray-600">Become a certified expert</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Community Forum */}
          {activeTab === 'community' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <FiUsers className="mr-2 text-blue-500" /> Community Forum
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  New Post
                </button>
              </div>

              <div className="space-y-4">
                {communityPosts.map(post => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-lg mb-2">{post.title}</h4>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Posted by {post.author}</span>
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Last activity: {post.lastActivity}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Join Discussion →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="font-semibold mb-4">User Groups</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">Financial Analysts</h5>
                    <p className="text-sm text-gray-600">1,245 members</p>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">CFO Network</h5>
                    <p className="text-sm text-gray-600">856 members</p>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-left">
                    <h5 className="font-medium mb-1">Small Business</h5>
                    <p className="text-sm text-gray-600">2,341 members</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default HelpSupport;