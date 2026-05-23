import React, { useState, useEffect } from 'react';
import { addStockOut, getStockOut, updateStockOut, deleteStockOut } from '../api/stockOutAPI';
import { getSpareParts } from '../api/sparePartsAPI';

const StockOut = ({ user }) => {
  const [stockOuts, setStockOuts] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [form, setForm] = useState({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: '', sparePartId: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [stockRes, partsRes] = await Promise.all([getStockOut(), getSpareParts()]);
      setStockOuts(stockRes.data);
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

    if (!form.stockOutQuantity || !form.stockOutUnitPrice || !form.stockOutDate || !form.sparePartId) {
      setError('All fields are required');
      return;
    }

    if (Number(form.stockOutQuantity) <= 0 || Number(form.stockOutUnitPrice) <= 0) {
      setError('Quantity and unit price must be positive');
      return;
    }

    setLoading(true);
    try {
      const data = {
        stockOutQuantity: Number(form.stockOutQuantity),
        stockOutUnitPrice: Number(form.stockOutUnitPrice),
        stockOutDate: form.stockOutDate,
        sparePartId: Number(form.sparePartId),
        userId: user?.userId || null
      };

      if (editId) {
        await updateStockOut(editId, data);
        setSuccess('Stock out updated successfully!');
        setEditId(null);
      } else {
        await addStockOut(data);
        setSuccess('Stock out recorded successfully!');
      }

      setForm({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: '', sparePartId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.stockOutId);
    setForm({
      stockOutQuantity: item.stockOutQuantity.toString(),
      stockOutUnitPrice: item.stockOutUnitPrice.toString(),
      stockOutDate: item.stockOutDate.split('T')[0],
      sparePartId: item.sparePartId.toString()
    });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteStockOut(id);
      setSuccess('Stock out record deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: '', sparePartId: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Stock Out</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editId ? 'Edit Stock Out' : 'Record Stock Out'}
            </h2>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Spare Part *</label>
                <select name="sparePartId" value={form.sparePartId} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                  <option value="">Select a spare part</option>
                  {spareParts.map((part) => (
                    <option key={part.sparePartId} value={part.sparePartId}>{part.name} (Qty: {part.quantity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
                <input type="number" name="stockOutQuantity" value={form.stockOutQuantity} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price (RWF) *</label>
                <input type="number" name="stockOutUnitPrice" value={form.stockOutUnitPrice} onChange={handleChange} step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0.00" min="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date *</label>
                <input type="date" name="stockOutDate" value={form.stockOutDate} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow hover:shadow-md disabled:opacity-50">
                  {loading ? 'Processing...' : editId ? 'Update' : 'Record Stock Out'}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit}
                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Spare Part</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stockOuts.length === 0 ? (
                    <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-400">No stock out records found</td></tr>
                  ) : (
                    stockOuts.map((item) => (
                      <tr key={item.stockOutId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-600">{item.stockOutId}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">{item.sparePartName}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{item.stockOutQuantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{Number(item.stockOutUnitPrice).toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">{Number(item.stockOutTotalPrice).toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{new Date(item.stockOutDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{item.username || '—'}</td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex gap-1">
                            <button onClick={() => handleEdit(item)}
                              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded-md transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(item.stockOutId)}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-md transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
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

export default StockOut;
