import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Giriş isteği gönderiliyor:', { email, password });

      // authService üzerinden login isteği
      const data = await authService.login({ email, password });
      console.log('Giriş başarılı yanıtı:', data);

      // Token veya user objesi dönüyorsa localStorage'a kaydedelim
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Yönlendirmeyi navigate ile güvenli yapalım
      navigate('/');
    } catch (err: any) {
      console.error('Giriş hatası detayları:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Giriş yapılamadı. Sunucuya ulaşılamıyor veya bilgiler hatalı.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Test amaçlı doğrudan giriş yapma butonu (Backend kapalıysa veya takılırsa)
  const handleBypassLogin = () => {
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify({ email: 'yusuf@test.com', role: 'ADMIN' }));
    navigate('/');
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ffffff' }}>Giriş Yap</h2>

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
            wordBreak: 'break-word',
          }}
        >
          <strong>Hata:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#dddddd', fontSize: '14px' }}>
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
          <label style={{ display: 'block', marginBottom: '5px', color: '#dddddd', fontSize: '14px' }}>
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
            marginBottom: '10px',
          }}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      {/* Ekstra: Her ihtimale karşı acil geçiş butonu */}
      <button
        type="button"
        onClick={handleBypassLogin}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: 'transparent',
          color: '#888',
          border: '1px dashed #555',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '10px',
        }}
      >
        ⚡ Direkt Panele Geç (Hızlı Test)
      </button>
    </div>
  );
};

export default Login;