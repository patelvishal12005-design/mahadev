import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Sparkles, ChevronRight, Layers } from 'lucide-react';
import api, { getImageUrl } from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/?active_only=true');
        setCategories(res.data);
      } catch (err) {
        console.error('Categories load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center">
          <FolderTree className="w-4 h-4 mr-1" /> Dynamic Category Directories
        </span>
        <h1 className="text-3xl font-black text-white">Event Occasions & Themes</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Browse decoration packages organized by dynamic category folders and sub-categories managed directly from Admin Panel.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Category Folder</span>
                    <h3 className="text-xl font-black text-white">{cat.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    {cat.decorations_count || 0} Decor Items
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {cat.description || `Explore handpicked ${cat.name} setup designs.`}
                </p>

                {/* Subcategories Tags */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Layers className="w-3 h-3 mr-1 text-rose-400" /> Sub-Folders
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/decorations?subcategory=${sub.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 text-[11px] font-medium transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={`/categories/${cat.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all mt-2"
                >
                  <span>Explore Category Folder</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
