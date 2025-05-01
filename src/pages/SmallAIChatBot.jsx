import React, { useState } from 'react';
import { FiSend, FiClock, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { fevicon } from '../assets/Assets';

const SmallAIChatBot = () => {
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
    <div className="flex w-[100%] h-screen bg-sky-50">
      {/* Left Sidebar - Conversation History */}
      <div className=" bg-sky-50 border-r border-sky-700 flex flex-col">
        {/* <div className="p-4 border-b border-sky-700 bg-sky-800">
          <h2 className="text-lg font-semibold text-sky-50">FinSightAI Chat</h2>
        </div> */}
        
        {/* History Tabs */}
       
        
        {/* Conversation List */}
   
      </div>
      
      {/* Right Side - Chat Area */}
      <div className="flex-1 justify-center items-center flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-sky-50  gap-5 border-b ">
            <div className='flex gap-4 items-center '>
            <img src={fevicon}  width="50px"/>

<h2 className="text-lg font-semibold text-sky-900">𝙵𝚒𝚗𝚂𝚒𝚐𝚑𝚝𝙰𝙸 𝙲𝚑𝚊𝚝 </h2>
            </div>
       
          <p className="text-sm text-sky-700">Ask me anything about financial reports, forecasts, or insights</p>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-sky-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${message.sender === 'user' 
                    ? 'bg-sky-600 text-sky-50 rounded-br-none' 
                    : 'bg-white border border-sky-200 text-sky-900 rounded-bl-none shadow-sm'}`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-sky-200' : 'text-sky-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-sky-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask FinSightAI about financial reports, forecasts, or insights..."
                className="w-full p-3 pr-12 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                rows="2"
              />
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`absolute right-3 bottom-3 p-1 rounded-full ${input.trim() === '' 
                  ? 'text-sky-300' 
                  : 'text-sky-600 hover:bg-sky-100'}`}
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-xs text-sky-500 mt-2">
              FinSightAI may produce inaccurate information about financial data. Always verify critical insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallAIChatBot;