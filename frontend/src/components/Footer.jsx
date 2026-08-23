import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Award } from 'lucide-react';
import { LocationContext } from '../context/LocationContext';

export default function Footer() {
  const { locations } = useContext(LocationContext);

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      {/* Features Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Same-Day Setup</h4>
              <p className="text-xs text-slate-400">On-time venue decorator arrival guaranteed</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Safe Materials</h4>
              <p className="text-xs text-slate-400">Non-toxic high quality balloon & decor items</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">4.9/5 Rating</h4>
              <p className="text-xs text-slate-400">Over 5,000+ happy birthday & wedding celebrations</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24x7 Customer Help</h4>
              <p className="text-xs text-slate-400">Instant WhatsApp & phone support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              DECOR<span className="gradient-text">FEST</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Your premier event styling marketplace for Birthday Balloons, Anniversary Candlelight Rooms, Floral Mandaps, Proposal LED setups, and Welcome Baby decor. Dynamic booking & setup across major cities.
          </p>
          <div className="pt-2 flex items-center space-x-4 text-slate-400 text-xs">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-1 text-emerald-400" /> +91 98765 43210</span>
            <span className="flex items-center"><Mail className="w-4 h-4 mr-1 text-rose-400" /> support@decorfest.com</span>
          </div>
        </div>

        {/* Col 2: Occasions & Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider text-xs uppercase">Top Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/decorations?category=Birthday%20Decoration" className="hover:text-rose-400 transition-colors">Birthday Balloons</Link></li>
            <li><Link to="/decorations?category=Anniversary%20Decoration" className="hover:text-rose-400 transition-colors">Anniversary Candle Light</Link></li>
            <li><Link to="/decorations?category=Wedding%20Decoration" className="hover:text-rose-400 transition-colors">Wedding Floral Mandap</Link></li>
            <li><Link to="/decorations?category=Baby%20Shower%20%26%20Welcome" className="hover:text-rose-400 transition-colors">Baby Shower & Welcome</Link></li>
            <li><Link to="/decorations?category=Proposal%20%26%20Romance" className="hover:text-rose-400 transition-colors">Proposal Marry Me LED</Link></li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider text-xs uppercase">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-rose-400 transition-colors">Home Page</Link></li>
            <li><Link to="/categories" className="hover:text-rose-400 transition-colors">Browse Categories</Link></li>
            <li><Link to="/decorations" className="hover:text-rose-400 transition-colors">All Decoration Packages</Link></li>
            <li><Link to="/about" className="hover:text-rose-400 transition-colors">About Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/admin/login" className="text-rose-400 hover:underline">Admin Control Panel</Link></li>
          </ul>
        </div>

        {/* Col 4: Available Cities */}
        <div className="space-y-3">
          <h4 className="text-white font-bold tracking-wider text-xs uppercase">Delivery Cities</h4>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {locations.slice(0, 8).map((loc) => (
              <Link
                key={loc.id}
                to={`/decorations?location=${encodeURIComponent(loc.name)}`}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 transition-colors"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} DecorFest Services Inc. All rights reserved. Dynamic Admin Controlled Platform.</span>
          <span className="flex items-center">Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> for unforgettable celebrations.</span>
        </div>
      </div>
    </footer>
  );
}
