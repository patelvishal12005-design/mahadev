import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, CheckCircle, XCircle, X, Save } from 'lucide-react';
import api from '../../api/axios';

export default function SubCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    status: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        api.get('/categories/'),
        api.get('/subcategories/'),
      ]);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
    } catch (err) {
      console.error('Error loading subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubcategories = selectedParentCategory
    ? subcategories.filter((s) => String(s.category) === String(selectedParentCategory))
    : subcategories;

  const handleOpenAddModal = () => {
    setEditingSub(null);
    setFormData({
      category: selectedParentCategory || (categories[0]?.id || ''),
      name: '',
      description: '',
      status: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSub(sub);
    setFormData({
      category: sub.category,
      name: sub.name,
      description: sub.description || '',
      status: sub.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSub) {
        await api.put(`/subcategories/${editingSub.id}/`, formData);
      } else {
        await api.post('/subcategories/', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving subcategory:', err);
      alert('Failed to save sub-category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sub-category folder?')) {
      try {
        await api.delete(`/subcategories/${id}/`);
        fetchData();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Sub-Category Hierarchy</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Sub-Category Management</h1>
          <p className="text-xs text-slate-400 mt-1">Add unlimited sub-folders inside main categories (e.g. Balloon Decor, Room Decor, Rose Gold).</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub-Category</span>
        </button>
      </div>

      {/* Filter by Parent Category */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4 max-w-md">
        <label className="text-xs font-bold text-slate-300 shrink-0">Filter By Category:</label>
        <select
          value={selectedParentCategory}
          onChange={(e) => setSelectedParentCategory(e.target.value)}
          className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500"
        >
          <option value="">All Parent Categories ({subcategories.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Parent Category</th>
                <th className="p-4">Sub-Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubcategories.length > 0 ? (
                filteredSubcategories.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-purple-300">
                      {sub.category_name || 'Category'}
                    </td>
                    <td className="p-4 font-bold text-white text-sm">
                      {sub.name}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">slug: /{sub.slug}</span>
                    </td>
                    <td className="p-4 text-slate-400">{sub.description || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        sub.status ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {sub.status ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(sub)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No sub-categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingSub ? 'Edit Sub-Category' : 'Create Sub-Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Parent Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Sub-Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balloon Decoration, Kids Birthday, Rose Gold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Sub-folder notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="subStatus"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="rounded accent-purple-500 w-4 h-4"
                />
                <label htmlFor="subStatus" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Enable Sub-Category (Active)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Sub-Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
