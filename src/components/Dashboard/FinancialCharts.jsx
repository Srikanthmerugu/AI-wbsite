import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { BsStars, BsThreeDotsVertical } from "react-icons/bs";
import { RiDragMove2Fill } from "react-icons/ri";
import { FiChevronDown, FiSend } from "react-icons/fi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
} from "react-chartjs-2";

const useOutsideClick = (callback) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref;
};

const renderChart = (type, data, options = {}) => {
  switch (type) {
    case "line":
      return <Line data={data} options={options} />;
    case "bar":
      return <Bar data={data} options={options} />;
    case "pie":
      return <Pie data={data} options={options} />;
    case "doughnut":
      return <Doughnut data={data} options={options} />;
    case "radar":
      return <Radar data={data} options={options} />;
    case "polarArea":
      return <PolarArea data={data} options={options} />;
    case "bubble":
      return <Bubble data={data} options={options} />;
    default:
      return <Line data={data} options={options} />;
  }
};

const EnhancedChartCard = ({
  title,
  componentPath,
  chartType,
  chartData,
  widgetId,
  index,
  onChartTypeChange,
  onAIQuery,
}) => {
  const navigate = useNavigate();
  const [dropdownWidget, setDropdownWidget] = useState(null);
  const [hoveredChartType, setHoveredChartType] = useState(null);
  const [aiInput, setAiInput] = useState("");
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const dropdownRef = useOutsideClick(() => setDropdownWidget(null));

  const handleSendAIQuery = () => {
    if (aiInput.trim()) {
      onAIQuery(widgetId, aiInput);
      setAiInput("");
      setShowAIDropdown(false);
    }
  };

  return (
    <Draggable draggableId={widgetId} index={index}>
      {(provided) => (
        <div
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100"
          ref={provided.innerRef}
          {...provided.draggableProps}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-sky-800">{title}</h3>
            <div className="flex space-x-2 relative">
              <div className="relative chart-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownWidget(dropdownWidget === widgetId ? null : widgetId);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                  data-tooltip-id="chart-type-tooltip"
                  data-tooltip-content="Options">
                  <BsThreeDotsVertical />
                </button>

                {dropdownWidget === widgetId && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1 text-xs text-gray-800">
                      <div
                        className="relative"
                        onMouseEnter={() => setHoveredChartType(widgetId)}
                        onMouseLeave={() => setHoveredChartType(null)}>
                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                          All Chart Types
                          <FiChevronDown className="ml-1 text-xs" />
                        </div>

                        {hoveredChartType === widgetId && (
                          <div
                            className="absolute top-0 left-full w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1"
                            style={{ marginLeft: "-1px" }}>
                            {[
                              "line",
                              "bar",
                              "pie",
                              "doughnut",
                              "radar",
                              "polarArea",
                              "bubble",
                            ].map((type) => (
                              <button
                                key={type}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onChartTypeChange(widgetId, type);
                                  setDropdownWidget(null);
                                  setHoveredChartType(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition">
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
                        }}>
                        Analyze
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAIDropdown(!showAIDropdown)}
                className="p-1 rounded hover:bg-gray-100"
                data-tooltip-id="ai-tooltip"
                data-tooltip-content="Ask AI">
                <BsStars />
              </button>
              {showAIDropdown && (
                <div className="absolute right-0 top-5 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-2">
                  <div className="flex flex-col items-center space-x-2">
                    <h1 className="text-xs">Ask regarding the {title}</h1>
                    <div className="flex justify-between gap-3">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask AI..."
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                      />
                      <button
                        onClick={handleSendAIQuery}
                        className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                        disabled={!aiInput.trim()}>
                        <FiSend />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div
                {...provided.dragHandleProps}
                className="p-1 rounded hover:bg-gray-100 cursor-move">
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

const FinancialCharts = ({ 
  activeWidgets, 
  chartsData, 
  chartTypes, 
  onDragEnd,
  onChartTypeChange,
  onAIQuery
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="charts" isDropDisabled={false}>
        {(provided) => (
          <div
            className="grid gap-6"
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {/* Row 1: 3 charts (2 vertical + 1 spanning 2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {activeWidgets.slice(0, 3).map((widgetId, index) => (
                <EnhancedChartCard
                  key={widgetId}
                  title={chartsData[widgetId].title}
                  chartType={chartTypes[widgetId]}
                  chartData={chartsData[widgetId]}
                  widgetId={widgetId}
                  index={index}
                  componentPath={chartsData[widgetId].componentPath}
                  onChartTypeChange={onChartTypeChange}
                  onAIQuery={onAIQuery}
                />
              ))}
            </div>

            {/* Row 2: 2 charts side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {activeWidgets.slice(3, 5).map((widgetId, index) => (
                <EnhancedChartCard
                  key={widgetId}
                  title={chartsData[widgetId].title}
                  chartType={chartTypes[widgetId]}
                  chartData={chartsData[widgetId]}
                  widgetId={widgetId}
                  index={index + 3}
                  componentPath={chartsData[widgetId].componentPath}
                  onChartTypeChange={onChartTypeChange}
                  onAIQuery={onAIQuery}
                />
              ))}
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FinancialCharts;