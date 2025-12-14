import { useState } from 'react';
import { Users as UsersIcon, UserCheck, UserX, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import type { User } from '../types/index';

// Dummy user data
const dummyUsers: User[] = [
  {
    id: '1',
    fullName: 'Adebayo Okonkwo',
    email: 'adebayo.okonkwo@email.com',
    phoneNumber: '+234 801 234 5678',
    balance: 125000.50,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    fullName: 'Chiamaka Nwankwo',
    email: 'chiamaka.n@email.com',
    phoneNumber: '+234 802 345 6789',
    balance: 89500.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    fullName: 'Emeka Johnson',
    email: 'emeka.j@email.com',
    phoneNumber: '+234 803 456 7890',
    balance: 45200.75,
    isActive: false,
    lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '4',
    fullName: 'Fatima Abubakar',
    email: 'fatima.abu@email.com',
    phoneNumber: '+234 804 567 8901',
    balance: 210000.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '5',
    fullName: 'Oluwaseun Adeyemi',
    email: 'seun.adeyemi@email.com',
    phoneNumber: '+234 805 678 9012',
    balance: 67890.25,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-28').toISOString(),
  },
  {
    id: '6',
    fullName: 'Chidinma Eze',
    email: 'chidinma.eze@email.com',
    phoneNumber: '+234 806 789 0123',
    balance: 34500.00,
    isActive: false,
    lastLoginAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: '7',
    fullName: 'Ibrahim Musa',
    email: 'ibrahim.musa@email.com',
    phoneNumber: '+234 807 890 1234',
    balance: 156700.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: '8',
    fullName: 'Ngozi Okafor',
    email: 'ngozi.okafor@email.com',
    phoneNumber: '+234 808 901 2345',
    balance: 92300.50,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-03-12').toISOString(),
  },
  {
    id: '9',
    fullName: 'Tunde Bakare',
    email: 'tunde.bakare@email.com',
    phoneNumber: '+234 809 012 3456',
    balance: 178000.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '10',
    fullName: 'Blessing Okoro',
    email: 'blessing.okoro@email.com',
    phoneNumber: '+234 810 123 4567',
    balance: 23400.75,
    isActive: false,
    lastLoginAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '11',
    fullName: 'Yusuf Ahmed',
    email: 'yusuf.ahmed@email.com',
    phoneNumber: '+234 811 234 5678',
    balance: 145600.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-03-20').toISOString(),
  },
  {
    id: '12',
    fullName: 'Amaka Chukwu',
    email: 'amaka.chukwu@email.com',
    phoneNumber: '+234 812 345 6789',
    balance: 56780.25,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-18').toISOString(),
  },
  {
    id: '13',
    fullName: 'Chinedu Onyeka',
    email: 'chinedu.onyeka@email.com',
    phoneNumber: '+234 813 456 7890',
    balance: 98500.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-30').toISOString(),
  },
  {
    id: '14',
    fullName: 'Kemi Adebisi',
    email: 'kemi.adebisi@email.com',
    phoneNumber: '+234 814 567 8901',
    balance: 12300.50,
    isActive: false,
    lastLoginAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '15',
    fullName: 'Adeola Williams',
    email: 'adeola.williams@email.com',
    phoneNumber: '+234 815 678 9012',
    balance: 234000.00,
    isActive: true,
    lastLoginAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-03-08').toISOString(),
  },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate stats
  const totalUsers = dummyUsers.length;
  const activeUsers = dummyUsers.filter(u => u.isActive).length;
  const inactiveUsers = dummyUsers.filter(u => !u.isActive).length;

  // Filter users
  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery);

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Helper function to format balance
  const formatBalance = (balance: number) => {
    return `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: <UsersIcon className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers.toString(),
      icon: <UserX className="h-6 w-6 text-gray-600" />,
      color: 'bg-gray-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
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
                setFilterStatus(e.target.value as 'all' | 'active' | 'inactive');
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {getInitials(user.fullName)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatBalance(user.balance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRelativeTime(user.lastLoginAt)}
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
              <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> users
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
