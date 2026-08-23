import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Sparkles, Menu, X, PhoneCall, ShieldCheck, UserCheck, Heart } from 'lucide-react';
import { LocationContext } from '../context/LocationContext';
import LocationModal from './LocationModal';

export default function Navbar() {
  const { selectedLocation } = useContext(LocationContext);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/decorations?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        {/* Top Info Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-rose-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" /> Same-day Balloon & Event Decor Setup
              </span>
              <span className="hidden md:flex items-center text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 100% Safe Eco-Balloon Material
              </span>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/40 text-rose-300 font-medium transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Deliver To: <strong className="text-white">{selectedLocation}</strong></span>
              </button>

              <a
                href="https://wa.me/919876543210?text=Hi,%20I%20want%20to%20inquire%20about%20decoration%20services"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Helpline: +91 98765 43210</span>
              </a>

              <Link
                to="/admin/login"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-200 hover:text-white font-medium transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                DECOR<span className="gradient-text">FEST</span>
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-1">
                Luxury Event Styling
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder={`Search decorations in ${selectedLocation}... (e.g. Rose Gold, Candlelight)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors hover:text-rose-400 ${
                isActive('/') ? 'text-rose-400 border-b-2 border-rose-500 pb-1' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`transition-colors hover:text-rose-400 ${
                isActive('/categories') ? 'text-rose-400 border-b-2 border-rose-500 pb-1' : 'text-slate-300'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/decorations"
              className={`transition-colors hover:text-rose-400 ${
                isActive('/decorations') ? 'text-rose-400 border-b-2 border-rose-500 pb-1' : 'text-slate-300'
              }`}
            >
              All Decorations
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-rose-400 ${
                isActive('/about') ? 'text-rose-400 border-b-2 border-rose-500 pb-1' : 'text-slate-300'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-rose-400 ${
                isActive('/contact') ? 'text-rose-400 border-b-2 border-rose-500 pb-1' : 'text-slate-300'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search decorations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-rose-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </form>

            <nav className="flex flex-col space-y-3 font-medium text-slate-200">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-rose-400"
              >
                Home
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-rose-400"
              >
                Categories
              </Link>
              <Link
                to="/decorations"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-rose-400"
              >
                All Decorations
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-rose-400"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-rose-400"
              >
                Contact Us
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-rose-600/20 text-rose-300 font-semibold border border-rose-500/30"
              >
                Admin Panel Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
}
