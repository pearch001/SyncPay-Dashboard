import { DollarSign, Users, TrendingUp, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import AIInsightCard from '../components/AIInsightCard';
import { formatCurrency } from '../utils/formatters';

export default function Analytics() {
  // Dummy data - replace with actual API data
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(1245680),
      icon: <DollarSign className="h-6 w-6 text-primary-600" />,
      trend: { value: 12.5, isPositive: true },
      color: 'bg-primary-100',
      badge: 'AI Insight',
    },
    {
      title: 'Active Users',
      value: '8,456',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      trend: { value: 8.2, isPositive: true },
      color: 'bg-blue-100',
    },
    {
      title: 'Transaction Volume',
      value: '24,567',
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      trend: { value: 3.1, isPositive: false },
      color: 'bg-purple-100',
    },
    {
      title: 'Success Rate',
      value: '98.4%',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      trend: { value: 2.3, isPositive: true },
      color: 'bg-green-100',
    },
  ];

  // Revenue chart data
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 58000 },
    { month: 'Jun', revenue: 70000 },
  ];

  // Transaction distribution data
  const transactionData = [
    { name: 'Success', value: 85, color: '#10B981' },
    { name: 'Pending', value: 10, color: '#F59E0B' },
    { name: 'Failed', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <AIInsightCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
            badge={stat.badge}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4843B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4843B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₦${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4843B"
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: '#D4843B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Transaction Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {transactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
