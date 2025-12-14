import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
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
import { 
  Download, 
  BarChart3, 
  Maximize2, 
  X, 
  Copy, 
  FileSpreadsheet,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import type { ChartData } from '../types';

export type { ChartData };

interface ChartRendererProps {
  chartData: ChartData;
  className?: string;
  onDataPointClick?: (data: Record<string, unknown>, index: number) => void;
}

// Color palettes
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
  // Color-blind friendly palette (Okabe-Ito)
  colorBlindFriendly: [
    '#E69F00', '#56B4E9', '#009E73', '#F0E442',
    '#0072B2', '#D55E00', '#CC79A7', '#999999',
  ],
  grid: '#E5E7EB',
  text: '#6B7280',
};

// Format large numbers (e.g., 1200000 -> ₦1.2M)
const formatValue = (value: number, currency = true): string => {
  if (typeof value !== 'number' || isNaN(value)) return String(value);
  
  const absValue = Math.abs(value);
  const prefix = currency ? '₦' : '';
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) return `${sign}${prefix}${(absValue / 1_000_000_000).toFixed(1)}B`;
  if (absValue >= 1_000_000) return `${sign}${prefix}${(absValue / 1_000_000).toFixed(1)}M`;
  if (absValue >= 1_000) return `${sign}${prefix}${(absValue / 1_000).toFixed(1)}K`;
  return `${sign}${prefix}${value.toLocaleString()}`;
};

const formatPercent = (value: number): string => `${(value * 100).toFixed(1)}%`;

const formatDateLabel = (label: string): string => {
  const date = new Date(label);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }
  return label;
};

// Enhanced tooltip with formatting
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string; value: number; color: string;
    dataKey: string; payload: Record<string, unknown>;
  }>;
  label?: string;
  chartType?: string;
  totalValue?: number;
}

