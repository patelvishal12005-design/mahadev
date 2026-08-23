import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderTree, Layers, Sparkles, ArrowLeft } from 'lucide-react';
import api, { getImageUrl } from '../api/axios';
import { LocationContext } from '../context/LocationContext';
import DecorationCard from '../components/DecorationCard';
import BookingModal from '../components/BookingModal';

export default function CategoryDetails() {
  const { id } = useParams();
  const { selectedLocation } = useContext(LocationContext);

  const [category, setCategory] = useState(null);
  const [decorations, setDecorations] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [selectedDecorationForBooking, setSelectedDecorationForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories/${id}/decorations/`);
        setCategory(res.data.category);
        setDecorations(res.data.decorations);
      } catch (err) {
        console.error('Error loading category details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const filteredDecorations = activeSubcategory
    ? decorations.filter((d) => d.subcategory === activeSubcategory.id)
    : decorations;

  const handleOpenBooking = (decor) => {
    setSelectedDecorationForBooking(decor);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-48 rounded-3xl bg-slate-900 animate-shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Category Not Found</h2>
        <Link to="/categories" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Link */}
      <Link to="/categories" className="inline-flex items-center space-x-2 text-xs font-bold text-rose-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[220px] flex items-center p-6 sm:p-10">
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Category Folder</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {category.description || `Explore handpicked ${category.name} decorations for your special event.`}
          </p>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1 text-rose-400" /> Sub-Category Folders
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeSubcategory === null
                  ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              All {category.name} ({decorations.length})
            </button>

            {category.subcategories.map((sub) => {
              const count = decorations.filter((d) => d.subcategory === sub.id).length;
              const isActive = activeSubcategory?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {sub.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Decorations List Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {activeSubcategory ? `${activeSubcategory.name} Packages` : `All ${category.name} Packages`}
        </h3>

        {filteredDecorations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecorations.map((decor) => (
              <DecorationCard
                key={decor.id}
                decoration={decor}
                onBookClick={handleOpenBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
            No decoration packages found in this sub-folder. Check back soon or select another sub-category!
          </div>
        )}
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
