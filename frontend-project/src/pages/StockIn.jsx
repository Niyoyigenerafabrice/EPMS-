import React, { useState, useEffect } from 'react';
import { addStockIn, getStockIn } from '../api/stockInAPI';
import { getSpareParts } from '../api/sparePartsAPI';

const StockIn = () => {
  const [stockIns, setStockIns] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [form, setForm] = useState({ stockInQuantity: '', stockInDate: '', sparePartId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [stockRes, partsRes] = await Promise.all([getStockIn(), getSpareParts()]);
      setStockIns(stockRes.data);
      setSpareParts(partsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.stockInQuantity || !form.stockInDate || !form.sparePartId) {
      setError('All fields are required');
      return;
    }

    if (Number(form.stockInQuantity) <= 0) {
      setError('Quantity must be positive');
      return;
    }

    setLoading(true);
    try {
      await addStockIn({
        stockInQuantity: Number(form.stockInQuantity),
        stockInDate: form.stockInDate,
        sparePartId: Number(form.sparePartId)
      });
      setSuccess('Stock in recorded successfully!');
      setForm({ stockInQuantity: '', stockInDate: '', sparePartId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record stock in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Stock In</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Record Stock In</h2>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Spare Part *</label>
                <select name="sparePartId" value={form.sparePartId} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                  <option value="">Select a spare part</option>
                  {spareParts.map((part) => (
                    <option key={part.sparePartId} value={part.sparePartId}>{part.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
                <input type="number" name="stockInQuantity" value={form.stockInQuantity} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date *</label>
                <input type="date" name="stockInDate" value={form.stockInDate} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow hover:shadow-md disabled:opacity-50">
                {loading ? 'Recording...' : 'Record Stock In'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Spare Part</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stockIns.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No stock in records found</td></tr>
                  ) : (
                    stockIns.map((item) => (
                      <tr key={item.stockInId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{item.stockInId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.sparePartName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.stockInQuantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.stockInDate).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockIn;
