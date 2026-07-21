import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Backend'e giriş isteği atıyoruz
      const response = await api.post('/auth/login', { email, password });
      
      // Backend'den gelen veri yapısına göre token ve user'ı yakalıyoruz
      const token = response.data.token || response.data.data?.token;
      const user = response.data.user || response.data.data?.user;

      if (token && user) {
        // Zustand store'u güncelliyoruz (Bu işlem otomatik olarak localStorage'a da yazıyor)
        setAuth(user, token);

        // Ana sayfaya güvenle yönlendiriyoruz
        navigate('/', { replace: true });
      } else {
        setError('Sunucudan geçersiz veri formatı döndü.');
      }
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setError(
        err.response?.data?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '30px',
        border: '1px solid #444',
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Giriş Yap
      </h2>

      {error && (
        <div
          style={{
            color: '#ff6b6b',
            backgroundColor: '#3d1a1a',
            border: '1px solid #ff6b6b',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            E-posta:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="yusuf@test.com"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #555',
              backgroundColor: '#2d2d2d',
              color: '#ffffff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Şifre:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #555',
              backgroundColor: '#2d2d2d',
              color: '#ffffff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#555' : '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default Login;