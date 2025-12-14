export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  name?: string;
  email: string;
  balance?: number;
  isActive?: boolean;
  role?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  sender: string;
  receiver: string;
  category: string;
  description: string;
  reference: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  successfulTransactions: number;
  successfulAmount: number;
  pendingTransactions: number;
  pendingAmount: number;
  failedTransactions: number;
  failedAmount: number;
  revenueGrowth: number;
  userGrowthRate: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  admin: User;
}

export interface AuthError {
  success: false;
  error: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area';
  title: string;
  data: Record<string, unknown>[];
  labels?: {
    x?: string;
    y?: string;
  };
  dataKeys?: string[];
}
