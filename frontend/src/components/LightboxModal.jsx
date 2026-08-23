import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

export default function LightboxModal({ images = [], initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = typeof images[currentIndex] === 'string'
    ? images[currentIndex]
    : images[currentIndex]?.image;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-md p-4 animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <span className="text-sm font-semibold text-slate-300">
          Photo {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center py-4 overflow-hidden">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-rose-600 transition-all z-10 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={getImageUrl(currentImage)}
          alt="Decoration Preview"
          className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-slate-800 shadow-2xl transition-all duration-300"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-rose-600 transition-all z-10 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center space-x-3 max-w-full overflow-x-auto p-2 bg-slate-900/80 rounded-2xl border border-slate-800">
          {images.map((img, idx) => {
            const imgUrl = typeof img === 'string' ? img : img.image;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  currentIndex === idx
                    ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/20'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(imgUrl)} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
