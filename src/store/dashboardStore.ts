import { create } from 'zustand';
import type { DashboardStats, User, Transaction } from '../types/index';

interface DashboardState {
  dashboardStats: DashboardStats | null;
  users: User[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  setDashboardStats: (stats: DashboardStats) => void;
  setUsers: (users: User[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardStats: null,
  users: [],
  transactions: [],
  isLoading: false,
  error: null,

  setDashboardStats: (stats: DashboardStats) => {
    set({ dashboardStats: stats });
  },

  setUsers: (users: User[]) => {
    set({ users });
  },

  setTransactions: (transactions: Transaction[]) => {
    set({ transactions });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
