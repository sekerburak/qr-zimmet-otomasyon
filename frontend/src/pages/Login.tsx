import React, { useState } from 'react';
import { QrCode, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../data/mockData';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.email === email && password === '123456');

      if (foundUser) {
        // MockUser'dan User'a dönüştürüyoruz (department hariç)
        const { department, ...userWithoutDept } = foundUser;
        login(userWithoutDept, `mock-jwt-token-${foundUser.id}`);
        navigate('/');
      } else {
        setError('E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sisteme Giriş</h1>
          <p className="text-slate-500">Stok & Demirbaş Otomasyonu</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 px-1">E-Posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="metehan@qrzimmet.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 px-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="123456"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" disabled={isLoading} />
              <span>Beni Hatırla</span>
            </label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Şifremi Unuttum</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2">Test Hesapları (Şifre: 123456)</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {mockUsers.slice(0, 6).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => { setEmail(u.email); setPassword('123456'); }}
                className="px-2 py-1 bg-slate-100 hover:bg-blue-100 rounded text-[10px] text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {u.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
