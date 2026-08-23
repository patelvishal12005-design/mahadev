import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, Star, Heart, CheckCircle2, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import api, { getImageUrl } from '../api/axios';
import { LocationContext } from '../context/LocationContext';
import DecorationCard from '../components/DecorationCard';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const { selectedLocation, locations } = useContext(LocationContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [featuredDecorations, setFeaturedDecorations] = useState([]);
  const [latestDecorations, setLatestDecorations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedDecorationForBooking, setSelectedDecorationForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, bestRes, featRes, latestRes] = await Promise.all([
          api.get('/categories/?active_only=true'),
          api.get(`/decorations/?bestseller=true&active_only=true&location=${encodeURIComponent(selectedLocation)}`),
          api.get(`/decorations/?featured=true&active_only=true&location=${encodeURIComponent(selectedLocation)}`),
          api.get(`/decorations/?ordering=latest&active_only=true&location=${encodeURIComponent(selectedLocation)}`),
        ]);

        setCategories(catRes.data);

        // Fallbacks if city filter returns empty list for bestsellers
        setBestsellers(bestRes.data.length > 0 ? bestRes.data : featRes.data);
        setFeaturedDecorations(featRes.data);
        setLatestDecorations(latestRes.data.slice(0, 8));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLocation]);

  const handleOpenBooking = (decor) => {
    setSelectedDecorationForBooking(decor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Premium Event & Birthday Balloon Decorators</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Make Every Moment <br />
              <span className="gradient-text">Unforgettable & Magical</span>
            </h1>

            <p className="text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore dynamic balloon setups, romantic candlelight setups, floral mandaps, and birthday themes delivered & styled right at your venue in <strong className="text-rose-400 font-bold">{selectedLocation}</strong>.
            </p>

            {/* Location Pill Bar */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start items-center gap-3">
              <Link
                to="/decorations"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm shadow-xl shadow-rose-500/25 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>Explore All Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/categories"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center space-x-2 transition-all"
              >
                <span>Browse Categories</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="block text-2xl font-black text-white">5,000+</span>
                <span className="text-xs text-slate-400 font-medium">Happy Events</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">4.9 ★</span>
                <span className="text-xs text-slate-400 font-medium">Customer Rating</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">3-Hour</span>
                <span className="text-xs text-slate-400 font-medium">Express Setup</span>
              </div>
            </div>
          </div>

          {/* Hero Feature Banner Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80"
                  alt="Birthday Decor"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
                  alt="Anniversary Decor"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Romantic Candlelight"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80"
                  alt="Wedding Mandap"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Occasions & Themes</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Decoration By Categories</h2>
          </div>
          <Link
            to="/categories"
            className="text-rose-400 hover:text-rose-300 text-sm font-bold flex items-center space-x-1"
          >
            <span>View All Folders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="glass-card rounded-2xl p-4 text-center group border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col items-center justify-between"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-slate-700 group-hover:border-rose-500 shadow-lg group-hover:scale-110 transition-all">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1 font-medium">
                {cat.decorations_count || 0}+ Packages
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLING DECORATIONS */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <Zap className="w-4 h-4 mr-1 fill-amber-400" /> Customer Favorites in {selectedLocation}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Bestseller Decorations</h2>
          </div>
          <Link
            to="/decorations?bestseller=true"
            className="text-rose-400 hover:text-rose-300 text-sm font-bold flex items-center space-x-1"
          >
            <span>See All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map((decor) => (
              <DecorationCard
                key={decor.id}
                decoration={decor}
                onBookClick={handleOpenBooking}
              />
            ))}
          </div>
        )}
      </section>

      {/* DELIVER TO CITIES SECTION */}
      <section className="bg-slate-900/80 border-y border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-6 text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Pan-India Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Deliver To Your City</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
              Select your city to filter local decorator availability and express same-day setup.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc.name;
              return (
                <button
                  key={loc.id}
                  onClick={() => navigate(`/decorations?location=${encodeURIComponent(loc.name)}`)}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LATEST DECORATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Newly Added Designs</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Latest Decoration Packages</h2>
          </div>
          <Link
            to="/decorations"
            className="text-rose-400 hover:text-rose-300 text-sm font-bold flex items-center space-x-1"
          >
            <span>Explore All ({latestDecorations.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestDecorations.map((decor) => (
            <DecorationCard
              key={decor.id}
              decoration={decor}
              onBookClick={handleOpenBooking}
            />
          ))}
        </div>
      </section>

      {/* BOOKING MODAL */}
      <BookingModal
        decoration={selectedDecorationForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
