import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, Sparkles, CheckCircle } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center">
          <Sparkles className="w-4 h-4 mr-1" /> We are Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Contact DecorFest Support</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have questions about custom theme balloon colors, large venue setups, or specific date availability? Get in touch with our team!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Customer Helpline</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Call / WhatsApp Inquiry</h4>
                  <p className="text-slate-400">+91 98765 43210 (24x7 Available)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Desk</h4>
                  <p className="text-slate-400">support@decorfest.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Operating Hours</h4>
                  <p className="text-slate-400">Monday - Sunday: 8:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Head Office Hub</h4>
                  <p className="text-slate-400">Corporate Tower, SG Highway, Ahmedabad, Gujarat</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hi%20DecorFest%20Team!%20I%20have%20an%20event%20query."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Instant WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-lg font-bold text-white mb-2">Send Us a Direct Message</h3>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shah"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="ramesh@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Requirement / Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us about your celebration date, venue city, and preferred decoration style..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit General Inquiry</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">Thank You for Reaching Out!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                We have received your message. Our customer executive will connect with you on <strong className="text-rose-400">{formData.phone}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Send Another Inquiry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
