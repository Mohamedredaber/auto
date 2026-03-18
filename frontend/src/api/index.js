// src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // backend Laravel
  withCredentials: true,               // nécessaire pour Sanctum
  headers: { 'Accept': 'application/json' },
});

// Intercepteur pour erreurs globales
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

export default api;