const EnhancedTooltip = ({ active, payload, label, chartType, totalValue }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const isPieChart = chartType === 'pie' || chartType === 'donut';
  
  return (
    <div 
      className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-xl text-sm border border-gray-700"
      role="tooltip"
      aria-live="polite"
    >
      {label && (
        <p className="font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-2">
          {formatDateLabel(String(label))}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const percentage = isPieChart && totalValue 
            ? ` (${formatPercent(entry.value / totalValue)})`
            : '';
          
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="text-gray-300">{entry.name}:</span>
              </div>
              <span className="font-semibold" style={{ color: entry.color }}>
                {formatValue(entry.value)}{percentage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <div 
    className="flex flex-col items-center justify-center h-64 text-gray-400"
    role="img"
    aria-label="No chart data available"
  >
    <BarChart3 className="w-16 h-16 mb-3 opacity-30" aria-hidden="true" />
    <p className="text-lg font-medium">No data available</p>
    <p className="text-sm">Chart data will appear here when available</p>
    <div className="mt-4 w-full max-w-xs h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-end justify-center gap-2 p-4">
      {[40, 65, 45, 80, 55, 70].map((height, i) => (
        <div
          key={i}
          className="w-6 bg-gray-100 rounded-t"
          style={{ height: `${height}%` }}
          aria-hidden="true"
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

// Convert data to CSV
const convertToCSV = (data: Record<string, unknown>[], title: string): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    `# ${title}`,
    `# Generated: ${new Date().toLocaleString()}`,
    '',
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};

// Custom hook for responsive detection
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 640);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return { isMobile };
};

// Export menu component
interface ExportMenuProps {
  onExportPNG: () => void;
  onExportCSV: () => void;
  onCopyData: () => void;
  copied: boolean;
}

const ExportMenu = ({ onExportPNG, onExportCSV, onCopyData, copied }: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Export options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Export</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
            role="menu"
          >
            <button
              onClick={() => { onExportPNG(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              role="menuitem"
            >
              <Download className="w-4 h-4" />
              Download as PNG
            </button>
            <button
              onClick={() => { onExportCSV(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              role="menuitem"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download as CSV
            </button>
            <button
              onClick={() => { onCopyData(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              role="menuitem"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Fullscreen modal
interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FullscreenModal = ({ isOpen, onClose, title, children }: FullscreenModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-chart-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="fullscreen-chart-title" className="text-xl font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Custom Legend with toggle
interface CustomLegendProps {
  payload?: Array<{ value: string; color: string; dataKey: string }>;
  hiddenSeries: Set<string>;
  onToggle: (dataKey: string) => void;
  isMobile: boolean;
}

const CustomLegend = ({ payload, hiddenSeries, onToggle, isMobile }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div 
      className={`flex ${isMobile ? 'flex-col items-start gap-1' : 'flex-wrap justify-center gap-3'} pt-3`}
      role="group"
      aria-label="Chart legend - click to toggle series"
    >
      {payload.map((entry, index) => {
        const isHidden = hiddenSeries.has(entry.dataKey);
        return (
          <button
            key={index}
            onClick={() => onToggle(entry.dataKey)}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
              isHidden ? 'opacity-40 hover:opacity-60' : 'hover:bg-gray-100'
            }`}
            aria-pressed={!isHidden}
            aria-label={`${entry.value}: ${isHidden ? 'hidden' : 'visible'}. Click to toggle.`}
          >
            <span 
              className={`w-3 h-3 rounded-full flex-shrink-0 transition-transform ${isHidden ? 'scale-75' : ''}`}
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className={`text-xs ${isHidden ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {entry.value}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const ChartRenderer = ({ chartData, className = '', onDataPointClick }: ChartRendererProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [useColorBlindPalette, setUseColorBlindPalette] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const { isMobile } = useResponsive();

  const { type, title, data, labels, dataKeys: providedDataKeys } = chartData;

  // Determine data keys
  const dataKeys = useMemo(() => providedDataKeys || extractDataKeys(data), [providedDataKeys, data]);
  const xAxisKey = useMemo(() => getXAxisKey(data), [data]);

  // Get colors
  const colorPalette = useMemo(() => {
    return useColorBlindPalette ? COLORS.colorBlindFriendly : COLORS.complementary;
  }, [useColorBlindPalette]);

  // Calculate total for pie charts
  const totalValue = useMemo(() => {
    if (type !== 'pie' && type !== 'donut') return 0;
    const pieDataKey = dataKeys[0] || 'value';
    return data.reduce((sum, item) => sum + (Number(item[pieDataKey]) || 0), 0);
  }, [data, dataKeys, type]);

  // Filter data based on hidden series
  const visibleDataKeys = useMemo(() => 
    dataKeys.filter(key => !hiddenSeries.has(key)),
    [dataKeys, hiddenSeries]
  );

  // Check for empty data
  const isEmpty = !data || data.length === 0;

  // Toggle series visibility
  const toggleSeries = useCallback((dataKey: string) => {
    setHiddenSeries(prev => {
      const next = new Set(prev);
      if (next.has(dataKey)) {
        next.delete(dataKey);
      } else {
        if (visibleDataKeys.length > 1) {
          next.add(dataKey);
        }
      }
      return next;
    });
  }, [visibleDataKeys.length]);

  // Export as PNG
  const handleExportPNG = useCallback(async () => {
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
  }, [title]);

  // Export as CSV
  const handleExportCSV = useCallback(() => {
    const csv = convertToCSV(data, title);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}_data.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [data, title]);

  // Copy data to clipboard
  const handleCopyData = useCallback(async () => {
    const csv = convertToCSV(data, title);
    try {
      await navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [data, title]);

  // Handle data point click
  const handleClick = useCallback((clickData: Record<string, unknown>, index: number) => {
    setActiveIndex(index);
    onDataPointClick?.(clickData, index);
  }, [onDataPointClick]);

  // Chart height
  const chartHeight = isMobile ? 250 : 300;
  const fullscreenChartHeight = 500;

  // Tick props for mobile
  const tickProps = {
    fill: COLORS.text, 
    fontSize: isMobile ? 10 : 12 
  };

  // Render tooltip
  const renderTooltip = () => (
    <Tooltip 
      content={<EnhancedTooltip chartType={type} totalValue={totalValue} />}
      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
    />
  );

  // Render legend
  const renderLegend = () => (
    <Legend 
      content={({ payload }) => (
        <CustomLegend 
          payload={payload?.map(p => ({
            value: p.value as string,
            color: p.color as string,
            dataKey: p.dataKey as string,
          }))}
          hiddenSeries={hiddenSeries}
          onToggle={toggleSeries}
          isMobile={isMobile}
        />
      )}
    />
  );

  // Render Line Chart
  const renderLineChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data} 
        margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}
        onClick={(e: any) => {
          if (e && e.activePayload && e.activePayload[0]) {
            const index = typeof e.activeTooltipIndex === 'number' ? e.activeTooltipIndex : 0;
            handleClick(e.activePayload[0].payload, index);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={isMobile ? (v) => String(v).slice(0, 3) : undefined}
          interval={isMobile ? Math.ceil(data.length / 5) - 1 : 'preserveStartEnd'}
          label={!isMobile && labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={(v) => formatValue(v, false)}
          width={isMobile ? 45 : 60}
          label={!isMobile && labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        {renderTooltip()}
        {renderLegend()}
        {visibleDataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colorPalette[index % colorPalette.length]}
            strokeWidth={2}
            dot={{ fill: colorPalette[index % colorPalette.length], strokeWidth: 2, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6, stroke: colorPalette[index % colorPalette.length], strokeWidth: 2, fill: '#fff' }}
            hide={hiddenSeries.has(key)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  // Render Bar Chart
  const renderBarChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}
        onClick={(e: any) => {
          if (e && e.activePayload && e.activePayload[0]) {
            const index = typeof e.activeTooltipIndex === 'number' ? e.activeTooltipIndex : 0;
            handleClick(e.activePayload[0].payload, index);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={isMobile ? (v) => String(v).slice(0, 3) : undefined}
          interval={isMobile ? Math.ceil(data.length / 5) - 1 : 'preserveStartEnd'}
          label={!isMobile && labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={(v) => formatValue(v, false)}
          width={isMobile ? 45 : 60}
          label={!isMobile && labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        {renderTooltip()}
        {renderLegend()}
        {visibleDataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colorPalette[index % colorPalette.length]}
            radius={[4, 4, 0, 0]}
            hide={hiddenSeries.has(key)}
            cursor="pointer"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  // Render Pie Chart (also handles donut)
  const renderPieChart = (isDonut = false, height: number) => {
    const pieDataKey = dataKeys[0] || 'value';
    const nameKey = xAxisKey || 'name';
    const outerRadius = isMobile ? 80 : 100;
    const innerRadius = isDonut ? (isMobile ? 40 : 60) : 0;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 10 : 20, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={isDonut ? 2 : 0}
            dataKey={pieDataKey}
            nameKey={nameKey}
            label={isMobile ? false : ({ name, percent }) => 
              `${name ?? 'Unknown'}: ${formatPercent(percent ?? 0)}`
            }
            labelLine={!isMobile && { stroke: COLORS.text }}
            onClick={(_, index) => handleClick(data[index], index)}
            cursor="pointer"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorPalette[index % colorPalette.length]}
                stroke={activeIndex === index ? '#000' : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          {renderTooltip()}
          {renderLegend()}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render Area Chart
  const renderAreaChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart 
        data={data} 
        margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}
        onClick={(e: any) => {
          if (e && e.activePayload && e.activePayload[0]) {
            const index = typeof e.activeTooltipIndex === 'number' ? e.activeTooltipIndex : 0;
            handleClick(e.activePayload[0].payload, index);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey={xAxisKey}
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={isMobile ? (v) => String(v).slice(0, 3) : undefined}
          interval={isMobile ? Math.ceil(data.length / 5) - 1 : 'preserveStartEnd'}
          label={!isMobile && labels?.x ? { value: labels.x, position: 'insideBottom', offset: -5, fill: COLORS.text } : undefined}
        />
        <YAxis
          tick={tickProps}
          axisLine={{ stroke: COLORS.grid }}
          tickFormatter={(v) => formatValue(v, false)}
          width={isMobile ? 45 : 60}
          label={!isMobile && labels?.y ? { value: labels.y, angle: -90, position: 'insideLeft', fill: COLORS.text } : undefined}
        />
        {renderTooltip()}
        {renderLegend()}
        {visibleDataKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colorPalette[index % colorPalette.length]}
            fill={colorPalette[index % colorPalette.length]}
            fillOpacity={0.3}
            strokeWidth={2}
            hide={hiddenSeries.has(key)}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  // Select chart renderer based on type
  const renderChart = (height: number) => {
    switch (type) {
      case 'line':
        return renderLineChart(height);
      case 'bar':
        return renderBarChart(height);
      case 'pie':
        return renderPieChart(false, height);
      case 'donut':
        return renderPieChart(true, height);
      case 'area':
        return renderAreaChart(height);
      default:
        return renderLineChart(height);
    }
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}
        role="figure"
        aria-label={`${title} - ${type} chart`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <button
            onClick={() => !isEmpty && setIsFullscreen(true)}
            className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors text-left flex items-center gap-2 group"
            disabled={isEmpty}
            aria-label={isEmpty ? title : `${title} - click to view fullscreen`}
          >
            {title}
            {!isEmpty && (
              <Maximize2 
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                aria-hidden="true" 
              />
            )}
          </button>
          
          {!isEmpty && (
            <div className="flex items-center gap-2">
              {/* Color blind toggle */}
              <button
                onClick={() => setUseColorBlindPalette(!useColorBlindPalette)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  useColorBlindPalette 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={useColorBlindPalette ? 'Using color-blind friendly palette' : 'Switch to color-blind friendly palette'}
                aria-pressed={useColorBlindPalette}
                aria-label="Toggle color-blind friendly palette"
              >
                <span aria-hidden="true">A11y</span>
              </button>
              
              <ExportMenu
                onExportPNG={handleExportPNG}
                onExportCSV={handleExportCSV}
                onCopyData={handleCopyData}
                copied={copied}
              />
            </div>
          )}
        </div>

        {/* Chart */}
        <div 
          ref={chartRef}
          tabIndex={isEmpty ? undefined : 0}
          role={isEmpty ? undefined : "application"}
          aria-label={isEmpty ? undefined : "Interactive chart. Use arrow keys to navigate data points."}
        >
          {isEmpty ? <EmptyState /> : renderChart(chartHeight)}
        </div>

        {/* Labels footer */}
        {!isEmpty && labels && (labels.x || labels.y) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
            {labels.x && <span>X-Axis: {labels.x}</span>}
            {labels.y && <span>Y-Axis: {labels.y}</span>}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={title}
      >
        <div 
          tabIndex={0}
          role="application"
          aria-label="Fullscreen interactive chart. Press Escape to close."
        >
          {renderChart(fullscreenChartHeight)}
        </div>
        
        {/* Fullscreen labels */}
        {labels && (labels.x || labels.y) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
            {labels.x && <span>X-Axis: {labels.x}</span>}
            {labels.y && <span>Y-Axis: {labels.y}</span>}
          </div>
        )}
      </FullscreenModal>
    </>
  );
};

export default ChartRenderer;
