import React, { useContext } from 'react';
import { Settings, ShieldCheck, Database, Cloud, Key, UserCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function SettingsManager() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">System Configurations</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Admin Settings & System Status</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <UserCheck className="w-5 h-5 text-rose-400 mr-2" /> Logged In Admin Profile
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Username</span>
              <strong className="text-white">{user?.username || 'admin'}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Email Address</span>
              <strong className="text-white">{user?.email || 'admin@decorations.com'}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Role Authority</span>
              <strong className="text-emerald-400">Super Administrator (Full Access)</strong>
            </div>
          </div>
        </div>

        {/* Database & Cloud Storage */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <Database className="w-5 h-5 text-blue-400 mr-2" /> Database & Media Storage
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 flex items-center">
                <Database className="w-4 h-4 mr-2 text-emerald-400" /> Django Database
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Connected & Seeded
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 flex items-center">
                <Cloud className="w-4 h-4 mr-2 text-cyan-400" /> Image Storage Mode
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                Media / Base64 / Cloudinary
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 flex items-center">
                <Key className="w-4 h-4 mr-2 text-amber-400" /> Authentication
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Token / JWT Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
