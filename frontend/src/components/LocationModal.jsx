import React, { useContext } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { LocationContext } from '../context/LocationContext';

export default function LocationModal({ isOpen, onClose }) {
  const { selectedLocation, changeLocation, locations } = useContext(LocationContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Select Your City</h3>
            <p className="text-sm text-slate-400">Choose city to explore local decor packages & delivery</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {locations.map((loc) => {
            const isSelected = selectedLocation === loc.name;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  changeLocation(loc.name);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span className="truncate">{loc.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-rose-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Don't see your city? We offer custom venue travel decor!</span>
          <button
            onClick={() => {
              changeLocation('All Locations');
              onClose();
            }}
            className="text-rose-400 hover:underline font-semibold"
          >
            Show All Cities
          </button>
        </div>
      </div>
    </div>
  );
}
