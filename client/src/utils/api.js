import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://intern-demo-3.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const url = error.config?.url || '';
        if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    }
    return Promise.reject(error);
  }
);

export default api;