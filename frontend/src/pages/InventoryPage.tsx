import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Plus, Package, CheckCircle2, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { mockInventory, mockUsers, mockCategories, InventoryItem } from '../data/mockData';

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'Zimmetli': { label: 'Zimmetli', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  'Depoda': { label: 'Depoda', color: 'bg-blue-100 text-blue-700', icon: <Package className="w-3 h-3" /> },
  'Bakımda': { label: 'Bakımda', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  'Hurda': { label: 'Hurda', color: 'bg-red-100 text-red-700', icon: <Trash2 className="w-3 h-3" /> },
};

const ITEMS_PER_PAGE = 20;

const InventoryPage = () => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockInventory.filter(item => {
      const matchSearch = search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.serial.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'all' || item.category === catFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useMemo(() => setPage(1), [search, catFilter, statusFilter]);

  // Category stats
  const catStats = useMemo(() => {
    const map: Record<string, number> = {};
    mockInventory.forEach(i => { map[i.category] = (map[i.category] || 0) + 1; });
    return map;
  }, []);

  const statusStats = useMemo(() => {
    const counts = { 'Zimmetli': 0, 'Depoda': 0, 'Bakımda': 0, 'Hurda': 0 };
    mockInventory.forEach(i => { counts[i.status as keyof typeof counts]++; });
    return counts;
  }, []);

  const getUserName = (id: string | null) => {
    if (!id) return '-';
    return mockUsers.find(u => u.id === id)?.name || '-';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Demirbaş Yönetimi</h2>
          <p className="text-slate-500 text-sm mt-1">Toplam <strong>{mockInventory.length}</strong> demirbaş kayıtlıdır.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20">
          <Plus className="w-5 h-5" />
          Yeni Demirbaş
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusStats).map(([status, count]) => {
          const info = STATUS_MAP[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3 hover:shadow-md transition-all cursor-pointer ${statusFilter === status ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-100'}`}
            >
              <div className={`p-3 rounded-xl ${info.color}`}>
                {info.icon}
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500">{info.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ürün adı, kod, seri no veya marka ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option value="all">Tüm Kategoriler</option>
            {mockCategories.map(c => <option key={c} value={c}>{c} ({catStats[c] || 0})</option>)}
          </select>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
          <option value="all">Tüm Durumlar</option>
          <option value="Zimmetli">Zimmetli</option>
          <option value="Depoda">Depoda</option>
          <option value="Bakımda">Bakımda</option>
          <option value="Hurda">Hurda</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-4 font-semibold text-slate-600">Kod</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600">Ürün Adı</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600 hidden lg:table-cell">Kategori</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600 hidden xl:table-cell">Seri No</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600">Durum</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600 hidden md:table-cell">Zimmetli Kişi</th>
                <th className="text-left px-5 py-4 font-semibold text-slate-600 hidden xl:table-cell">Satın Alma</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => {
                const statusInfo = STATUS_MAP[item.status] || STATUS_MAP['Depoda'];
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer">
                    <td className="px-5 py-3 font-mono text-xs text-blue-600 font-medium">{item.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400 lg:hidden">{item.category}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600 hidden lg:table-cell">{item.category}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs hidden xl:table-cell">{item.serial}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 hidden md:table-cell">{getUserName(item.assignedTo)}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs hidden xl:table-cell">{item.purchaseDate}</td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">Sonuç bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            <strong>{filtered.length}</strong> üründen <strong>{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</strong> arası gösteriliyor
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) { pageNum = i + 1; }
              else if (page <= 4) { pageNum = i + 1; }
              else if (page >= totalPages - 3) { pageNum = totalPages - 6 + i; }
              else { pageNum = page - 3 + i; }
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === pageNum ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
