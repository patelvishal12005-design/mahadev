import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderTree, Layers, Sparkles, MapPin,
  CalendarDays, Settings, LogOut, ExternalLink, Menu, X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminSidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Sub-Categories', path: '/admin/subcategories', icon: Layers },
    { label: 'Decorations', path: '/admin/decorations', icon: Sparkles },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Admin Header Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-md shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">
                ADMIN<span className="gradient-text">PANEL</span>
              </span>
              <span className="text-[10px] text-rose-400 font-semibold tracking-wider uppercase block -mt-0.5">
                Decoration Manager
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin User Info */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold flex items-center justify-center text-sm uppercase">
            {user?.username ? user.username.charAt(0) : 'A'}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate">{user?.username || 'Admin User'}</h4>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse"></span>
              Super Admin Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          target="_blank"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-800"
        >
          <span className="flex items-center">
            <ExternalLink className="w-3.5 h-3.5 mr-2 text-rose-400" />
            Live Customer Site
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-300 hover:text-white text-xs font-bold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile & Tablet Header Navigation Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between w-full">
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>
          <span className="text-sm font-black tracking-tight text-white">
            ADMIN<span className="gradient-text">PANEL</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800/80 flex-col justify-between h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
