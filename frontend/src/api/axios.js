import axios from 'axios';

const API_BASE_URL = 'https://mahadev-lc9b.onrender.com/api';
const BACKEND_BASE = 'https://mahadev-lc9b.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('decor_admin_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${BACKEND_BASE}${imagePath}`;
  }
  return `${BACKEND_BASE}/${imagePath}`;
};

export default api;
