import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Image as ImageIcon, Plus, Trash2, ArrowLeft, Star, Upload, Sparkles } from 'lucide-react';
import api, { getImageUrl } from '../../api/axios';

export default function GalleryManager() {
  const { id } = useParams();
  const [decoration, setDecoration] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const [decorRes, imgRes] = await Promise.all([
        api.get(`/decorations/${id}/`),
        api.get(`/decoration-images/?decoration=${id}`),
      ]);
      setDecoration(decorRes.data);
      setImages(imgRes.data);
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const handleAddPhoto = async (imageUrl, cap = '') => {
    if (!imageUrl) return;
    try {
      await api.post('/decoration-images/', {
        decoration: id,
        image: imageUrl,
        caption: cap,
      });
      setNewImageUrl('');
      setCaption('');
      fetchGallery();
    } catch (err) {
      console.error('Error uploading gallery photo:', err);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAddPhoto(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = async (imageId) => {
    if (window.confirm('Delete this gallery photo?')) {
      try {
        await api.delete(`/decoration-images/${imageId}/`);
        fetchGallery();
      } catch (err) {
        console.error('Error deleting photo:', err);
      }
    }
  };

  const handleSetMainCover = async (imageUrl) => {
    try {
      await api.put(`/decorations/${id}/`, {
        ...decoration,
        main_image: imageUrl,
      });
      fetchGallery();
    } catch (err) {
      console.error('Error updating main image:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-48 rounded-3xl bg-slate-900 animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link to="/admin/decorations" className="inline-flex items-center space-x-2 text-xs font-bold text-rose-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Decoration Management</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Multi-Photo Gallery Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">{decoration?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Upload multiple photos. They will automatically appear in customer lightbox galleries.</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-300 block">Total Photos:</span>
          <span className="text-2xl font-black text-purple-400">{images.length + 1}</span>
        </div>
      </div>

      {/* Add New Photo Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Upload className="w-4 h-4 text-purple-400 mr-2" /> Upload New Gallery Photos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select File(s) to Upload</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 w-full"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1">OR Paste Photo Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="md:col-span-3">
            <button
              onClick={() => handleAddPhoto(newImageUrl, caption)}
              disabled={!newImageUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add URL Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Cover Image Display */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-2" /> Current Main Cover Image
        </h3>
        <div className="w-48 h-36 rounded-2xl overflow-hidden border-2 border-amber-500 relative">
          <img src={getImageUrl(decoration?.main_image)} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
            Main Cover
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">All Gallery Photos ({images.length})</h3>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="glass-card rounded-2xl p-3 border border-slate-800 space-y-2 group relative">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => handleSetMainCover(img.image)}
                    className="text-[10px] font-bold text-amber-400 hover:underline flex items-center"
                  >
                    <Star className="w-3 h-3 mr-1" /> Set as Cover
                  </button>

                  <button
                    onClick={() => handleDeletePhoto(img.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs">
            No gallery photos added yet. Use the upload box above to add 5-10 photos for this decoration!
          </div>
        )}
      </div>
    </div>
  );
}
