import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiUsers, FiMonitor, FiBriefcase, FiDollarSign, FiInfo, FiChevronRight, FiEdit, FiAlertCircle, FiSave } from "react-icons/fi";
import { Tooltip as ReactTooltip } from "react-tooltip";

// --- Mock Data and Configuration ---
// This simulates fetching data for a specific department based on a URL parameter.
// In a real app, this would be an API call: `fetch('/api/budget/opex/${departmentName}')`
const departmentDetailsData = {
  marketing: {
    name: "Marketing",
    guideline: "Marketing budget to remain flat vs. last year; 10% increase only if tied to documented pipeline ROI. (FY25 Guidance v1)",
    people: {
      totalCost: 1250000,
      headcount: 8,
      aiInsight: "Cost includes a 4% standard merit increase. Headcount is flat YoY.",
      lastYearCost: 1180000,
    },
    campaigns: [
      { id: 1, name: "Q3 Social Media Blitz", driver_cost: 75000, driver_count: 1, notes: "Targeting new user acquisition.", aiBaseline: 70000 },
      { id: 2, name: "Annual Conference Sponsorship", driver_cost: 120000, driver_count: 1, notes: "Platinum sponsorship package.", aiBaseline: 120000 },
      { id: 3, name: "Content Creation (Blogs/Videos)", driver_cost: 15000, driver_count: 12, notes: "Monthly agency retainer.", aiBaseline: 15000 },
    ],
    software: [
      { id: 1, name: "HubSpot Marketing Hub", driver_cost: 300, driver_count: 10, notes: "10 Marketing user seats.", aiBaseline: 3000 },
      { id: 2, name: "Canva for Teams", driver_cost: 25, driver_count: 15, notes: "Includes design and marketing teams.", aiBaseline: 375 },
      { id: 3, name: "SEMrush", driver_cost: 500, driver_count: 1, notes: "Advanced SEO toolkit subscription.", aiBaseline: 500 },
    ],
  },
  sales: {
    name: "Sales",
    guideline: "No more than 15% YoY growth on T&E spend. Travel must align with the revenue plan. (FY25 Guidance v1)",
    people: {
      totalCost: 2100000, headcount: 15, aiInsight: "Includes 3 new Account Executive hires for H2.", lastYearCost: 1850000,
    },
    campaigns: [],
    software: [
        { id: 1, name: "Salesforce Sales Cloud", driver_cost: 150, driver_count: 20, notes: "20 Sales user seats.", aiBaseline: 3000 },
        { id: 2, name: "ZoomInfo", driver_cost: 18000, driver_count: 1, notes: "Annual data subscription.", aiBaseline: 18000 },
    ],
  }
};

const SCENARIOS = { BASELINE: "Baseline", STRETCH: "Stretch", CONSERVATIVE: "Conservative" };

// --- Main Component ---

