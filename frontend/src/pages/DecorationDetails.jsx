import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Sparkles, CheckCircle2, MessageSquare, PhoneCall,
  CalendarCheck, ShieldCheck, Clock, Award, ArrowLeft, Maximize2
} from 'lucide-react';
import api, { getImageUrl } from '../api/axios';
import { LocationContext } from '../context/LocationContext';
import LightboxModal from '../components/LightboxModal';
import BookingModal from '../components/BookingModal';
import DecorationCard from '../components/DecorationCard';

export default function DecorationDetails() {
  const { id } = useParams();
  const { selectedLocation } = useContext(LocationContext);

  const [decoration, setDecoration] = useState(null);
  const [relatedDecorations, setRelatedDecorations] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDecoration = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/decorations/${id}/`);
        setDecoration(res.data);
        setSelectedImageIndex(0);

        // Fetch related decorations in same category
        if (res.data.category) {
          const relRes = await api.get(`/decorations/?category=${res.data.category}&active_only=true`);
          setRelatedDecorations(relRes.data.filter((d) => d.id !== Number(id)).slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading decoration details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecoration();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[420px] rounded-3xl bg-slate-900 animate-shimmer" />
          <div className="lg:col-span-5 h-[420px] rounded-3xl bg-slate-900 animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!decoration) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Decoration Package Not Found</h2>
        <Link to="/decorations" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">
          Back to All Decorations
        </Link>
      </div>
    );
  }

  // Gallery array preparation
  const allImages = [
    decoration.main_image,
    ...(decoration.images ? decoration.images.map((img) => img.image) : [])
  ].filter(Boolean);

  const activeMainImage = allImages[selectedImageIndex] || decoration.main_image;

  const handleWhatsApp = () => {
    const text = `Hi DecorFest! I'm interested in booking "${decoration.name}" (Price: ₹${decoration.price}). Can you check slot availability for my city?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Back navigation */}
      <Link to="/decorations" className="inline-flex items-center space-x-2 text-xs font-bold text-rose-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Decoration Packages</span>
      </Link>

      {/* Main Details Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Col: Multi-Photo Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
            <img
              src={getImageUrl(activeMainImage)}
              alt={decoration.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md text-white border border-slate-700 hover:bg-rose-600 transition-colors flex items-center space-x-2 text-xs font-bold shadow-xl"
            >
              <Maximize2 className="w-4 h-4 text-rose-400" />
              <span>Full Screen Gallery ({allImages.length})</span>
            </button>
          </div>

          {/* Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto p-2 bg-slate-900/60 rounded-2xl border border-slate-800">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(imgUrl)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Package Specifications & Booking Controls */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
          {/* Category & Status Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold">
              {decoration.category_name} &rarr; {decoration.subcategory_name || 'General Theme'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${decoration.available ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'}`}>
              {decoration.available ? '● Slot Available' : '● Booked Out'}
            </span>
          </div>

          {/* Title & Ratings */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{decoration.name}</h1>
            <div className="flex items-center space-x-2 mt-2 text-xs font-semibold text-amber-400">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span>{decoration.rating || 4.9}</span>
              <span className="text-slate-400 font-normal">({decoration.reviews_count || 18} Customer Reviews)</span>
            </div>
          </div>

          {/* Price Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Special Offer Price</span>
              <div className="text-3xl font-black text-white flex items-baseline space-x-2">
                <span>₹{Number(decoration.price).toLocaleString('en-IN')}</span>
                <span className="text-xs font-normal text-slate-400">All Taxes & Setup Included</span>
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-rose-400 opacity-80" />
          </div>

          {/* Locations Available */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-300 flex items-center">
              <MapPin className="w-4 h-4 text-rose-400 mr-1" /> Service Locations Available:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {decoration.location_details && decoration.location_details.length > 0 ? (
                decoration.location_details.map((loc) => (
                  <span key={loc.id} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                    {loc.name}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200">All Major Cities</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Package Highlights & Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{decoration.description}</p>
          </div>

          {/* Guarantees List */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Eco-Balloon Safety</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Clock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>3-Hour On-Time Setup</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Custom Color Options</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Full Venue Teardown</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Book Decoration Now</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Inquiry</span>
              </button>

              <a
                href="tel:+919876543210"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all border border-slate-700"
              >
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages Recommendations */}
      {relatedDecorations.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Recommendations</span>
              <h2 className="text-2xl font-black text-white mt-1">Similar Decoration Packages</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDecorations.map((decor) => (
              <DecorationCard
                key={decor.id}
                decoration={decor}
                onBookClick={(d) => {
                  setDecoration(d);
                  setIsBookingModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Booking Modal */}
      <BookingModal
        decoration={decoration}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
