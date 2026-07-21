import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import QrOperations from './pages/Qroperations';

// --- KORUMALI ROTA (ProtectedRoute) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// --- SOL MENÜ NAVİGASYON BİLEŞENİ ---
const SidebarNav = () => {
  const location = useLocation();

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: isActive ? '#f97316' : 'transparent',
      color: isActive ? '#ffffff' : '#9ca3af',
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Link to="/" style={getLinkStyle('/')}>
        <span>📊</span> Dashboard
      </Link>
      <Link to="/qr-operations" style={getLinkStyle('/qr-operations')}>
        <span>🏷️</span> QR Etiket İşlemleri
      </Link>
      <Link to="/assets" style={getLinkStyle('/assets')}>
        <span>💻</span> Demirbaş Listesi
      </Link>
      <Link to="/movements" style={getLinkStyle('/movements')}>
        <span>📋</span> Zimmet Hareketleri
      </Link>
      <Link to="/users" style={getLinkStyle('/users')}>
        <span>👥</span> Personel Yönetimi
      </Link>
    </nav>
  );
};

// --- ANA DÜZEN (Layout & Sidebar - Aydınlık Tema) ---
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* SOL MENÜ */}
      <aside style={{ width: '260px', backgroundColor: '#111827', borderRight: '1px solid #1f2937', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Logo & Marka */}
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#f97316', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '18px' }}>QR</span>
            <span>Zimmet Panel</span>
          </div>

          {/* Menü Linkleri */}
          <SidebarNav />
        </div>

        {/* KULLANICI PROFİLİ & ÇIKIŞ */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px' }}>
          <div style={{ marginBottom: '12px', paddingLeft: '4px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#f3f4f6' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '500' }}>{user?.role}</div>
          </div>
          <button
            onClick={logout}
            style={{ width: '100%', padding: '10px', backgroundColor: '#374151', color: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* SAĞ İÇERİK ALANI (Aydınlık Tema) */}
      <main style={{ flex: 1, padding: '32px 40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};

// --- DASHBOARD İÇERİĞİ ---
const DashboardContent = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Sistem Genel Bakış</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', margin: 0 }}>Zimmetli cihazlar ve stok durum özeti</p>
        </div>
        <button style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)' }}>
          + Yeni Zimmet Ekle
        </button>
      </div>
      
      {/* İSTATİSTİK KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Toplam Demirbaş</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>142</div>
          <div style={{ fontSize: '12px', color: '#f97316', marginTop: '4px', fontWeight: '500' }}>Tüm kayıtlı stoklar</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Zimmetli Cihazlar</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a', marginTop: '8px' }}>98</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: '500' }}>Kullanımda olanlar</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Boşta / Depoda</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ea580c', marginTop: '8px' }}>44</div>
          <div style={{ fontSize: '12px', color: '#ea580c', marginTop: '4px', fontWeight: '500' }}>Atamaya hazır</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Aktif Personel</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>32</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>Kayıtlı kullanıcılar</div>
        </div>
      </div>

      {/* DEMİRBAŞ TABLOSU */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Son Zimmet Hareketleri</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280' }}>
              <th style={{ padding: '12px' }}>Cihaz / Ürün</th>
              <th style={{ padding: '12px' }}>Kategori</th>
              <th style={{ padding: '12px' }}>Zimmetlenen Kişi</th>
              <th style={{ padding: '12px' }}>Tarih</th>
              <th style={{ padding: '12px' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '14px 12px', fontWeight: '600', color: '#111827' }}>MacBook Pro M2 16"</td>
              <td style={{ padding: '14px 12px', color: '#4b5563' }}>Laptop</td>
              <td style={{ padding: '14px 12px', color: '#4b5563' }}>Ahmet Yılmaz</td>
              <td style={{ padding: '14px 12px', color: '#6b7280' }}>20.07.2026</td>
              <td style={{ padding: '14px 12px' }}>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Zimmetli</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '14px 12px', fontWeight: '600', color: '#111827' }}>Dell 27" 4K Monitör</td>
              <td style={{ padding: '14px 12px', color: '#4b5563' }}>Monitör</td>
              <td style={{ padding: '14px 12px', color: '#4b5563' }}>Mehmet Demir</td>
              <td style={{ padding: '14px 12px', color: '#6b7280' }}>18.07.2026</td>
              <td style={{ padding: '14px 12px' }}>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Zimmetli</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '14px 12px', fontWeight: '600', color: '#111827' }}>Logitech MX Master 3S</td>
              <td style={{ padding: '14px 12px', color: '#4b5563' }}>Aksesuar</td>
              <td style={{ padding: '14px 12px', color: '#9ca3af' }}>-</td>
              <td style={{ padding: '14px 12px', color: '#6b7280' }}>15.07.2026</td>
              <td style={{ padding: '14px 12px' }}>
                <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Depoda</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- GEÇİCİ SAYFA BİLEŞENİ (Sayfa yoksa Dashboard'a atmasını engeller) ---
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{title}</h1>
    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Bu modül geliştirme aşamasındadır.</p>
  </div>
);

// --- UYGULAMA ROTASI ---
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardContent />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/qr-operations" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <QrOperations />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assets" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlaceholderPage title="Demirbaş Listesi" />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movements" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlaceholderPage title="Zimmet Hareketleri" />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <PlaceholderPage title="Personel Yönetimi" />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;