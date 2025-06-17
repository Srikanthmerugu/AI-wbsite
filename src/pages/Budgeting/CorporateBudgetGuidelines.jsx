import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSave, FiCheckCircle, FiInfo, FiChevronRight, FiGitCommit, FiPlus, FiTrash2, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Professional Mock Data & Configuration ---
// This structure is more robust, allowing for multiple, driver-based rules per department.
const initialData = {
    sales: {
        department: "Sales",
        rules: [
            { id: 1, metric: 'T&E Spend Growth', operator: '<=', value: '15%', notes: 'Travel must align with approved revenue plan.' },
            { id: 2, metric: 'New FTEs (AEs)', operator: '=', value: '5', notes: 'Hiring to be phased in H2.' },
        ]
    },
    marketing: {
        department: "Marketing",
        rules: [
            { id: 3, metric: 'Total Opex vs PY', operator: '<=', value: '0%', notes: '10% increase allowed only if tied to documented pipeline ROI.' },
            { id: 4, metric: 'SaaS Spend', operator: '<', value: '$250,000', notes: 'All renewals over $20k need separate VP approval.' },
        ]
    },
    it: {
        department: "IT",
        rules: [
            { id: 5, metric: 'Cloud Spend (AWS/GCP)', operator: 'Optimize', value: '-5%', notes: 'Prioritize cloud cost optimization via reserved instances.' },
            { id: 6, metric: 'Capital Expenditure', operator: '=', value: '$500,000', notes: 'Budget allocated for security & infrastructure upgrades.' },
        ]
    },
    hr: {
        department: "HR & People",
        rules: [
            { id: 7, metric: 'Annual Salary Inflation', operator: '=', value: '5%', notes: 'Standard merit increase pool.' },
            { id: 8, metric: 'New FTEs (G&A)', operator: '=', value: '2', notes: 'Use headcount module for detailed inputs.' },
        ]
    },
};

const metricOptions = ['Total Opex vs PY', 'T&E Spend Growth', 'SaaS Spend', 'Cloud Spend (AWS/GCP)', 'New FTEs (AEs)', 'New FTEs (G&A)', 'Annual Salary Inflation', 'Capital Expenditure'];
const operatorOptions = ['<=', '>=', '=', '<', '>', 'Optimize'];

