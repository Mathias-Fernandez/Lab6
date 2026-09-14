import axios from 'axios';
import { API_CONFIG } from '../config/api.js';

const TOKEN_KEY = 'mini_erp_token';

const http = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export const usersAPI = {
  async login(email, password) {
    const { data } = await http.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
    const token = data.token ?? data.access ?? data.accessToken;

    if (!token) {
      throw new Error('La API no devolvió un token válido.');
    }

    setToken(token);
    return data;
  },

  async getProfile() {
    const { data } = await http.get(API_CONFIG.ENDPOINTS.PROFILE);
    return data;
  },

  logout() {
    clearToken();
  }
};

export const productsAPI = {
  async getAll() {
    const { data } = await http.get(API_CONFIG.ENDPOINTS.PRODUCTS);
    if (Array.isArray(data)) return data;
    return data.results ?? data.products ?? [];
  }
};

export const reportsAPI = {
  async getDashboardSummary() {
    const { data } = await http.get(API_CONFIG.ENDPOINTS.DASHBOARD);
    return data;
  }
};