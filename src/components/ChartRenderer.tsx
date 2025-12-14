import { useRef } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Download, BarChart3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { ChartData } from '../types';

export type { ChartData };

interface ChartRendererProps {
  chartData: ChartData;
  className?: string;
}

// Color palette
const COLORS = {
  primary: '#D4843B',
  complementary: [
    '#D4843B',
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#EC4899',
  ],
  grid: '#E5E7EB',
  text: '#6B7280',
};

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        {label && <p className="font-medium mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' 
              ? entry.value.toLocaleString() 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <BarChart3 className="w-16 h-16 mb-3 opacity-30" />
    <p className="text-lg font-medium">No data available</p>
    <p className="text-sm">Chart data will appear here when available</p>
    <div className="mt-4 w-full max-w-xs h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-end justify-center gap-2 p-4">
      {[40, 65, 45, 80, 55, 70].map((height, i) => (
        <div
          key={i}
          className="w-6 bg-gray-100 rounded-t"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </div>
);

// Helper to extract data keys from data array
const extractDataKeys = (data: Record<string, unknown>[]): string[] => {
  if (!data || data.length === 0) return [];
  const firstItem = data[0];
  return Object.keys(firstItem).filter(key => {
    const value = firstItem[key];
    return typeof value === 'number';
  });
};

// Helper to get x-axis key (non-numeric field)
const getXAxisKey = (data: Record<string, unknown>[]): string => {
  if (!data || data.length === 0) return '';
  const firstItem = data[0];
  const nonNumericKeys = Object.keys(firstItem).filter(key => {
    const value = firstItem[key];
    return typeof value !== 'number';
  });
  return nonNumericKeys[0] || Object.keys(firstItem)[0];
};

export const ChartRenderer = ({ chartData, className = '' }: ChartRendererProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const { type, title, data, labels, dataKeys: providedDataKeys } = chartData;

  // Determine data keys
  const dataKeys = providedDataKeys || extractDataKeys(data);
  const xAxisKey = getXAxisKey(data);

  // Check for empty data
  const isEmpty = !data || data.length === 0;

  // Export chart as PNG
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

  // Render Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS.complementary[index % COLORS.complementary.length]}
            strokeWidth={2}
            dot={{ fill: COLORS.complementary[index % COLORS.complementary.length], strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  // Render Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={COLORS.complementary[index % COLORS.complementary.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  // Render Pie Chart (also handles donut)
  const renderPieChart = (isDonut = false) => {
    // For pie charts, we need to transform data to have name/value pairs
    const pieDataKey = dataKeys[0] || 'value';
    const nameKey = xAxisKey || 'name';

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={isDonut ? 60 : 0}
            outerRadius={100}
            paddingAngle={isDonut ? 2 : 0}
            dataKey={pieDataKey}
            nameKey={nameKey}
            label={({ name, percent }) => 
              `${name ?? 'Unknown'}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: COLORS.text }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS.complementary[index % COLORS.complementary.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render Area Chart
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={{ fill: COLORS.text, fontSize: 12 }}
          axisLine={{ stroke: COLORS.grid }}
          label={labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {dataKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS.complementary[index % COLORS.complementary.length]}
            fill={COLORS.complementary[index % COLORS.complementary.length]}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  // Select chart renderer based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart(false);
      case 'donut':
        return renderPieChart(true);
      case 'area':
        return renderAreaChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {!isEmpty && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export as PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}
      </div>

      {/* Chart */}
      <div ref={chartRef}>
        {isEmpty ? <EmptyState /> : renderChart()}
      </div>

      {/* Labels footer */}
      {!isEmpty && labels && (labels.x || labels.y) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
          {labels.x && <span>X-Axis: {labels.x}</span>}
          {labels.y && <span>Y-Axis: {labels.y}</span>}
        </div>
      )}
    </div>
  );
};

export default ChartRenderer;
