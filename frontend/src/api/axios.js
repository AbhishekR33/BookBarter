import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://bookbarter-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for production
});

export default instance;
