import React, { useState } from 'react';
import { FiSend, FiClock, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const AIChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you with financial analysis today?', sender: 'ai', time: '12:30 PM' }
  ]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const newUserMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `I'm analyzing your query about "${input}". Here's what I found...`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Sample conversation history
  const history = {
    today: [
      { id: 1, preview: 'Revenue forecast analysis', time: '12:30 PM' },
      { id: 2, preview: 'Expense breakdown Q2', time: '11:45 AM' }
    ],
    yesterday: [
      { id: 3, preview: 'Cash flow projections', time: '4:20 PM' },
      { id: 4, preview: 'Budget variance report', time: '2:15 PM' }
    ],
    history: [
      { id: 5, preview: 'Financial ratio analysis', time: 'May 20' },
      { id: 6, preview: 'Annual report summary', time: 'May 18' },
      { id: 7, preview: 'Investment recommendations', time: 'May 15' }
    ]
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Conversation History */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-sky-800">𝙵𝚒𝚗𝚂𝚒𝚐𝚑𝚝𝙰𝙸 𝙲𝚑𝚊𝚝
          </h2>
        </div>
        
        {/* History Tabs */}
        <div className="flex border-b bg-gray-300 border-gray-200">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'today' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiCalendar className="inline mr-1" /> Today
          </button>
          {/* <button 
            onClick={() => setActiveTab('yesterday')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'yesterday' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiClock className="inline mr-1" /> Yesterday
          </button> */}
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiMessageSquare className="inline mr-1" /> History
          </button>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1  overflow-y-auto">
          {history[activeTab].map(convo => (
            <div key={convo.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="text-sm font-medium text-gray-800 truncate">{convo.preview}</div>
              <div className="text-xs text-gray-500">{convo.time}</div>
            </div>
          ))}
        </div>
        
        {/* User Profile */}
        {/* <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              JS
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-800">John Smith</div>
              <div className="text-xs text-gray-500">Finance Team</div>
            </div>
          </div>
        </div> */}
      </div>
      
      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Financial Analysis Assistant</h2>
          <p className="text-sm text-gray-500">Ask me anything about financial reports, forecasts, or insights</p>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'}`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask FinSightAI about financial reports, forecasts, or insights..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="2"
              />
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`absolute right-3 bottom-3 p-1 rounded-full ${input.trim() === '' 
                  ? 'text-gray-400' 
                  : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              FinSightAI may produce inaccurate information about financial data. Always verify critical insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;