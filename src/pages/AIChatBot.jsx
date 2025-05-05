import React, { useState, useEffect } from "react";
import { FiSend, FiClock, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { FaRobot, FaUser } from "react-icons/fa"; // User and AI icons

const AIChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I assist you with financial analysis today?",
      sender: "ai",
      time: "12:30 PM",
    },
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("today");

  const handleSend = () => {
    if (input.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newUserMessage]);
    setInput("");

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `I'm analyzing your query about "${input}". Here's a simulated response based on financial data...`,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Sample conversation history
  const history = {
    today: [
      { id: 1, preview: "Revenue forecast analysis", time: "12:30 PM" },
      { id: 2, preview: "Expense breakdown Q2", time: "11:45 AM" },
    ],
    // yesterday: [
    //   { id: 3, preview: "Cash flow projections", time: "4:20 PM" },
    //   { id: 4, preview: "Budget variance report", time: "2:15 PM" },
    // ],
    history: [
      { id: 5, preview: "Financial ratio analysis", time: "May 20" },
      { id: 6, preview: "Annual report summary", time: "May 18" },
      { id: 7, preview: "Investment recommendations", time: "May 15" },
    ],
  };

  return (
    <div className="flex h-[85vh] bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Sidebar - Conversation History */}
      <div className=" bg-white border-r border-gray-300 shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-sky-800 to-sky-600">
          <h2 className="text-xl font-bold text-white drop-shadow-md">𝙵𝚒𝚗𝚂𝚒𝚐𝚑𝚝𝙰𝙸 𝙲𝚑𝚊𝚝</h2>
        </div>

        {/* History Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "today" ? "text-blue-600 border-b-2 border-blue-600 bg-gray-50" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiCalendar className="inline mr-2" /> Today
          </button>
          {/* <button
            onClick={() => setActiveTab("yesterday")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "yesterday" ? "text-blue-600 border-b-2 border-blue-600 bg-gray-50" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiClock className="inline mr-2" /> Yesterday
          </button> */}
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600 bg-gray-50" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiMessageSquare className="inline mr-2" /> History
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2">
          {history[activeTab].map((convo) => (
            <div
              key={convo.id}
              className="p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors rounded-lg"
            >
              <div className="text-sm font-medium text-gray-800 truncate">{convo.preview}3</div>
              <div className="text-xs text-gray-500">{convo.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-2 border-b border-gray-200 bg-white shadow-md">
          {/* <h2 className="text-xl font-bold text-gray-900">Financial Analysis Assistant</h2> */}
          <p className="text-sm font-semibold text-sky-900 mt-1">Ask me anything about financial reports, forecasts, or insights</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="flex items-start animate-slide-in-left">
                    <spam className="border border-sky-200 rounded-full p-1 mr-3 mt-1"><FaRobot className="w-6  text-2xl  h-6 text-blue-500 " size={24}/></spam>
                    <div className="bg-gradient-to-br from-blue-100 to-gray-100 border border-gray-200 rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg shadow-md">
                      <div className="text-sm text-gray-800">{message.text}</div>
                      <div className="text-xs text-gray-500 mt-1">{message.time}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start animate-slide-in-right">
                    <div className="bg-sky-600 text-white rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg shadow-md rounded-bl-none">
                      <div className="text-sm">{message.text}</div>
                      <div className="text-xs text-blue-200 mt-1">{message.time}</div>
                    </div>
                    {/* <FaUser className="w-6 h-6 text-green-500 ml-3 mt-1" /> */}
                    <spam className="border border-sky-200 text-sm rounded-full p-2 ml-3 mt-1"><FaUser className="w-6  text-sm  h-6 text-blue-500 " /></spam>

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-2 border-t z-50 border-gray-200 bg-white shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask FinSightAI about financial reports, forecasts, or insights..."
                className="w-full p-4 pr-12 outline-0 border-2 border-sky-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm placeholder-gray-400"
                rows="3"
              />
              <button
                onClick={handleSend}
                disabled={input.trim() === ""}
                className={`absolute right-4 bottom-4 p-2 text-sky-500 rounded-full transition-colors ${
                  input.trim() === ""
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                <FiSend size={20} />
              </button>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;