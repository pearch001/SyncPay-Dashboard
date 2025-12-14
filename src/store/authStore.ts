import { create } from 'zustand';
import type { User } from '../types/index';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    // Save to localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Update state
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Clear state
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });

    // Redirect to login
    window.location.href = '/login';
  },

  setUser: (user: User) => {
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Update state
    set({ user });
  },

  checkAuth: () => {
    // Check localStorage on app load
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        // Invalid user data, clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      }
    }
  },
}));
