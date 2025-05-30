
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiDollarSign, FiInfo, FiDownload, FiArrowLeft, FiChevronRight} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CashShortfallWarning = () => {
  const navigate = useNavigate();
  const [shortfallData, setShortfallData] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortfallData = async () => {
      try {
        // Simulate API call for shortfall data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockShortfall = {
          id: 1,
          title: 'Potential Cash Shortfall Warning',
          message: 'AI predicts a potential liquidity issue in the next 30 days.',
          severity: 'high',
          date: new Date(),
          resolved: false,
          details: {
            predictedShortfall: '$45,200',
            timeframe: 'Next 30 days',
            confidence: '82%',
            suggestions: [
              'Delay non-essential capital expenditures',
              'Arrange short-term line of credit',
              'Accelerate accounts receivable collection'
            ]
          }
        };

        // Generate mock cash flow data for 30 days
        const today = new Date();
        const cashFlow = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const balance = 100000 - i * 2000 + Math.random() * 5000 - 2500;
          return { date: date.getTime(), balance: balance > 0 ? balance : 0 };
        });

        setShortfallData(mockShortfall);
        setCashFlowData(cashFlow);
        setLoading(false);

        // Show toast for high severity
        if (mockShortfall.severity === 'high' && !mockShortfall.resolved) {
          toast.error(mockShortfall.message, {
            position: 'top-right',
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        }
      } catch (error) {
        console.error('Error fetching shortfall data:', error);
        toast.error('Failed to load shortfall data', {
          position: 'top-right',
          autoClose: 5000
        });
        setLoading(false);
      }
    };

    fetchShortfallData();
  }, []);

  const exportToExcel = () => {
    if (!shortfallData || !cashFlowData.length) {
      toast.warn('No data available to export', { position: 'top-right', autoClose: 5000 });
      return;
    }
    try {
      const wsData = [
        ['Title', shortfallData.title],
        ['Message', shortfallData.message],
        ['Severity', shortfallData.severity],
        ['Date', shortfallData.date.toLocaleDateString()],
        ['Predicted Shortfall', shortfallData.details.predictedShortfall],
        ['Timeframe', shortfallData.details.timeframe],
        ['Confidence', shortfallData.details.confidence],
        ...shortfallData.details.suggestions.map((s, i) => ['Suggestion ' + (i + 1), s]),
        ['', ''], // Spacer
        ['Cash Flow Projections'],
        ['Date', 'Projected Cash Balance'],
        ...cashFlowData.map(item => [
          new Date(item.date).toLocaleDateString(),
          `$${item.balance.toLocaleString()}`
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CashShortfall');
      XLSX.writeFile(wb, 'Cash_Shortfall_Warning.xlsx');
      toast.success('Exported to Excel successfully', { position: 'top-right', autoClose: 5000 });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel', { position: 'top-right', autoClose: 5000 });
    }
  };

  const exportToPDF = () => {
    if (!shortfallData) {
      toast.warn('No data available to export', { position: 'top-right', autoClose: 5000 });
      return;
    }
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Cash Shortfall Warning', 14, 15);
      doc.setFontSize(12);
      doc.autoTable({
        head: [['Field', 'Value']],
        body: [
          ['Title', shortfallData.title],
          ['Message', shortfallData.message],
          ['Severity', shortfallData.severity],
          ['Date', shortfallData.date.toLocaleDateString()],
          ['Predicted Shortfall', shortfallData.details.predictedShortfall],
          ['Timeframe', shortfallData.details.timeframe],
          ['Confidence', shortfallData.details.confidence]
        ],
        startY: 20
      });
      doc.autoTable({
        head: [['Suggestions']],
        body: shortfallData.details.suggestions.map(s => [s]),
        startY: doc.lastAutoTable.finalY + 10
      });
      doc.autoTable({
        head: [['Date', 'Projected Cash Balance']],
        body: cashFlowData.map(item => [
          new Date(item.date).toLocaleDateString(),
          `$${item.balance.toLocaleString()}`
        ]),
        startY: doc.lastAutoTable.finalY + 10
      });
      doc.save('Cash_Shortfall_Warning.pdf');
      toast.success('Exported to PDF successfully', { position: 'top-right', autoClose: 5000 });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export to PDF', { position: 'top-right', autoClose: 5000 });
    }
  };

  const markAsResolved = () => {
    if (shortfallData) {
      setShortfallData({ ...shortfallData, resolved: true });
      toast.success('Alert marked as resolved', {
        position: 'top-right',
        autoClose: 5000
      });
      // TODO: Sync with SmartFinancialAlerts via API or context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
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
                      <Link to="/smart-financial-alerts" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                        Smart Financial Alerts
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <FiChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
                      <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">Detailed View</span>
                    </div>
                  </li>
                </ol>
              </nav>
        {/* Header */}
        

        <div className="mb-5 flex justify-between items-center bg-gradient-to-r from-[#004a80] to-[#cfe6f7] p-4 rounded-lg shadow-sm w-full">
          <div className="flex items-center">
           
            <div>
              <div className="flex items-center">
                {/* <FiDollarSign className="text-red-500 mr-2" size={28} /> */}
                <h1 className="text-2xl font-bold text-white">Cash Shortfall Warning</h1>
              </div>
              <p className="text-white mt-1">AI-driven predictions of liquidity issues with corrective actions</p>
            </div>
          </div>
          <div className="flex space-x-4">
             <button
              onClick={() => navigate('/smart-financial-alerts')}
              className="mr-4 flex p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back to alerts"
            >
              <FiArrowLeft size={24} className="text-gray-600" /> Back
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <FiDownload className="mr-1" /> Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <FiDownload className="mr-1" /> PDF
            </button>
            
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cash Flow Projection Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold">Cash Flow Projection</h2>
                <FiInfo
                  data-tooltip-id="cash-flow-tooltip"
                  className="ml-2 text-gray-500 cursor-pointer"
                />
                <ReactTooltip id="cash-flow-tooltip" place="top" className="max-w-xs">
                  Projected cash balance over the next 30 days, highlighting potential shortfall risks.
                </ReactTooltip>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={time => new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                    />
                    <YAxis
                      tickFormatter={value => `$${value.toLocaleString()}`}
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      formatter={value => `$${value.toLocaleString()}`}
                      labelFormatter={time => new Date(time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#ef4444"
                      fill="rgba(239, 68, 68, 0.2)"
                      name="Projected Cash Balance ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shortfall Details */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold">Shortfall Details</h2>
                <FiInfo
                  data-tooltip-id="shortfall-tooltip"
                  className="ml-2 text-gray-500 cursor-pointer"
                />
                <ReactTooltip id="shortfall-tooltip" place="top" className="max-w-xs">
                  AI-predicted details of the potential cash shortfall, including amount, timeframe, and confidence level.
                </ReactTooltip>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Predicted Shortfall</p>
                  <p className="text-lg font-semibold text-red-600">
                    {shortfallData?.details.predictedShortfall || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Timeframe</p>
                  <p className="text-lg font-semibold text-red-600">
                    {shortfallData?.details.timeframe || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-lg font-semibold text-red-600">
                    {shortfallData?.details.confidence || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Corrective Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold">Suggested Corrective Actions</h2>
                <FiInfo
                  data-tooltip-id="suggestions-tooltip"
                  className="ml-2 text-gray-500 cursor-pointer"
                />
                <ReactTooltip id="suggestions-tooltip" place="top" className="max-w-xs">
                  AI-generated suggestions to mitigate the predicted cash shortfall.
                </ReactTooltip>
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {shortfallData?.details.suggestions?.length ? (
                  shortfallData.details.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No suggestions available</li>
                )}
              </ul>
              {!shortfallData?.resolved && (
                <button
                  onClick={markAsResolved}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashShortfallWarning;
