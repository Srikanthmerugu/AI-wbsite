import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  BsStars, 
  BsFilter, 
  BsDownload,
  BsInfoCircle,
  BsPieChart,
  BsBarChart,
  BsGraphUp,
  BsServer,
  BsShieldLock,
  BsCodeSquare,
  BsThreeDotsVertical
} from 'react-icons/bs';
import { FiSend, FiChevronDown } from 'react-icons/fi';
import { RiDragMove2Fill } from 'react-icons/ri';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

export const ITSpendAnalytics = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState('Last Quarter');
  const [department, setDepartment] = useState('All Departments');
  const [region, setRegion] = useState('All Regions');
  const [platformType, setPlatformType] = useState('All Platforms');
  const [showFilters, setShowFilters] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState([
    'spendByCategory', 
    'budgetVsActual', 
    'monthlySpendTrend',
    'cloudAdoption',
    'licenseUtilization',
    'techDebtAnalysis'
  ]);
  const [chartTypes, setChartTypes] = useState({
    spendByCategory: 'pie',
    budgetVsActual: 'bar',
    monthlySpendTrend: 'line',
    cloudAdoption: 'doughnut',
    licenseUtilization: 'bar',
    techDebtAnalysis: 'bar'
  });
  const [dropdownWidget, setDropdownWidget] = useState(null);
  const [hoveredChartType, setHoveredChartType] = useState(null);
  const [aiInput, setAiInput] = useState({});
  const [showAIDropdown, setShowAIDropdown] = useState(null);
  const filtersRef = useRef(null);
  const aiChatbotRef = useRef(null);

  // Mock data
  const departments = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];
  const regions = ['North America', 'Europe', 'Asia', 'Global'];
  const platformTypes = ['Cloud', 'On-Prem', 'Hybrid', 'SaaS'];

  // KPI data
  const kpis = [
    {
      id: 1,
      name: 'Total IT Spend',
      value: '$2.45M',
      change: '+8%',
      trend: 'up',
      forecast: '$2.6M next quarter',
      icon: <BsGraphUp size={20} />,
      color: 'text-amber-600'
    },
    {
      id: 2,
      name: 'Avg License Utilization',
      value: '68%',
      change: '+5%',
      trend: 'up',
      forecast: '72% next quarter',
      icon: <BsPieChart size={20} />,
      color: 'text-green-600'
    },
    {
      id: 3,
      name: 'Cloud vs On-Prem Ratio',
      value: '65% Cloud',
      change: '+12% Cloud',
      trend: 'up',
      forecast: '70% Cloud next quarter',
      icon: <BsServer size={20} />,
      color: 'text-blue-600'
    },
    {
      id: 4,
      name: 'Security Incidents',
      value: '8',
      change: '-3',
      trend: 'down',
      forecast: '6 next quarter',
      icon: <BsShieldLock size={20} />,
      color: 'text-red-600'
    },
    {
      id: 5,
      name: 'Tech Debt Score',
      value: '6.2/10',
      change: '-0.4',
      trend: 'down',
      forecast: '5.8 next quarter',
      icon: <BsCodeSquare size={20} />,
      color: 'text-purple-600'
    }
  ];

  const navItems = [
    { name: "IT Spend Breakdown", icon: <BsPieChart />, path: "/it-spend-breakdown" },
    { name: "License Utilization", icon: <BsBarChart />, path: "/software-license-utilization" },
    { name: "Infra Efficiency", icon: <BsServer />, path: "/infrastructure-cost-efficiency" },
    { name: "Budget vs Actuals", icon: <BsGraphUp />, path: "/it-budget-tracker" },
    { name: "Security Analytics", icon: <BsShieldLock />, path: "/security-compliance" },
    { name: "Tech Debt Index", icon: <BsCodeSquare />, path: "/tech-debt-modernization" }
  ];

  // Chart data
  const chartData = {
    spendByCategory: {
      title: "IT Spend by Category",
      componentPath: "/it-spend-table",
      data: {
        labels: ['Cloud Services', 'SaaS Subscriptions', 'Infrastructure', 'Security', 'Personnel', 'Other'],
        datasets: [{
          data: [850000, 650000, 420000, 280000, 200000, 50000],
          backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB', '#9966FF', '#FF9F40'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => `$${context.raw.toLocaleString()} (${Math.round(context.raw/2450000*100)}%)`
            }
          }
        }
      },
      defaultType: 'pie'
    },
    budgetVsActual: {
      title: "Budget vs Actuals",
      componentPath: "/it-spend-table",
      data: {
        labels: ['ERP Upgrade', 'Cloud Migration', 'Security Suite', 'HR System', 'Marketing Platform'],
        datasets: [
          {
            label: 'Budget',
            data: [500000, 750000, 300000, 250000, 200000],
            backgroundColor: '#4BC0C0',
          },
          {
            label: 'Actual',
            data: [550000, 800000, 280000, 270000, 220000],
            backgroundColor: '#FF6384',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => `$${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `$${value/1000}k`
            }
          }
        }
      },
      defaultType: 'bar'
    },
    monthlySpendTrend: {
      title: "Monthly Spend Trend",
      componentPath: "/it-technology-spend",
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Total IT Spend',
          data: [380000, 420000, 450000, 410000, 480000, 500000],
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `$${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `$${value/1000}k`
            }
          }
        }
      },
      defaultType: 'line'
    },
    cloudAdoption: {
      title: "Cloud Adoption",
      componentPath: "/it-technology-spend",
      data: {
        labels: ['Production', 'Development', 'Test', 'Disaster Recovery'],
        datasets: [{
          data: [65, 20, 10, 5],
          backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}% of cloud spend`
            }
          }
        }
      },
      defaultType: 'doughnut'
    },
    licenseUtilization: {
      title: "License Utilization",
      componentPath: "/it-technology-spend",
      data: {
        labels: ['Microsoft 365', 'Salesforce', 'Adobe CC', 'Zoom', 'Slack'],
        datasets: [{
          label: 'Utilization Rate',
          data: [72, 65, 58, 80, 75],
          backgroundColor: '#9966FF',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}% utilization`
            }
          }
        },
        scales: {
          y: {
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            }
          }
        }
      },
      defaultType: 'bar'
    },
    techDebtAnalysis: {
      title: "Tech Debt Analysis",
      componentPath: "/it-technology-spend",
      data: {
        labels: ['Legacy Systems', 'Custom Code', 'Security Patches', 'Documentation', 'Test Coverage'],
        datasets: [{
          label: 'Tech Debt Score (1-10)',
          data: [8.2, 6.5, 5.8, 4.2, 3.7],
          backgroundColor: '#FF9F40',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Score: ${context.raw}/10`
            }
          }
        },
        scales: {
          y: {
            max: 10,
            min: 0,
            ticks: {
              stepSize: 1
            }
          }
        }
      },
      defaultType: 'bar'
    }
  };

  // IT Projects table data
  const projectsTableData = [
    { name: "ERP Upgrade", budget: "$500K", spent: "$550K", completion: "85%", status: "On Track" },
    { name: "Cloud Migration", budget: "$750K", spent: "$800K", completion: "65%", status: "Over Budget" },
    { name: "Security Suite", budget: "$300K", spent: "$280K", completion: "90%", status: "Under Budget" },
    { name: "HR System", budget: "$250K", spent: "$270K", completion: "75%", status: "On Track" },
    { name: "Marketing Platform", budget: "$200K", spent: "$220K", completion: "95%", status: "Over Budget" }
  ];

  // Vendor spend table data
  const vendorTableData = [
    { vendor: "AWS", spend: "$420K", contractEnd: "2024-12-31", utilization: "78%", risk: "Low" },
    { vendor: "Microsoft", spend: "$380K", contractEnd: "2025-06-30", utilization: "65%", risk: "Medium" },
    { vendor: "Salesforce", spend: "$250K", contractEnd: "2024-09-15", utilization: "72%", risk: "Low" },
    { vendor: "Oracle", spend: "$180K", contractEnd: "2023-12-31", utilization: "58%", risk: "High" },
    { vendor: "Google Cloud", spend: "$150K", contractEnd: "2025-03-31", utilization: "82%", risk: "Low" }
  ];

  const toggleChartType = (widgetId, type) => {
    setChartTypes(prev => ({ ...prev, [widgetId]: type }));
  };

  const handleSendAIQuery = (widgetId) => {
    if (aiInput[widgetId]?.trim()) {
      console.log(`AI Query for ${widgetId}:`, aiInput[widgetId]);
      setAiInput(prev => ({ ...prev, [widgetId]: "" }));
      setShowAIDropdown(null);
    }
  };

  const renderChart = (type, data, options = {}) => {
    switch (type) {
      case "line": return <Line data={data} options={options} />;
      case "bar": return <Bar data={data} options={options} />;
      case "pie": return <Pie data={data} options={options} />;
      case "doughnut": return <Doughnut data={data} options={options} />;
      default: return <Bar data={data} options={options} />;
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveWidgets(items);
  };

  const EnhancedChartCard = ({ title, componentPath, chartType, chartData, widgetId, index }) => {
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownWidget(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <Draggable draggableId={widgetId} index={index}>
        {(provided) => (
          <div 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100" 
            ref={provided.innerRef} 
            {...provided.draggableProps}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-sky-800">{title}</h3>
              <div className="flex space-x-2 relative">
                <div className="relative chart-dropdown">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setDropdownWidget(dropdownWidget === widgetId ? null : widgetId); 
                    }} 
                    className="p-1 rounded hover:bg-gray-100" 
                    data-tooltip-id="chart-type-tooltip" 
                    data-tooltip-content="Options"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {dropdownWidget === widgetId && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1 text-xs text-gray-800">
                        <div 
                          className="relative" 
                          onMouseEnter={() => setHoveredChartType(widgetId)} 
                          onMouseLeave={() => setHoveredChartType(null)}
                        >
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                            All Chart Types <FiChevronDown className="ml-1 text-xs" />
                          </div>
                          {hoveredChartType === widgetId && (
                            <div className="absolute top-0 left-full w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1" style={{ marginLeft: "-1px" }}>
                              {["line", "bar", "pie", "doughnut"].map((type) => (
                                <button 
                                  key={type} 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    toggleChartType(widgetId, type); 
                                    setDropdownWidget(null); 
                                    setHoveredChartType(null); 
                                  }} 
                                  className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition"
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(componentPath); 
                            setDropdownWidget(null); 
                            setHoveredChartType(null); 
                          }}
                        >
                          Analyze
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowAIDropdown(showAIDropdown === widgetId ? null : widgetId)} 
                  className="p-1 rounded hover:bg-gray-100" 
                  data-tooltip-id="ai-tooltip" 
                  data-tooltip-content="Ask AI"
                >
                  <BsStars />
                </button>
                {showAIDropdown === widgetId && (
                  <div ref={aiChatbotRef} className="absolute right-0 top-5 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-2">
                    <div className="flex flex-col items-center space-x-2">
                      <h1 className="text-xs">Ask regarding the {title}</h1>
                      <div className="flex justify-between gap-3">
                        <input 
                          type="text" 
                          value={aiInput[widgetId] || ""} 
                          onChange={(e) => setAiInput(prev => ({ ...prev, [widgetId]: e.target.value }))} 
                          placeholder="Ask AI..." 
                          className="w-full p-1 border border-gray-300 rounded text-xs" 
                        />
                        <button 
                          onClick={() => handleSendAIQuery(widgetId)} 
                          className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600" 
                          disabled={!aiInput[widgetId]?.trim()}
                        >
                          <FiSend />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div {...provided.dragHandleProps} className="p-1 rounded hover:bg-gray-100 cursor-move">
                  <RiDragMove2Fill />
                </div>
              </div>
            </div>
            <div className="h-48">
              {renderChart(chartType, chartData.data, chartData.options)}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const KPICard = ({ title, value, change, isPositive, icon, componentPath, forecast }) => {
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const [localAIInput, setLocalAIInput] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowAIDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendAIQuery = () => {
      if (localAIInput.trim()) {
        console.log(`AI Query for ${title}:`, localAIInput);
        setLocalAIInput("");
        setShowAIDropdown(false);
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowAIDropdown(!showAIDropdown); }} 
                className="p-1 rounded hover:bg-gray-100" 
                data-tooltip-id="ai-tooltip" 
                data-tooltip-content="Ask AI"
              >
                <BsStars />
              </button>
              {showAIDropdown && (
                <div ref={dropdownRef} className="absolute right-0 top-8 mt-2 w-44 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={localAIInput} 
                      onChange={(e) => setLocalAIInput(e.target.value)} 
                      placeholder="Ask AI..." 
                      className="w-full p-1 border border-gray-300 rounded text-xs" 
                    />
                    <button 
                      onClick={handleSendAIQuery} 
                      className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600" 
                      disabled={!localAIInput.trim()}
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xl font-bold text-sky-900 mt-1">{value}</p>
            <div className={`flex items-center mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              <span className="text-xs font-medium">{change} {isPositive ? "↑" : "↓"} vs last period</span>
            </div>
            <div className="mt-1">
              <p className="text-xs text-gray-500 italic">AI Forecast: {forecast}</p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors duration-200">
            <div className="text-sky-600 hover:text-sky-800 transition-colors duration-200">{icon}</div>
          </div>
        </div>
      </div>
    );
  };

  const ProjectsTable = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
      <h3 className="text-sm font-semibold text-sky-800 mb-2">IT Projects Overview</h3>
      <table className="w-full text-xs text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Project</th>
            <th className="p-2 text-left">Budget</th>
            <th className="p-2 text-left">Spent</th>
            <th className="p-2 text-left">Completion</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {projectsTableData.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{row.name}</td>
              <td className="p-2">{row.budget}</td>
              <td className="p-2">{row.spent}</td>
              <td className="p-2">{row.completion}</td>
              <td className={`p-2 ${
                row.status === "On Track" ? "text-green-500" : 
                row.status === "Under Budget" ? "text-blue-500" : 
                "text-red-500"
              }`}>
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const VendorTable = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
      <h3 className="text-sm font-semibold text-sky-800 mb-2">Vendor Spend Analysis</h3>
      <table className="w-full text-xs text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Vendor</th>
            <th className="p-2 text-left">Spend</th>
            <th className="p-2 text-left">Contract End</th>
            <th className="p-2 text-left">Utilization</th>
            <th className="p-2 text-left">Risk</th>
          </tr>
        </thead>
        <tbody>
          {vendorTableData.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{row.vendor}</td>
              <td className="p-2">{row.spend}</td>
              <td className="p-2">{row.contractEnd}</td>
              <td className="p-2">{row.utilization}</td>
              <td className={`p-2 ${
                row.risk === "Low" ? "text-green-500" : 
                row.risk === "Medium" ? "text-amber-500" : 
                "text-red-500"
              }`}>
                {row.risk}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
      {/* Header with filters */}
      <div className="bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-white">IT & Technology Spend Overview</h1>
            <p className="text-sky-100 text-xs">Budget utilization, risk, and modernization insights</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <BsFilter className="mr-1" /> Filters
            </button>
            <button 
              className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
            >
              <BsDownload className="mr-1" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm" ref={filtersRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select 
                value={timePeriod} 
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option>Last Quarter</option>
                <option>Last Month</option>
                <option>Last Week</option>
                <option>Year to Date</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option>All Departments</option>
                {departments.map(dept => <option key={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option>All Regions</option>
                {regions.map(reg => <option key={reg}>{reg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Type</label>
              <select 
                value={platformType} 
                onChange={(e) => setPlatformType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option>All Platforms</option>
                {platformTypes.map(type => <option key={type}>{type}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(kpi => (
          <KPICard
            key={kpi.id}
            title={kpi.name}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.trend === 'up'}
            icon={kpi.icon}
            componentPath="/it-technology-spend"
            forecast={kpi.forecast}
          />
        ))}
      </div>


        {/* Quick Links to Sub-Pages */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-sky-100 mt-6">
        <h3 className="text-md font-semibold text-sky-800 mb-4">Explore Detailed Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {navItems.map((item, index) => (
            <Link 
              to={item.path} 
              key={index} 
              className="bg-sky-50 hover:bg-sky-100 p-3 rounded-lg text-center text-sm font-medium text-sky-800 transition-colors"
            >
              <div className="mx-auto w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mb-2 text-sky-600">
                {item.icon}
              </div>
              {item.name}
            </Link>
          ))}
        </div>
      </div>



      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="charts" isDropDisabled={false}>
          {(provided) => (
            <div className="grid gap-6" {...provided.droppableProps} ref={provided.innerRef}>
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedChartCard 
                  title={chartData.spendByCategory.title} 
                  chartType={chartTypes.spendByCategory} 
                  chartData={chartData.spendByCategory} 
                  widgetId="spendByCategory" 
                  index={0} 
                  componentPath={chartData.spendByCategory.componentPath} 
                />
                <EnhancedChartCard 
                  title={chartData.budgetVsActual.title} 
                  chartType={chartTypes.budgetVsActual} 
                  chartData={chartData.budgetVsActual} 
                  widgetId="budgetVsActual" 
                  index={1} 
                  componentPath={chartData.budgetVsActual.componentPath} 
                />
                <EnhancedChartCard 
                  title={chartData.monthlySpendTrend.title} 
                  chartType={chartTypes.monthlySpendTrend} 
                  chartData={chartData.monthlySpendTrend} 
                  widgetId="monthlySpendTrend" 
                  index={2} 
                  componentPath={chartData.monthlySpendTrend.componentPath} 
                />
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedChartCard 
                  title={chartData.cloudAdoption.title} 
                  chartType={chartTypes.cloudAdoption} 
                  chartData={chartData.cloudAdoption} 
                  widgetId="cloudAdoption" 
                  index={3} 
                  componentPath={chartData.cloudAdoption.componentPath} 
                />
                <EnhancedChartCard 
                  title={chartData.licenseUtilization.title} 
                  chartType={chartTypes.licenseUtilization} 
                  chartData={chartData.licenseUtilization} 
                  widgetId="licenseUtilization" 
                  index={4} 
                  componentPath={chartData.licenseUtilization.componentPath} 
                />
                <EnhancedChartCard 
                  title={chartData.techDebtAnalysis.title} 
                  chartType={chartTypes.techDebtAnalysis} 
                  chartData={chartData.techDebtAnalysis} 
                  widgetId="techDebtAnalysis" 
                  index={5} 
                  componentPath={chartData.techDebtAnalysis.componentPath} 
                />
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectsTable />
                <VendorTable />
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 p-5 rounded-xl shadow-sm border border-sky-200 mt-6">
        <h3 className="text-lg font-semibold text-sky-800 mb-3 flex items-center">
          <BsStars className="text-blue-500 mr-2" />
          AI IT Spend Insights
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Cloud Optimization Opportunity</div>
            <div className="text-sky-700">Right-sizing underutilized cloud resources could save ~$85,000 annually (17% of current cloud spend).</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">License Waste Alert</div>
            <div className="text-sky-700">32% of SaaS licenses are underutilized. Consolidating overlapping tools could save $120,000/year.</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="font-medium text-sky-900">Tech Debt Impact</div>
            <div className="text-sky-700">Legacy systems account for 28% of IT spend but only 15% of business value. Modernization could yield 23% ROI.</div>
          </div>
        </div>
      </div>

      <ReactTooltip id="chart-type-tooltip" place="top" effect="solid" />
      <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default ITSpendAnalytics;