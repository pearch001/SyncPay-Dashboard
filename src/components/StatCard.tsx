import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  badge?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'bg-primary-100',
  badge,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className={`${color} rounded-lg p-3 flex-shrink-0`}>
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
              {badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>

            {/* Trend Indicator */}
            {trend && (
              <div className="flex items-center">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-success' : 'text-danger'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
