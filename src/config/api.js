export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://185.218.124.154:8800/api',
  ENDPOINTS: {
    LOGIN: '/users/users/login/',
    PROFILE: '/users/users/profile/',
    PRODUCTS: '/inventory/products/',
    DASHBOARD: '/reports/dashboard_summary/'
  }
};

export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@minierp.com',
    password: 'test123456'
  }
};