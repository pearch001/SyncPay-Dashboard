import axios, { AxiosError } from 'axios';
import type { AuthResponse, DashboardStats, User, Transaction } from '../types/index';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://receivers-revolution-rehabilitation-attributes.trycloudflare.com',
  timeout: 30000, // Increased timeout for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and return data
api.interceptors.response.use(
  (response) => {
    // Return response.data for successful requests
    return response.data;
  },
  (error: AxiosError) => {
    // Handle 401 errors - Unauthorized
    if (error.response?.status === 401) {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Redirect to login
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    }

    // Return error message
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
    });
  }
);

// ============================================
// API Functions (Placeholder implementations)
// ============================================

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns Authentication response with token and user data
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    'https://receivers-revolution-rehabilitation-attributes.trycloudflare.com/api/v1/auth/admin/login',
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );
  return response.data;
};

/**
 * Get dashboard statistics
 * @returns Dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // TODO: Implement actual API call.
  // return api.get('/dashboard/stats');
  throw new Error('Not implemented yet');
};

/**
 * Get users list
 * @param page - Page number
 * @param limit - Items per page
 * @param status - Optional status filter (active/inactive)
 * @returns List of users
 */
export const getUsers = async (
  _page: number,
  _limit: number,
  _status?: 'active' | 'inactive'
): Promise<{ users: User[]; total: number }> => {
  // TODO: Implement actual API call
  // const params = { page, limit, ...(status && { status }) };
  // return api.get('/users', { params });
  throw new Error('Not implemented yet');
};

/**
 * Get transactions list
 * @param page - Page number
 * @param limit - Items per page
 * @param status - Optional status filter
 * @param dateRange - Optional date range filter
 * @returns List of transactions
 */
export const getTransactions = async (
  _page: number,
  _limit: number,
  _status?: 'SUCCESS' | 'PENDING' | 'FAILED',
  _dateRange?: { from: string; to: string }
): Promise<{ transactions: Transaction[]; total: number }> => {
  // TODO: Implement actual API call
  // const params = {
  //   page,
  //   limit,
  //   ...(status && { status }),
  //   ...(dateRange && { from: dateRange.from, to: dateRange.to }),
  // };
  // return api.get('/transactions', { params });
  throw new Error('Not implemented yet');
};

/**
 * Logout user
 * @returns Success message
 */
export const logout = async (): Promise<{ message: string }> => {
  // TODO: Implement actual API call
  // return api.post('/auth/logout');
  throw new Error('Not implemented yet');
};

export default api;
