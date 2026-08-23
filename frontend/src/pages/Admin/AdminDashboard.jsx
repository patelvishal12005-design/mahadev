import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree, Layers, Sparkles, Image as ImageIcon, MapPin,
  CalendarDays, Users, PlusCircle, ArrowUpRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import api, { getImageUrl } from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats/');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Categories', value: stats?.total_categories || 0, icon: FolderTree, color: 'text-rose-400', bg: 'bg-rose-500/10', link: '/admin/categories' },
    { label: 'Sub-Categories', value: stats?.total_subcategories || 0, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/admin/subcategories' },
    { label: 'Total Decorations', value: stats?.total_decorations || 0, icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/admin/decorations' },
    { label: 'Gallery Images', value: stats?.total_images || 0, icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', link: '/admin/decorations' },
    { label: 'Active Locations', value: stats?.total_locations || 0, icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/admin/locations' },
    { label: 'Customer Bookings', value: stats?.total_bookings || 0, icon: CalendarDays, color: 'text-pink-400', bg: 'bg-pink-500/10', link: '/admin/bookings' },
    { label: 'Total Users', value: stats?.total_users || 1, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', link: '/admin/settings' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Live Management Overview</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Admin Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Changes made here dynamically reflect on the customer website instantly.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/categories"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <PlusCircle className="w-4 h-4 text-rose-400" />
            <span>Add Category</span>
          </Link>
          <Link
            to="/admin/decorations"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Decoration</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400 block">{card.label}</span>
                <span className="text-3xl font-black text-white mt-1 block">{card.value}</span>
              </div>
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Booking Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Pending Bookings</span>
            <span className="text-2xl font-black text-white">{stats?.booking_stats?.pending || 0}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">Confirmed Bookings</span>
            <span className="text-2xl font-black text-white">{stats?.booking_stats?.confirmed || 0}</span>
          </div>
          <CheckCircle className="w-6 h-6 text-blue-400" />
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Completed Events</span>
            <span className="text-2xl font-black text-white">{stats?.booking_stats?.completed || 0}</span>
          </div>
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider block">Cancelled</span>
            <span className="text-2xl font-black text-white">{stats?.booking_stats?.cancelled || 0}</span>
          </div>
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Customer Bookings */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center">
              <CalendarDays className="w-4 h-4 text-pink-400 mr-2" /> Recent Booking Inquiries
            </h3>
            <Link to="/admin/bookings" className="text-xs text-rose-400 font-bold hover:underline">
              View All Bookings &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Decoration</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.recent_bookings && stats.recent_bookings.length > 0 ? (
                  stats.recent_bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">
                        {b.customer_name}
                        <span className="block text-[10px] text-slate-400 font-normal">{b.customer_phone}</span>
                      </td>
                      <td className="p-3 max-w-[140px] truncate">{b.decoration_title}</td>
                      <td className="p-3">{b.location}</td>
                      <td className="p-3">{b.event_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                          b.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-300' :
                          b.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-500">No recent bookings recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Decorations Added */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center">
              <Sparkles className="w-4 h-4 text-amber-400 mr-2" /> Recently Added Packages
            </h3>
            <Link to="/admin/decorations" className="text-xs text-rose-400 font-bold hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recent_decorations && stats.recent_decorations.length > 0 ? (
              stats.recent_decorations.map((decor) => (
                <div key={decor.id} className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img src={getImageUrl(decor.main_image)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 truncate text-xs">
                    <h4 className="font-bold text-white truncate">{decor.name}</h4>
                    <span className="text-slate-400 block font-medium">₹{Number(decor.price).toLocaleString('en-IN')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold">
                    {decor.category_name}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No decorations found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
