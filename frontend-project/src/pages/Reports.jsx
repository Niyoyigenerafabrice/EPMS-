import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/reports';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('daily-stockout');
  const [dailyStockOut, setDailyStockOut] = useState([]);
  const [stockStatus, setStockStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchDailyStockOut = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/daily-stockout`, {
        params: { date },
        withCredentials: true
      });
      setDailyStockOut(res.data);
    } catch (err) {
      console.error('Failed to fetch daily stock out:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/stock-status`, { withCredentials: true });
      setStockStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch stock status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'daily-stockout') {
      fetchDailyStockOut(selectedDate);
    } else {
      fetchStockStatus();
    }
  }, [activeTab, selectedDate]);

  const tabClass = (tab) =>
    `px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
      activeTab === tab
        ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm'
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Reports</h1>

      <div className="flex gap-1 mb-0">
        <button onClick={() => setActiveTab('daily-stockout')} className={tabClass('daily-stockout')}>
          Daily Stock Out
        </button>
        <button onClick={() => setActiveTab('stock-status')} className={tabClass('stock-status')}>
          Stock Status
        </button>
      </div>

      <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-lg p-6">
        {activeTab === 'daily-stockout' && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-600">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Spare Part</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Total Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dailyStockOut.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No stock out records for this date</td></tr>
                    ) : (
                      dailyStockOut.map((item) => (
                        <tr key={item.stockOutId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{item.stockOutId}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.sparePartName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.stockOutQuantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{Number(item.stockOutUnitPrice).toLocaleString()} RWF</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{Number(item.stockOutTotalPrice).toLocaleString()} RWF</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.stockOutDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.username || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'stock-status' && (
          <>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Stored Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Stock Out Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Remaining Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stockStatus.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No data available</td></tr>
                    ) : (
                      stockStatus.map((item) => (
                        <tr key={item.sparePartId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{item.sparePartId}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.category || '—'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.storedQuantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.totalStockOut}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.remainingQuantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{Number(item.unitPrice).toLocaleString()} RWF</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
