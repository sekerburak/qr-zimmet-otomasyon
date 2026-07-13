import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, UserPlus, Shield, Briefcase, Warehouse, Users as UsersIcon, Eye, Mail, Building2 } from 'lucide-react';
import { mockUsers, mockInventory, MockUser } from '../data/mockData';
import { Link } from 'react-router-dom';

const ROLES: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  admin: { label: 'Admin', color: 'text-red-700', bg: 'bg-red-100', icon: <Shield className="w-3.5 h-3.5" /> },
  zimmet_sorumlusu: { label: 'Zimmet Sorumlusu', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Briefcase className="w-3.5 h-3.5" /> },
  depo: { label: 'Depo Görevlisi', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Warehouse className="w-3.5 h-3.5" /> },
  personel: { label: 'Personel', color: 'text-slate-600', bg: 'bg-slate-100', icon: <UsersIcon className="w-3.5 h-3.5" /> },
};

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-fuchsia-500',
];

const ITEMS_PER_PAGE = 12;

const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const departments = useMemo(() => [...new Set(mockUsers.map(u => u.department))].sort(), []);

  // Role stats
  const roleStats = useMemo(() => {
    const counts: Record<string, number> = {};
    mockUsers.forEach(u => { counts[u.role] = (counts[u.role] || 0) + 1; });
    return counts;
  }, []);

  // Zimmet count per user
  const userZimmetCounts = useMemo(() => {
    const map: Record<string, number> = {};
    mockInventory.forEach(item => {
      if (item.status === 'Zimmetli' && item.assignedTo) {
        map[item.assignedTo] = (map[item.assignedTo] || 0) + 1;
      }
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    return mockUsers.filter(u => {
      const matchSearch = search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchDept = deptFilter === 'all' || u.department === deptFilter;
      return matchSearch && matchRole && matchDept;
    });
  }, [search, roleFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useMemo(() => setPage(1), [search, roleFilter, deptFilter]);

  const getGradient = (id: string) => AVATAR_GRADIENTS[parseInt(id) % AVATAR_GRADIENTS.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kullanıcı Yönetimi</h2>
          <p className="text-slate-500 text-sm mt-1">Sistemde kayıtlı <strong>{mockUsers.length}</strong> kullanıcıyı yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-slate-100 rounded-xl p-1 flex gap-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
              Kart
            </button>
            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
              Tablo
            </button>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20">
            <UserPlus className="w-4 h-4" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(ROLES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setRoleFilter(roleFilter === key ? 'all' : key)}
            className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3 hover:shadow-md transition-all cursor-pointer ${roleFilter === key ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-100'}`}
          >
            <div className={`p-3 rounded-xl ${info.bg} ${info.color}`}>
              {info.icon}
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-slate-800">{roleStats[key] || 0}</p>
              <p className="text-xs text-slate-500">{info.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="İsim, e-posta veya departman ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option value="all">Tüm Roller</option>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
          <option value="all">Tüm Departmanlar</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((user) => {
            const roleInfo = ROLES[user.role] || ROLES.personel;
            const zimmetCount = userZimmetCounts[user.id] || 0;
            return (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradient(user.id)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {user.initials}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleInfo.bg} ${roleInfo.color}`}>
                    {roleInfo.icon}
                    {roleInfo.label}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-0.5">{user.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <Building2 className="w-3 h-3" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${zimmetCount > 0 ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                    <span className="text-xs text-slate-500">
                      <strong className="text-slate-700">{zimmetCount}</strong> zimmetli ürün
                    </span>
                  </div>
                  <Eye className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">#</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Kullanıcı</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">E-Posta</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Departman</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Rol</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">Zimmet</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-600">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, idx) => {
                  const roleInfo = ROLES[user.role] || ROLES.personel;
                  const zimmetCount = userZimmetCounts[user.id] || 0;
                  return (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                      <td className="px-6 py-3.5 text-slate-400 font-mono text-xs">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getGradient(user.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {user.initials}
                          </div>
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{user.email}</td>
                      <td className="px-6 py-3.5 text-slate-600">{user.department}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color}`}>
                          {roleInfo.icon}
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className="font-semibold text-slate-700">{zimmetCount}</span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <Link to={`/users/${user.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          Görüntüle
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-16 text-slate-400">Sonuç bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between px-6 py-4">
        <p className="text-sm text-slate-500">
          <strong>{filtered.length}</strong> kullanıcıdan <strong>{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</strong> arası
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
  );
};

export default UsersPage;
