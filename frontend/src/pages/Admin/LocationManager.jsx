import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, MapPin, CheckCircle, XCircle, X, Save } from 'lucide-react';
import api from '../../api/axios';
import { LocationContext } from '../../context/LocationContext';

export default function LocationManager() {
  const { refreshLocations } = useContext(LocationContext);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: true });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/locations/');
      setLocations(res.data);
    } catch (err) {
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenAddModal = () => {
    setEditingLoc(null);
    setFormData({ name: '', status: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (loc) => {
    setEditingLoc(loc);
    setFormData({ name: loc.name, status: loc.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLoc) {
        await api.put(`/locations/${editingLoc.id}/`, formData);
      } else {
        await api.post('/locations/', formData);
      }
      setIsModalOpen(false);
      fetchLocations();
      refreshLocations();
    } catch (err) {
      console.error('Error saving location:', err);
      alert('Failed to save location.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this location city?')) {
      try {
        await api.delete(`/locations/${id}/`);
        fetchLocations();
        refreshLocations();
      } catch (err) {
        console.error('Error deleting location:', err);
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pan-India Delivery Network</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Location Management</h1>
          <p className="text-xs text-slate-400 mt-1">Add new cities anytime. Customers will be able to select and filter decorations for these locations.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New City</span>
        </button>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{loc.name}</h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  {loc.decorations_count || 0} Packages Active
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenEditModal(loc)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(loc.id)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {editingLoc ? 'Edit City Location' : 'Add New City Location'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad, Surat, Mumbai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="locStatus"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
                <label htmlFor="locStatus" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Enable City (Active on Location Dropdowns)
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
