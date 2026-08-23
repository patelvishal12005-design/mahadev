import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Users, MapPin, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 mr-1" /> Crafting Unforgettable Moments
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">About DecorFest Services</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We are India's premier dynamic event decoration platform bringing world-class balloon art, romantic candlelight setups, floral mandaps, and birthday themes right to your doorstep.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <span className="text-3xl font-black text-white">5,000+</span>
          <span className="block text-xs text-slate-400 font-semibold">Events Styled</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <span className="text-3xl font-black text-rose-400">9+</span>
          <span className="block text-xs text-slate-400 font-semibold">Major Cities Active</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <span className="text-3xl font-black text-amber-400">4.9 ★</span>
          <span className="block text-xs text-slate-400 font-semibold">Average Rating</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-1">
          <span className="text-3xl font-black text-emerald-400">100%</span>
          <span className="block text-xs text-slate-400 font-semibold">On-Time Arrival</span>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-max">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Dynamic Customization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every category, subcategory, photo gallery, and location is dynamically driven by our Admin Panel. Choose custom color themes, balloon finishes, and backdrop sizes.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-max">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Eco Safety</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We use non-toxic, odorless, latex eco-balloons and safe LED lighting systems, ensuring total safety for toddlers, pets, and indoor bedroom setups.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl w-max">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Certified Decorators</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our background-verified professional event stylists arrive equipped with all tools, ladders, tape, and backup balloon pumps for express 3-hour setup.
          </p>
        </div>
      </div>
    </div>
  );
}
