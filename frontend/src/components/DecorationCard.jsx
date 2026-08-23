import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Sparkles, ArrowRight, Eye, CalendarCheck } from 'lucide-react';
import { getImageUrl } from '../api/axios';

export default function DecorationCard({ decoration, onBookClick }) {
  if (!decoration) return null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800 hover:border-rose-500/40 group transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
        <img
          src={getImageUrl(decoration.main_image)}
          alt={decoration.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {decoration.bestseller && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
              Bestseller
            </span>
          )}
          {decoration.featured && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-semibold text-amber-400 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{decoration.rating || 4.8}</span>
          <span className="text-slate-400 text-[10px]">({decoration.reviews_count || 12})</span>
        </div>

        {/* Category tag at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end">
          <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-500/30 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
            {decoration.subcategory_name || decoration.category_name}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${decoration.available ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}`}>
            {decoration.available ? 'Available' : 'Booked Out'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {decoration.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {decoration.description}
          </p>
        </div>

        {/* Location list tags */}
        <div className="flex items-center space-x-1 text-slate-400 text-xs truncate">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">
            {decoration.location_details && decoration.location_details.length > 0
              ? decoration.location_details.map((l) => l.name).join(', ')
              : 'All Major Cities'}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Starting At</span>
            <div className="text-lg font-black text-white flex items-baseline">
              ₹{Number(decoration.price).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/decorations/${decoration.id}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="View Decoration Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onBookClick && onBookClick(decoration)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center space-x-1.5 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
