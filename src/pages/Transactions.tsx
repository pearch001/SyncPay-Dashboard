import { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import type { Transaction } from '../types/index';
import { formatCurrency, formatDate } from '../utils/formatters';

// Dummy transaction data
const dummyTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'CREDIT',
    amount: 25000,
    status: 'SUCCESS',
    sender: 'Adebayo Okonkwo',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Account funding via bank transfer',
    reference: 'TXN-2024-001-ABC',
    createdAt: new Date('2024-12-13T14:30:00').toISOString(),
  },
  {
    id: '2',
    userId: '2',
    type: 'DEBIT',
    amount: 5500,
    status: 'SUCCESS',
    sender: 'Chiamaka Nwankwo',
    receiver: 'ShopRite',
    category: 'Shopping',
    description: 'Grocery purchase',
    reference: 'TXN-2024-002-DEF',
    createdAt: new Date('2024-12-13T13:15:00').toISOString(),
  },
  {
    id: '3',
    userId: '3',
    type: 'CREDIT',
    amount: 15000,
    status: 'PENDING',
    sender: 'Emeka Johnson',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Bank transfer pending confirmation',
    reference: 'TXN-2024-003-GHI',
    createdAt: new Date('2024-12-13T12:45:00').toISOString(),
  },
  {
    id: '4',
    userId: '4',
    type: 'DEBIT',
    amount: 3200,
    status: 'FAILED',
    sender: 'Fatima Abubakar',
    receiver: 'Uber',
    category: 'Transport',
    description: 'Insufficient balance',
    reference: 'TXN-2024-004-JKL',
    createdAt: new Date('2024-12-13T11:30:00').toISOString(),
  },
  {
    id: '5',
    userId: '5',
    type: 'DEBIT',
    amount: 12500,
    status: 'SUCCESS',
    sender: 'Oluwaseun Adeyemi',
    receiver: 'Netflix',
    category: 'Entertainment',
    description: 'Monthly subscription',
    reference: 'TXN-2024-005-MNO',
    createdAt: new Date('2024-12-13T10:20:00').toISOString(),
  },
  {
    id: '6',
    userId: '6',
    type: 'CREDIT',
    amount: 50000,
    status: 'SUCCESS',
    sender: 'Chidinma Eze',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Card payment',
    reference: 'TXN-2024-006-PQR',
    createdAt: new Date('2024-12-12T16:45:00').toISOString(),
  },
  {
    id: '7',
    userId: '7',
    type: 'DEBIT',
    amount: 8750,
    status: 'SUCCESS',
    sender: 'Ibrahim Musa',
    receiver: 'Jumia',
    category: 'Shopping',
    description: 'Online purchase',
    reference: 'TXN-2024-007-STU',
    createdAt: new Date('2024-12-12T15:30:00').toISOString(),
  },
  {
    id: '8',
    userId: '8',
    type: 'CREDIT',
    amount: 30000,
    status: 'PENDING',
    sender: 'Ngozi Okafor',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Processing bank transfer',
    reference: 'TXN-2024-008-VWX',
    createdAt: new Date('2024-12-12T14:15:00').toISOString(),
  },
  {
    id: '9',
    userId: '9',
    type: 'DEBIT',
    amount: 4500,
    status: 'SUCCESS',
    sender: 'Tunde Bakare',
    receiver: 'DSTV',
    category: 'Entertainment',
    description: 'Cable TV subscription',
    reference: 'TXN-2024-009-YZA',
    createdAt: new Date('2024-12-12T13:00:00').toISOString(),
  },
  {
    id: '10',
    userId: '10',
    type: 'DEBIT',
    amount: 1800,
    status: 'FAILED',
    sender: 'Blessing Okoro',
    receiver: 'Airtel',
    category: 'Airtime',
    description: 'Network error',
    reference: 'TXN-2024-010-BCD',
    createdAt: new Date('2024-12-12T12:30:00').toISOString(),
  },
  {
    id: '11',
    userId: '11',
    type: 'CREDIT',
    amount: 75000,
    status: 'SUCCESS',
    sender: 'Yusuf Ahmed',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Bank transfer',
    reference: 'TXN-2024-011-EFG',
    createdAt: new Date('2024-12-11T18:20:00').toISOString(),
  },
  {
    id: '12',
    userId: '12',
    type: 'DEBIT',
    amount: 6200,
    status: 'SUCCESS',
    sender: 'Amaka Chukwu',
    receiver: 'KFC',
    category: 'Food & Drink',
    description: 'Restaurant payment',
    reference: 'TXN-2024-012-HIJ',
    createdAt: new Date('2024-12-11T17:45:00').toISOString(),
  },
  {
    id: '13',
    userId: '13',
    type: 'DEBIT',
    amount: 15500,
    status: 'SUCCESS',
    sender: 'Chinedu Onyeka',
    receiver: 'Bolt',
    category: 'Transport',
    description: 'Ride payment',
    reference: 'TXN-2024-013-KLM',
    createdAt: new Date('2024-12-11T16:30:00').toISOString(),
  },
  {
    id: '14',
    userId: '14',
    type: 'CREDIT',
    amount: 10000,
    status: 'PENDING',
    sender: 'Kemi Adebisi',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Awaiting confirmation',
    reference: 'TXN-2024-014-NOP',
    createdAt: new Date('2024-12-11T15:15:00').toISOString(),
  },
  {
    id: '15',
    userId: '15',
    type: 'DEBIT',
    amount: 22000,
    status: 'SUCCESS',
    sender: 'Adeola Williams',
    receiver: 'Konga',
    category: 'Shopping',
    description: 'Electronics purchase',
    reference: 'TXN-2024-015-QRS',
    createdAt: new Date('2024-12-11T14:00:00').toISOString(),
  },
  {
    id: '16',
    userId: '1',
    type: 'DEBIT',
    amount: 3500,
    status: 'SUCCESS',
    sender: 'Adebayo Okonkwo',
    receiver: 'MTN',
    category: 'Airtime',
    description: 'Mobile recharge',
    reference: 'TXN-2024-016-TUV',
    createdAt: new Date('2024-12-10T19:30:00').toISOString(),
  },
  {
    id: '17',
    userId: '2',
    type: 'CREDIT',
    amount: 40000,
    status: 'SUCCESS',
    sender: 'Chiamaka Nwankwo',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Card payment',
    reference: 'TXN-2024-017-WXY',
    createdAt: new Date('2024-12-10T18:15:00').toISOString(),
  },
  {
    id: '18',
    userId: '3',
    type: 'DEBIT',
    amount: 7800,
    status: 'FAILED',
    sender: 'Emeka Johnson',
    receiver: 'Spotify',
    category: 'Entertainment',
    description: 'Payment declined',
    reference: 'TXN-2024-018-ZAB',
    createdAt: new Date('2024-12-10T17:00:00').toISOString(),
  },
  {
    id: '19',
    userId: '4',
    type: 'DEBIT',
    amount: 9500,
    status: 'SUCCESS',
    sender: 'Fatima Abubakar',
    receiver: 'IKEDC',
    category: 'Utilities',
    description: 'Electricity bill payment',
    reference: 'TXN-2024-019-CDE',
    createdAt: new Date('2024-12-10T16:45:00').toISOString(),
  },
  {
    id: '20',
    userId: '5',
    type: 'CREDIT',
    amount: 100000,
    status: 'SUCCESS',
    sender: 'Oluwaseun Adeyemi',
    receiver: 'SyncPay Wallet',
    category: 'Wallet Top-up',
    description: 'Large bank transfer',
    reference: 'TXN-2024-020-FGH',
    createdAt: new Date('2024-12-10T15:30:00').toISOString(),
  },
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'SUCCESS' | 'PENDING' | 'FAILED'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Calculate stats
  const totalTransactions = dummyTransactions.length;
  const totalAmount = dummyTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const successfulTransactions = dummyTransactions.filter(t => t.status === 'SUCCESS');
  const successfulCount = successfulTransactions.length;
  const successfulAmount = successfulTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const pendingTransactions = dummyTransactions.filter(t => t.status === 'PENDING');
  const pendingCount = pendingTransactions.length;
  const pendingAmount = pendingTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const failedTransactions = dummyTransactions.filter(t => t.status === 'FAILED');
  const failedCount = failedTransactions.length;
  const failedAmount = failedTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Filter and sort transactions
  let filteredTransactions = dummyTransactions.filter(transaction => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.receiver.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Sort transactions
  filteredTransactions.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleExport = () => {
    // TODO: Implement CSV export
    alert('Export functionality to be implemented');
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'CREDIT'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const stats = [
    {
      title: 'Total Transactions',
      value: totalTransactions.toString(),
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100',
      badge: formatCurrency(totalAmount),
    },
    {
      title: 'Successful',
      value: successfulCount.toString(),
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100',
      badge: formatCurrency(successfulAmount),
    },
    {
      title: 'Pending',
      value: pendingCount.toString(),
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      color: 'bg-yellow-100',
      badge: formatCurrency(pendingAmount),
    },
    {
      title: 'Failed',
      value: failedCount.toString(),
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      color: 'bg-red-100',
      badge: formatCurrency(failedAmount),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all platform transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            badge={stat.badge}
          />
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Filters Row */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by reference or user..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as 'all' | 'SUCCESS' | 'PENDING' | 'FAILED');
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
            >
              <option value="all">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => toggleSort('amount')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Amount</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => toggleSort('date')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Date & Time</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {transaction.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.sender}</div>
                    <div className="text-xs text-gray-500">→ {transaction.receiver}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(
                        transaction.type
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-lg transition"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, filteredTransactions.length)}</span> of{' '}
              <span className="font-medium">{filteredTransactions.length}</span> transactions
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
