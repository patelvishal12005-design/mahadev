import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, MapPin, SlidersHorizontal, RefreshCw, X, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { LocationContext } from '../context/LocationContext';
import DecorationCard from '../components/DecorationCard';
import BookingModal from '../components/BookingModal';

export default function AllDecorations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { locations, selectedLocation } = useContext(LocationContext);

  const [decorations, setDecorations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('subcategory') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('location') || selectedLocation || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || 'latest');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [bestsellerOnly, setBestsellerOnly] = useState(searchParams.get('bestseller') === 'true');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Booking Modal State
  const [selectedDecorationForBooking, setSelectedDecorationForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Initial categories fetch
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const catRes = await api.get('/categories/?active_only=true');
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error loading filter meta:', err);
      }
    };
    fetchMeta();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const matchCat = categories.find(
        (c) => c.name === selectedCategory || String(c.id) === selectedCategory
      );
      if (matchCat && matchCat.subcategories) {
        setSubcategories(matchCat.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  // Main Decorations Query
  const fetchDecorations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('active_only', 'true');

      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubCategory) params.append('subcategory', selectedSubCategory);
      if (selectedCity && selectedCity !== 'All Locations') params.append('location', selectedCity);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (ordering) params.append('ordering', ordering);
      if (featuredOnly) params.append('featured', 'true');
      if (bestsellerOnly) params.append('bestseller', 'true');

      const res = await api.get(`/decorations/?${params.toString()}`);
      setDecorations(res.data);
    } catch (err) {
      console.error('Error fetching decorations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecorations();
  }, [search, selectedCategory, selectedSubCategory, selectedCity, minPrice, maxPrice, ordering, featuredOnly, bestsellerOnly]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedCity('');
    setMinPrice('');
    setMaxPrice('');
    setOrdering('latest');
    setFeaturedOnly(false);
    setBestsellerOnly(false);
    setSearchParams({});
  };

  const handleOpenBooking = (decor) => {
    setSelectedDecorationForBooking(decor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Dynamic Marketplace Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">All Decoration Packages</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-white">{decorations.length}</strong> available packages in{' '}
            <strong className="text-rose-400">{selectedCity || selectedLocation}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex-1 py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            <span>Filters ({[selectedCategory, selectedCity, search].filter(Boolean).length})</span>
          </button>

          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="py-2.5 px-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-bold focus:outline-none focus:border-rose-500"
          >
            <option value="latest">Sort By: Latest Added</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FILTER SIDEBAR (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-6 lg:block ${
            isMobileFilterOpen ? 'block fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : 'hidden'
          }`}
        >
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center">
              <Filter className="w-4 h-4 text-rose-400 mr-2" /> Filter Packages
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:underline flex items-center font-medium"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </button>
              {isMobileFilterOpen && (
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="lg:hidden p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search decor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('');
              }}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Filter */}
          {subcategories.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Sub-Category</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="">All Sub-Categories</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Delivery City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="">All Cities</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span>Featured Only</span>
            </label>
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={bestsellerOnly}
                onChange={(e) => setBestsellerOnly(e.target.checked)}
                className="rounded accent-amber-500"
              />
              <span>Bestseller Only</span>
            </label>
          </div>

          {isMobileFilterOpen && (
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Apply Filters ({decorations.length} Results)
            </button>
          )}
        </aside>

        {/* DECORATION CARDS GRID */}
        <main className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-shimmer" />
              ))}
            </div>
          ) : decorations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {decorations.map((decor) => (
                <DecorationCard
                  key={decor.id}
                  decoration={decor}
                  onBookClick={handleOpenBooking}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No Decoration Packages Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try relaxing your filter criteria or search keyword to discover available event styling setups.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      <BookingModal
        decoration={selectedDecorationForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
