import React from 'react';
import { mockInventory, mockUsers } from '../data/mockData';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const user = authService.getCurrentUser();

  const totalInventory = mockInventory ? mockInventory.length : 0;
  const activeAssignments = mockInventory ? mockInventory.filter(i => i.status === 'Zimmetli').length : 0;
  const inStorage = mockInventory ? mockInventory.filter(i => i.status === 'Depoda').length : 0;
  const totalUsers = mockUsers ? mockUsers.length : 0;

  const catMap: Record<string, number> = {};
  if (mockInventory) {
    mockInventory.forEach(i => { catMap[i.category] = (catMap[i.category] || 0) + 1; });
  }
  const topCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const recentAssigned = mockInventory
    ? mockInventory.filter(i => i.status === 'Zimmetli' && i.assignedTo).slice(-8).reverse()
    : [];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Hoş geldin, {user?.name ? user.name.split(' ')[0] : 'Kullanıcı'}! 👋</h2>
          <p className="text-blue-100 max-w-xl text-lg">
            Sistemde <strong>{totalInventory}</strong> demirbaş ve <strong>{totalUsers}</strong> kullanıcı kayıtlı.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { title: 'Toplam Demirbaş', value: totalInventory, color: 'bg-emerald-50 text-emerald-600', icon: '📦' },
          { title: 'Aktif Zimmetler', value: activeAssignments, color: 'bg-blue-50 text-blue-600', icon: '🔄' },
          { title: 'Depoda Bekleyen', value: inStorage, color: 'bg-amber-50 text-amber-600', icon: '📈' },
          { title: 'Kayıtlı Personel', value: totalUsers, color: 'bg-purple-50 text-purple-600', icon: '👥' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Categories & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Kategori Dağılımı</h3>
          <div className="space-y-4">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="flex justify-between border-b pb-2">
                <span className="text-slate-700">{cat}</span>
                <span className="font-bold text-slate-900">{count} adet</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Son Zimmetler</h3>
          <div className="space-y-3">
            {recentAssigned.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-slate-800">{item.name}</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;