const DepartmentLevelBudgeting = () => {
    const { departmentName = "marketing" } = useParams(); // Default to marketing for demo
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("people");
    const [departmentData, setDepartmentData] = useState(null);
    const [activeScenario, setActiveScenario] = useState(SCENARIOS.BASELINE);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // This simulates fetching data when the component mounts or the departmentName changes.
        const data = departmentDetailsData[departmentName.toLowerCase()];
        if (data) {
            setDepartmentData(data);
        } else {
            console.error("Department not found:", departmentName);
            // Optionally navigate to a 404 page
            // navigate('/not-found'); 
        }
    }, [departmentName]);

    const handleInputChange = (category, index, field, value) => {
        setDepartmentData(prev => {
            const newCategoryData = [...prev[category]];
            newCategoryData[index] = { ...newCategoryData[index], [field]: value };
            return { ...prev, [category]: newCategoryData };
        });
        setHasChanges(true);
    };

    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((acc, item) => acc + (parseFloat(item.driver_cost) || 0) * (parseFloat(item.driver_count) || 0), 0);
    };

    if (!departmentData) {
        return <div className="p-8 text-center text-gray-500">Loading department data...</div>;
    }

    const TABS = [
        { id: "people", label: "People", icon: <FiUsers /> },
        { id: "campaigns", label: "Campaigns & Ads", icon: <FiDollarSign /> },
        { id: "software", label: "Software & Tools", icon: <FiMonitor /> },
        { id: "general", label: "General Expenses", icon: <FiBriefcase /> },
    ];

    // --- Reusable Sub-Components ---

    const CorporateGuidelineBanner = ({ guideline }) => (
        <div className="bg-sky-100 border-l-4 border-sky-500 text-sky-800 p-4 mb-6 rounded-r-lg" role="alert">
            <div className="flex items-center">
                <FiInfo className="mr-3 text-2xl flex-shrink-0" />
                <div>
                    <p className="font-bold">Corporate Budget Guideline</p>
                    <p className="text-sm">{guideline}</p>
                </div>
            </div>
        </div>
    );
    
    // --- Views for each tab ---

    const PeopleView = ({ data }) => (
        <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-sky-900 mb-2">People & Headcount Budget</h3>
            <p className="text-sm text-gray-500 mb-4">Summary of all salary, bonus, and benefits costs for the {departmentData.name} department.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
                    <p className="text-sm font-medium text-sky-700">Total Estimated Cost</p>
                    <p className="text-2xl font-bold text-sky-900">${data.totalCost.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
                    <p className="text-sm font-medium text-sky-700">Budgeted Headcount (FTE)</p>
                    <p className="text-2xl font-bold text-sky-900">{data.headcount}</p>
                </div>
                <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
                    <p className="text-sm font-medium text-sky-700 relative">AI Insight <FiInfo className="inline-block ml-1 text-gray-400" /></p>
                    <p className="text-sm text-gray-800 mt-2">{data.aiInsight}</p>
                </div>
            </div>
            <div className="text-right">
                <button
                    onClick={() => navigate('/budgeting/workforce-planning')}
                    className="inline-flex items-center px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                >
                    <FiEdit className="mr-2" /> Manage Headcount Details
                </button>
            </div>
        </div>
    );

    const DriverBasedTable = ({ title, description, items, columns, categoryKey }) => (
        <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-sky-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-sky-50">
                        <tr>
                            {columns.map(col => <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-sky-800 uppercase tracking-wider">{col.label}</th>)}
                            <th className="px-4 py-3 text-right text-xs font-semibold text-sky-800 uppercase tracking-wider">Calculated Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <tr key={item.id} className="hover:bg-sky-50/50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                                        <input
                                            type={col.type || "text"}
                                            value={item[col.key]}
                                            onChange={(e) => handleInputChange(categoryKey, index, col.key, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500"
                                            placeholder={col.placeholder || ''}
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-right text-sm font-medium text-sky-900">
                                    ${((parseFloat(item.driver_cost) || 0) * (parseFloat(item.driver_count) || 0)).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-sky-100">
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-3 text-right font-bold text-sky-800">Sub-Total</td>
                            <td className="px-4 py-3 text-right font-bold text-sky-900">${calculateTotal(items).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
                 <div className="text-right mt-4">
                    <button className="text-sm font-medium text-sky-600 hover:text-sky-800">+ Add Line Item</button>
                </div>
            </div>
        </div>
    );

    // --- Main Return ---

    return (
        <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
            {/* Breadcrumb Navigation */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li><Link to="/budgeting" className="text-sm font-medium text-gray-700 hover:text-blue-600">Budgeting Hub</Link></li>
                    <li><div className="flex items-center"><FiChevronRight className="w-3 h-3 text-gray-400 mx-1" /><span className="text-sm font-medium text-gray-500">Opex Planning</span></div></li>
                    <li><div className="flex items-center"><FiChevronRight className="w-3 h-3 text-gray-400 mx-1" /><span className="text-sm font-medium text-gray-500 capitalize">{departmentName}</span></div></li>
                </ol>
            </nav>
            
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-sky-900 capitalize">{departmentData.name} Department: Opex Budget</h1>
                        <p className="text-sm text-gray-600 mt-1">Enter and manage all operating expenses using driver-based inputs for FY2025.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Scenario:</label>
                        <select value={activeScenario} onChange={(e) => setActiveScenario(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm">
                            {Object.values(SCENARIOS).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <button onClick={() => {}} disabled={!hasChanges} className={`px-4 py-2 text-sm rounded-lg flex items-center ${hasChanges ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><FiSave className="mr-2" /> Save Changes</button>
                    </div>
                </div>
            </div>
            
            <CorporateGuidelineBanner guideline={departmentData.guideline} />

            {/* Sub-Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center
                                ${activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                            }
                        >
                            {React.cloneElement(tab.icon, { className: 'mr-2' })}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === 'people' && <PeopleView data={departmentData.people} />}
                
                {activeTab === 'campaigns' && (
                    <DriverBasedTable
                        title="Campaigns, Events & Advertising"
                        description="Budget for all marketing and promotional activities."
                        items={departmentData.campaigns}
                        categoryKey="campaigns"
                        columns={[
                            { key: 'name', label: 'Campaign/Event Name', placeholder: 'e.g., Q4 Conference' },
                            { key: 'driver_cost', label: 'Cost per Unit/Event ($)', type: 'number', placeholder: '25000' },
                            { key: 'driver_count', label: 'Count', type: 'number', placeholder: '1' },
                            { key: 'notes', label: 'Notes / Justification', placeholder: 'Sponsorship cost' },
                        ]}
                    />
                )}

                {activeTab === 'software' && (
                     <DriverBasedTable
                        title="Software & Technology Tools"
                        description="Budget for all SaaS subscriptions and technology licenses used by this department."
                        items={departmentData.software}
                        categoryKey="software"
                        columns={[
                            { key: 'name', label: 'Application Name', placeholder: 'e.g., Salesforce' },
                            { key: 'driver_cost', label: 'Cost per Unit/Month ($)', type: 'number', placeholder: '150' },
                            { key: 'driver_count', label: 'Units (e.g., Seats)', type: 'number', placeholder: '20' },
                            { key: 'notes', label: 'Notes / Justification', placeholder: 'Sales team licenses' },
                        ]}
                    />
                )}

                {activeTab === 'general' && (
                    <div className="p-6 bg-white rounded-lg shadow-sm border text-center">
                         <h3 className="text-lg font-semibold text-sky-900 mb-2">General & Administrative Expenses</h3>
                         <p className="text-sm text-gray-500">Budget for T&E, office supplies, consulting, and other general expenses.</p>
                         <p className="mt-4 text-sm text-gray-400">(Content for this tab would be built out here)</p>
                    </div>
                )}
            </div>
            
            <ReactTooltip id="global-tooltip" place="top" effect="solid" />
        </div>
    );
};

export default DepartmentLevelBudgeting;