import axios from 'axios';

const api = axios.create({
  // In dev: empty → Vite proxy handles /api → localhost:5000
  // In prod: VITE_API_URL = https://your-backend.onrender.com
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
