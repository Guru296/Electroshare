import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Add a request interceptor
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

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and optionally redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not already on the login page, we might want to redirect.
      // But we will handle the UI state in AuthContext.
    }
    return Promise.reject(error);
  }
);

export default api;
