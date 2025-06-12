import React from "react";

const FinancialDataTable = ({ kpiData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
      <h3 className="text-sm font-semibold text-sky-800 mb-2">Summary Table</h3>
      <table className="w-full text-xs text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Metric</th>
            <th className="p-2 text-left">Value</th>
            <th className="p-2 text-left">Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(kpiData).map(([key, value], index) => {
            const needsDollarSign = [
              "revenue",
              "gross_profit",
              "expenses",
              "net_profit",
              "cash_flow",
            ].includes(key);
            return (
              <tr key={index} className="border-b">
                <td className="p-2">{key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}</td>
                <td className="p-2">
                  {needsDollarSign && "$"}
                  {typeof value.value === "number"
                    ? value.value.toLocaleString()
                    : value.value}
                </td>
                <td className="p-2">{value.change}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialDataTable