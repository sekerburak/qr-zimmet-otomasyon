import React from 'react';
import { Package, QrCode, Users, FileText, ArrowRightLeft, ShieldCheck, LogOut, LayoutGrid, Boxes, Settings, HelpCircle } from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { user, logout } = useAuthStore();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const mainNav = [
    { icon: <LayoutGrid className="w-5 h-5" />, label: 'Dashboard', path: '/' },
  ];

  const managementNav = [
    { icon: <Boxes className="w-5 h-5" />, label: 'Demirbaş Yönetimi', path: '/inventory' },
    { icon: <Users className="w-5 h-5" />, label: 'Kullanıcı Yönetimi', path: '/users' },
    { icon: <ArrowRightLeft className="w-5 h-5" />, label: 'Zimmet İşlemleri', path: '/assignments' },
  ];

  const toolsNav = [
    { icon: <QrCode className="w-5 h-5" />, label: 'QR Tarayıcı', path: '/scanner' },
    { icon: <FileText className="w-5 h-5" />, label: 'Raporlar', path: '/reports' },
  ];

  const systemNav = [
    { icon: <Settings className="w-5 h-5" />, label: 'Ayarlar', path: '/settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Yardım', path: '/help' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const renderNavGroup = (title: string, items: typeof mainNav) => (
    <div className="mb-2">
      <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive(item.path) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  // Find current page label
  const allNav = [...mainNav, ...managementNav, ...toolsNav, ...systemNav];
  const currentLabel = allNav.find(n => isActive(n.path))?.label;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0">
        {/* Logo */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-tight">QR Zimmet</span>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Otomasyon Paneli</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800 mx-4 mb-4"></div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-5">
          {renderNavGroup('Ana Sayfa', mainNav)}
          {renderNavGroup('Yönetim', managementNav)}
          {renderNavGroup('Araçlar', toolsNav)}
          {renderNavGroup('Sistem', systemNav)}
        </nav>

        {/* User Info + Logout */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
              {user?.initials || '??'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Kullanıcı'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">
              {currentLabel || 'QR Zimmet'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-slate-600 capitalize">{user?.role || 'Personel'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
