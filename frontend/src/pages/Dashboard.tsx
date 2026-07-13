import React from 'react';
import { Package, ArrowRightLeft, Users, TrendingUp } from 'lucide-react';
import { mockInventory, mockUsers } from '../data/mockData';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = useAuthStore(state => state.user);

  const totalInventory = mockInventory.length;
  const activeAssignments = mockInventory.filter(i => i.status === 'Zimmetli').length;
  const inStorage = mockInventory.filter(i => i.status === 'Depoda').length;
  const underMaintenance = mockInventory.filter(i => i.status === 'Bakımda').length;
  const assignmentRatio = Math.round((activeAssignments / totalInventory) * 100);
  const totalUsers = mockUsers.length;

  // Category breakdown
  const catMap: Record<string, number> = {};
  mockInventory.forEach(i => { catMap[i.category] = (catMap[i.category] || 0) + 1; });
  const topCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Recent assigned items (last 8)
  const recentAssigned = mockInventory
    .filter(i => i.status === 'Zimmetli' && i.assignedTo)
    .slice(-8)
    .reverse();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Hoş geldin, {user?.name.split(' ')[0] || 'Kullanıcı'}! 👋</h2>
          <p className="text-blue-100 max-w-xl text-lg">
            Sistemde <strong>{totalInventory}</strong> demirbaş ve <strong>{totalUsers}</strong> kullanıcı kayıtlı. Her şey kontrol altında.
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-32 translate-y-1/2 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { title: 'Toplam Demirbaş', value: totalInventory, color: 'bg-emerald-50 text-emerald-600', icon: <Package className="w-6 h-6" /> },
          { title: 'Aktif Zimmetler', value: activeAssignments, color: 'bg-blue-50 text-blue-600', icon: <ArrowRightLeft className="w-6 h-6" /> },
          { title: 'Depoda Bekleyen', value: inStorage, color: 'bg-amber-50 text-amber-600', icon: <TrendingUp className="w-6 h-6" /> },
          { title: 'Kayıtlı Personel', value: totalUsers, color: 'bg-purple-50 text-purple-600', icon: <Users className="w-6 h-6" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow group cursor-pointer">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Kategori Dağılımı</h3>
            <Link to="/inventory" className="text-sm font-medium text-blue-600 hover:text-blue-700">Tümünü Gör</Link>
          </div>
          <div className="p-6 space-y-4">
            {topCategories.map(([cat, count]) => {
              const pct = Math.round((count / totalInventory) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{cat}</span>
                    <span className="text-sm text-slate-500">{count} adet (%{pct})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Son Zimmetler</h3>
            <Link to="/assignments" className="text-sm font-medium text-blue-600 hover:text-blue-700">Tümünü Gör</Link>
          </div>
          <div className="p-6 space-y-4">
            {recentAssigned.map((item) => {
              const assignedUser = mockUsers.find(u => u.id === item.assignedTo);
              return (
                <div key={item.id} className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {assignedUser?.initials || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 truncate">{assignedUser?.name || '-'}</p>
                  </div>
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
