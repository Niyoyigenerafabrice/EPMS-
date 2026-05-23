import React, { useState, useEffect } from 'react';
import { addSparePart, getSpareParts } from '../api/sparePartsAPI';

const SparePart = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unitPrice: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSpareParts = async () => {
    try {
      const res = await getSpareParts();
      setSpareParts(res.data);
    } catch (err) {
      console.error('Failed to fetch spare parts:', err);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.quantity || !form.unitPrice) {
      setError('Name, quantity, and unit price are required');
      return;
    }

    if (Number(form.quantity) <= 0 || Number(form.unitPrice) <= 0) {
      setError('Quantity and unit price must be positive');
      return;
    }

    setLoading(true);
    try {
      await addSparePart({
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice)
      });
      setSuccess('Spare part added successfully!');
      setForm({ name: '', category: '', quantity: '', unitPrice: '' });
      fetchSpareParts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add spare part');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Spare Parts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Spare Part</h2>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Part name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <input type="text" name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Category" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price (RWF) *</label>
                <input type="number" name="unitPrice" value={form.unitPrice} onChange={handleChange} step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0.00" min="0.01" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow hover:shadow-md disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Spare Part'}
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {spareParts.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No spare parts found</td></tr>
                  ) : (
                    spareParts.map((part) => (
                      <tr key={part.sparePartId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{part.sparePartId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{part.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{part.category || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{part.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{Number(part.unitPrice).toLocaleString()} RWF</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{Number(part.totalPrice).toLocaleString()} RWF</td>
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

export default SparePart;
