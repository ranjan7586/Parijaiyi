import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the admin token to every request if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('parijaiyi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
