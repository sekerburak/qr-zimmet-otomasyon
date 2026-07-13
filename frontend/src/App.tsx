import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import QrScanner from './pages/QrScanner';
import Assignments from './pages/Assignments';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import InventoryPage from './pages/InventoryPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Placeholder pages
const SettingsPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
    <p className="text-slate-500">Ayarlar sayfası yapım aşamasında.</p>
  </div>
);
const HelpPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
    <p className="text-slate-500">Yardım sayfası yapım aşamasında.</p>
  </div>
);
const ReportsPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
    <p className="text-slate-500">Raporlar sayfası yapım aşamasında.</p>
  </div>
);
const NotFound = () => (
  <div className="p-12 text-center text-slate-500">404 - Sayfa Bulunamadı</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="scanner" element={<QrScanner />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="reports" element={<ReportsPlaceholder />} />
          <Route path="settings" element={<SettingsPlaceholder />} />
          <Route path="help" element={<HelpPlaceholder />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