const initialVersionHistory = [
    { version: 'FY25 Guidance v1.1', publishedBy: 'Jane Doe, VP Finance', timestamp: '2024-03-15T14:30:00Z', notes: 'Updated IT guidance for new security project and clarified Sales T&E does not include annual kick-off event cost.' },
    { version: 'FY25 Guidance v1.0', publishedBy: 'Jane Doe, VP Finance', timestamp: '2024-03-01T09:00:00Z', notes: 'Initial budget guidelines published for FY2025 planning cycle.' },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const CorporateBudgetGuidelines = () => {
    const [guidelines, setGuidelines] = useState(JSON.parse(JSON.stringify(initialData)));
    const [versionHistory, setVersionHistory] = useState(initialVersionHistory);
    const [hasChanges, setHasChanges] = useState(false);
    const [newVersionNotes, setNewVersionNotes] = useState('');

    const handleRuleChange = (deptKey, ruleId, field, value) => {
        setGuidelines(prev => ({
            ...prev,
            [deptKey]: {
                ...prev[deptKey],
                rules: prev[deptKey].rules.map(rule => 
                    rule.id === ruleId ? { ...rule, [field]: value } : rule
                )
            }
        }));
        setHasChanges(true);
    };
    
    const addRule = (deptKey) => {
        const newRule = { id: Date.now(), metric: metricOptions[0], operator: '<=', value: '0%', notes: '' };
        setGuidelines(prev => ({
            ...prev,
            [deptKey]: {
                ...prev[deptKey],
                rules: [...prev[deptKey].rules, newRule]
            }
        }));
        setHasChanges(true);
    };

    const deleteRule = (deptKey, ruleId) => {
        setGuidelines(prev => ({
            ...prev,
            [deptKey]: {
                ...prev[deptKey],
                rules: prev[deptKey].rules.filter(rule => rule.id !== ruleId)
            }
        }));
        setHasChanges(true);
    };

    const handlePublish = () => {
        if (!newVersionNotes.trim()) {
            alert('Please provide notes for this new version before publishing.');
            return;
        }
        const newVersionNumber = `v${(parseFloat(versionHistory[0].version.split('v')[1]) + 0.1).toFixed(1)}`;
        const newVersion = {
            version: `FY25 Guidance ${newVersionNumber}`,
            publishedBy: 'Current User (FP&A Lead)',
            timestamp: new Date().toISOString(),
            notes: newVersionNotes,
        };
        setVersionHistory(prev => [newVersion, ...prev]);
        setHasChanges(false);
        setNewVersionNotes('');
        alert(`${newVersion.version} has been published successfully! Department heads will now see these guidelines.`);
    };

    return (
        <div className="space-y-6 p-4 min-h-screen relative bg-sky-50">
            {/* Breadcrumb & Header */}
            <motion.div initial="hidden" animate="visible" variants={cardVariants}>
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li><Link to="/budgeting-hub" className="text-sm font-medium text-gray-700 hover:text-blue-600">Budgeting Hub</Link></li>
                        <li><div className="flex items-center"><FiChevronRight className="w-3 h-3 text-gray-400 mx-1" /><span className="text-sm font-medium text-gray-500">Settings</span></div></li>
                        <li><div className="flex items-center"><FiChevronRight className="w-3 h-3 text-gray-400 mx-1" /><span className="text-sm font-medium text-gray-500">Corporate Guidelines</span></div></li>
                    </ol>
                </nav>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h1 className="text-xl font-bold text-sky-900">Corporate Budget Guidelines</h1>
                    <p className="text-sm text-gray-600 mt-1">Define and publish top-down targets to guide the annual financial planning process across all departments.</p>
                </div>
            </motion.div>

            {/* Editor Section */}
            <motion.div initial="hidden" animate="visible" variants={cardVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-sky-800 mb-4">Edit FY2025 Planning Guidelines</h2>
                <div className="space-y-8">
                    {Object.keys(guidelines).map(deptKey => {
                        const dept = guidelines[deptKey];
                        return (
                            <div key={deptKey}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-md text-sky-900">{dept.department}</h3>
                                    <button onClick={() => addRule(deptKey)} className="flex items-center text-sm text-sky-600 hover:text-sky-800">
                                        <FiPlus size={14} className="mr-1"/> Add Guideline
                                    </button>
                                </div>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full">
                                        <thead className="bg-sky-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider w-[25%]">Metric</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider w-[10%]">Operator</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider w-[15%]">Value</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider w-[40%]">Notes / Rationale</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-sky-700 uppercase tracking-wider w-[10%]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {dept.rules.map(rule => (
                                                <tr key={rule.id} className="hover:bg-sky-50/50">
                                                    <td className="p-2"><select value={rule.metric} onChange={e => handleRuleChange(deptKey, rule.id, 'metric', e.target.value)} className="w-full p-2 border-gray-300 border rounded-md text-sm"><option disabled>Select Metric</option>{metricOptions.map(o => <option key={o}>{o}</option>)}</select></td>
                                                    <td className="p-2"><select value={rule.operator} onChange={e => handleRuleChange(deptKey, rule.id, 'operator', e.target.value)} className="w-full p-2 border-gray-300 border rounded-md text-sm">{operatorOptions.map(o => <option key={o}>{o}</option>)}</select></td>
                                                    <td className="p-2"><input type="text" value={rule.value} onChange={e => handleRuleChange(deptKey, rule.id, 'value', e.target.value)} className="w-full p-2 border-gray-300 border rounded-md text-sm" /></td>
                                                    <td className="p-2"><input type="text" value={rule.notes} onChange={e => handleRuleChange(deptKey, rule.id, 'notes', e.target.value)} className="w-full p-2 border-gray-300 border rounded-md text-sm" /></td>
                                                    <td className="p-2 text-center"><button onClick={() => deleteRule(deptKey, rule.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><FiTrash2 size={16}/></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Publishing & Version History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial="hidden" animate="visible" variants={cardVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-sky-800 mb-2">Publish New Version</h2>
                    <p className="text-sm text-gray-500 mb-4">Publishing makes these guidelines official and visible to department heads. This action is recorded and cannot be undone.</p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="versionNotes" className="block text-sm font-medium text-gray-700 mb-1">Release Notes for this Version <span className="text-red-500">*</span></label>
                            <textarea id="versionNotes" rows="3" value={newVersionNotes} onChange={(e) => setNewVersionNotes(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500" placeholder="e.g., 'Initial targets for FY25 cycle.'" />
                        </div>
                        <div className="text-right">
                            <button onClick={handlePublish} disabled={!newVersionNotes.trim()} className={`inline-flex items-center px-6 py-2 text-sm font-medium rounded-lg text-white transition-colors ${!newVersionNotes.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                                <FiCheckCircle className="mr-2" /> Publish Guidelines
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={cardVariants} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-sky-800 mb-4">Version History</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {versionHistory.map(v => (
                            <div key={v.timestamp} className="p-3 border border-gray-200 rounded-lg bg-gray-50/70">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <FiGitCommit className="text-gray-500 mr-3 mt-1 flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-sky-900">{v.version}</p>
                                            <p className="text-xs text-gray-500">By {v.publishedBy} on {new Date(v.timestamp).toLocaleDateString()}</p>
                                            <p className="mt-1 text-sm text-gray-700">{v.notes}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-sky-600 hover:underline flex-shrink-0 ml-2">View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CorporateBudgetGuidelines;