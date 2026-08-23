import React, { useState, useContext } from 'react';
import { X, Calendar, MapPin, Phone, User, Mail, MessageSquare, CheckCircle, Send, Sparkles } from 'lucide-react';
import api, { getImageUrl } from '../api/axios';
import { LocationContext } from '../context/LocationContext';

export default function BookingModal({ decoration, isOpen, onClose }) {
  const { locations, selectedLocation } = useContext(LocationContext);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    location: selectedLocation || 'Ahmedabad',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !decoration) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.event_date) {
      setError('Please fill in your name, mobile number, and event date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/bookings/', {
        decoration: decoration.id,
        decoration_name: decoration.name,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        location: formData.location,
        event_date: formData.event_date,
        notes: formData.notes,
        status: 'Pending',
      });

      setSuccess(true);
    } catch (err) {
      console.error('Booking submission error:', err);
      setError('Failed to submit booking inquiry. Please try again or contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hi DecorFest! I would like to book "${decoration.name}" (Price: ₹${decoration.price}) for date: ${formData.event_date} in ${formData.location}. My Name: ${formData.customer_name || 'Customer'}.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <div>
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <img
                  src={getImageUrl(decoration.main_image)}
                  alt={decoration.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Booking Request
                </span>
                <h3 className="text-lg font-bold text-white line-clamp-1">{decoration.name}</h3>
                <p className="text-sm font-semibold text-amber-400">
                  ₹{Number(decoration.price).toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-400 font-normal">(Inclusive of setup & teardown)</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customer_name"
                      required
                      placeholder="e.g. Rahul Patel"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile / WhatsApp No *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Event City *</label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 text-sm appearance-none"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Celebration Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="event_date"
                      required
                      value={formData.event_date}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 text-sm"
                    />
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <input
                    type="email"
                    name="customer_email"
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Special Notes / Address</label>
                <div className="relative">
                  <textarea
                    name="notes"
                    rows="2"
                    placeholder="Provide specific setup timing or custom theme requirements..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Booking Request'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Quick WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-white">Booking Request Received!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, <strong className="text-rose-400">{formData.customer_name}</strong>! Our event styling manager will call you back on{' '}
              <strong className="text-white">{formData.customer_phone}</strong> to confirm your slot for{' '}
              <strong className="text-white">{formData.event_date}</strong> in {formData.location}.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppInquiry}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
