import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

// Customer Pages
import Home from './pages/Home';
import AllDecorations from './pages/AllDecorations';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import DecorationDetails from './pages/DecorationDetails';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CategoryManager from './pages/Admin/CategoryManager';
import SubCategoryManager from './pages/Admin/SubCategoryManager';
import DecorationManager from './pages/Admin/DecorationManager';
import GalleryManager from './pages/Admin/GalleryManager';
import LocationManager from './pages/Admin/LocationManager';
import BookingManager from './pages/Admin/BookingManager';
import SettingsManager from './pages/Admin/SettingsManager';

// Customer Layout Wrapper
const CustomerLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Admin Layout Wrapper
const AdminLayout = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-w-0 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Routes>
          {/* Customer Public Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetails />} />
            <Route path="/decorations" element={<AllDecorations />} />
            <Route path="/decorations/:id" element={<DecorationDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/admin/subcategories" element={<SubCategoryManager />} />
            <Route path="/admin/decorations" element={<DecorationManager />} />
            <Route path="/admin/decorations/:id/gallery" element={<GalleryManager />} />
            <Route path="/admin/locations" element={<LocationManager />} />
            <Route path="/admin/bookings" element={<BookingManager />} />
            <Route path="/admin/settings" element={<SettingsManager />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LocationProvider>
    </AuthProvider>
  );
}
