import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Sparkles, Image as ImageIcon, CheckCircle, XCircle, MapPin, Search, X, Save, Star } from 'lucide-react';
import api, { getImageUrl } from '../../api/axios';

export default function DecorationManager() {
  const [decorations, setDecorations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecoration, setEditingDecoration] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    name: '',
    description: '',
    price: '',
    location_ids: [],
    main_image: '',
    available: true,
    featured: false,
    bestseller: false,
    status: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [decorRes, catRes, subRes, locRes] = await Promise.all([
        api.get('/decorations/'),
        api.get('/categories/'),
        api.get('/subcategories/'),
        api.get('/locations/'),
      ]);
      setDecorations(decorRes.data);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error('Error fetching decorations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter subcategories when category changes in form
  const availableSubcategories = formData.category
    ? subcategories.filter((s) => String(s.category) === String(formData.category))
    : subcategories;

  const handleOpenAddModal = () => {
    setEditingDecoration(null);
    setFormData({
      category: categories[0]?.id || '',
      subcategory: '',
      name: '',
      description: '',
      price: '',
      location_ids: locations.map((l) => l.id),
      main_image: '',
      available: true,
      featured: false,
      bestseller: false,
      status: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (decor) => {
    setEditingDecoration(decor);
    setFormData({
      category: decor.category,
      subcategory: decor.subcategory || '',
      name: decor.name,
      description: decor.description || '',
      price: decor.price,
      location_ids: decor.locations || [],
      main_image: decor.main_image || '',
      available: decor.available,
      featured: decor.featured,
      bestseller: decor.bestseller,
      status: decor.status,
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, main_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationToggle = (locId) => {
    setFormData((prev) => {
      const exists = prev.location_ids.includes(locId);
      if (exists) {
        return { ...prev, location_ids: prev.location_ids.filter((id) => id !== locId) };
      } else {
        return { ...prev, location_ids: [...prev.location_ids, locId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        subcategory: formData.subcategory || null,
      };

      if (editingDecoration) {
        await api.put(`/decorations/${editingDecoration.id}/`, payload);
      } else {
        await api.post('/decorations/', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving decoration:', err);
      alert('Failed to save decoration package.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Decoration package?')) {
      try {
        await api.delete(`/decorations/${id}/`);
        fetchData();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const filteredDecorations = decorations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Decoration Catalog Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Decoration Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage price, locations, features, main images, and multiple photo galleries.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Decoration</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search decoration by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-slate-100 text-xs focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Main Image</th>
                <th className="p-4">Decoration Title</th>
                <th className="p-4">Category & Sub-Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Locations</th>
                <th className="p-4">Status & Flags</th>
                <th className="p-4 text-right">Gallery & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDecorations.length > 0 ? (
                filteredDecorations.map((decor) => (
                  <tr key={decor.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={getImageUrl(decor.main_image)} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white text-sm max-w-xs">
                      {decor.name}
                      <span className="block text-[10px] text-slate-400 font-normal line-clamp-1">{decor.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-rose-300 block">{decor.category_name}</span>
                      <span className="text-[10px] text-slate-400 block">{decor.subcategory_name || 'General'}</span>
                    </td>
                    <td className="p-4 font-black text-amber-400 text-sm">
                      ₹{Number(decor.price).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-[11px] max-w-[150px] truncate text-slate-300">
                      {decor.location_details?.map((l) => l.name).join(', ') || 'All Cities'}
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          decor.available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {decor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex gap-1 text-[9px]">
                        {decor.featured && <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold">Featured</span>}
                        {decor.bestseller && <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-bold">Bestseller</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/decorations/${decor.id}/gallery`}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white font-bold text-xs inline-flex items-center space-x-1 border border-purple-500/30"
                        title="Manage Multi-Photo Gallery"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Photos ({decor.images?.length || 0})</span>
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(decor)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Decoration"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(decor.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                        title="Delete Decoration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No decorations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Decoration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingDecoration ? 'Edit Decoration Package' : 'Create New Decoration Package'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Decoration Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rose Gold Birthday Balloon Setup"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sub-Category</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">None / General</option>
                    {availableSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Package Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 2499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Main Cover Image (Upload or Paste URL)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.main_image}
                    onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="mt-1 text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:bg-slate-800 file:text-amber-400 file:border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description & Inclusions *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed description of setup items, balloon colors, LED lights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Service Locations Multi-Select */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Available Service Cities</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-32 overflow-y-auto">
                  {locations.map((loc) => {
                    const isChecked = formData.location_ids.includes(loc.id);
                    return (
                      <button
                        type="button"
                        key={loc.id}
                        onClick={() => handleLocationToggle(loc.id)}
                        className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center space-x-1 ${
                          isChecked
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{loc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <span>Available</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded accent-rose-500 w-4 h-4"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                  <span>Active</span>
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs shadow-lg flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Decoration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
