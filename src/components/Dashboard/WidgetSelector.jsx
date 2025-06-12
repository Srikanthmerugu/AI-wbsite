import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const WidgetSelector = ({ activeWidgets, setActiveWidgets }) => {
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const allWidgets = [
    { id: "revenueTrend", name: "Revenue Trend" },
    { id: "expenseBreakdown", name: "Expense Breakdown" },
    { id: "profitAnalysis", name: "Profit Analysis" },
    { id: "cashFlow", name: "Cash Flow" },
    { id: "headcount", name: "Headcount Trend" },
  ];

  const toggleWidget = (widgetId) => {
    if (activeWidgets.includes(widgetId)) {
      setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    } else {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center py-2 px-3 text-xs font-medium text-white bg-sky-900 rounded-lg border border-sky-200 hover:bg-white hover:text-sky-900 transition-colors duration-200"
        onClick={() => setShowWidgetSelector(!showWidgetSelector)}>
        <FiPlus className="mr-1" />
        Add Widget
      </button>
      
      {showWidgetSelector && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Available Widgets</div>
          {allWidgets.map(widget => (
            <label key={widget.id} className="flex items-center space-x-2 p-1 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={activeWidgets.includes(widget.id)}
                onChange={() => toggleWidget(widget.id)}
                className="rounded text-sky-600"
              />
              <span>{widget.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetSelector;