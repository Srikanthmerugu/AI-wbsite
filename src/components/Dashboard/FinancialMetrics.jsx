import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiDollarSign, FiUsers } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";

const KPICard = ({ title, value, change, isPositive, icon, componentPath }) => {
  const [showAIDropdown, setShowAIDropdown] = React.useState(false);
  const [localAIInput, setLocalAIInput] = React.useState("");
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAIDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendAIQuery = () => {
    if (localAIInput.trim()) {
      console.log(`AI Query for ${title}:`, localAIInput);
      setLocalAIInput("");
      setShowAIDropdown(false);
    }
  };

  const needsDollarSign = [
    "revenue",
    "gross_profit",
    "expenses",
    "net_profit",
    "cash_flow",
  ].includes(title.toLowerCase().replace(/ /g, "_"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-white p-3 rounded-lg shadow-sm border border-sky-100 relative">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider truncate">
              {title.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAIDropdown(!showAIDropdown);
              }}
              className="p-1 rounded hover:bg-gray-100"
              data-tooltip-id="ai-tooltip"
              data-tooltip-content="Ask AI">
              <BsStars />
            </button>
            {showAIDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-5 mt-2 w-full sm:w-44 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={localAIInput}
                    onChange={(e) => setLocalAIInput(e.target.value)}
                    placeholder="Ask AI..."
                    className="w-full p-1 border border-gray-300 rounded text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={handleSendAIQuery}
                    className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600"
                    disabled={!localAIInput.trim()}>
                    <FiSend />
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-sky-900 mt-1">
            {needsDollarSign && "$"}
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <div
            className={`flex items-center mt-2 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}>
            <span className="text-[10px] font-medium">
              {change} {isPositive ? "↑" : "↓"} vs last period
            </span>
          </div>
        </div>
        <div className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors duration-200">
          <div className="text-sky-600 hover:text-sky-800 transition-colors duration-200">
            {icon}
          </div>
        </div>
      </div>
      <ReactTooltip id="ai-tooltip" place="top" effect="solid" />
    </motion.div>
  );
};

const FinancialMetrics = ({ kpiData }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {Object.entries(kpiData).map(([key, value]) => {
        const isPositive = value.change.startsWith('+');
        return (
          <KPICard
            key={key}
            title={key}
            value={value.value}
            change={value.change}
            isPositive={isPositive}
            icon={
              key === "revenue" ? (
                <FiTrendingUp size={16} />
              ) : key === "gross_profit" ||
                key === "expenses" ||
                key === "net_profit" ? (
                <FiDollarSign size={16} />
              ) : key === "cash_flow" ? (
                <FiTrendingUp size={16} />
              ) : key === "headcount" ? (
                <FiUsers size={16} />
              ) : (
                <FiPieChart size={16} />
              )
            }
            componentPath={value.componentPath}
          />
        );
      })}
    </div>
  );
};

export default FinancialMetrics;