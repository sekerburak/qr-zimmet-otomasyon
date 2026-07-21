import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

export const authService = {
  // Giriş yapma fonksiyonu
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<any>('/auth/login', credentials);
    
    console.log('Backend yanıtı:', response.data);

    // Backend yanıt formatı iki farklı şekilde gelebilir, ikisini de kontrol ediyoruz:
    const token = response.data.token || response.data.data?.token;
    const user = response.data.user || response.data.data?.user;

    // Token bulunduysa hafızaya yazıyoruz
    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token başarıyla LocalStorage\'a yazıldı:', token);
    } else {
      console.error('❌ Yanıtta token bulunamadı! Gelen veri:', response.data);
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  // Çıkış yapma fonksiyonu
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Kayıtlı kullanıcıyı getirme
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
};