import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Building2, Shield, Package, CheckCircle2, Clock, Trash2, ChevronRight } from 'lucide-react';
import { mockUsers, mockInventory } from '../data/mockData';

const ROLES: Record<string, { label: string; color: string; bg: string }> = {
  admin: { label: 'Sistem Yöneticisi', color: 'text-red-700', bg: 'bg-red-100' },
  zimmet_sorumlusu: { label: 'Zimmet Sorumlusu', color: 'text-blue-700', bg: 'bg-blue-100' },
  depo: { label: 'Depo Görevlisi', color: 'text-amber-700', bg: 'bg-amber-100' },
  personel: { label: 'Personel', color: 'text-slate-600', bg: 'bg-slate-100' },
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'Zimmetli': { label: 'Zimmetli', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  'Depoda': { label: 'Depoda', color: 'bg-blue-100 text-blue-700', icon: <Package className="w-3 h-3" /> },
  'Bakımda': { label: 'Bakımda', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  'Hurda': { label: 'Hurda', color: 'bg-red-100 text-red-700', icon: <Trash2 className="w-3 h-3" /> },
};

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-fuchsia-500',
];

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useMemo(() => mockUsers.find(u => u.id === id), [id]);

  const userItems = useMemo(() => {
    return mockInventory.filter(item => item.assignedTo === id);
  }, [id]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    userItems.forEach(item => { map[item.category] = (map[item.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [userItems]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-slate-500 text-lg">Kullanıcı bulunamadı.</p>
        <button onClick={() => navigate('/users')} className="text-blue-600 hover:text-blue-700 font-medium">
          ← Kullanıcı Listesine Dön
        </button>
      </div>
    );
  }

  const roleInfo = ROLES[user.role] || ROLES.personel;
  const gradient = AVATAR_GRADIENTS[parseInt(user.id) % AVATAR_GRADIENTS.length];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/users" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Kullanıcı Listesine Dön
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className={`h-32 bg-gradient-to-r ${gradient} relative`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        </div>
        <div className="px-8 pb-6 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white`}>
              {user.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Building2 className="w-4 h-4" />
                  {user.department}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.bg} ${roleInfo.color}`}>
                  <Shield className="w-3 h-3" />
                  {roleInfo.label}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-50 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{userItems.length}</p>
                <p className="text-xs text-blue-500 font-medium">Zimmetli Ürün</p>
              </div>
              <div className="bg-emerald-50 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{categoryBreakdown.length}</p>
                <p className="text-xs text-emerald-500 font-medium">Farklı Kategori</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categoryBreakdown.map(([cat, count]) => (
            <div key={cat} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center hover:shadow-md transition-shadow">
              <p className="text-xl font-bold text-slate-800">{count}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{cat}</p>
            </div>
          ))}
        </div>
      )}

      {/* Assigned Items Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Zimmetli Demirbaşlar</h3>
            <p className="text-sm text-slate-500 mt-0.5">{user.name} üzerinde kayıtlı tüm ürünler</p>
          </div>
        </div>

        {userItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Kod</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Ürün Adı</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 hidden md:table-cell">Kategori</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 hidden lg:table-cell">Seri No</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Durum</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600 hidden lg:table-cell">Satın Alma</th>
                </tr>
              </thead>
              <tbody>
                {userItems.map((item, idx) => {
                  const statusInfo = STATUS_MAP[item.status] || STATUS_MAP['Depoda'];
                  return (
                    <tr key={item.id} className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-6 py-3.5 font-mono text-xs text-blue-600 font-semibold">{item.id}</td>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-400 md:hidden">{item.category}</p>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 hidden md:table-cell">{item.category}</td>
                      <td className="px-6 py-3.5 text-slate-400 font-mono text-xs hidden lg:table-cell">{item.serial}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 text-xs hidden lg:table-cell">{item.purchaseDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">Bu kullanıcının üzerinde zimmetli ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
