import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://bookbarter-backend.onrender.com/api';

console.log('🔍 API URL being used:', API_URL);
console.log('🔍 Environment:', import.meta.env.MODE);

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for mobile
});

// Add request interceptor for debugging
instance.interceptors.request.use(
  (config) => {
    console.log('📤 Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.message);
    console.error('❌ Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default instance;
