import React, { useState, useEffect } from 'react';
import { CalendarDays, Phone, Mail, MapPin, Trash2, CheckCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/bookings/?status=${statusFilter}` : '/bookings/';
      const res = await api.get(url);
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Delete this booking record?')) {
      try {
        await api.delete(`/bookings/${id}/`);
        fetchBookings();
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
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Customer Event Enquiries</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Bookings Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review event date requests, customer contact numbers, and update booking status.</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-300">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-bold focus:outline-none focus:border-rose-500"
          >
            <option value="">All Statuses ({bookings.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Decoration Package</th>
                <th className="p-4">City Location</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Special Notes</th>
                <th className="p-4">Status Update</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <h4 className="font-bold text-white text-sm">{b.customer_name}</h4>
                      <div className="flex items-center text-slate-400 text-[11px] space-x-2 mt-0.5">
                        <a href={`tel:${b.customer_phone}`} className="text-emerald-400 hover:underline flex items-center">
                          <Phone className="w-3 h-3 mr-1" /> {b.customer_phone}
                        </a>
                      </div>
                      {b.customer_email && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">{b.customer_email}</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-rose-300 max-w-[160px] truncate">
                      {b.decoration_title}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-200 font-medium">
                        {b.location}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{b.event_date}</td>
                    <td className="p-4 max-w-[180px] truncate text-slate-400">
                      {b.notes || 'No special notes'}
                    </td>
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold border focus:outline-none ${
                          b.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : b.status === 'Confirmed'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : b.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900 text-amber-300">Pending</option>
                        <option value="Confirmed" className="bg-slate-900 text-blue-300">Confirmed</option>
                        <option value="Completed" className="bg-slate-900 text-emerald-300">Completed</option>
                        <option value="Cancelled" className="bg-slate-900 text-red-300">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.customer_name)},%20regarding%20your%20DecorFest%20booking%20for%20${encodeURIComponent(b.event_date)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white inline-flex items-center"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No bookings found for the selected status.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
