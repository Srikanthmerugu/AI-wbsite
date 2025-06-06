import React, { useState, useMemo } from 'react';
import { BsStars, BsLightning, BsCheckCircle, BsClock, BsFilter, BsDownload, BsX, BsChatDots, BsPerson, BsFlag } from 'react-icons/bs';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FiChevronRight
} from "react-icons/fi";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


// --- Suggestion Detail Modal Component ---
const SuggestionDetailModal = ({ suggestion, onClose, onUpdate }) => {
  const [currentSuggestion, setCurrentSuggestion] = useState(suggestion);
  const [newComment, setNewComment] = useState("");

  const handleStatusChange = (newStatus) => {
    setCurrentSuggestion({ ...currentSuggestion, status: newStatus });
  };
  
  const handleAssigneeChange = (newAssignee) => {
    setCurrentSuggestion({ ...currentSuggestion, assignee: newAssignee });
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const comment = {
      user: "Finance Analyst", // In a real app, this would be the logged-in user
      text: newComment,
      timestamp: new Date().toISOString(),
    };
    setCurrentSuggestion({
      ...currentSuggestion,
      comments: [...currentSuggestion.comments, comment],
    });
    setNewComment("");
  };

  const handleSaveChanges = () => {
    onUpdate(currentSuggestion);
    onClose();
  };

  const statusOptions = ['pending', 'approved', 'in-progress', 'implemented', 'rejected'];
  const teamOptions = ['Unassigned', 'IT Dept', 'Finance Team', 'Operations', 'Procurement'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-sky-900">{currentSuggestion.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><BsX size={24} /></button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-700">Potential Savings</div>
                  <div className="text-xl font-bold text-green-800">${currentSuggestion.savings.toLocaleString()}</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-xs text-amber-700">Implementation Effort</div>
                  <div className="text-xl font-bold text-amber-800">{currentSuggestion.effort}</div>
              </div>
              <div className="bg-sky-50 p-3 rounded-lg">
                  <div className="text-xs text-sky-700">Operational Impact</div>
                  <div className="text-xl font-bold text-sky-800">{currentSuggestion.impact}</div>
              </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2"><BsStars className="text-sky-500" /> AI-Driven Analysis</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md border">{currentSuggestion.details}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-2 flex items-center gap-2"><BsFlag /> Status</label>
              <select value={currentSuggestion.status} onChange={(e) => handleStatusChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-2 flex items-center gap-2"><BsPerson /> Assign To</label>
              <select value={currentSuggestion.assignee} onChange={(e) => handleAssigneeChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sky-800 mb-3 flex items-center gap-2"><BsChatDots /> Collaboration Log</h4>
            <div className="space-y-3 mb-4">
              {currentSuggestion.comments.map((comment, index) => (
                <div key={index} className="text-sm bg-sky-50 p-2 rounded-md">
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">- {comment.user} on {new Date(comment.timestamp).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-grow p-2 border border-gray-300 rounded-md" />
              <button onClick={handleAddComment} className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700">Post</button>
            </div>
          </div>
        </div>
        <div className="p-5 bg-gray-50 border-t rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100">Cancel</button>
          <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-medium text-white bg-sky-800 rounded-md hover:bg-sky-900">Save Changes</button>
        </div>
      </div>
    </div>
  );
};


export const AICostOptimization = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // AI suggestions data with new fields
  const initialSuggestions = [
    {
      id: 1, title: 'Cloud Service Consolidation', category: 'IT', savings: 18400, effort: 'Medium', impact: 'Low', status: 'pending', assignee: 'IT Dept',
      details: 'Analysis shows 23% of cloud resources are underutilized across AWS and Azure subscriptions. Consolidating instances and leveraging reserved pricing models could yield an estimated $18.4k in annual savings with minimal disruption to services.',
      comments: [],
    },
    {
      id: 2, title: 'Vendor Contract Renegotiation', category: 'Procurement', savings: 32500, effort: 'Low', impact: 'None', status: 'approved', assignee: 'Procurement',
      details: 'Current pricing for office supplies is 12% above the market benchmark identified through AI analysis of industry purchasing data. AI has identified 3 alternative vendors offering equivalent quality at lower rates.',
      comments: [{user: 'Finance Controller', text: 'Approved. Please proceed with vendor outreach.', timestamp: new Date().toISOString()}],
    },
    {
      id: 3, title: 'Energy Efficiency Program', category: 'Facilities', savings: 15700, effort: 'High', impact: 'Positive', status: 'implemented', assignee: 'Facilities',
      details: 'Implementing smart lighting and IoT-enabled HVAC controls in office spaces could reduce energy consumption by an estimated 18%. The project has a 2-year payback period and qualifies for green energy tax credits.',
      comments: [{user: 'Project Manager', text: 'Project completed on 05/15. Monitoring savings now.', timestamp: new Date().toISOString()}],
    },
    {
      id: 4, title: 'Travel Policy Adjustment', category: 'Operations', savings: 28600, effort: 'Low', impact: 'Medium', status: 'pending', assignee: 'Unassigned',
      details: 'Historical expense report analysis shows 45% of domestic travel is for internal-only team meetings. Mandating virtual meetings for these events could significantly reduce T&E costs without affecting client-facing activities.',
      comments: [],
    },
    {
      id: 5, title: 'Software License Optimization', category: 'IT', savings: 42200, effort: 'Medium', impact: 'None', status: 'in-progress', assignee: 'IT Dept',
      details: 'Usage data from our top 10 SaaS vendors indicates that 32% of paid licenses are either completely unused or underutilized (less than 10% of features accessed). Reclaiming these licenses or moving users to lower-cost tiers could save an estimated $42.2k annually.',
      comments: [{user: 'IT Manager', text: 'Audit is underway. Initial findings confirm the AI analysis.', timestamp: new Date().toISOString()}],
    },
  ];

  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // Handlers for modal and data updates
  const handleViewDetails = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSuggestion(null);
  };
  
  const handleUpdateSuggestion = (updatedSuggestion) => {
    setSuggestions(suggestions.map(s => s.id === updatedSuggestion.id ? updatedSuggestion : s));
  };
  
  // Dynamic stats calculation using useMemo for performance
  const summaryStats = useMemo(() => {
    const totalPotential = suggestions.reduce((sum, s) => s.status !== 'rejected' ? sum + s.savings : sum, 0);
    const quickWins = suggestions.reduce((sum, s) => s.effort === 'Low' && s.status !== 'rejected' ? sum + s.savings : sum, 0);
    const implemented = suggestions.reduce((sum, s) => s.status === 'implemented' ? sum + s.savings : sum, 0);
    return { totalPotential, quickWins, implemented };
  }, [suggestions]);

  // Filter suggestions for display
  const filteredSuggestions = suggestions.filter((suggestion) => (
    (activeTab === 'all' || suggestion.status === activeTab) &&
    (selectedCategory === 'All Categories' || suggestion.category === selectedCategory)
  ));
  
  // Data for charts
  const savingsData = {
    labels: ['IT', 'Procurement', 'Facilities', 'Operations'],
    datasets: [{ data: [60600, 32500, 15700, 28600], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }],
  };
  const effortData = {
    labels: ['Low Effort', 'Medium Effort', 'High Effort'],
    datasets: [{ data: [61100, 60600, 15700], backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56'] }],
  };

  const getStatusPill = (status) => {
    switch (status) {
        case 'implemented': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        case 'approved': return 'bg-sky-100 text-sky-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Breadcrumb Navigation */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                    <Link to="/operational-budgeting" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                      Operational Budgeting
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">AI Cost Optimization</span>
                  </div>
                </li>
              </ol>
            </nav>
      {isModalOpen && <SuggestionDetailModal suggestion={selectedSuggestion} onClose={handleCloseModal} onUpdate={handleUpdateSuggestion} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">AI-Based Cost Optimization</h1>
            <p className="text-sky-100 text-xs">Smart suggestions to reduce spending without operational impact</p>
          </div>
          <div className="flex space-x-2">
            <select
              className="py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option><option>IT</option><option>Procurement</option><option>Facilities</option><option>Operations</option>
            </select>
            <button className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                <BsFilter /> Advanced Filters
            </button>
            <button className="flex gap-2 items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200">
                <BsDownload /> Export Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Dynamic Stats summary */}
      <div className="grid grid-cols-1 mt-5 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Total Potential Savings</div>
          <div className="text-2xl font-bold text-sky-900">${summaryStats.totalPotential.toLocaleString()}</div>
          <div className="text-sm text-sky-600">Annual recurring</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Quick Wins</div>
          <div className="text-2xl font-bold text-green-600">${summaryStats.quickWins.toLocaleString()}</div>
          <div className="text-sm text-sky-600">Low effort suggestions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Implemented Savings</div>
          <div className="text-2xl font-bold text-sky-900">${summaryStats.implemented.toLocaleString()}</div>
          <div className="text-sm text-sky-600">YTD realized</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
          <div className="text-sky-800 font-medium">Avg. Implementation</div>
          <div className="text-2xl font-bold text-sky-900">23 days</div>
          <div className="text-sm text-sky-600">Time to savings</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-200 mb-6">
        {['all', 'pending', 'approved', 'in-progress', 'implemented'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? 'text-sky-800 border-b-2 border-sky-500' : 'text-sky-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggestions list */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 hover:border-sky-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-sky-900">{suggestion.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusPill(suggestion.status)} capitalize`}>
                    {suggestion.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sky-700 mb-4">{suggestion.details.substring(0, 150)}...</p>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">${suggestion.savings.toLocaleString()}</span>
                    <span className="text-sm text-sky-600">annual savings</span>
                  </div>
                  <div className="flex gap-4">
                     <div>
                      <div className="text-xs text-sky-600">Effort</div>
                      <div className={`text-sm font-medium ${suggestion.effort === 'Low' ? 'text-green-600' : suggestion.effort === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>{suggestion.effort}</div>
                    </div>
                     <div>
                      <div className="text-xs text-sky-600">Impact</div>
                      <div className={`text-sm font-medium ${suggestion.impact === 'None' ? 'text-green-600' : suggestion.impact === 'Low' ? 'text-amber-600' : 'text-red-600'}`}>{suggestion.impact}</div>
                    </div>
                  </div>
                  <button onClick={() => handleViewDetails(suggestion)} className="text-sm bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Review & Act
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-sky-100 text-center">
              <div className="text-sky-400 mb-2"><BsStars size={32} className="mx-auto" /></div>
              <h3 className="text-lg font-medium text-sky-800 mb-1">No suggestions match your filters</h3>
              <p className="text-sky-600">Try adjusting your filters to see more cost optimization opportunities</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Potential Savings by Category</h3>
            <div className="h-64"><Bar data={savingsData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, ticks: { callback: (value) => `$${value/1000}k` }}}, plugins: { legend: { display: false }}}} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-800 mb-4">Savings by Implementation Effort</h3>
            <div className="h-64"><Doughnut data={effortData} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: { callbacks: { label: (ctx) => `$${ctx.raw.toLocaleString()} potential savings`}}, legend: { position: 'bottom' }}}} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICostOptimization;